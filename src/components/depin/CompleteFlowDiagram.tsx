import Mermaid from '../docs/Mermaid';
import deviceAdditionFlowImage from '@/assets/device-addition-flow.png';

const CompleteFlowDiagram = () => {
  const earningCalculationFlow = `
graph LR
    A[Device Collects Metric] --> B[Sign with Private Key]
    B --> C[Send to Backend API]
    C --> D{Verify Signature}
    D -->|Invalid| E[Reject]
    D -->|Valid| F[Calculate Base Reward]
    F --> G{Device Verified?}
    G -->|Yes - 2x| H[Base × 2]
    G -->|No - 1x| I[Base × 1]
    H --> J[Check Uptime]
    I --> J
    J --> K{Uptime > 99%?}
    K -->|Yes| L[Add 10% Bonus]
    K -->|No| M[No Bonus]
    L --> N[Store in Database]
    M --> N
    N --> O[Update Dashboard]
    O --> P[User Sees Earnings]
  `;

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
        <Mermaid chart={earningCalculationFlow} />
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
