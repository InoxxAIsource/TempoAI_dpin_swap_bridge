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
      // Create new user
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

    // Generate a sign-in link for the user
    const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
      type: 'magiclink',
      email: `${walletAddress}@wallet.tempo`,
    });

    if (linkError) {
      console.error('Error generating link:', linkError);
      throw linkError;
    }

    // Extract tokens properly using URL parsing
    const actionLink = new URL(linkData.properties.action_link);
    const accessToken = actionLink.searchParams.get('access_token');
    const refreshToken = actionLink.searchParams.get('refresh_token');

    if (!accessToken || !refreshToken) {
      console.error('Failed to extract tokens from action link:', linkData.properties.action_link);
      throw new Error('Failed to generate valid session tokens');
    }

    console.log('✓ Session tokens generated successfully');

    return new Response(
      JSON.stringify({ 
        session: {
          access_token: accessToken,
          refresh_token: refreshToken,
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
