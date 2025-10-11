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
    // Mock yield data - in production, fetch from Aave, Compound, etc.
    const yields = [
      {
        protocol: 'Aave',
        token: 'USDC',
        chain: 'Arbitrum',
        apy: 6.8,
        tvl: '890000000',
        risk: 'low',
        type: 'lending',
        actionable: true,
        execution: {
          type: 'cross_chain_yield',
          requiresBridge: true,
          estimatedGas: '$2.34',
          executionTime: '12 seconds',
        },
      },
      {
        protocol: 'Curve',
        token: '3pool',
        chain: 'Polygon',
        apy: 4.2,
        tvl: '1200000000',
        risk: 'low',
        type: 'liquidity',
        actionable: true,
        execution: {
          type: 'cross_chain_yield',
          requiresBridge: true,
          estimatedGas: '$0.45',
          executionTime: '12 seconds',
        },
      },
      {
        protocol: 'Lido',
        token: 'stETH',
        chain: 'Ethereum',
        apy: 3.5,
        tvl: '9500000000',
        risk: 'low',
        type: 'staking',
        actionable: true,
        execution: {
          type: 'cross_chain_yield',
          requiresBridge: false,
          estimatedGas: '$5.67',
          executionTime: '12 seconds',
        },
      },
      {
        protocol: 'Compound',
        token: 'USDT',
        chain: 'Base',
        apy: 5.4,
        tvl: '450000000',
        risk: 'low',
        type: 'lending',
        actionable: true,
        execution: {
          type: 'cross_chain_yield',
          requiresBridge: true,
          estimatedGas: '$0.89',
          executionTime: '12 seconds',
        },
      },
      {
        protocol: 'Uniswap V3',
        token: 'ETH/USDC',
        chain: 'Optimism',
        apy: 8.9,
        tvl: '340000000',
        risk: 'medium',
        type: 'liquidity',
        actionable: true,
        execution: {
          type: 'cross_chain_yield',
          requiresBridge: true,
          estimatedGas: '$1.23',
          executionTime: '12 seconds',
        },
      },
    ];

    return new Response(
      JSON.stringify({ yields }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in fetch-defi-yields:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
