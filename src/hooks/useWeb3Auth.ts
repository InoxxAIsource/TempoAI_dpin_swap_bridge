import { useState, useEffect, useRef } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useWeb3Auth = () => {
  const { publicKey, signMessage, connected } = useWallet();
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const { toast } = useToast();
  const isMountedRef = useRef(true);
  const timeoutRef = useRef<NodeJS.Timeout>();

  // Track component mounted state
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      // Clear any pending timeouts on unmount
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

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

    // Store pending auth state for mobile deep link recovery
    const pendingAuthData = {
      walletAddress: publicKey.toString(),
      timestamp: Date.now(),
      attempt: retryCount + 1
    };
    localStorage.setItem('pending_solana_auth', JSON.stringify(pendingAuthData));

    // Set up timeout detection (30 seconds)
    timeoutRef.current = setTimeout(() => {
      if (!isMountedRef.current) return; // Don't update if unmounted
      
      console.warn('[useWeb3Auth] Authentication timeout - signature request may be stuck');
      setIsAuthenticating(false);
      const timeoutError = 'Authentication timed out. Please try again and approve the signature request in your wallet.';
      setAuthError(timeoutError);
      toast({
        title: 'Timeout',
        description: timeoutError,
        variant: 'destructive',
      });
      localStorage.removeItem('pending_solana_auth');
    }, 30000);

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
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      } catch (signError: any) {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        
        if (!isMountedRef.current) return; // Don't update state if unmounted
        
        console.error('[useWeb3Auth] Signature rejected:', signError);
        const errorMsg = signError.message?.includes('rejected') || signError.message?.includes('denied')
          ? 'Signature request was rejected. Please try again and approve the request.'
          : 'Failed to sign message. Please ensure your wallet is unlocked.';
        setAuthError(errorMsg);
        localStorage.removeItem('pending_solana_auth');
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
      
      // Link the Solana wallet to the user account
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase.from('wallet_connections').insert({
            user_id: user.id,
            wallet_address: walletAddress.toLowerCase(),
            chain_type: 'SOLANA',
            chain_name: 'Solana',
            is_primary: true,
          });
          console.log('[useWeb3Auth] ✓ Solana wallet linked to user account');
        }
      } catch (linkError: any) {
        console.error('[useWeb3Auth] Failed to link Solana wallet:', linkError);
        // Don't throw - authentication succeeded, linking is secondary
      }
      
      if (!isMountedRef.current) return; // Don't update state if unmounted
      
      console.log('[useWeb3Auth] ✓ Authentication successful!');
      
      // Clear pending auth and reset retry count on success
      localStorage.removeItem('pending_solana_auth');
      setRetryCount(0);
      
      toast({
        title: 'Authenticated!',
        description: 'Successfully signed in with your Solana wallet',
      });
      
    } catch (error: any) {
      if (!isMountedRef.current) return; // Don't update state if unmounted
      
      console.error('[useWeb3Auth] Authentication error:', error);
      
      // Clear pending auth and increment retry count on error
      localStorage.removeItem('pending_solana_auth');
      setRetryCount(prev => prev + 1);
      
      const errorMessage = error.message || 'Failed to authenticate with wallet';
      setAuthError(errorMessage);
      
      toast({
        title: 'Authentication Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      if (isMountedRef.current) {
        setIsAuthenticating(false);
      }
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
