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
      setAuthError('Wallet not connected');
      return;
    }

    setIsAuthenticating(true);
    setAuthError(null);

    try {
      const walletAddress = publicKey.toString();
      
      // Check if user already has a session
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.user_metadata?.wallet_address === walletAddress) {
        console.log('Already authenticated with this wallet');
        setIsAuthenticating(false);
        return;
      }

      // Generate message to sign
      const message = `Sign this message to authenticate with Tempo DePIN Network\n\nWallet: ${walletAddress}\nTimestamp: ${Date.now()}`;
      const encodedMessage = new TextEncoder().encode(message);
      
      // Request signature from wallet
      const signature = await signMessage(encodedMessage);
      const signatureBase58 = btoa(String.fromCharCode(...signature));

      // Call edge function to verify and create session
      const { data, error } = await supabase.functions.invoke('verify-wallet-signature', {
        body: {
          walletAddress,
          signature: signatureBase58,
          message,
        },
      });

      if (error) throw error;

      if (data?.session) {
        // Set the session in Supabase
        await supabase.auth.setSession(data.session);
        
        toast({
          title: 'Authenticated!',
          description: 'Successfully signed in with your Solana wallet',
        });
      }
    } catch (error: any) {
      console.error('Web3 authentication error:', error);
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
