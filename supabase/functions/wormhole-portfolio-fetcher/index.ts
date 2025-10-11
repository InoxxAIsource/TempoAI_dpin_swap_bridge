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

// Helper function for retrying failed RPC calls
async function fetchWithRetry(
  url: string,
  options: RequestInit,
  maxRetries = 2
): Promise<Response> {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);
      
      if (response.ok) {
        return response;
      }
      
      console.warn(`⚠️ Attempt ${attempt + 1}/${maxRetries + 1} failed with status ${response.status}`);
      
      if (attempt < maxRetries) {
        const delay = Math.pow(2, attempt) * 1000; // 1s, 2s, 4s
        console.log(`⏳ Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    } catch (error) {
      console.error(`❌ Attempt ${attempt + 1}/${maxRetries + 1} error:`, error);
      
      if (attempt >= maxRetries) {
        throw error;
      }
      
      const delay = Math.pow(2, attempt) * 1000;
      console.log(`⏳ Retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw new Error('All retry attempts failed');
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

    // Validate API key
    if (!ALCHEMY_API_KEY) {
      throw new Error('❌ ALCHEMY_API_KEY not configured in Supabase secrets');
    }

    if (ALCHEMY_API_KEY === 'demo') {
      console.warn('⚠️ WARNING: Using demo Alchemy key - expect rate limiting');
    }

    console.log('🔑 Using Alchemy API key:', ALCHEMY_API_KEY.slice(0, 8) + '...' + ALCHEMY_API_KEY.slice(-4));
    console.log('📋 Query params:', {
      evmAddress: evmAddress ? `${evmAddress.slice(0, 6)}...${evmAddress.slice(-4)}` : 'none',
      solanaAddress: solanaAddress ? `${solanaAddress.slice(0, 6)}...${solanaAddress.slice(-4)}` : 'none',
      includeTestnets
    });

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

    console.log('🌐 Chains to query:', chains.map(c => c.name).join(', '));

    const holdings: any[] = [];
    let totalValueUSD = 0;

    // Fetch EVM balances
    if (evmAddress) {
      const balancePromises = chains.map(async (chain) => {
        try {
          console.log(`🔍 Fetching balance for ${chain.name} (${evmAddress.slice(0, 6)}...${evmAddress.slice(-4)})...`);
          console.log(`📡 ${chain.name} RPC: ${chain.rpc.substring(0, 50)}...`);

          const response = await fetchWithRetry(chain.rpc, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              jsonrpc: '2.0',
              method: 'eth_getBalance',
              params: [evmAddress, 'latest'],
              id: 1,
            }),
          });

          console.log(`📡 ${chain.name} RPC Response Status: ${response.status}`);

          const data = await response.json();
          console.log(`📊 ${chain.name} Raw Response:`, JSON.stringify(data));

          if (data.error) {
            console.error(`❌ ${chain.name} RPC Error:`, data.error);
            return { 
              chain: chain.name, 
              balance: 0, 
              error: data.error 
            };
          }

          const balanceWei = parseInt(data.result, 16);
          const balanceEth = balanceWei / 1e18;

          console.log(`💰 ${chain.name} Balance: ${balanceEth} ETH (${balanceWei} Wei)`);

          // Fetch real ETH price from CoinGecko
          const ethPrice = await fetchTokenPrice('ethereum');
          const valueUSD = balanceEth * ethPrice;

          console.log(`💵 ${chain.name} Value: $${valueUSD.toFixed(2)} (ETH price: $${ethPrice})`);

          if (balanceEth > 0) {
            holdings.push({
              chain: chain.name,
              token: 'ETH',
              amount: balanceEth.toFixed(4),
              valueUSD: valueUSD.toFixed(2),
              network: chain.id === 11155111 ? 'testnet' : 'mainnet',
            });
            totalValueUSD += valueUSD;
            console.log(`✅ Added ${chain.name} holding: ${balanceEth} ETH`);
          } else {
            console.log(`⚠️ ${chain.name} has 0 balance, skipping`);
          }

          return { chain: chain.name, balance: balanceEth };
        } catch (error) {
          const errorDetails = {
            chain: chain.name,
            rpc: chain.rpc,
            error: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined,
            timestamp: new Date().toISOString()
          };
          
          console.error(`❌ Failed to fetch balance for ${chain.name}:`, errorDetails);
          
          return { 
            chain: chain.name, 
            balance: 0, 
            error: errorDetails.error 
          };
        }
      });

      const results = await Promise.all(balancePromises);
      
      // Log any chains that failed
      const failedChains = results.filter(r => r.error);
      if (failedChains.length > 0) {
        console.error('⚠️ Some chains failed:', failedChains.map(f => `${f.chain}: ${f.error}`));
      }
    }

    // Fetch Solana balance
    if (solanaAddress) {
      try {
        const ALCHEMY_KEY = ALCHEMY_API_KEY || 'demo';
        const solanaRpc = includeTestnets 
          ? `https://solana-devnet.g.alchemy.com/v2/${ALCHEMY_KEY}` 
          : `https://solana-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY}`;
        
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

    console.log('📋 PORTFOLIO SUMMARY:', {
      totalHoldings: holdings.length,
      totalValueUSD: totalValueUSD.toFixed(2),
      chains: holdings.map(h => `${h.chain}: ${h.amount} ${h.token}`),
      chainsQueried: chains.map(c => c.name),
      evmAddress: evmAddress ? `${evmAddress.slice(0, 6)}...${evmAddress.slice(-4)}` : 'none',
      solanaAddress: solanaAddress ? `${solanaAddress.slice(0, 6)}...${solanaAddress.slice(-4)}` : 'none'
    });

    return new Response(
      JSON.stringify({
        totalValueUSD: parseFloat(totalValueUSD.toFixed(2)),
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
