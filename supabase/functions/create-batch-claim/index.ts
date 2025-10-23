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
    const { deviceIds, claimAmount, destinationChain, walletAddress } = await req.json();

    console.log(`🔍 Claim Request:`, {
      claimAmount: claimAmount || 'ALL',
      deviceIds: deviceIds?.length || 'auto-select',
      destinationChain,
      walletAddress: walletAddress?.substring(0, 10) + '...'
    });

    if (!destinationChain) {
      throw new Error('destinationChain is required');
    }

    if (!walletAddress) {
      throw new Error('walletAddress is required');
    }

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

    console.log(`👤 User: ${user.id.substring(0, 8)}...`);

    let selectedDeviceIds = deviceIds;

    // If claimAmount provided without deviceIds, auto-select devices
    if (claimAmount && (!deviceIds || deviceIds.length === 0)) {
      console.log(`🤖 Auto-selecting devices for $${claimAmount} claim`);
      
      // Fetch ALL pending rewards for this user, sorted by amount
      const { data: allRewards, error: fetchError } = await supabase
        .from('depin_rewards')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'pending')
        .is('claimed_via_tx', null)
        .order('amount', { ascending: true }); // Start with smallest

      if (fetchError) throw fetchError;
      if (!allRewards || allRewards.length === 0) {
        throw new Error('No pending rewards available');
      }

      // Greedy algorithm: Select smallest rewards that fit
      let currentTotal = 0;
      let selectedRewards = [];
      
      for (const reward of allRewards) {
        if (currentTotal + reward.amount <= claimAmount) {
          selectedRewards.push(reward);
          currentTotal += reward.amount;
        }
        
        // Stop when we're within 5% of target or exceeded
        if (currentTotal >= claimAmount * 0.95) {
          break;
        }
      }
      
      // If we couldn't reach target with small rewards, try one large reward
      if (currentTotal < claimAmount * 0.95) {
        const singleReward = allRewards.find(r => 
          r.amount >= claimAmount * 0.95 && 
          r.amount <= claimAmount * 1.1
        );
        
        if (singleReward) {
          selectedRewards = [singleReward];
          currentTotal = singleReward.amount;
        }
      }
      
      selectedDeviceIds = [...new Set(selectedRewards.map(r => r.device_id))];
      
      console.log(`✅ Auto-selected ${selectedDeviceIds.length} devices totaling $${currentTotal.toFixed(2)} (target: $${claimAmount})`);
    }

    if (!selectedDeviceIds || selectedDeviceIds.length === 0) {
      throw new Error('No devices selected or available for the requested amount');
    }

    console.log(`🔄 Creating batch claim for ${selectedDeviceIds.length} devices to ${destinationChain}`);

    // Fetch pending rewards for the selected devices
    const { data: allRewards, error: rewardsError } = await supabase
      .from('depin_rewards')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'pending')
      .in('device_id', selectedDeviceIds)
      .is('claimed_via_tx', null)
      .order('amount', { ascending: false }); // Fetch largest first for better selection

    if (rewardsError) {
      console.error('Error fetching rewards:', rewardsError);
      throw rewardsError;
    }

    if (!allRewards || allRewards.length === 0) {
      throw new Error('No pending rewards found for selected devices');
    }

    // Select only enough rewards to match claimAmount (if provided)
    let rewards = allRewards;
    if (claimAmount) {
      let runningTotal = 0;
      const selectedRewards = [];
      
      for (const reward of allRewards) {
        if (runningTotal >= claimAmount) break;
        selectedRewards.push(reward);
        runningTotal += Number(reward.amount);
      }
      
      rewards = selectedRewards;
      console.log(`💰 Selected ${rewards.length} rewards totaling $${runningTotal.toFixed(2)} from ${allRewards.length} available rewards`);
    }

    // Calculate total amount
    const totalAmount = rewards.reduce((sum, reward) => sum + Number(reward.amount), 0);

    console.log(`📊 Reward breakdown:`, {
      totalRewardsForDevices: allRewards.length,
      selectedRewards: rewards.length,
      requestedAmount: claimAmount || 'ALL',
      actualTotal: totalAmount.toFixed(2)
    });

    // ⚠️ TEST MODE: Maximum claim limit
    const TEST_MODE_MAX_CLAIM = 50;
    if (totalAmount > TEST_MODE_MAX_CLAIM) {
      console.log(`❌ Claim rejected: $${totalAmount.toFixed(2)} exceeds $${TEST_MODE_MAX_CLAIM} test limit`);
      throw new Error(`Test mode active: Maximum claim amount is $${TEST_MODE_MAX_CLAIM}. Your selection totals $${totalAmount.toFixed(2)}. Please select fewer devices.`);
    }

    console.log(`✅ Claim amount $${totalAmount.toFixed(2)} within test limit`);

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

    // First create the claim record to get the claim ID
    const tempClaimId = crypto.randomUUID();
    
    const { data: claimRecord, error: claimError } = await supabase
      .from('depin_reward_claims')
      .insert({
        id: tempClaimId,
        user_id: user.id,
        device_ids: selectedDeviceIds,
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

    console.log(`✅ Claim record created: ${claimRecord.id}`);

    // Now create wormhole transaction record with claim ID in source_reference_ids
    const { data: wormholeTx, error: txError } = await supabase
      .from('wormhole_transactions')
      .insert({
        user_id: user.id,
        wallet_address: walletAddress.toLowerCase(),
        from_chain: 'Ethereum', // Sepolia is Ethereum testnet
        to_chain: destinationChain,
        from_token: 'ETH',
        to_token: destinationChain === 'Solana' ? 'SOL' : 'ETH',
        amount: totalAmount, // USD amount, will be converted to ETH in transfer-reward-eth
        status: 'pending',
        source_type: 'depin_rewards',
        source_reference_ids: [claimRecord.id], // Store claim ID for tracking
        contract_address: '0xb90bb7616bc138a177bec31a4571f4fd8fe113a1',
        contract_claim_status: 'pending',
      })
      .select()
      .single();

    if (txError) {
      console.error('Error creating wormhole transaction:', txError);
      throw txError;
    }

    console.log(`✅ Wormhole transaction created: ${wormholeTx.id}`);

    // Update claim record with wormhole_tx_id
    await supabase
      .from('depin_reward_claims')
      .update({ wormhole_tx_id: wormholeTx.id })
      .eq('id', claimRecord.id);

    if (claimError) {
      console.error('Error creating claim record:', claimError);
      throw claimError;
    }

    // Update rewards with batch_claim_id and set to claiming status
    await supabase
      .from('depin_rewards')
      .update({ 
        batch_claim_id: claimRecord.id,
        status: 'claiming',
        claimed_via_tx: wormholeTx.id
      })
      .in('id', rewards.map(r => r.id));

    const result = {
      claimId: claimRecord.id,
      wormholeTxId: wormholeTx.id,
      totalAmount,
      actualAmount: totalAmount,
      deviceCount: selectedDeviceIds.length,
      selectedDeviceIds: selectedDeviceIds,
      estimatedFees,
      destinationChain,
      fromChain: rewards[0].chain,
      token: rewards[0].token || 'USDC',
      status: 'pending_approval',
      rewardIds: rewards.map(r => r.id),
    };

    console.log(`✅ Batch claim created: ${claimRecord.id} with Wormhole TX: ${wormholeTx.id} for $${totalAmount.toFixed(2)}`);

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
