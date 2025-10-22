import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get user from auth header
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    const userId = user.id;
    const url = new URL(req.url);
    const pathParts = url.pathname.split('/').filter(Boolean);

    // GET - List all connected wallets
    if (req.method === 'GET') {
      console.log('Fetching wallets for user:', userId);

      const { data: wallets, error: walletsError } = await supabase
        .from('wallet_connections')
        .select('*')
        .eq('user_id', userId)
        .order('is_primary', { ascending: false })
        .order('connected_at', { ascending: false });

      if (walletsError) {
        console.error('Wallets fetch error:', walletsError);
        throw walletsError;
      }

      return new Response(
        JSON.stringify({ wallets: wallets || [] }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    // POST - Connect new wallet
    if (req.method === 'POST') {
      const body = await req.json();
      const { wallet_address, chain_type, chain_name } = body;

      if (!wallet_address || !chain_type || !chain_name) {
        throw new Error('Missing required fields: wallet_address, chain_type, chain_name');
      }

      console.log('Connecting wallet for user:', userId, wallet_address);

      // Check if wallet already exists
      const { data: existingWallet } = await supabase
        .from('wallet_connections')
        .select('*')
        .eq('user_id', userId)
        .eq('wallet_address', wallet_address)
        .single();

      if (existingWallet) {
        throw new Error('Wallet already connected');
      }

      // Check if user has any wallets (set as primary if first wallet)
      const { data: existingWallets } = await supabase
        .from('wallet_connections')
        .select('id')
        .eq('user_id', userId);

      const isPrimary = !existingWallets || existingWallets.length === 0;

      const { data: newWallet, error: insertError } = await supabase
        .from('wallet_connections')
        .insert({
          user_id: userId,
          wallet_address,
          chain_type,
          chain_name,
          is_primary: isPrimary,
        })
        .select()
        .single();

      if (insertError) {
        console.error('Wallet insert error:', insertError);
        throw insertError;
      }

      // Log activity
      await supabase.from('user_activity').insert({
        user_id: userId,
        activity_type: 'wallet_connect',
        details: { wallet_address, chain_type, chain_name },
        status: 'completed',
        completed_at: new Date().toISOString(),
      });

      console.log('✓ Wallet connected successfully');

      return new Response(
        JSON.stringify({ wallet: newWallet }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 201,
        }
      );
    }

    // DELETE - Disconnect wallet
    if (req.method === 'DELETE') {
      const walletId = pathParts[pathParts.length - 1];

      if (!walletId) {
        throw new Error('Wallet ID is required');
      }

      console.log('Disconnecting wallet:', walletId);

      // Get wallet info before deleting
      const { data: wallet, error: fetchError } = await supabase
        .from('wallet_connections')
        .select('*')
        .eq('id', walletId)
        .eq('user_id', userId)
        .single();

      if (fetchError || !wallet) {
        throw new Error('Wallet not found or unauthorized');
      }

      // Delete wallet
      const { error: deleteError } = await supabase
        .from('wallet_connections')
        .delete()
        .eq('id', walletId)
        .eq('user_id', userId);

      if (deleteError) {
        console.error('Wallet delete error:', deleteError);
        throw deleteError;
      }

      // If deleted wallet was primary, set another wallet as primary
      if (wallet.is_primary) {
        const { data: otherWallets } = await supabase
          .from('wallet_connections')
          .select('id')
          .eq('user_id', userId)
          .limit(1);

        if (otherWallets && otherWallets.length > 0) {
          await supabase
            .from('wallet_connections')
            .update({ is_primary: true })
            .eq('id', otherWallets[0].id);
        }
      }

      console.log('✓ Wallet disconnected successfully');

      return new Response(
        JSON.stringify({ success: true }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    // PUT - Set primary wallet
    if (req.method === 'PUT' && pathParts.includes('primary')) {
      const walletId = pathParts[pathParts.length - 2];

      if (!walletId) {
        throw new Error('Wallet ID is required');
      }

      console.log('Setting primary wallet:', walletId);

      // Verify wallet belongs to user
      const { data: wallet, error: fetchError } = await supabase
        .from('wallet_connections')
        .select('*')
        .eq('id', walletId)
        .eq('user_id', userId)
        .single();

      if (fetchError || !wallet) {
        throw new Error('Wallet not found or unauthorized');
      }

      // Unset all other wallets as primary
      await supabase
        .from('wallet_connections')
        .update({ is_primary: false })
        .eq('user_id', userId);

      // Set this wallet as primary
      const { data: updatedWallet, error: updateError } = await supabase
        .from('wallet_connections')
        .update({ is_primary: true })
        .eq('id', walletId)
        .eq('user_id', userId)
        .select()
        .single();

      if (updateError) {
        console.error('Wallet update error:', updateError);
        throw updateError;
      }

      console.log('✓ Primary wallet updated successfully');

      return new Response(
        JSON.stringify({ wallet: updatedWallet }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 405,
      }
    );

  } catch (error) {
    console.error('Error in user-wallets function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
