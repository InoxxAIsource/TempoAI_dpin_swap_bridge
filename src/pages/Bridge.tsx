import PageLayout from '../components/layout/PageLayout';
import PageHero from '../components/layout/PageHero';
import BridgeCard from '../components/bridge/BridgeCard';
import { ArrowRight, ExternalLink } from 'lucide-react';
import StatusBadge from '../components/ui/StatusBadge';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useWalletContext } from '@/contexts/WalletContext';

const Bridge = () => {
  const { evmAddress, solanaAddress, isAnyWalletConnected } = useWalletContext();
  const [recentTransfers, setRecentTransfers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch real transaction history from database
  useEffect(() => {
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

    fetchTransactions();
  }, [isAnyWalletConnected, evmAddress, solanaAddress]);

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

      <section className="px-6 md:px-12 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Bridge Interface */}
            <div className="lg:col-span-2">
              <BridgeCard />
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
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-medium">{transfer.from}</span>
                        <ArrowRight className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">{transfer.to}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold">{transfer.amount}</span>
                        <StatusBadge status={transfer.status} />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-muted-foreground">{transfer.time}</div>
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
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Supported Chains */}
      <section className="px-6 md:px-12 py-8 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="border border-border rounded-2xl p-8 bg-card">
            <h2 className="text-3xl font-bold mb-6">Supported Chains</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {['Ethereum', 'Polygon', 'Arbitrum', 'Avalanche', 'Solana', 'Optimism', 'BNB Chain', 'Base', 'Fantom', 'Celo', 'Moonbeam', 'Aurora'].map((chain) => (
                <div key={chain} className="flex items-center gap-2 p-3 border border-border rounded-xl hover:border-primary/50 transition-all duration-300 cursor-pointer">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                  <span className="text-sm font-medium">{chain}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Bridge;
