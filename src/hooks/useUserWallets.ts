import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface WalletConnection {
  id: string;
  user_id: string;
  wallet_address: string;
  chain_type: 'evm' | 'solana';
  chain_name: string;
  connected_at: string;
  is_primary: boolean;
}

export const useUserWallets = () => {
  const [wallets, setWallets] = useState<WalletConnection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchWallets = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Not authenticated');
      }

      const { data: result, error: fetchError } = await supabase.functions.invoke(
        'user-wallets',
        {
          method: 'GET',
        }
      );

      if (fetchError) throw fetchError;

      setWallets(result.wallets || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch wallets';
      setError(errorMessage);
      console.error('Wallets fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const connectWallet = async (
    wallet_address: string,
    chain_type: 'evm' | 'solana',
    chain_name: string
  ) => {
    try {
      setError(null);

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Not authenticated');
      }

      const { data: result, error: connectError } = await supabase.functions.invoke(
        'user-wallets',
        {
          method: 'POST',
          body: { wallet_address, chain_type, chain_name },
        }
      );

      if (connectError) throw connectError;

      setWallets((prev) => [...prev, result.wallet]);

      toast({
        title: 'Wallet connected',
        description: 'Your wallet has been connected successfully.',
      });

      return result.wallet;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to connect wallet';
      setError(errorMessage);
      toast({
        title: 'Connection failed',
        description: errorMessage,
        variant: 'destructive',
      });
      throw err;
    }
  };

  const disconnectWallet = async (walletId: string) => {
    try {
      setError(null);

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Not authenticated');
      }

      const { error: deleteError } = await supabase.functions.invoke(
        `user-wallets/${walletId}`,
        {
          method: 'DELETE',
        }
      );

      if (deleteError) throw deleteError;

      setWallets((prev) => prev.filter((w) => w.id !== walletId));

      toast({
        title: 'Wallet disconnected',
        description: 'Your wallet has been disconnected successfully.',
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to disconnect wallet';
      setError(errorMessage);
      toast({
        title: 'Disconnect failed',
        description: errorMessage,
        variant: 'destructive',
      });
      throw err;
    }
  };

  const setPrimaryWallet = async (walletId: string) => {
    try {
      setError(null);

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Not authenticated');
      }

      const { data: result, error: updateError } = await supabase.functions.invoke(
        `user-wallets/${walletId}/primary`,
        {
          method: 'PUT',
        }
      );

      if (updateError) throw updateError;

      setWallets((prev) =>
        prev.map((w) => ({
          ...w,
          is_primary: w.id === walletId,
        }))
      );

      toast({
        title: 'Primary wallet updated',
        description: 'Your primary wallet has been updated successfully.',
      });

      return result.wallet;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update primary wallet';
      setError(errorMessage);
      toast({
        title: 'Update failed',
        description: errorMessage,
        variant: 'destructive',
      });
      throw err;
    }
  };

  const refetch = () => {
    fetchWallets();
  };

  useEffect(() => {
    fetchWallets();
  }, []);

  return {
    wallets,
    isLoading,
    error,
    connectWallet,
    disconnectWallet,
    setPrimaryWallet,
    refetch,
  };
};
