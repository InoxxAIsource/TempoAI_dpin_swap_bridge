import PageLayout from '../components/layout/PageLayout';
import PageHero from '../components/layout/PageHero';
import BridgeCard from '../components/bridge/BridgeCard';
import WormholeConnectWidget from '../components/bridge/WormholeConnectWidget';
import PendingClaimsBanner from '@/components/claim/PendingClaimsBanner';
import ChainBadge from '../components/ui/ChainBadge';
import { ArrowRight, ExternalLink, Zap, Settings } from 'lucide-react';
import StatusBadge from '../components/ui/StatusBadge';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useWalletContext } from '@/contexts/WalletContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { YieldDepositModal } from '@/components/chat/YieldDepositModal';

const Bridge = () => {
  const { evmAddress, solanaAddress, isAnyWalletConnected } = useWalletContext();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [recentTransfers, setRecentTransfers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('simple');
  const [pendingClaimsCount, setPendingClaimsCount] = useState(0);
  const [showDepositModal, setShowDepositModal] = useState(false);
  
  // Check if this is part of a yield strategy flow
  const nextAction = searchParams.get('nextAction');
  const protocol = searchParams.get('protocol');
  const apy = searchParams.get('apy');
  const token = searchParams.get('token');
  const chain = searchParams.get('targetChain');
  const amount = searchParams.get('amount');

  useEffect(() => {
    fetchTransactions();
    fetchPendingClaims();
  }, [isAnyWalletConnected, evmAddress, solanaAddress]);

  // Validate wallet connection state
  useEffect(() => {
    const validateWalletState = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      // If session exists but wallet is disconnected, show warning
      if (session?.user?.user_metadata?.wallet_address && !isAnyWalletConnected) {
        console.warn('[Bridge] Wallet session exists but wallet not connected');
      }
    };
    
    validateWalletState();
  }, [isAnyWalletConnected]);
  
  // Listen for bridge completion event
  useEffect(() => {
    const handleBridgeComplete = () => {
      if (nextAction === 'deposit' && protocol) {
        setShowDepositModal(true);
      }
    };
    
    window.addEventListener('wormhole-transfer-complete', handleBridgeComplete);
    
    return () => {
      window.removeEventListener('wormhole-transfer-complete', handleBridgeComplete);
    };
  }, [nextAction, protocol]);

  const fetchTransactions = async () => {
      if (!isAnyWalletConnected) {
        setRecentTransfers([]);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('wormhole_transactions')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);

        if (error) throw error;

        if (data && data.length > 0) {
          const formattedTransfers = data.map((tx: any) => ({
            from: tx.from_chain,
            to: tx.to_chain,
            amount: `${tx.amount} ${tx.from_token}`,
            status: tx.status,
            time: formatTimeAgo(new Date(tx.created_at)),
            txHash: tx.tx_hash,
          }));
          setRecentTransfers(formattedTransfers);
        } else {
          setRecentTransfers([]);
        }
      } catch (error) {
        console.error('Error fetching transactions:', error);
        setRecentTransfers([]);
      } finally {
        setLoading(false);
      }
  };

  const fetchPendingClaims = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { count } = await supabase
        .from('wormhole_transactions')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .or('status.eq.pending,needs_redemption.eq.true');

      setPendingClaimsCount(count || 0);
    } catch (error) {
      console.error('Error fetching pending claims:', error);
    }
  };
  
  // FIX 3: Listen for switch to advanced bridge event
  useEffect(() => {
    const handleSwitchToAdvanced = () => {
      setActiveTab('advanced');
    };
    
    window.addEventListener('switch-to-advanced-bridge', handleSwitchToAdvanced);
    return () => window.removeEventListener('switch-to-advanced-bridge', handleSwitchToAdvanced);
  }, []);

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <PageLayout>
      <PageHero 
        title="Bridge"
        description="Seamlessly transfer assets across multiple blockchains with Wormhole"
      />
      
      <div className="px-4 md:px-6 lg:px-12 pt-3 md:pt-4">
        <PendingClaimsBanner count={pendingClaimsCount} />
      </div>

      <section className="px-4 md:px-6 lg:px-12 py-6 md:py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            {/* Bridge Interface with Tabs */}
            <div className="lg:col-span-2">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="simple" className="flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    Simple Bridge
                  </TabsTrigger>
                  <TabsTrigger value="advanced" className="flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    Advanced Bridge
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="simple" className="mt-0">
                  <BridgeCard />
                </TabsContent>
                
                <TabsContent value="advanced" className="mt-0">
                  <WormholeConnectWidget />
                </TabsContent>
              </Tabs>
            </div>

            {/* Recent Transfers */}
            <div className="border border-border rounded-2xl p-6 bg-card h-fit">
              <h3 className="text-xl font-bold mb-6">Recent Transfers</h3>
              <div className="space-y-4">
                {loading ? (
                  <div className="text-center py-8 text-muted-foreground">Loading...</div>
                ) : !isAnyWalletConnected ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>Connect wallet to view history</p>
                  </div>
                ) : recentTransfers.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No transfers yet</p>
                    <p className="text-xs mt-2">Your bridge history will appear here</p>
                  </div>
                ) : (
                  recentTransfers.map((transfer, index) => (
                    <div key={index} className="border border-border rounded-xl p-4 space-y-3 hover:border-primary/50 transition-all duration-300">
                      <div className="flex items-center justify-between gap-2 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{transfer.from}</span>
                          <ArrowRight className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">{transfer.to}</span>
                        </div>
                        {transfer.status === 'pending' && (
                          <Badge variant="outline" className="text-xs">Needs Claim</Badge>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold">{transfer.amount}</span>
                        <StatusBadge status={transfer.status} />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-muted-foreground">{transfer.time}</div>
                        <div className="flex gap-2">
                          {transfer.status === 'pending' && (
                            <Button size="sm" variant="outline" onClick={() => navigate('/claim')} className="text-xs h-6">
                              Claim
                            </Button>
                          )}
                          {transfer.txHash && (
                            <a 
                              href={`https://wormholescan.io/#/tx/${transfer.txHash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-primary hover:underline flex items-center gap-1"
                            >
                              View <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Supported Chains */}
      <section className="px-4 md:px-6 lg:px-12 py-6 md:py-8 pb-16 md:pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="border border-border rounded-2xl p-4 md:p-6 lg:p-8 bg-card">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">Supported Chains</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
              {['Ethereum', 'Polygon', 'Arbitrum', 'Avalanche', 'Solana', 'Optimism', 'BNB Chain', 'Base', 'Fantom', 'Celo', 'Moonbeam', 'Aurora'].map((chain) => (
                <ChainBadge key={chain} chain={chain} />
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* Show deposit modal after bridge completes */}
      {showDepositModal && protocol && token && chain && (
        <YieldDepositModal
          protocol={protocol}
          token={token}
          chain={chain}
          amount={parseFloat(amount || '0')}
          apy={parseFloat(apy || '0')}
          isOpen={showDepositModal}
          onClose={() => setShowDepositModal(false)}
        />
      )}
    </PageLayout>
  );
};

export default Bridge;
