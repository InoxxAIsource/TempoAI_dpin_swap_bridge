import { useEffect, useState } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import PageHero from '@/components/layout/PageHero';
import ClaimFlowDiagram from '@/components/claim/ClaimFlowDiagram';
import ClaimGuideSection from '@/components/claim/ClaimGuideSection';
import ClaimableTransferCard from '@/components/claim/ClaimableTransferCard';
import EmptyClaimState from '@/components/claim/EmptyClaimState';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { useWalletContext } from '@/contexts/WalletContext';
import WalletModal from '@/components/WalletModal';
import ManualTransactionImport from '@/components/claim/ManualTransactionImport';
import { Wallet, Sprout, Plus, Clock, AlertTriangle } from 'lucide-react';
import { useWormholeVAAPoller } from '@/hooks/useWormholeVAAPoller';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { monitorWalletTransactions } from '@/utils/web3TransactionMonitor';
import { checkWormholeTxStatus } from '@/utils/wormholeScanAPI';

interface ClaimableTransfer {
  id: string;
  from_chain: string;
  to_chain: string;
  from_token: string;
  to_token: string;
  amount: number;
  status: string;
  tx_hash: string | null;
  needs_redemption: boolean;
  created_at: string;
  wormhole_vaa: string | null;
  wallet_address: string;
  source_type?: string;
  source_reference_ids?: string[];
}

const Claim = () => {
  const [transfers, setTransfers] = useState<ClaimableTransfer[]>([]);
  const [loading, setLoading] = useState(true);
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const { toast } = useToast();
  const { evmAddress, solanaAddress, isAnyWalletConnected, isEvmConnected } = useWalletContext();
  const currentWallet = evmAddress || solanaAddress;

  // Automatically poll for VAA on pending transactions
  useWormholeVAAPoller(currentWallet);

  useEffect(() => {
    fetchClaimableTransfers();
    const cleanup = setupRealtimeSubscription();
    return cleanup;
  }, [currentWallet]);

  // Auto-discover missing transactions from blockchain
  useEffect(() => {
    const discoverTransactions = async () => {
      if (!currentWallet || !isEvmConnected) return;
      
      console.log('🔍 Auto-discovering transactions from blockchain...');
      
      const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
      const networkMode = 'Testnet'; // TODO: Make this dynamic based on user preference
      
      const txs = await monitorWalletTransactions(
        currentWallet,
        networkMode,
        sevenDaysAgo
      );
      
      if (txs.length > 0) {
        console.log(`📥 Found ${txs.length} blockchain transactions, checking if new...`);
        
        for (const tx of txs) {
          // Check if already in database
          const { data: existing } = await supabase
            .from('wormhole_transactions')
            .select('id')
            .eq('tx_hash', tx.hash)
            .maybeSingle();
          
          if (!existing) {
            console.log(`💾 Importing new transaction: ${tx.hash}`);
            
            // Use blockchain verification for accurate data
            const { verifyWormholeTransaction } = await import('@/utils/etherscanVerification');
            const { validateTransactionData } = await import('@/utils/transactionValidator');
            const verification = await verifyWormholeTransaction(tx.hash, networkMode as any);
            
            // Check WormholeScan for VAA
            const wormholeStatus = await checkWormholeTxStatus(tx.hash, networkMode);
            
            const { data: { user } } = await supabase.auth.getUser();
            
            const insertData = {
              wallet_address: currentWallet.toLowerCase(),
              tx_hash: tx.hash,
              from_chain: networkMode === 'Testnet' ? 'Sepolia' : 'Ethereum',
              to_chain: 'Solana',
              from_token: verification.token || 'USDC',
              to_token: verification.token || 'USDC',
              amount: verification.amount ? Number(verification.amount) : 0,
              status: (wormholeStatus.status === 'completed' ? 'completed' : 'pending') as 'completed' | 'pending' | 'failed',
              wormhole_vaa: wormholeStatus.vaa || null,
              needs_redemption: wormholeStatus.needsRedemption || false,
              user_id: user?.id || null,
            };
            
            // Validate before insert
            const validation = validateTransactionData(insertData);
            if (!validation.isValid) {
              console.warn('⚠️ Skipping invalid transaction:', validation.errors);
              continue;
            }
            
            await supabase
              .from('wormhole_transactions')
              .insert([insertData]);
            
            toast({
              title: "✨ Transaction Discovered",
              description: `Auto-imported ${insertData.amount} ${insertData.from_token}: ${tx.hash.slice(0, 10)}...`,
            });
          }
        }
        
        // Refresh the list
        fetchClaimableTransfers();
      }
    };
    
    discoverTransactions();
  }, [currentWallet, isEvmConnected]);

  const fetchClaimableTransfers = async () => {
    try {
      setLoading(true);
      
      if (!currentWallet) {
        setTransfers([]);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('wormhole_transactions')
        .select('*')
        .eq('wallet_address', currentWallet.toLowerCase())
        .or('status.eq.pending,needs_redemption.eq.true')
        .lt('amount', 1000000) // Filter out corrupted records
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTransfers(data || []);
    } catch (error) {
      console.error('Error fetching claimable transfers:', error);
      toast({
        title: "Error",
        description: "Failed to fetch claimable transfers",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSubscription = () => {
    if (!currentWallet) return () => {};
    
    const channel = supabase
      .channel('claim-updates')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'wormhole_transactions'
      }, (payload) => {
        fetchClaimableTransfers();
        
        if (payload.new && (payload.new as any).needs_redemption) {
          toast({
            title: "Transfer Ready!",
            description: "Your transfer is ready to claim"
          });
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  return (
    <PageLayout showFooter={true}>
      <PageHero 
        title="Claim Your Transfers"
        description="Complete your cross-chain transfers and receive your tokens on the destination chain"
      />
      
      <section className="px-4 md:px-6 lg:px-12 py-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-500" />
              Understanding Wormhole Bridge Timing
            </h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="font-semibold text-blue-500 mb-1">1. Blockchain Finality</p>
                <p className="text-muted-foreground">15-20 minutes after transaction submission for Ethereum testnet to reach finality</p>
              </div>
              <div>
                <p className="font-semibold text-blue-500 mb-1">2. Guardian Verification</p>
                <p className="text-muted-foreground">5-15 minutes for Wormhole Guardians to sign and generate your VAA</p>
              </div>
              <div>
                <p className="font-semibold text-blue-500 mb-1">3. Manual Redemption</p>
                <p className="text-muted-foreground">Once VAA is ready, you can claim your tokens on the destination chain</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              💡 Total expected time: <strong>20-35 minutes</strong> from transaction submission to ready-to-claim status.
              Testnet may experience longer delays due to lower validator activity.
            </p>
          </div>
        </div>
      </section>
      
      <ClaimFlowDiagram />
      
      <ClaimGuideSection />
      
      {isAnyWalletConnected && (
        <section className="px-4 md:px-6 lg:px-12 py-6">
          <div className="max-w-6xl mx-auto">
            <Button
              variant="outline"
              onClick={() => setShowImportDialog(!showImportDialog)}
              className="mb-4"
            >
              <Plus className="w-4 h-4 mr-2" />
              {showImportDialog ? 'Hide Import' : 'Import Missing Transaction'}
            </Button>
            
            {showImportDialog && (
              <ManualTransactionImport onImportSuccess={fetchClaimableTransfers} />
            )}
          </div>
        </section>
      )}
      
      <section className="px-4 md:px-6 lg:px-12 py-12 md:py-16 bg-secondary/30">
        <div className="max-w-6xl mx-auto">
          {transfers.some(t => t.amount === 0 || !t.amount) && (
            <Alert className="mb-6 border-yellow-500/50 bg-yellow-500/10">
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
              <AlertTitle className="text-yellow-500">Invalid Transactions Detected</AlertTitle>
              <AlertDescription className="text-sm">
                <p className="mb-2">Some transactions have 0 amount. This usually means:</p>
                <ul className="list-disc ml-6 space-y-1">
                  <li>You approved token spending but didn't complete the actual transfer</li>
                  <li>The transaction failed on the blockchain</li>
                  <li>There was an error detecting the transfer amount</li>
                </ul>
                <p className="mt-3">
                  Please verify these transactions on{' '}
                  <a 
                    href="https://sepolia.etherscan.io" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline text-yellow-500 hover:text-yellow-400"
                  >
                    Etherscan Sepolia
                  </a>{' '}
                  to check their actual status.
                </p>
              </AlertDescription>
            </Alert>
          )}
          
          <div className="flex items-center gap-2 md:gap-3 mb-6 md:mb-8">
            <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-primary" />
            <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold">Your Claimable Transfers</h2>
          </div>
          
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-48 w-full" />
            </div>
          ) : !isAnyWalletConnected ? (
            <div className="text-center py-16 border border-border rounded-2xl bg-card">
              <Wallet className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-2xl font-semibold mb-2">Connect Your Wallet</h3>
              <p className="text-muted-foreground mb-6">
                Connect your wallet to view pending claims
              </p>
              <button
                onClick={() => setWalletModalOpen(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
              >
                <Wallet className="w-4 h-4" />
                Connect Wallet
              </button>
            </div>
          ) : transfers.length === 0 ? (
            <EmptyClaimState />
          ) : (
            <div className="grid gap-6">
              {transfers.map(transfer => (
                <div key={transfer.id} className="relative">
                  {transfer.source_type === 'depin_rewards' && (
                    <Badge className="absolute -top-3 -right-3 z-10 gap-1 bg-green-500/10 text-green-500 border-green-500/20">
                      <Sprout className="w-3 h-3" />
                      DePIN Batch Claim
                    </Badge>
                  )}
                  <ClaimableTransferCard 
                    transfer={transfer}
                    currentWallet={currentWallet}
                    onRefresh={fetchClaimableTransfers}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      
      <section className="px-4 md:px-6 lg:px-12 py-12 md:py-16">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 md:gap-3 mb-6 md:mb-8">
            <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-primary" />
            <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold">Frequently Asked Questions</h2>
          </div>
          
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="what-is-claiming">
              <AccordionTrigger>What is claiming/redemption?</AccordionTrigger>
              <AccordionContent>
                Claiming (or redemption) is the final step in a cross-chain transfer using Wormhole. 
                After your tokens are bridged from the source chain, you need to manually claim them 
                on the destination chain. This two-step process ensures security and allows you to 
                control when to pay gas fees on the destination chain.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="gas-needed">
              <AccordionTrigger>Do I need gas to claim?</AccordionTrigger>
              <AccordionContent>
                Yes, you'll need native tokens (gas) on the destination chain to complete the claim. 
                For example, if you're claiming tokens on Solana, you'll need SOL to pay for the 
                transaction fee. Make sure to have sufficient gas before attempting to claim.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="how-long">
              <AccordionTrigger>How long does claiming take?</AccordionTrigger>
              <AccordionContent>
                Once your transfer is ready to claim (usually within 15-30 minutes after initiation), 
                the actual claiming process takes just a few seconds. The claim transaction needs to 
                be confirmed on the destination chain, which varies by network but is typically under 
                a minute.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="failed-claim">
              <AccordionTrigger>What if my claim fails?</AccordionTrigger>
              <AccordionContent>
                If your claim transaction fails, your tokens are still safe. Common reasons include 
                insufficient gas or network congestion. Simply try again with more gas. The VAA 
                (Verifiable Action Approval) remains valid, so you can always retry the claim later.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="manual-claim">
              <AccordionTrigger>Can I claim manually on WormholeScan?</AccordionTrigger>
              <AccordionContent>
                Yes! Each claimable transfer card has a "Claim on WormholeScan" button that takes 
                you directly to the official WormholeScan interface with your transaction pre-loaded. 
                This is useful if you prefer to use the official Wormhole interface or need more 
                advanced options.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>
      
      <WalletModal open={walletModalOpen} onOpenChange={setWalletModalOpen} />
    </PageLayout>
  );
};

export default Claim;
