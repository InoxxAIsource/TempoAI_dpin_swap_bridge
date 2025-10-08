import PageLayout from '../components/layout/PageLayout';
import PageHero from '../components/layout/PageHero';
import BridgeCard from '../components/bridge/BridgeCard';
import { ArrowRight } from 'lucide-react';
import StatusBadge from '../components/ui/StatusBadge';

const Bridge = () => {
  const recentTransfers = [
    { from: 'Ethereum', to: 'Polygon', amount: '500 USDC', status: 'completed' as const, time: '2m ago' },
    { from: 'Arbitrum', to: 'Avalanche', amount: '1.5 ETH', status: 'pending' as const, time: '5m ago' },
    { from: 'Solana', to: 'Ethereum', amount: '100 SOL', status: 'completed' as const, time: '1h ago' },
  ];

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
                {recentTransfers.map((transfer, index) => (
                  <div key={index} className="border border-border rounded-xl p-4 space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium">{transfer.from}</span>
                      <ArrowRight className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">{transfer.to}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold">{transfer.amount}</span>
                      <StatusBadge status={transfer.status} />
                    </div>
                    <div className="text-xs text-muted-foreground">{transfer.time}</div>
                  </div>
                ))}
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
