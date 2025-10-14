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

      const metrics = {
        energy_kwh: parseFloat(energy_kwh.toFixed(2)),
        uptime_percent: parseFloat(uptime_percent.toFixed(2)),
        timestamp: Date.now(),
      };

      // Sign metrics if device has private key (demo devices only)
      let signature = null;
      if (device.metadata?.private_key) {
        try {
          const privateKeyBytes = Uint8Array.from(
            atob(device.metadata.private_key).split('').map(c => c.charCodeAt(0))
          );
          const messageBytes = new TextEncoder().encode(JSON.stringify(metrics));
          const signatureBytes = await crypto.subtle.sign(
            { name: 'Ed25519' },
            await crypto.subtle.importKey(
              'raw',
              privateKeyBytes.slice(0, 32),
              { name: 'Ed25519' },
              false,
              ['sign']
            ),
            messageBytes
          );
          signature = btoa(String.fromCharCode(...new Uint8Array(signatureBytes)));
        } catch (error) {
          console.error('❌ Error signing metrics:', error);
        }
      }

      // Call report-device-event to trigger signature verification
      try {
        const reportResponse = await fetch(`${supabaseUrl}/functions/v1/report-device-event`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseKey}`,
          },
          body: JSON.stringify({
            device_id: device.device_id,
            metrics,
            signature,
          }),
        });

        const result = await reportResponse.json();
        
        if (result.verified) {
          console.log(`✅ Device ${device.device_id}: VERIFIED - Reward: ${result.reward_amount} USDC (2x multiplier)`);
        } else {
          console.log(`⚠️ Device ${device.device_id}: UNVERIFIED - Reward: ${result.reward_amount} USDC`);
        }

        events.push({
          device_id: device.device_id,
          verified: result.verified,
          reward_amount: result.reward_amount,
        });
      } catch (error) {
        console.error(`❌ Error reporting event for device ${device.device_id}:`, error);
      }

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
