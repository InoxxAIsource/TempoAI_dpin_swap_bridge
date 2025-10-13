import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.74.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { device_id, metrics, signature } = await req.json();

    if (!device_id || !metrics) {
      throw new Error('Missing device_id or metrics');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch device to check if it's verified
    const { data: device, error: deviceError } = await supabase
      .from('device_registry')
      .select('*')
      .eq('device_id', device_id)
      .single();

    if (deviceError || !device) {
      throw new Error('Device not found');
    }

    let verified = false;
    let reward_multiplier = 1;

    // For verified devices with signatures, we'd verify here
    // For now, we'll accept the signature but not verify it (placeholder for future Ed25519 verification)
    if (device.is_verified && device.public_key && signature) {
      // In a real implementation, verify the Ed25519 signature here
      verified = true;
      reward_multiplier = 2; // 2x rewards for verified devices
      console.log(`✅ Signature accepted for device ${device_id}`);
    }

    // Calculate reward (example: $0.05 per kWh, 2x for verified)
    const energy_kwh = metrics.energy_kwh || 0;
    const reward_amount = energy_kwh * 0.05 * reward_multiplier;

    // Insert event
    const { error: eventError } = await supabase.from('device_events').insert({
      device_id,
      event_type: 'metrics_update',
      metrics,
      signature,
      verified,
      reward_amount: parseFloat(reward_amount.toFixed(4)),
    });

    if (eventError) throw eventError;

    // Create reward entry
    await supabase.from('depin_rewards').insert({
      user_id: device.user_id,
      device_id,
      amount: reward_amount,
      token: 'USDC',
      chain: 'Solana',
      status: 'pending',
    });

    // Update last_seen_at
    await supabase
      .from('device_registry')
      .update({ last_seen_at: new Date().toISOString() })
      .eq('device_id', device_id);

    console.log(`📊 Event recorded for ${device_id}, reward: ${reward_amount} USDC`);

    return new Response(
      JSON.stringify({ success: true, verified, reward_amount }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('❌ Error reporting device event:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
