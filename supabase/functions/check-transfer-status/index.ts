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

    // Query WormholeScan API using operations endpoint (testnet)
    const baseUrl = 'https://api.testnet.wormholescan.io';
    const wormholeResponse = await fetch(
      `${baseUrl}/api/v1/operations?txHash=${tx_hash}`,
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

    // Parse operations response
    const operation = wormholeData.operations?.[0];
    const sourceTx = operation?.sourceChain?.transaction;
    const destTx = operation?.targetChain?.transaction;
    
    // Determine if transfer needs redemption
    const vaa = sourceTx?.vaa || null;
    const needsRedemption = !!(vaa && !destTx?.txHash);
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
        wormhole_vaa: vaa,
        status: destTx?.txHash ? 'completed' : 'pending',
      })
      .eq('tx_hash', tx_hash)
      .eq('user_id', userData.user.id);

    if (updateError) {
      console.error('Error updating transaction:', updateError);
      throw updateError;
    }

    // Use testnet for WormholeScan URL
    const network = 'Testnet';
    const redeemUrl = `https://wormholescan.io/#/tx/${tx_hash}?network=${network}`;

    return new Response(
      JSON.stringify({
        ready_to_claim: readyToClaim,
        needs_redemption: needsRedemption,
        redeem_url: redeemUrl,
        status: destTx?.txHash ? 'completed' : 'pending',
        vaa_available: !!vaa,
        redeemed: !!destTx?.txHash,
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
