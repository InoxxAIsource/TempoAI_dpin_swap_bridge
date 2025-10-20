import PageLayout from '../components/layout/PageLayout';
import PageHero from '../components/layout/PageHero';
import WormholeConnectWidget from '../components/bridge/WormholeConnectWidget';
import ChainBadge from '../components/ui/ChainBadge';
import MonitoringPanel from '../components/bridge/MonitoringPanel';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { YieldDepositModal } from '@/components/chat/YieldDepositModal';
import { useWalletContext } from '@/contexts/WalletContext';

const Bridge = () => {
  const { evmAddress } = useWalletContext();
  const [searchParams] = useSearchParams();
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [networkMode] = useState<'Testnet' | 'Mainnet'>('Testnet');
  
  // Check if this is part of a yield strategy flow
  const nextAction = searchParams.get('nextAction');
  const protocol = searchParams.get('protocol');
  const apy = searchParams.get('apy');
  const token = searchParams.get('token');
  const chain = searchParams.get('targetChain');
  const amount = searchParams.get('amount');

  
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

  return (
    <PageLayout>
      <PageHero 
        title="Bridge"
        description="Seamlessly transfer assets across multiple blockchains with Wormhole"
      />

      <section className="px-4 md:px-6 lg:px-12 py-6 md:py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <WormholeConnectWidget />
          
          {/* Transaction Monitor */}
          {evmAddress && (
            <MonitoringPanel 
              evmAddress={evmAddress} 
              networkMode={networkMode}
            />
          )}
        </div>
      </section>

      {/* Supported Chains */}
      <section className="px-4 sm:px-6 lg:px-12 py-6 md:py-8 pb-16 md:pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="border border-border rounded-2xl p-4 md:p-6 lg:p-8 bg-card">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">Supported Chains</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3 md:gap-4">
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
