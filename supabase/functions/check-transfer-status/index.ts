import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.74.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TransferStatusRequest {
  tx_hash: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { tx_hash }: TransferStatusRequest = await req.json();

    if (!tx_hash) {
      throw new Error('Transaction hash is required');
    }

    console.log('Checking transfer status for tx:', tx_hash);

    // Query WormholeScan API
    const wormholeResponse = await fetch(
      `https://api.wormholescan.io/api/v1/transactions/${tx_hash}`,
      {
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    if (!wormholeResponse.ok) {
      console.error('WormholeScan API error:', wormholeResponse.status);
      throw new Error('Failed to fetch transfer status from WormholeScan');
    }

    const wormholeData = await wormholeResponse.json();
    console.log('WormholeScan response:', JSON.stringify(wormholeData, null, 2));

    // Determine if transfer needs redemption
    // Check if VAA is available and destination chain hasn't received tokens
    const needsRedemption = !!(
      wormholeData.data?.vaa && 
      wormholeData.data?.toChain &&
      !wormholeData.data?.redeemedTxHash
    );

    const readyToClaim = needsRedemption;

    // Update database with status
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get authorization header to identify user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const { data: userData, error: userError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (userError || !userData.user) {
      throw new Error('Unauthorized');
    }

    // Update the transaction record
    const { error: updateError } = await supabaseClient
      .from('wormhole_transactions')
      .update({
        needs_redemption: needsRedemption,
        wormhole_vaa: wormholeData.data?.vaa || null,
        status: wormholeData.data?.redeemedTxHash ? 'completed' : 'pending',
      })
      .eq('tx_hash', tx_hash)
      .eq('user_id', userData.user.id);

    if (updateError) {
      console.error('Error updating transaction:', updateError);
      throw updateError;
    }

    // Determine network for WormholeScan URL
    const network = wormholeData.data?.fromChain?.toLowerCase().includes('testnet') ||
                    wormholeData.data?.fromChain?.toLowerCase().includes('devnet')
      ? 'Testnet'
      : 'Mainnet';

    const redeemUrl = `https://wormholescan.io/#/tx/${tx_hash}?network=${network}&view=redeem`;

    return new Response(
      JSON.stringify({
        ready_to_claim: readyToClaim,
        needs_redemption: needsRedemption,
        redeem_url: redeemUrl,
        status: wormholeData.data?.status || 'unknown',
        vaa_available: !!wormholeData.data?.vaa,
        redeemed: !!wormholeData.data?.redeemedTxHash,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in check-transfer-status:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
