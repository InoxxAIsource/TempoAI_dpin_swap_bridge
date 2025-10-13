import Mermaid from '../docs/Mermaid';
import deviceAdditionFlowImage from '@/assets/device-addition-flow.png';
import earningCalculationFlowImage from '@/assets/earning-calculation-flow.png';

const CompleteFlowDiagram = () => {
  const wormholeIntegrationFlow = `
sequenceDiagram
    participant Device
    participant Backend
    participant Database
    participant User
    participant Wormhole
    participant TargetChain
    
    Device->>Backend: Report Metrics (35 kWh)
    Backend->>Backend: Verify Signature
    Backend->>Database: Calculate Reward ($3.50)
    Database->>User: Show Pending Reward
    User->>User: Click "Bridge Rewards"
    User->>Wormhole: Initiate Transfer (USDC)
    Wormhole->>Wormhole: Lock on Source Chain
    Wormhole->>Wormhole: Generate VAA
    Wormhole->>TargetChain: Mint/Release on Destination
    TargetChain->>User: Receive USDC
    User->>User: Deposit in DeFi Protocol
  `;

  return (
    <div className="space-y-12">
      <div>
        <h3 className="text-2xl font-bold mb-6">Device Addition Flow</h3>
        <p className="text-muted-foreground mb-6">
          Complete journey from signing up to seeing your first device metrics on the dashboard.
        </p>
        <div className="my-8 p-6 rounded-xl border border-border bg-card/50">
          <img 
            src={deviceAdditionFlowImage} 
            alt="Device Addition Flow Diagram" 
            className="w-full h-auto"
          />
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-bold mb-6">Earning Calculation Flow</h3>
        <p className="text-muted-foreground mb-6">
          How your device metrics are verified, calculated, and converted into rewards.
        </p>
        <div className="my-8 p-6 rounded-xl border border-border bg-card/50 overflow-x-auto">
          <img 
            src={earningCalculationFlowImage} 
            alt="Earning Calculation Flow Diagram" 
            className="w-full h-auto min-w-[800px]"
          />
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-bold mb-6">Wormhole Cross-Chain Bridge Flow</h3>
        <p className="text-muted-foreground mb-6">
          Step-by-step process of bridging your DePIN rewards across blockchain networks using Wormhole.
        </p>
        <Mermaid chart={wormholeIntegrationFlow} />
      </div>
    </div>
  );
};

export default CompleteFlowDiagram;
