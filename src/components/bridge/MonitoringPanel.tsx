import { useState, useEffect, memo } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { monitorWalletTransactions } from '@/utils/web3TransactionMonitor';
import { ExternalLink } from 'lucide-react';

interface MonitoringPanelProps {
  evmAddress: string | null;
  networkMode: 'Testnet' | 'Mainnet';
  onTransactionDetected?: (txDetails: any) => void;
}

const MonitoringPanel = memo(({ evmAddress, networkMode, onTransactionDetected }: MonitoringPanelProps) => {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [lastPollTime, setLastPollTime] = useState<Date | null>(null);
  const [monitoringTimeRemaining, setMonitoringTimeRemaining] = useState(0);
  const [lastCheckedTimestamp, setLastCheckedTimestamp] = useState(0);

  // Active polling when monitoring is enabled
  useEffect(() => {
    if (!isMonitoring || !evmAddress) return;
    
    console.log('🔄 Starting active polling for wallet:', evmAddress);
    const monitoringStartTime = Date.now();
    const TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes
    
    setLastPollTime(new Date());
    
    const pollInterval = setInterval(async () => {
      try {
        setLastPollTime(new Date());
        
        const recentTxs = await monitorWalletTransactions(
          evmAddress,
          networkMode,
          lastCheckedTimestamp
        );
        
        console.log(`📡 Web3 Poll result: ${recentTxs.length} new Wormhole transactions`);
        
        for (const tx of recentTxs) {
          console.log('✅ Found transaction via polling:', tx.hash);
          
          const txDetails = {
            hash: tx.hash,
            fromChain: networkMode === 'Testnet' ? 'Sepolia' : 'Ethereum',
            toChain: 'Solana',
            token: 'USDC',
            amount: 0,
            network: networkMode,
          };
          
          onTransactionDetected?.(txDetails);
          
          const { data: { user } } = await supabase.auth.getUser();
          await supabase.from('wormhole_transactions').insert({
            user_id: user?.id || null,
            wallet_address: evmAddress.toLowerCase(),
            tx_hash: tx.hash,
            from_chain: networkMode === 'Testnet' ? 'Sepolia' : 'Ethereum',
            to_chain: 'Solana',
            from_token: 'USDC',
            to_token: 'USDC',
            amount: 0,
            status: 'pending',
          });
          
          toast({
            title: "✅ Transaction Detected!",
            description: (
              <a 
                href={`https://wormholescan.io/#/tx/${tx.hash}?network=${networkMode}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Track on WormholeScan →
              </a>
            ) as any,
          });
        }
        
        setLastCheckedTimestamp(Date.now());
        
        if (recentTxs.length > 0) {
          setIsMonitoring(false);
        }
      } catch (error) {
        console.error('❌ Polling error:', error);
      }
    }, 5000);
    
    const countdownInterval = setInterval(() => {
      const elapsed = Date.now() - monitoringStartTime;
      const remaining = Math.max(0, TIMEOUT_MS - elapsed);
      setMonitoringTimeRemaining(Math.floor(remaining / 1000));
      
      if (remaining <= 0) {
        console.log('⏰ Stopping polling - 30 minute timeout');
        setIsMonitoring(false);
      }
    }, 1000);
    
    return () => {
      clearInterval(pollInterval);
      clearInterval(countdownInterval);
    };
  }, [isMonitoring, evmAddress, lastCheckedTimestamp, networkMode, onTransactionDetected]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!evmAddress) return null;

  return (
    <Card className="p-6 mb-6 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex-1">
          <h3 className="font-semibold text-lg mb-2">Transaction Monitor</h3>
          <div className="space-y-1 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Status:</span>
              {isMonitoring ? (
                <Badge variant="default" className="bg-green-500">Active</Badge>
              ) : (
                <Badge variant="secondary">Inactive</Badge>
              )}
            </div>
            {isMonitoring && (
              <>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Time Remaining:</span>
                  <span className="font-mono">{formatTime(monitoringTimeRemaining)}</span>
                </div>
                {lastPollTime && (
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Last Check:</span>
                    <span className="font-mono">{lastPollTime.toLocaleTimeString()}</span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button
            onClick={() => {
              setIsMonitoring(true);
              setLastCheckedTimestamp(Date.now());
              toast({
                title: "🔍 Monitoring Started",
                description: "Watching for bridge transactions...",
              });
            }}
            disabled={isMonitoring}
            variant={isMonitoring ? "outline" : "default"}
            className="min-w-[140px]"
          >
            {isMonitoring ? "Monitoring..." : "Start Monitoring"}
          </Button>
          
          {isMonitoring && (
            <Button
              onClick={() => setIsMonitoring(false)}
              variant="outline"
            >
              Stop
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
});

MonitoringPanel.displayName = 'MonitoringPanel';

export default MonitoringPanel;
