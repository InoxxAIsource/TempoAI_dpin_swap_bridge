import { useEffect, useState } from 'react';
import PageLayout from '@/components/layout/PageLayout';
import PageHero from '@/components/layout/PageHero';
import ClaimFlowDiagram from '@/components/claim/ClaimFlowDiagram';
import ClaimGuideSection from '@/components/claim/ClaimGuideSection';
import ClaimableTransferCard from '@/components/claim/ClaimableTransferCard';
import EmptyClaimState from '@/components/claim/EmptyClaimState';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { useWalletContext } from '@/contexts/WalletContext';
import WalletModal from '@/components/WalletModal';
import { Wallet, Sprout } from 'lucide-react';

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
  const { toast } = useToast();
  const { evmAddress, solanaAddress, isAnyWalletConnected } = useWalletContext();
  const currentWallet = evmAddress || solanaAddress;

  useEffect(() => {
    fetchClaimableTransfers();
    const cleanup = setupRealtimeSubscription();
    return cleanup;
  }, [currentWallet]);

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
        console.log('Transfer status updated:', payload);
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
      
      <ClaimFlowDiagram />
      
      <ClaimGuideSection />
      
      <section className="px-4 md:px-6 lg:px-12 py-12 md:py-16 bg-secondary/30">
        <div className="max-w-6xl mx-auto">
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
