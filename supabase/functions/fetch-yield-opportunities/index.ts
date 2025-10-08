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
    const { tokens } = await req.json();

    console.log(`Fetching yield opportunities for ${tokens?.length || 0} tokens`);

    // Mock yield opportunities - in production, integrate with DeFi protocols like Aave, Compound, etc.
    const opportunities = [
      {
        protocol: 'Aave',
        token: 'USDC',
        apy: 4.2,
        type: 'lending',
        chain: 'Ethereum',
        tvl: 2400000000,
      },
      {
        protocol: 'Compound',
        token: 'ETH',
        apy: 3.8,
        type: 'lending',
        chain: 'Ethereum',
        tvl: 1800000000,
      },
      {
        protocol: 'Uniswap V3',
        token: 'ETH/USDC',
        apy: 12.5,
        type: 'liquidity',
        chain: 'Ethereum',
        tvl: 3200000000,
      },
      {
        protocol: 'Curve',
        token: 'stETH',
        apy: 5.6,
        type: 'staking',
        chain: 'Ethereum',
        tvl: 5100000000,
      },
      {
        protocol: 'Lido',
        token: 'ETH',
        apy: 4.1,
        type: 'staking',
        chain: 'Ethereum',
        tvl: 9800000000,
      },
    ];

    console.log(`Returning ${opportunities.length} yield opportunities`);

    return new Response(
      JSON.stringify({ opportunities }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error fetching yield opportunities:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
