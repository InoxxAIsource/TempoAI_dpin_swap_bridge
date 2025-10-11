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
    const { protocol, token, chain, fromChain, amount, walletAddress } = await req.json();

    if (!protocol || !token || !chain || !amount) {
      throw new Error('Missing required parameters');
    }

    // Mock combined bridge + yield deposit
    const mockTxHash = '0x' + Array.from({ length: 64 }, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('');

    const execution = {
      txHash: mockTxHash,
      estimatedCompletion: Date.now() + 12000, // 12 seconds
      status: 'pending',
      protocol,
      token,
      chain,
      fromChain: fromChain || chain,
      amount,
      walletAddress,
    };

    console.log('Yield execution:', execution);

    return new Response(
      JSON.stringify(execution),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in wormhole-execute-yield:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
