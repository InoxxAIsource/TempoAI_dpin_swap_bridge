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
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch all simulated devices (is_verified = false)
    const { data: devices, error: devicesError } = await supabase
      .from('device_registry')
      .select('*')
      .eq('is_verified', false)
      .eq('status', 'active');

    if (devicesError) throw devicesError;

    console.log(`📡 Simulating metrics for ${devices?.length || 0} devices`);

    const events = [];
    for (const device of devices || []) {
      // Generate realistic solar panel metrics
      const energy_kwh = Math.random() * 30 + 20; // 20-50 kWh
      const uptime_percent = Math.random() * 10 + 90; // 90-100%
      const reward_amount = energy_kwh * 0.05; // $0.05 per kWh

      const event = {
        device_id: device.device_id,
        event_type: 'metrics_update',
        metrics: {
          energy_kwh: parseFloat(energy_kwh.toFixed(2)),
          uptime_percent: parseFloat(uptime_percent.toFixed(2)),
          timestamp: Date.now(),
        },
        verified: false,
        reward_amount: parseFloat(reward_amount.toFixed(4)),
      };

      events.push(event);

      // Insert event
      await supabase.from('device_events').insert(event);

      // Create reward entry
      await supabase.from('depin_rewards').insert({
        user_id: device.user_id,
        device_id: device.device_id,
        amount: reward_amount,
        token: 'USDC',
        chain: 'Solana', // Default to Solana for testnet
        status: 'pending',
      });

      // Update last_seen_at
      await supabase
        .from('device_registry')
        .update({ last_seen_at: new Date().toISOString() })
        .eq('device_id', device.device_id);
    }

    console.log(`✅ Generated ${events.length} simulated events`);

    return new Response(
      JSON.stringify({ success: true, events: events.length }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('❌ Error simulating device events:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
