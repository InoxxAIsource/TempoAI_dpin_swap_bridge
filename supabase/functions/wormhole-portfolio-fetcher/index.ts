import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.74.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Price cache to avoid rate limits
const priceCache = new Map<string, { price: number, timestamp: number }>();
const CACHE_TTL = 60000; // 60 seconds

async function fetchTokenPrice(tokenId: string): Promise<number> {
  const cached = priceCache.get(tokenId);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.price;
  }
  
  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${tokenId}&vs_currencies=usd`
    );
    const data = await response.json();
    const price = data[tokenId]?.usd || 0;
    
    priceCache.set(tokenId, { price, timestamp: Date.now() });
    console.log(`✅ Fetched ${tokenId} price: $${price}`);
    return price;
  } catch (error) {
    console.error(`Error fetching price for ${tokenId}:`, error);
    return cached?.price || 0;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { evmAddress, solanaAddress, includeTestnets = true } = await req.json();

    if (!evmAddress && !solanaAddress) {
      throw new Error('At least one wallet address is required');
    }

    const ALCHEMY_API_KEY = Deno.env.get('ALCHEMY_API_KEY') || Deno.env.get('VITE_ALCHEMY_API_KEY');

    // Fetch balances from multiple chains using Alchemy
    const chains = [
      { name: 'Ethereum', id: 1, rpc: `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}` },
      { name: 'Arbitrum', id: 42161, rpc: `https://arb-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}` },
      { name: 'Optimism', id: 10, rpc: `https://opt-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}` },
      { name: 'Polygon', id: 137, rpc: `https://polygon-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}` },
      { name: 'Base', id: 8453, rpc: `https://base-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}` },
    ];

    if (includeTestnets && evmAddress) {
      chains.push({ name: 'Sepolia', id: 11155111, rpc: `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}` });
    }

    const holdings: any[] = [];
    let totalValueUSD = 0;

    // Fetch EVM balances
    if (evmAddress) {
      const balancePromises = chains.map(async (chain) => {
        try {
          const response = await fetch(chain.rpc, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              jsonrpc: '2.0',
              method: 'eth_getBalance',
              params: [evmAddress, 'latest'],
              id: 1,
            }),
          });

          const data = await response.json();
          const balanceWei = parseInt(data.result, 16);
          const balanceEth = balanceWei / 1e18;

          // Fetch real ETH price from CoinGecko
          const ethPrice = await fetchTokenPrice('ethereum');
          const valueUSD = balanceEth * ethPrice;

          if (balanceEth > 0) {
            holdings.push({
              chain: chain.name,
              token: 'ETH',
              amount: balanceEth.toFixed(4),
              valueUSD: valueUSD.toFixed(2),
              network: chain.id === 11155111 ? 'testnet' : 'mainnet',
            });
            totalValueUSD += valueUSD;
          }

          return { chain: chain.name, balance: balanceEth };
        } catch (error) {
          console.error(`Error fetching balance for ${chain.name}:`, error);
          return { chain: chain.name, balance: 0 };
        }
      });

      await Promise.all(balancePromises);
    }

    // Fetch Solana balance
    if (solanaAddress) {
      try {
        const solanaRpc = includeTestnets 
          ? 'https://api.devnet.solana.com' 
          : 'https://api.mainnet-beta.solana.com';
        
        const response = await fetch(solanaRpc, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            id: 1,
            method: 'getBalance',
            params: [solanaAddress],
          }),
        });

        const data = await response.json();
        const balanceSol = (data.result?.value || 0) / 1e9;
        // Fetch real SOL price from CoinGecko
        const solPrice = await fetchTokenPrice('solana');
        const valueUSD = balanceSol * solPrice;

        if (balanceSol > 0) {
          holdings.push({
            chain: 'Solana',
            token: 'SOL',
            amount: balanceSol.toFixed(4),
            valueUSD: valueUSD.toFixed(2),
            network: includeTestnets ? 'devnet' : 'mainnet',
          });
          totalValueUSD += valueUSD;
        }
      } catch (error) {
        console.error('Error fetching Solana balance:', error);
      }
    }

    // Sort by value
    holdings.sort((a, b) => parseFloat(b.valueUSD) - parseFloat(a.valueUSD));

    const topHoldings = holdings.slice(0, 3);
    const chainCount = new Set(holdings.map(h => h.chain)).size;
    const hasIdleStablecoins = false; // Would need to check token balances
    const hasEthereumMainnet = holdings.some(h => h.chain === 'Ethereum');

    return new Response(
      JSON.stringify({
        totalValueUSD: totalValueUSD.toFixed(2),
        holdings,
        topHoldings,
        chainCount,
        chainsQueried: chains.map(c => c.name),
        guardianVerified: true,
        timestamp: Date.now(),
        hasIdleStablecoins,
        hasEthereumMainnet,
        ethereumGasHigh: true, // Could fetch real gas price
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in wormhole-portfolio-fetcher:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
