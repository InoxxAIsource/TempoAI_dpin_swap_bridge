import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Waves, Activity, TrendingUp } from 'lucide-react';

const WormholeStatusWidget = () => {
  const [status, setStatus] = useState({
    operational: true,
    avgBridgeTime: '2m 15s',
    guardiansOnline: '19/19',
    volume24h: '$2.4M',
    successRate: '99.8%'
  });

  // Simulate real-time status check
  useEffect(() => {
    const interval = setInterval(() => {
      // In a real implementation, this would fetch from Wormhole API
      setStatus(prev => ({
        ...prev,
        avgBridgeTime: `${Math.floor(Math.random() * 60) + 90}s`,
        volume24h: `$${(2.3 + Math.random()).toFixed(1)}M`
      }));
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Waves className="w-5 h-5 text-purple-400" />
          <span className="font-bold">Wormhole Status</span>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${status.operational ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
          <span className="text-sm font-semibold">
            {status.operational ? 'Operational' : 'Issues Detected'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 text-xs">
        <div className="text-center">
          <div className="text-muted-foreground mb-1">Guardians</div>
          <div className="font-bold text-green-400">{status.guardiansOnline}</div>
        </div>
        <div className="text-center">
          <div className="text-muted-foreground mb-1">24h Volume</div>
          <div className="font-bold">{status.volume24h}</div>
        </div>
        <div className="text-center">
          <div className="text-muted-foreground mb-1">Success</div>
          <div className="font-bold text-green-400">{status.successRate}</div>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-border flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <Activity className="w-3 h-3 text-primary" />
          <span className="text-muted-foreground">Avg Bridge Time</span>
        </div>
        <span className="font-semibold">{status.avgBridgeTime}</span>
      </div>

      {status.operational && (
        <div className="mt-3 p-2 rounded-lg bg-green-500/10 border border-green-500/20">
          <div className="flex items-center gap-2 text-xs text-green-400">
            <TrendingUp className="w-3 h-3" />
            <span>All systems operational</span>
          </div>
        </div>
      )}
    </Card>
  );
};

export default WormholeStatusWidget;
