import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.74.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get user from JWT
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    console.log(`📊 Checking pending rewards for user: ${user.id}`);

    // Fetch pending rewards
    const { data: rewards, error: rewardsError } = await supabase
      .from('depin_rewards')
      .select('*, device_id')
      .eq('user_id', user.id)
      .eq('status', 'pending')
      .is('claimed_via_tx', null);

    if (rewardsError) {
      console.error('Error fetching rewards:', rewardsError);
      throw rewardsError;
    }

    // Fetch user preferences
    const { data: preferences } = await supabase
      .from('bridge_preferences')
      .select('*')
      .eq('user_id', user.id)
      .single();

    const claimThreshold = preferences?.claim_threshold || 100;
    const preferredChain = preferences?.preferred_chain || 'Solana';

    // Calculate total amount
    const totalAmount = rewards?.reduce((sum, reward) => sum + Number(reward.amount), 0) || 0;

    // Group by device
    const deviceBreakdown: { [key: string]: number } = {};
    rewards?.forEach(reward => {
      if (!deviceBreakdown[reward.device_id]) {
        deviceBreakdown[reward.device_id] = 0;
      }
      deviceBreakdown[reward.device_id] += Number(reward.amount);
    });

    // Fetch device names
    const { data: devices } = await supabase
      .from('device_registry')
      .select('device_id, device_name')
      .in('device_id', Object.keys(deviceBreakdown));

    const deviceBreakdownWithNames = Object.entries(deviceBreakdown).map(([deviceId, amount]) => {
      const device = devices?.find(d => d.device_id === deviceId);
      return {
        deviceId,
        deviceName: device?.device_name || deviceId,
        amount
      };
    });

    const result = {
      claimable: totalAmount >= claimThreshold,
      totalAmount,
      threshold: claimThreshold,
      deviceBreakdown: deviceBreakdownWithNames,
      preferredChain,
      rewardCount: rewards?.length || 0
    };

    console.log(`✅ Found ${result.rewardCount} pending rewards totaling $${totalAmount.toFixed(2)}`);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
