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
    const { token, amount, fromChain, toChain, senderAddress, recipientAddress } = await req.json();

    if (!token || !amount || !fromChain || !toChain || !senderAddress) {
      throw new Error('Missing required parameters');
    }

    // Mock Wormhole NTT bridge
    const mockTxHash = '0x' + Array.from({ length: 64 }, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
    
    const mockVAA = 'vaa_' + Array.from({ length: 32 }, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('');

    const execution = {
      txHash: mockTxHash,
      vaa: mockVAA,
      status: 'pending',
      estimatedCompletion: Date.now() + 300000, // ~5 minutes
      token,
      amount,
      fromChain,
      toChain,
      senderAddress,
      recipientAddress: recipientAddress || senderAddress,
    };

    console.log('Bridge execution:', execution);

    return new Response(
      JSON.stringify(execution),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in wormhole-execute-bridge:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
