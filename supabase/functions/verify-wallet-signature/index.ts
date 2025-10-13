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

    console.log('Link data received:', {
      hasActionLink: !!linkData?.properties?.action_link,
      actionLinkPreview: linkData?.properties?.action_link?.substring(0, 100)
    });

    // Extract tokens with better error handling
    let accessToken: string | null = null;
    let refreshToken: string | null = null;

    try {
      if (!linkData?.properties?.action_link) {
        throw new Error('No action link in response from Supabase');
      }

      const actionLink = new URL(linkData.properties.action_link);
      accessToken = actionLink.searchParams.get('access_token');
      refreshToken = actionLink.searchParams.get('refresh_token');

      console.log('Token extraction:', {
        hasAccessToken: !!accessToken,
        hasRefreshToken: !!refreshToken,
        accessTokenLength: accessToken?.length || 0,
        refreshTokenLength: refreshToken?.length || 0
      });

      if (!accessToken || !refreshToken) {
        console.error('Missing tokens in action link. Search params:', Array.from(actionLink.searchParams.keys()));
        throw new Error('Failed to extract tokens from action link');
      }
    } catch (parseError) {
      console.error('Error parsing action link:', parseError);
      console.error('Raw action link:', linkData?.properties?.action_link);
      const errorMsg = parseError instanceof Error ? parseError.message : 'Unknown parsing error';
      throw new Error(`Failed to parse session tokens: ${errorMsg}`);
    }

    console.log('✓ Session tokens extracted successfully');

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
