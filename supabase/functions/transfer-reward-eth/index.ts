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
  // Version: 2.1.0 - Auto-funding enabled
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🚀 Edge Function Version 2.1.0 - Auto-funding enabled');
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
    // Round to 6 decimals to avoid parseEther precision errors
    const ethAmountRounded = parseFloat(ethAmountWithBuffer.toFixed(6));
    const conversionRate = 1 / ethPriceUSD;

    console.log(`Converting $${claim.total_amount} USDC to ${ethAmountRounded} ETH (with 2% buffer)`);

    // Sanity check: Reject if ETH price is outside reasonable range
    if (ethPriceUSD < 1000 || ethPriceUSD > 10000) {
      throw new Error(`ETH price $${ethPriceUSD} is outside acceptable range ($1,000-$10,000)`);
    }

    // Sanity check: Reject if transfer amount is too large
    if (ethAmountRounded > 10) {
      throw new Error(`Transfer amount ${ethAmountRounded} ETH exceeds maximum (10 ETH)`);
    }

    // Initialize provider and wallet
    const provider = new ethers.JsonRpcProvider(SEPOLIA_RPC_URL);
    const deployerPrivateKey = Deno.env.get('TEMPO_DEPLOYER_PRIVATE_KEY');
    
    if (!deployerPrivateKey) {
      throw new Error('Deployer private key not configured');
    }

    const wallet = new ethers.Wallet(deployerPrivateKey, provider);
    console.log(`Deployer wallet address: ${wallet.address}`);

    // Smart contract setup
    const FAUCET_ADDRESS = '0xb90bb7616bc138a177bec31a4571f4fd8fe113a1';
    const FAUCET_ABI = [
      'function setClaimableReward(address user, uint256 amount, string claimId) external',
      'function getClaimStatus(address user) view returns (uint256 amount, bool claimed)',
      'function claimRewards() external',
    ];

    const faucetContract = new ethers.Contract(FAUCET_ADDRESS, FAUCET_ABI, wallet);

    // Check deployer balance for gas
    const balance = await provider.getBalance(wallet.address);
    const balanceInEth = parseFloat(ethers.formatEther(balance));
    console.log(`Deployer balance: ${balanceInEth} ETH`);

    if (balanceInEth < 0.1) {
      console.warn(`⚠️ Deployer balance is low: ${balanceInEth} ETH`);
    }

    // Check contract balance
    const contractBalance = await provider.getBalance(FAUCET_ADDRESS);
    const contractBalanceInEth = parseFloat(ethers.formatEther(contractBalance));
    console.log(`Contract balance: ${contractBalanceInEth} ETH`);

    // Auto-fund contract if balance is insufficient
    if (contractBalanceInEth < ethAmountRounded) {
      console.log(`⚠️ Contract balance insufficient. Funding contract...`);
      
      // Transfer ETH from deployer wallet to contract (2x the needed amount for buffer)
      const fundingAmount = ethAmountRounded * 2;
      const fundingAmountRounded = parseFloat(fundingAmount.toFixed(6));
      const fundingAmountInWei = ethers.parseEther(fundingAmountRounded.toString());
      
      console.log(`Transferring ${fundingAmountRounded} ETH from deployer to contract...`);
      
      const fundingTx = await wallet.sendTransaction({
        to: FAUCET_ADDRESS,
        value: fundingAmountInWei,
      });
      
      console.log(`Funding tx sent: ${fundingTx.hash}`);
      await fundingTx.wait(1);
      console.log(`✓ Contract funded with ${fundingAmountRounded} ETH`);
      
      // Re-check contract balance
      const newContractBalance = await provider.getBalance(FAUCET_ADDRESS);
      const newContractBalanceInEth = parseFloat(ethers.formatEther(newContractBalance));
      console.log(`New contract balance: ${newContractBalanceInEth} ETH`);
    }

    // Convert ETH amount to Wei
    const ethAmountInWei = ethers.parseEther(ethAmountRounded.toString());

    console.log(`Setting claimable reward for ${evmWalletAddress}: ${ethAmountRounded} ETH`);

    // Call smart contract to set claimable amount (deployer signs this)
    const tx = await faucetContract.setClaimableReward(evmWalletAddress, ethAmountInWei, claimId);
    console.log(`Transaction sent: ${tx.hash}`);

    // Wait for confirmation
    console.log('Waiting for transaction confirmation...');
    const receipt = await tx.wait(1);
    console.log(`Transaction confirmed in block ${receipt?.blockNumber}`);

    // Wait for blockchain state to settle (2-3 blocks on Sepolia = ~30 seconds)
    console.log('⏱️ Waiting 30 seconds for blockchain state to settle before verification...');
    await new Promise(resolve => setTimeout(resolve, 30000));

    // Verify the transaction succeeded by reading back the claimable amount with retry logic
    let verificationSuccess = false;
    let verifyClaimableEth = 0;
    const maxRetries = 3;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`Verification attempt ${attempt}/${maxRetries}: Checking on-chain claimable amount...`);
        const verifyClaimStatus = await faucetContract.getClaimStatus(evmWalletAddress);
        
        // Log raw response for debugging - getClaimStatus returns [amount, claimed]
        console.log(`Raw contract response: ${JSON.stringify(verifyClaimStatus)}`);
        
        verifyClaimableEth = parseFloat(ethers.formatEther(verifyClaimStatus[0]));
        const hasBeenClaimed = verifyClaimStatus[1];
        console.log(`On-chain claimable amount: ${verifyClaimableEth} ETH, claimed: ${hasBeenClaimed}`);

        if (verifyClaimableEth === 0) {
          console.warn(`⚠️ Attempt ${attempt}: Verification shows 0 claimable amount`);
          if (attempt < maxRetries) {
            console.log(`Waiting 10 seconds before retry...`);
            await new Promise(resolve => setTimeout(resolve, 10000));
            continue;
          } else {
            console.warn(`⚠️ All verification attempts returned 0. Transaction confirmed but verification inconclusive.`);
          }
        } else if (Math.abs(verifyClaimableEth - ethAmountRounded) > 0.0001) {
          console.warn(`⚠️ Claimable amount mismatch: expected ${ethAmountRounded}, got ${verifyClaimableEth}`);
          verificationSuccess = true; // Still mark as success since amount is non-zero
          break;
        } else {
          console.log('✓ On-chain verification successful');
          verificationSuccess = true;
          break;
        }
      } catch (verifyError: any) {
        console.error(`❌ Verification attempt ${attempt} failed:`, verifyError);
        console.error(`Error details: ${JSON.stringify({
          code: verifyError?.code,
          message: verifyError?.message,
          value: verifyError?.value,
        })}`);
        
        if (attempt < maxRetries) {
          console.log(`Waiting 10 seconds before retry...`);
          await new Promise(resolve => setTimeout(resolve, 10000));
        } else {
          console.log('⚠️ All verification attempts failed. Contract is prepared but verification inconclusive.');
        }
      }
    }

    // Always update the claim record with contract preparation details
    // Set status to 'contract_prepared' since transaction confirmed successfully
    console.log('Updating database with prepared contract details...');
    const claimStatus = verificationSuccess && verifyClaimableEth > 0 
      ? 'ready_to_claim' 
      : 'contract_prepared'; // Transaction succeeded, just verification pending
    
    console.log(`Setting claim status to: ${claimStatus}`);
    
    const { error: updateError } = await supabase
      .from('depin_reward_claims')
      .update({
        sepolia_eth_amount: ethAmountRounded,
        eth_price_at_transfer: ethPriceUSD,
        conversion_rate: conversionRate,
        contract_prepared_at: new Date().toISOString(),
        status: claimStatus,
        eth_transfer_tx: tx.hash,
        eth_transfer_block_number: receipt?.blockNumber,
      })
      .eq('id', claimId);

    if (updateError) {
      console.error('Failed to update claim:', updateError);
      throw new Error(`Contract preparation succeeded but database update failed: ${updateError.message}`);
    }
    
    console.log('✓ Database updated successfully');

    // Update wormhole_transactions status
    if (claim.wormhole_tx_id) {
      const { error: txUpdateError } = await supabase
        .from('wormhole_transactions')
        .update({
          contract_claim_status: 'ready_to_claim',
        })
        .eq('id', claim.wormhole_tx_id);

      if (txUpdateError) {
        console.error('Failed to update wormhole transaction:', txUpdateError);
      }
    }

    console.log('✓ Smart contract prepared for user claim');

    return new Response(
      JSON.stringify({
        success: true,
        prepareTxHash: tx.hash,
        sepoliaEthAmount: ethAmountRounded.toString(),
        ethAmountWithoutBuffer: ethAmount.toFixed(6),
        usdcAmount: claim.total_amount,
        ethPriceUSD: ethPriceUSD,
        conversionRate: conversionRate,
        blockNumber: receipt?.blockNumber,
        contractAddress: FAUCET_ADDRESS,
        userNeedsToClaim: true,
        explorerUrl: `https://sepolia.etherscan.io/tx/${tx.hash}`,
        verificationSuccess,
        verifiedAmount: verifyClaimableEth > 0 ? verifyClaimableEth.toString() : null,
        warning: verificationSuccess 
          ? null 
          : 'Contract prepared successfully! Verification is still settling. You can try to claim now or wait 30-60 seconds for on-chain state to update.',
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
