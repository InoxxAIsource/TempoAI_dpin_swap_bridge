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
  const visibilityListenerRef = useRef<(() => void) | null>(null);

  // Track component mounted state and cleanup
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (visibilityListenerRef.current) {
        document.removeEventListener('visibilitychange', visibilityListenerRef.current);
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

    const walletAddress = publicKey.toString();
    
    // Store pending auth state in sessionStorage for mobile recovery
    const pendingAuthData = {
      walletAddress,
      timestamp: Date.now(),
      attempt: retryCount + 1,
      isWaitingForSignature: true
    };
    sessionStorage.setItem('pending_solana_auth', JSON.stringify(pendingAuthData));
    localStorage.setItem('pending_solana_auth', JSON.stringify(pendingAuthData));

    // Increase timeout to 60s for mobile (users may need to switch apps)
    const MOBILE_TIMEOUT = 60000;
    timeoutRef.current = setTimeout(() => {
      if (!isMountedRef.current) return;
      
      console.warn('[useWeb3Auth] Authentication timeout after 60s');
      const timeoutError = 'Signature request timed out. Please try again and approve the request in your wallet app.';
      
      if (isMountedRef.current) {
        setIsAuthenticating(false);
        setAuthError(timeoutError);
        toast({
          title: 'Timeout',
          description: timeoutError,
          variant: 'destructive',
        });
      }
      
      sessionStorage.removeItem('pending_solana_auth');
      localStorage.removeItem('pending_solana_auth');
    }, MOBILE_TIMEOUT);

    // Add visibility change listener for mobile app switching
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log('[useWeb3Auth] App became visible - user may have returned from wallet app');
        
        // Check if we're still waiting for signature
        const pending = sessionStorage.getItem('pending_solana_auth');
        if (pending) {
          const data = JSON.parse(pending);
          if (data.isWaitingForSignature && Date.now() - data.timestamp < MOBILE_TIMEOUT) {
            console.log('[useWeb3Auth] Still waiting for signature, keeping auth state active');
          }
        }
      } else {
        console.log('[useWeb3Auth] App became hidden - user may have switched to wallet app');
      }
    };

    visibilityListenerRef.current = handleVisibilityChange;
    document.addEventListener('visibilitychange', handleVisibilityChange);

    try {
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
        console.log('[useWeb3Auth] Requesting signature (may open wallet app on mobile)...');
        signature = await signMessage(encodedMessage);
        console.log('[useWeb3Auth] ✓ Signature obtained successfully');
        
        // Clear timeout and visibility listener
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        if (visibilityListenerRef.current) {
          document.removeEventListener('visibilitychange', visibilityListenerRef.current);
          visibilityListenerRef.current = null;
        }
      } catch (signError: any) {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        if (visibilityListenerRef.current) {
          document.removeEventListener('visibilitychange', visibilityListenerRef.current);
          visibilityListenerRef.current = null;
        }
        
        if (!isMountedRef.current) return;
        
        console.error('[useWeb3Auth] Signature rejected or failed:', signError);
        const errorMsg = signError.message?.includes('rejected') || signError.message?.includes('denied') || signError.message?.includes('User rejected')
          ? 'You rejected the signature request. Please try again and approve the request in your wallet.'
          : signError.message?.includes('Ledger')
          ? 'Ledger wallet connection failed. Please ensure your device is connected and unlocked.'
          : 'Failed to sign message. Please ensure your wallet is unlocked and try again.';
        
        setAuthError(errorMsg);
        sessionStorage.removeItem('pending_solana_auth');
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
      
      // Clear all pending auth states and reset retry count
      sessionStorage.removeItem('pending_solana_auth');
      localStorage.removeItem('pending_solana_auth');
      setRetryCount(0);
      
      // Remove visibility listener
      if (visibilityListenerRef.current) {
        document.removeEventListener('visibilitychange', visibilityListenerRef.current);
        visibilityListenerRef.current = null;
      }
      
      toast({
        title: 'Authenticated!',
        description: 'Successfully signed in with your Solana wallet',
      });
      
    } catch (error: any) {
      if (!isMountedRef.current) return;
      
      console.error('[useWeb3Auth] Authentication error:', error);
      
      // Clear all pending auth states
      sessionStorage.removeItem('pending_solana_auth');
      localStorage.removeItem('pending_solana_auth');
      setRetryCount(prev => prev + 1);
      
      // Remove visibility listener
      if (visibilityListenerRef.current) {
        document.removeEventListener('visibilitychange', visibilityListenerRef.current);
        visibilityListenerRef.current = null;
      }
      
      const errorMessage = error.message || 'Failed to authenticate. Please try again.';
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
