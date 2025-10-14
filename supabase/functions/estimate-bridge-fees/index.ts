import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.74.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Gas estimates for different chains (in native tokens)
const GAS_ESTIMATES = {
  'Ethereum': { gasUnits: 150000, symbol: 'ETH' },
  'Polygon': { gasUnits: 150000, symbol: 'MATIC' },
  'Arbitrum': { gasUnits: 150000, symbol: 'ETH' },
  'Optimism': { gasUnits: 150000, symbol: 'ETH' },
  'Base': { gasUnits: 150000, symbol: 'ETH' },
  'Avalanche': { gasUnits: 150000, symbol: 'AVAX' },
  'Solana': { gasUnits: 5000, symbol: 'SOL' }, // lamports
  'BNB': { gasUnits: 150000, symbol: 'BNB' },
};

// Approximate gas prices (in USD per unit)
const GAS_PRICES_USD = {
  'ETH': 0.000002, // ~$2 per million gas at current prices
  'MATIC': 0.0000001,
  'AVAX': 0.0000005,
  'SOL': 0.000001,
  'BNB': 0.0000003,
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { amount, fromChain, toChain, token } = await req.json();

    if (!amount || !fromChain || !toChain || !token) {
      throw new Error('Missing required parameters: amount, fromChain, toChain, token');
    }

    console.log(`💰 Estimating fees for ${amount} ${token} from ${fromChain} to ${toChain}`);

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get user from JWT (optional for this endpoint)
    let userId = null;
    const authHeader = req.headers.get('Authorization');
    if (authHeader) {
      const { data: { user } } = await supabase.auth.getUser(
        authHeader.replace('Bearer ', '')
      );
      userId = user?.id;
    }

    // Estimate bridge fee (typically 0.1-0.5% of amount for Wormhole)
    const bridgeFeePercent = 0.002; // 0.2%
    const bridgeFee = Number(amount) * bridgeFeePercent;

    // Get gas estimate for destination chain
    const gasEstimate = GAS_ESTIMATES[toChain as keyof typeof GAS_ESTIMATES];
    if (!gasEstimate) {
      throw new Error(`Unsupported chain: ${toChain}`);
    }

    // Calculate gas cost in USD
    const gasSymbol = gasEstimate.symbol;
    const gasPriceUSD = GAS_PRICES_USD[gasSymbol as keyof typeof GAS_PRICES_USD] || 0;
    const estimatedGasUSD = gasEstimate.gasUnits * gasPriceUSD;

    // Total cost
    const totalCostUSD = bridgeFee + estimatedGasUSD;

    const result = {
      bridgeFee,
      bridgeFeeUSD: bridgeFee,
      estimatedGas: gasEstimate.gasUnits,
      estimatedGasUSD,
      gasSymbol,
      totalCostUSD,
      hasGasOnDestination: false, // Would need to check user's wallet
      recommendedGasAmount: gasEstimate.gasUnits * 1.5, // 50% buffer
      savings: 0, // Calculate based on individual vs batch
    };

    // Store estimate in database if user is authenticated
    if (userId) {
      await supabase.from('bridge_fee_estimates').insert({
        user_id: userId,
        from_chain: fromChain,
        to_chain: toChain,
        token,
        amount,
        bridge_fee: bridgeFee,
        estimated_gas_usd: estimatedGasUSD,
        total_cost_usd: totalCostUSD,
      });
    }

    console.log(`✅ Estimated fees: Bridge $${bridgeFee.toFixed(4)}, Gas $${estimatedGasUSD.toFixed(4)}, Total $${totalCostUSD.toFixed(4)}`);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
