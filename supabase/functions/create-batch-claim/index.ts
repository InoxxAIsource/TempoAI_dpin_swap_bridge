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
    const { deviceIds, destinationChain } = await req.json();

    if (!deviceIds || !Array.isArray(deviceIds) || deviceIds.length === 0) {
      throw new Error('deviceIds array is required');
    }

    if (!destinationChain) {
      throw new Error('destinationChain is required');
    }

    console.log(`🔄 Creating batch claim for ${deviceIds.length} devices to ${destinationChain}`);

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

    // Fetch pending rewards for the selected devices
    const { data: rewards, error: rewardsError } = await supabase
      .from('depin_rewards')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'pending')
      .in('device_id', deviceIds)
      .is('claimed_via_tx', null);

    if (rewardsError) {
      console.error('Error fetching rewards:', rewardsError);
      throw rewardsError;
    }

    if (!rewards || rewards.length === 0) {
      throw new Error('No pending rewards found for selected devices');
    }

    // Calculate total amount
    const totalAmount = rewards.reduce((sum, reward) => sum + Number(reward.amount), 0);

    // Get fee estimate
    const estimateResponse = await fetch(`${supabaseUrl}/functions/v1/estimate-bridge-fees`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
      body: JSON.stringify({
        amount: totalAmount,
        fromChain: rewards[0].chain,
        toChain: destinationChain,
        token: rewards[0].token,
      }),
    });

    const estimatedFees = await estimateResponse.json();

    // Create the batch claim record
    const batchClaimId = crypto.randomUUID();

    const { data: claimRecord, error: claimError } = await supabase
      .from('depin_reward_claims')
      .insert({
        user_id: user.id,
        device_ids: deviceIds,
        total_amount: totalAmount,
        destination_chain: destinationChain,
        status: 'pending_approval',
      })
      .select()
      .single();

    if (claimError) {
      console.error('Error creating claim record:', claimError);
      throw claimError;
    }

    // Update rewards with batch_claim_id
    await supabase
      .from('depin_rewards')
      .update({ batch_claim_id: claimRecord.id })
      .in('id', rewards.map(r => r.id));

    const result = {
      claimId: claimRecord.id,
      totalAmount,
      deviceCount: deviceIds.length,
      estimatedFees,
      destinationChain,
      status: 'pending_approval',
      rewardIds: rewards.map(r => r.id),
    };

    console.log(`✅ Batch claim created: ${claimRecord.id} for $${totalAmount.toFixed(2)}`);

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
