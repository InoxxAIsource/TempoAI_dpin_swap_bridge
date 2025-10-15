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
    const { claimId, evmWalletAddress } = await req.json();
    
    if (!claimId) {
      throw new Error('Claim ID is required');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    // Verify the user
    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    console.log(`Preparing claim funds for claim ${claimId}`);

    // Fetch the claim details
    const { data: claim, error: claimError } = await supabase
      .from('depin_reward_claims')
      .select('*')
      .eq('id', claimId)
      .eq('user_id', user.id)
      .single();

    if (claimError || !claim) {
      throw new Error('Claim not found or unauthorized');
    }

    // Verify EVM wallet is linked to the claim owner if provided
    if (evmWalletAddress) {
      const { data: walletLink, error: linkError } = await supabase
        .from('wallet_connections')
        .select('id')
        .eq('user_id', user.id)
        .eq('wallet_address', evmWalletAddress.toLowerCase())
        .eq('chain_type', 'EVM')
        .maybeSingle();

      if (linkError) {
        console.error('Wallet link verification error:', linkError);
        throw new Error('Failed to verify wallet ownership');
      }

      if (!walletLink) {
        throw new Error('EVM wallet not linked to your account. Please link it first.');
      }

      console.log('✓ EVM wallet ownership verified');
    }

    // Check if already prepared
    if (claim.contract_prepared_at) {
      console.log('Claim already prepared');
      return new Response(
        JSON.stringify({
          success: true,
          alreadyPrepared: true,
          sepoliaEthAmount: claim.sepolia_eth_amount,
          claimId: claim.id,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Calculate Sepolia ETH amount (fixed conversion: 1 USDC = 0.0003 ETH for testing)
    // In production, you'd fetch real-time prices
    const USDC_TO_ETH_RATE = 0.0003;
    const sepoliaEthAmount = claim.total_amount * USDC_TO_ETH_RATE;

    console.log(`Calculated Sepolia ETH amount: ${sepoliaEthAmount} ETH for ${claim.total_amount} USDC`);

    // Update the claim with Sepolia ETH amount
    const { error: updateError } = await supabase
      .from('depin_reward_claims')
      .update({
        sepolia_eth_amount: sepoliaEthAmount,
        contract_prepared_at: new Date().toISOString(),
      })
      .eq('id', claimId);

    if (updateError) {
      throw new Error(`Failed to update claim: ${updateError.message}`);
    }

    console.log('Successfully prepared claim funds');

    return new Response(
      JSON.stringify({
        success: true,
        sepoliaEthAmount: sepoliaEthAmount.toString(),
        usdcAmount: claim.total_amount,
        claimId: claim.id,
        contractAddress: '0xb90bb7616bc138a177bec31a4571f4fd8fe113a1',
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in prepare-claim-funds:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
