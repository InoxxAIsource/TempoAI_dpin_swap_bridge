import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useWeb3Auth = () => {
  const { publicKey, signMessage, connected } = useWallet();
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const { toast } = useToast();

  const authenticateWithSolana = async () => {
    if (!publicKey || !signMessage || !connected) {
      const error = 'Wallet not connected. Please connect your Phantom wallet first.';
      setAuthError(error);
      toast({
        title: 'Connection Required',
        description: error,
        variant: 'destructive',
      });
      return;
    }

    setIsAuthenticating(true);
    setAuthError(null);

    try {
      const walletAddress = publicKey.toString();
      
      // Check if already authenticated
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.user_metadata?.wallet_address === walletAddress) {
        console.log('[useWeb3Auth] Already authenticated with this wallet');
        setIsAuthenticating(false);
        toast({
          title: 'Already Authenticated',
          description: 'Your wallet is already connected',
        });
        return;
      }

      // Generate message to sign
      const timestamp = Date.now();
      const message = `Sign this message to authenticate with Tempo DePIN Network\n\nWallet: ${walletAddress}\nTimestamp: ${timestamp}`;
      const encodedMessage = new TextEncoder().encode(message);
      
      console.log('[useWeb3Auth] Requesting signature from wallet...');
      
      // Request signature from wallet
      let signature: Uint8Array;
      try {
        signature = await signMessage(encodedMessage);
        console.log('[useWeb3Auth] ✓ Signature obtained');
      } catch (signError: any) {
        console.error('[useWeb3Auth] Signature rejected:', signError);
        const errorMsg = signError.message?.includes('rejected') || signError.message?.includes('denied')
          ? 'Signature request was rejected. Please try again and approve the request.'
          : 'Failed to sign message. Please ensure your wallet is unlocked.';
        setAuthError(errorMsg);
        throw new Error(errorMsg);
      }
      
      const signatureBase58 = btoa(String.fromCharCode(...signature));
      console.log('[useWeb3Auth] Calling verify-wallet-signature edge function...');

      // Call edge function to verify and create session
      const { data, error: invokeError } = await supabase.functions.invoke('verify-wallet-signature', {
        body: {
          walletAddress,
          signature: signatureBase58,
          message,
        },
      });

      if (invokeError) {
        console.error('[useWeb3Auth] Edge function invocation error:', invokeError);
        const errorMsg = 'Failed to verify signature. Please try again.';
        setAuthError(errorMsg);
        throw new Error(errorMsg);
      }

      if (!data?.session) {
        console.error('[useWeb3Auth] Invalid response from edge function:', data);
        const errorMsg = 'Invalid response from server. Please try again.';
        setAuthError(errorMsg);
        throw new Error(errorMsg);
      }

      if (!data.session.access_token || !data.session.refresh_token) {
        console.error('[useWeb3Auth] Missing tokens in session:', data.session);
        const errorMsg = 'Authentication incomplete. Please try again.';
        setAuthError(errorMsg);
        throw new Error(errorMsg);
      }

      console.log('[useWeb3Auth] Setting session with tokens...');

      // Set the session in Supabase
      const { error: sessionError } = await supabase.auth.setSession({
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
      });

      if (sessionError) {
        console.error('[useWeb3Auth] Failed to set session:', sessionError);
        const errorMsg = 'Failed to establish session. Please try again.';
        setAuthError(errorMsg);
        throw new Error(`Failed to set session: ${sessionError.message}`);
      }
      
      // Verify session was actually set and persisted
      const { data: { session: verifiedSession } } = await supabase.auth.getSession();
      if (!verifiedSession) {
        throw new Error('Session was set but could not be verified');
      }
      
      console.log('[useWeb3Auth] ✓ Session verified and persisted');
      console.log('[useWeb3Auth] ✓ Authentication successful!');
      
      toast({
        title: 'Authenticated!',
        description: 'Successfully signed in with your Solana wallet',
      });
      
    } catch (error: any) {
      console.error('[useWeb3Auth] Authentication error:', error);
      const errorMessage = error.message || 'Failed to authenticate with wallet';
      setAuthError(errorMessage);
      
      toast({
        title: 'Authentication Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleWalletDisconnection = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return {
    authenticateWithSolana,
    handleWalletDisconnection,
    isAuthenticating,
    authError,
  };
};
