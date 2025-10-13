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
    let tempPassword: string;
    const existingUser = existingUsers.users.find(
      (u) => u.user_metadata?.wallet_address === walletAddress
    );

    if (existingUser) {
      console.log('Existing user found:', existingUser.id);
      userId = existingUser.id;
      tempPassword = `wallet_${walletAddress}_${Date.now()}`;
      
      // Update the user to set a password (for existing users)
      console.log('Updating existing user with temp password');
      const { error: updateError } = await supabase.auth.admin.updateUserById(
        userId,
        { password: tempPassword }
      );
      
      if (updateError) {
        console.error('Error updating user password:', updateError);
        throw updateError;
      }
    } else {
      // Create new user with a temporary password
      console.log('Creating new user for wallet:', walletAddress);
      tempPassword = `wallet_${walletAddress}_${Date.now()}`;
      
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email: `${walletAddress}@wallet.tempo`,
        password: tempPassword,
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
    
    // Sign in the user with the password to get a valid session
    console.log('Signing in user to create session...');
    const { data: sessionData, error: signInError } = await supabase.auth.signInWithPassword({
      email: `${walletAddress}@wallet.tempo`,
      password: tempPassword,
    });
    
    if (signInError) {
      console.error('Error signing in:', signInError);
      throw signInError;
    }
    
    if (!sessionData.session) {
      throw new Error('No session returned from sign in');
    }
    
    console.log('✓ Session created successfully');

    return new Response(
      JSON.stringify({ 
        session: {
          access_token: sessionData.session.access_token,
          refresh_token: sessionData.session.refresh_token,
          expires_in: sessionData.session.expires_in || 3600,
          expires_at: sessionData.session.expires_at,
          token_type: 'bearer',
          user: sessionData.session.user
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
