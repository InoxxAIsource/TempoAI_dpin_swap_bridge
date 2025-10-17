import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { walletAddress, chainId } = await req.json();
    const ALCHEMY_API_KEY = Deno.env.get('ALCHEMY_API_KEY');

    if (!ALCHEMY_API_KEY) {
      throw new Error('ALCHEMY_API_KEY not configured');
    }

    console.log(`Fetching balance for ${walletAddress} on chain ${chainId}`);

    // SOLANA SUPPORT: Check if this is a Solana address/chain
    if (chainId === 'solana' || chainId === 'Solana' || chainId === 1399811149) {
      console.log('🔵 Detected Solana chain, using Solana RPC methods');
      
      // Determine if mainnet or devnet based on chainId
      const isMainnet = chainId === 'Solana' || chainId === 1399811149;
      const solanaUrl = isMainnet
        ? 'https://api.mainnet.solana.com' // Official public mainnet RPC
        : `https://solana-devnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`; // Testnet via Alchemy

      // Get SOL native balance
      const balanceResponse = await fetch(solanaUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'getBalance',
          params: [walletAddress],
        }),
      });

      const balanceData = await balanceResponse.json();
      
      if (balanceData.error) {
        throw new Error(`Solana RPC error: ${balanceData.error.message}`);
      }
      
      const nativeBalance = balanceData.result?.value ? balanceData.result.value / 1e9 : 0;
      console.log(`✅ Solana balance: ${nativeBalance} SOL`);

      // Get SPL token balances
      const tokenResponse = await fetch(solanaUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 2,
          method: 'getTokenAccountsByOwner',
          params: [
            walletAddress,
            { programId: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA' },
            { encoding: 'jsonParsed' }
          ],
        }),
      });

      const tokenData = await tokenResponse.json();
      
      if (tokenData.error) {
        console.warn('⚠️ Could not fetch SPL tokens:', tokenData.error.message);
      }
      
      const tokens = tokenData.result?.value || [];
      console.log(`✅ Found ${tokens.length} SPL token accounts`);

      // Parse SPL token data
      const parsedTokens = tokens.map((token: any) => ({
        tokenAddress: token.account.data.parsed.info.mint,
        tokenBalance: token.account.data.parsed.info.tokenAmount.amount,
        decimals: token.account.data.parsed.info.tokenAmount.decimals,
        uiAmount: token.account.data.parsed.info.tokenAmount.uiAmount,
      })).filter((t: any) => parseFloat(t.uiAmount) > 0);

      return new Response(
        JSON.stringify({
          chain: 'Solana',
          nativeBalance,
          nativeSymbol: 'SOL',
          tokens: parsedTokens,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // EVM CHAINS: Original logic
    const chainMap: Record<number, string> = {
      1: 'eth-mainnet',
      137: 'polygon-mainnet',
      42161: 'arb-mainnet',
      10: 'opt-mainnet',
      8453: 'base-mainnet',
      11155111: 'eth-sepolia',
      421614: 'arb-sepolia',
      84532: 'base-sepolia',
      11155420: 'opt-sepolia',
      80002: 'polygon-amoy',
    };

    const network = chainMap[chainId] || 'eth-mainnet';
    const alchemyUrl = `https://${network}.g.alchemy.com/v2/${ALCHEMY_API_KEY}`;

    console.log(`🔷 Using EVM network: ${network}`);

    // Get native token balance
    const balanceResponse = await fetch(alchemyUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'eth_getBalance',
        params: [walletAddress, 'latest'],
      }),
    });

    const balanceData = await balanceResponse.json();
    
    if (balanceData.error) {
      throw new Error(`EVM RPC error: ${balanceData.error.message}`);
    }
    
    const nativeBalance = parseInt(balanceData.result, 16) / 1e18;
    console.log(`✅ EVM balance: ${nativeBalance} ETH`);

    // Get token balances
    const tokenResponse = await fetch(alchemyUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 2,
        method: 'alchemy_getTokenBalances',
        params: [walletAddress],
      }),
    });

    const tokenData = await tokenResponse.json();
    const tokens = tokenData.result?.tokenBalances || [];

    console.log(`✅ Found ${tokens.length} ERC20 tokens`);

    return new Response(
      JSON.stringify({
        chain: network,
        nativeBalance,
        nativeSymbol: 'ETH',
        tokens: tokens.filter((t: any) => parseInt(t.tokenBalance, 16) > 0),
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('❌ Error fetching wallet balances:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
