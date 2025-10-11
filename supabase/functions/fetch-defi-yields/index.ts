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
    console.log('🔍 Fetching real DeFi yields from DeFi Llama...');
    
    // Fetch real yield data from DeFi Llama
    const response = await fetch('https://yields.llama.fi/pools');
    const rawData = await response.json();
    
    if (!rawData.data || !Array.isArray(rawData.data)) {
      throw new Error('Invalid response from DeFi Llama API');
    }

    // Filter for quality opportunities
    const supportedChains = ['Ethereum', 'Arbitrum', 'Optimism', 'Polygon', 'Base'];
    const supportedProtocols = ['Aave', 'Compound', 'Curve', 'Lido', 'Uniswap'];

    const yields = rawData.data
      .filter((pool: any) => {
        return (
          pool.tvlUsd > 10_000_000 && // $10M+ TVL
          pool.apy > 3 && // 3%+ APY
          pool.apy < 100 && // Remove suspicious APYs
          supportedChains.includes(pool.chain) &&
          supportedProtocols.some(p => pool.project.toLowerCase().includes(p.toLowerCase())) &&
          pool.stablecoin !== false // Include stablecoins and others
        );
      })
      .slice(0, 15) // Top 15 opportunities
      .map((pool: any) => {
        // Risk assessment
        let risk: 'low' | 'medium' | 'high' = 'medium';
        if (pool.tvlUsd > 100_000_000 && pool.predictions?.predictedClass === 'Stable') {
          risk = 'low';
        } else if (pool.tvlUsd < 50_000_000) {
          risk = 'high';
        }

        // Determine type
        let type = 'liquidity';
        if (pool.poolMeta && pool.poolMeta.toLowerCase().includes('lending')) {
          type = 'lending';
        } else if (pool.project.toLowerCase().includes('lido') || pool.project.toLowerCase().includes('stake')) {
          type = 'staking';
        }

        return {
          protocol: pool.project,
          token: pool.symbol,
          chain: pool.chain,
          apy: parseFloat(pool.apy.toFixed(2)),
          tvl: pool.tvlUsd.toFixed(0),
          risk,
          type,
          poolAddress: pool.pool,
          actionable: true,
          execution: {
            type: 'cross_chain_yield',
            requiresBridge: true,
            estimatedGas: pool.chain === 'Ethereum' ? '$5.00' : pool.chain === 'Polygon' ? '$0.50' : '$2.00',
            executionTime: '12 seconds'
          }
        };
      });

    console.log(`✅ Fetched ${yields.length} real yield opportunities from DeFi Llama`);

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
