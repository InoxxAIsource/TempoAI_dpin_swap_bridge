import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { checkWormholeTxStatus } from '@/utils/wormholeScanAPI';
import { useToast } from './use-toast';

/**
 * Hook to automatically poll WormholeScan for VAA availability on pending transactions
 * Polls every 30 seconds for transactions without a VAA until it's available
 */
export const useWormholeVAAPoller = (walletAddress: string | null) => {
  const { toast } = useToast();
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!walletAddress) return;

    const pollForVAAs = async () => {
      try {
        // Fetch pending transactions without VAA for this wallet
        const { data: pendingTxs, error } = await supabase
          .from('wormhole_transactions')
          .select('*')
          .eq('wallet_address', walletAddress.toLowerCase())
          .eq('status', 'pending')
          .is('wormhole_vaa', null);

        if (error) {
          console.error('Error fetching pending transactions:', error);
          return;
        }

        if (!pendingTxs || pendingTxs.length === 0) {
          return;
        }

        console.log(`🔍 Polling for VAA on ${pendingTxs.length} pending transaction(s)`);

        // Check each transaction
        for (const tx of pendingTxs) {
          if (!tx.tx_hash) continue;

          try {
            const status = await checkWormholeTxStatus(tx.tx_hash, 'Testnet');

            if (status.vaa && status.needsRedemption) {
              console.log(`✅ VAA found for tx ${tx.tx_hash}`);
              
              // Update database with VAA
              const { error: updateError } = await supabase
                .from('wormhole_transactions')
                .update({
                  wormhole_vaa: status.vaa,
                  needs_redemption: true,
                })
                .eq('id', tx.id);

              if (updateError) {
                console.error('Error updating transaction with VAA:', updateError);
              } else {
                toast({
                  title: "✅ Transfer Ready to Claim!",
                  description: `Your ${tx.from_token} transfer from ${tx.from_chain} to ${tx.to_chain} is ready to redeem.`
                });
              }
            }
          } catch (err) {
            console.error(`Error checking status for tx ${tx.tx_hash}:`, err);
          }
        }
      } catch (err) {
        console.error('Error in VAA polling:', err);
      }
    };

    // Initial poll
    pollForVAAs();

    // Set up interval polling every 30 seconds
    pollingRef.current = setInterval(pollForVAAs, 30000);

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, [walletAddress, toast]);
};
