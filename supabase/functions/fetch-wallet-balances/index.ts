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

    // Map chain IDs to Alchemy network names
    const chainMap: Record<number, string> = {
      1: 'eth-mainnet',
      137: 'polygon-mainnet',
      42161: 'arb-mainnet',
      10: 'opt-mainnet',
      8453: 'base-mainnet',
    };

    const network = chainMap[chainId] || 'eth-mainnet';
    const alchemyUrl = `https://${network}.g.alchemy.com/v2/${ALCHEMY_API_KEY}`;

    console.log(`Fetching balance for ${walletAddress} on ${network}`);

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
    const nativeBalance = parseInt(balanceData.result, 16) / 1e18;

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

    console.log(`Found ${tokens.length} tokens for ${walletAddress}`);

    return new Response(
      JSON.stringify({
        nativeBalance,
        tokens: tokens.filter((t: any) => parseInt(t.tokenBalance, 16) > 0),
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error fetching wallet balances:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
