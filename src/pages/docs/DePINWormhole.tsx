import WormholeExplainer from '@/components/depin/WormholeExplainer';
import WormholeIntegrationFlow from '@/components/depin/WormholeIntegrationFlow';
import CrossChainBenefitsTable from '@/components/depin/CrossChainBenefitsTable';
import WormholeCostComparison from '@/components/depin/WormholeCostComparison';
import WormholeSecurityCard from '@/components/depin/WormholeSecurityCard';
import WormholeUserJourneyMap from '@/components/depin/WormholeUserJourneyMap';
import WormholeTransactionHistory from '@/components/depin/WormholeTransactionHistory';
import { Card } from '@/components/ui/card';

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
        <h2 className="text-3xl font-bold mb-6">DePIN Claim Flow</h2>
        <Card className="p-6">
          <h3 className="text-xl font-bold mb-4">Complete Claim Journey</h3>
          <ol className="space-y-4 list-decimal list-inside">
            <li>
              <strong>Earn Rewards:</strong> Devices generate rewards based on uptime and performance
            </li>
            <li>
              <strong>Select Amount:</strong> Choose partial or full claim amount
            </li>
            <li>
              <strong>Claim on Sepolia:</strong> Smart contract allocates ETH equivalent on Sepolia testnet
            </li>
            <li>
              <strong>Wormhole Bridge:</strong> Guardian Network generates VAA for cross-chain transfer
            </li>
            <li>
              <strong>Redeem on Destination:</strong> Claim final tokens on your preferred chain (Solana, Polygon, Base, etc.)
            </li>
          </ol>
          
          <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/50 rounded-lg">
            <h4 className="font-semibold mb-2">⏱️ Timeline Expectations</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• <strong>Sepolia Claim:</strong> 1-3 minutes (contract transaction)</li>
              <li>• <strong>Blockchain Finality:</strong> 15-20 minutes (testnet confirmation)</li>
              <li>• <strong>Guardian Verification:</strong> 5-15 minutes (VAA generation)</li>
              <li>• <strong>Redemption:</strong> 1-5 minutes (claim on destination chain)</li>
              <li>• <strong>Total Time:</strong> ~30-45 minutes (automated polling tracks progress)</li>
            </ul>
          </div>
        </Card>
      </div>
      
      <div>
        <h2 className="text-3xl font-bold mb-6">Your Transaction History</h2>
        <WormholeTransactionHistory />
      </div>
    </div>
  );
};

export default DePINWormhole;
