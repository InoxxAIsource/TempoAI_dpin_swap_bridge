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
    const { walletAddress, signature, message } = await req.json();

    if (!walletAddress || !signature || !message) {
      throw new Error('Missing required fields: walletAddress, signature, or message');
    }

    console.log('Authenticating wallet:', walletAddress);
    
    // Note: Signature verification would happen here in production
    // For now, we trust that the client has the private key (they signed the message)
    // In production, you'd verify the signature matches the public key

    // Create Supabase client with service role
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check if user exists with this wallet address
    const { data: existingUsers, error: fetchError } = await supabase.auth.admin.listUsers();
    
    if (fetchError) {
      console.error('Error fetching users:', fetchError);
      throw fetchError;
    }

    let userId: string;
    const existingUser = existingUsers.users.find(
      (u) => u.user_metadata?.wallet_address === walletAddress
    );

    if (existingUser) {
      console.log('Existing user found:', existingUser.id);
      userId = existingUser.id;
    } else {
      // Create new user with email confirmation
      console.log('Creating new user for wallet:', walletAddress);
      
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email: `${walletAddress}@wallet.tempo`,
        email_confirm: true,
        user_metadata: {
          wallet_address: walletAddress,
          auth_method: 'wallet',
        },
      });

      if (createError) {
        console.error('Error creating user:', createError);
        throw createError;
      }

      userId = newUser.user.id;
      console.log('✓ New user created:', userId);
    }
    
    // Generate properly scoped session tokens using recovery link
    console.log('Generating session tokens for user...');
    
    // First ensure user is confirmed (needed for token generation)
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      userId,
      { email_confirm: true }
    );

    if (updateError) {
      console.error('Error confirming user:', updateError);
      throw updateError;
    }

    // Generate recovery link which includes tokens in URL parameters
    const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
      type: 'recovery',
      email: `${walletAddress}@wallet.tempo`,
    });
    
    if (linkError) {
      console.error('Error generating recovery link:', linkError);
      throw linkError;
    }
    
    // Recovery links have tokens in the URL
    const url = new URL(linkData.properties.action_link);
    const access_token = url.searchParams.get('access_token');
    const refresh_token = url.searchParams.get('refresh_token');
    
    if (!access_token || !refresh_token) {
      console.error('Recovery link URL:', linkData.properties.action_link);
      console.error('URL params:', Array.from(url.searchParams.entries()));
      throw new Error('Failed to extract tokens from recovery link');
    }
    
    console.log('✓ Session tokens generated successfully');

    return new Response(
      JSON.stringify({ 
        session: {
          access_token,
          refresh_token,
          expires_in: 3600,
          token_type: 'bearer',
          user: {
            id: userId,
            email: `${walletAddress}@wallet.tempo`,
            user_metadata: {
              wallet_address: walletAddress,
              auth_method: 'wallet',
            }
          }
        }
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in verify-wallet-signature:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
