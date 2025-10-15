import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.74.0';
import { ethers } from 'https://esm.sh/ethers@6.9.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Sepolia RPC URL
const SEPOLIA_RPC_URL = 'https://eth-sepolia.g.alchemy.com/v2/' + Deno.env.get('ALCHEMY_API_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { claimId, evmWalletAddress } = await req.json();
    
    if (!claimId || !evmWalletAddress) {
      throw new Error('Claim ID and EVM wallet address are required');
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

    console.log(`Processing reward transfer for claim ${claimId}`);

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

    // Check if already transferred
    if (claim.contract_prepared_at) {
      console.log('Claim already processed');
      return new Response(
        JSON.stringify({
          success: true,
          alreadyTransferred: true,
          sepoliaEthAmount: claim.sepolia_eth_amount,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify EVM wallet is linked to the user
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

    // Fetch real-time ETH price from CoinGecko
    console.log('Fetching real-time ETH price...');
    const priceResponse = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd',
      { headers: { 'Accept': 'application/json' } }
    );

    if (!priceResponse.ok) {
      throw new Error('Failed to fetch ETH price from CoinGecko');
    }

    const priceData = await priceResponse.json();
    const ethPriceUSD = priceData.ethereum.usd;

    if (!ethPriceUSD || ethPriceUSD <= 0) {
      throw new Error('Invalid ETH price received');
    }

    console.log(`Current ETH price: $${ethPriceUSD}`);

    // Calculate ETH amount based on real market price
    const ethAmount = claim.total_amount / ethPriceUSD;
    const ethAmountWithBuffer = ethAmount * 1.02; // Add 2% buffer
    const conversionRate = 1 / ethPriceUSD;

    console.log(`Converting $${claim.total_amount} USDC to ${ethAmountWithBuffer.toFixed(6)} ETH (with 2% buffer)`);

    // Sanity check: Reject if ETH price is outside reasonable range
    if (ethPriceUSD < 1000 || ethPriceUSD > 10000) {
      throw new Error(`ETH price $${ethPriceUSD} is outside acceptable range ($1,000-$10,000)`);
    }

    // Sanity check: Reject if transfer amount is too large
    if (ethAmountWithBuffer > 10) {
      throw new Error(`Transfer amount ${ethAmountWithBuffer} ETH exceeds maximum (10 ETH)`);
    }

    // Initialize provider and wallet
    const provider = new ethers.JsonRpcProvider(SEPOLIA_RPC_URL);
    const deployerPrivateKey = Deno.env.get('TEMPO_DEPLOYER_PRIVATE_KEY');
    
    if (!deployerPrivateKey) {
      throw new Error('Deployer private key not configured');
    }

    const wallet = new ethers.Wallet(deployerPrivateKey, provider);
    console.log(`Deployer wallet address: ${wallet.address}`);

    // Check deployer balance
    const balance = await provider.getBalance(wallet.address);
    const balanceInEth = parseFloat(ethers.formatEther(balance));
    console.log(`Deployer balance: ${balanceInEth} ETH`);

    if (balanceInEth < ethAmountWithBuffer) {
      throw new Error(`Insufficient deployer balance. Has ${balanceInEth} ETH, needs ${ethAmountWithBuffer} ETH`);
    }

    if (balanceInEth < 5) {
      console.warn(`⚠️ Deployer balance is low: ${balanceInEth} ETH`);
    }

    // Create and send transaction
    console.log(`Sending ${ethAmountWithBuffer} ETH to ${evmWalletAddress}...`);
    
    const tx = await wallet.sendTransaction({
      to: evmWalletAddress,
      value: ethers.parseEther(ethAmountWithBuffer.toString()),
    });

    console.log(`Transaction sent: ${tx.hash}`);

    // Wait for confirmation (1 block)
    console.log('Waiting for transaction confirmation...');
    const receipt = await tx.wait(1);
    console.log(`Transaction confirmed in block ${receipt?.blockNumber}`);

    // Update the claim record
    const { error: updateError } = await supabase
      .from('depin_reward_claims')
      .update({
        sepolia_eth_amount: ethAmountWithBuffer,
        contract_prepared_at: new Date().toISOString(),
      })
      .eq('id', claimId);

    if (updateError) {
      console.error('Failed to update claim:', updateError);
      // Transaction succeeded but database update failed - log for manual resolution
      throw new Error(`Transfer succeeded but database update failed: ${updateError.message}`);
    }

    // Update wormhole_transactions if exists
    if (claim.wormhole_tx_id) {
      const { error: txUpdateError } = await supabase
        .from('wormhole_transactions')
        .update({
          contract_claim_tx: tx.hash,
          contract_claim_status: 'completed',
        })
        .eq('id', claim.wormhole_tx_id);

      if (txUpdateError) {
        console.error('Failed to update wormhole transaction:', txUpdateError);
      }
    }

    console.log('✓ Reward transfer completed successfully');

    return new Response(
      JSON.stringify({
        success: true,
        txHash: tx.hash,
        sepoliaEthAmount: ethAmountWithBuffer.toString(),
        ethAmountWithoutBuffer: ethAmount.toString(),
        usdcAmount: claim.total_amount,
        ethPriceUSD: ethPriceUSD,
        conversionRate: conversionRate,
        blockNumber: receipt?.blockNumber,
        claimId: claim.id,
        explorerUrl: `https://sepolia.etherscan.io/tx/${tx.hash}`,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in transfer-reward-eth:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        details: error instanceof Error ? error.stack : undefined 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
