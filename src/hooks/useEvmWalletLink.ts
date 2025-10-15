import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { supabase } from '@/integrations/supabase/client';

export const useEvmWalletLink = () => {
  const { address, isConnected } = useAccount();
  const [isLinked, setIsLinked] = useState(false);
  const [isLinking, setIsLinking] = useState(false);
  const [linkError, setLinkError] = useState<string | null>(null);

  // Check if the current EVM wallet is linked to the authenticated user
  useEffect(() => {
    const checkWalletLink = async () => {
      if (!address || !isConnected) {
        setIsLinked(false);
        return;
      }

      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setIsLinked(false);
          return;
        }

        const { data, error } = await supabase
          .from('wallet_connections')
          .select('id')
          .eq('user_id', user.id)
          .eq('wallet_address', address.toLowerCase())
          .eq('chain_type', 'EVM')
          .maybeSingle();

        if (error) {
          console.error('[useEvmWalletLink] Error checking wallet link:', error);
          setIsLinked(false);
          return;
        }

        setIsLinked(!!data);
        console.log('[useEvmWalletLink] Wallet link status:', !!data);
      } catch (error) {
        console.error('[useEvmWalletLink] Failed to check wallet link:', error);
        setIsLinked(false);
      }
    };

    checkWalletLink();
  }, [address, isConnected]);

  const linkEvmWallet = async (chainName: string = 'Ethereum') => {
    if (!address || !isConnected) {
      setLinkError('No EVM wallet connected');
      return false;
    }

    setIsLinking(true);
    setLinkError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('No authenticated user found');
      }

      console.log('[useEvmWalletLink] Linking EVM wallet:', address);

      const { error } = await supabase.from('wallet_connections').insert({
        user_id: user.id,
        wallet_address: address.toLowerCase(),
        chain_type: 'EVM',
        chain_name: chainName,
        is_primary: false,
      });

      if (error) throw error;

      setIsLinked(true);
      console.log('[useEvmWalletLink] ✓ EVM wallet linked successfully');
      return true;
    } catch (error: any) {
      console.error('[useEvmWalletLink] Failed to link EVM wallet:', error);
      setLinkError(error.message || 'Failed to link wallet');
      return false;
    } finally {
      setIsLinking(false);
    }
  };

  const unlinkEvmWallet = async () => {
    if (!address) return false;

    setIsLinking(true);
    setLinkError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user found');

      const { error } = await supabase
        .from('wallet_connections')
        .delete()
        .eq('user_id', user.id)
        .eq('wallet_address', address.toLowerCase())
        .eq('chain_type', 'EVM');

      if (error) throw error;

      setIsLinked(false);
      console.log('[useEvmWalletLink] ✓ EVM wallet unlinked');
      return true;
    } catch (error: any) {
      console.error('[useEvmWalletLink] Failed to unlink EVM wallet:', error);
      setLinkError(error.message || 'Failed to unlink wallet');
      return false;
    } finally {
      setIsLinking(false);
    }
  };

  return {
    isLinked,
    isLinking,
    linkError,
    linkEvmWallet,
    unlinkEvmWallet,
  };
};
