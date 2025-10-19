import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Clock, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useWallet } from '@/contexts/WalletContext';

interface Transaction {
  id: string;
  created_at: string;
  from_chain: string;
  to_chain: string;
  from_token: string;
  to_token: string;
  amount: number;
  tx_hash: string | null;
  wormhole_vaa: string | null;
  status: string;
  needs_redemption: boolean;
  redemption_tx_hash: string | null;
}

const WormholeTransactionHistory = () => {
  const { walletAddress } = useWallet();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (walletAddress) {
      fetchTransactions();
    }
  }, [walletAddress]);

  const fetchTransactions = async () => {
    if (!walletAddress) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('wormhole_transactions')
        .select('*')
        .eq('wallet_address', walletAddress)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setTransactions(data || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (tx: Transaction) => {
    if (tx.status === 'completed') {
      return (
        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
          <CheckCircle2 className="w-3 h-3 mr-1" />
          Complete
        </Badge>
      );
    }
    
    if (tx.needs_redemption && tx.wormhole_vaa) {
      return (
        <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
          <AlertCircle className="w-3 h-3 mr-1" />
          Ready to Claim
        </Badge>
      );
    }
    
    if (tx.status === 'pending') {
      return (
        <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
          <Clock className="w-3 h-3 mr-1" />
          Pending VAA
        </Badge>
      );
    }

    if (tx.status === 'failed') {
      return (
        <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
          <AlertCircle className="w-3 h-3 mr-1" />
          Failed
        </Badge>
      );
    }

    return (
      <Badge variant="outline">
        {tx.status}
      </Badge>
    );
  };

  const getExplorerUrl = (chain: string, txHash: string) => {
    const explorers: { [key: string]: string } = {
      'Ethereum': 'https://sepolia.etherscan.io/tx/',
      'Polygon': 'https://mumbai.polygonscan.com/tx/',
      'Base': 'https://sepolia.basescan.org/tx/',
      'Arbitrum': 'https://sepolia.arbiscan.io/tx/',
      'Optimism': 'https://sepolia-optimism.etherscan.io/tx/',
    };
    return explorers[chain] ? `${explorers[chain]}${txHash}` : null;
  };

  const getWormholeScanUrl = (txHash: string) => {
    return `https://wormholescan.io/#/tx/${txHash}?network=TESTNET`;
  };

  if (!walletAddress) {
    return (
      <Card className="p-8 text-center">
        <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-xl font-bold mb-2">Connect Wallet</h3>
        <p className="text-muted-foreground">
          Connect your wallet to view your Wormhole transaction history
        </p>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card className="p-8 text-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground">Loading transaction history...</p>
      </Card>
    );
  }

  if (transactions.length === 0) {
    return (
      <Card className="p-8 text-center">
        <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-xl font-bold mb-2">No Transactions Yet</h3>
        <p className="text-muted-foreground">
          Your Wormhole bridge transactions will appear here once you claim your first rewards
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-2xl font-bold mb-6">Your Transaction History</h3>
        
        <div className="space-y-4">
          {transactions.map((tx) => (
            <Card key={tx.id} className="p-6 hover:border-primary/40 transition-colors">
              <div className="grid md:grid-cols-12 gap-4 items-center">
                {/* Date & Status */}
                <div className="md:col-span-3">
                  <div className="text-sm text-muted-foreground mb-1">
                    {new Date(tx.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                  {getStatusBadge(tx)}
                </div>

                {/* Route */}
                <div className="md:col-span-4">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-semibold">{tx.from_chain}</span>
                    <span className="text-muted-foreground">→</span>
                    <span className="font-semibold">{tx.to_chain}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {tx.from_token} → {tx.to_token}
                  </div>
                </div>

                {/* Amount */}
                <div className="md:col-span-2">
                  <div className="text-lg font-bold text-primary">
                    ${tx.amount.toFixed(2)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {tx.from_token}
                  </div>
                </div>

                {/* Actions */}
                <div className="md:col-span-3 flex gap-2">
                  {tx.tx_hash && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(getWormholeScanUrl(tx.tx_hash!), '_blank')}
                    >
                      <ExternalLink className="w-3 h-3 mr-1" />
                      WormholeScan
                    </Button>
                  )}
                  
                  {tx.needs_redemption && tx.wormhole_vaa && (
                    <Button
                      size="sm"
                      className="bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30"
                    >
                      Complete Transfer
                    </Button>
                  )}
                </div>
              </div>

              {/* Additional Details */}
              {(tx.tx_hash || tx.redemption_tx_hash) && (
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="grid md:grid-cols-2 gap-3 text-xs">
                    {tx.tx_hash && (
                      <div>
                        <span className="text-muted-foreground">Source TX: </span>
                        <a
                          href={getExplorerUrl(tx.from_chain, tx.tx_hash) || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline font-mono"
                        >
                          {tx.tx_hash.slice(0, 10)}...{tx.tx_hash.slice(-8)}
                        </a>
                      </div>
                    )}
                    {tx.redemption_tx_hash && (
                      <div>
                        <span className="text-muted-foreground">Destination TX: </span>
                        <a
                          href={getExplorerUrl(tx.to_chain, tx.redemption_tx_hash) || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline font-mono"
                        >
                          {tx.redemption_tx_hash.slice(0, 10)}...{tx.redemption_tx_hash.slice(-8)}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      </Card>

      <Card className="p-6 bg-muted/30">
        <h4 className="font-bold mb-3">Transaction Status Guide</h4>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-blue-400">Pending VAA</div>
              <div className="text-muted-foreground">Waiting for Guardian validators (~30-60 seconds)</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-yellow-400">Ready to Claim</div>
              <div className="text-muted-foreground">VAA ready, click "Complete Transfer" to finalize</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-green-400">Complete</div>
              <div className="text-muted-foreground">Funds successfully bridged to destination</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-red-400">Failed</div>
              <div className="text-muted-foreground">Transaction encountered an error</div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default WormholeTransactionHistory;
