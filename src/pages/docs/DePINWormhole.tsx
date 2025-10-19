import WormholeExplainer from '@/components/depin/WormholeExplainer';
import WormholeIntegrationFlow from '@/components/depin/WormholeIntegrationFlow';
import CrossChainBenefitsTable from '@/components/depin/CrossChainBenefitsTable';
import WormholeCostComparison from '@/components/depin/WormholeCostComparison';
import WormholeSecurityCard from '@/components/depin/WormholeSecurityCard';
import WormholeUserJourneyMap from '@/components/depin/WormholeUserJourneyMap';
import WormholeTransactionHistory from '@/components/depin/WormholeTransactionHistory';

const DePINWormhole = () => {
  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-4xl font-bold mb-4">Wormhole Bridge</h1>
        <p className="text-xl text-muted-foreground">
          Learn how Wormhole enables cross-chain reward claiming and DeFi integration.
        </p>
      </div>

      <WormholeExplainer />
      
      <div>
        <h2 className="text-3xl font-bold mb-6">Wormhole's Role in Tempo DePIN</h2>
        <WormholeIntegrationFlow />
      </div>
      
      <div>
        <h2 className="text-3xl font-bold mb-6">Cross-Chain Benefits</h2>
        <CrossChainBenefitsTable />
      </div>
      
      <div>
        <h2 className="text-3xl font-bold mb-6">Bridge Cost Comparison</h2>
        <WormholeCostComparison />
      </div>
      
      <div>
        <h2 className="text-3xl font-bold mb-6">Security & Trust</h2>
        <WormholeSecurityCard />
      </div>
      
      <div>
        <h2 className="text-3xl font-bold mb-6">Your Journey with Wormhole</h2>
        <WormholeUserJourneyMap />
      </div>
      
      <div>
        <h2 className="text-3xl font-bold mb-6">Your Transaction History</h2>
        <WormholeTransactionHistory />
      </div>
    </div>
  );
};

export default DePINWormhole;
