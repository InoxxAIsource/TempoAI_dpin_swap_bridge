import { Card } from '@/components/ui/card';
import { Waves, Lock, CheckCircle2, ArrowRight } from 'lucide-react';
import Mermaid from '../docs/Mermaid';

const WormholeIntegrationFlow = () => {
  const flowDiagram = `graph TB
    A[Device Reports Metrics] -->|API Call| B[Backend Calculates Rewards]
    B -->|Multi-factor Formula| C[Rewards Accumulate in DB]
    C -->|User Claims| D{Select Chain}
    D -->|Ethereum| E[No Bridge - Direct]
    D -->|Polygon/Base/etc| F[Wormhole Bridge Process]
    
    F -->|1. Lock USDC| G[Ethereum Sepolia]
    G -->|2. Emit Event| H[19 Guardian Validators]
    H -->|3. 13/19 Signatures| I[VAA Generated]
    I -->|4. Retrieve VAA| J[WormholeScan API]
    J -->|5. Redeem| K[Destination Chain]
    K -->|USDC Released| L[Your Wallet]
    L -->|Optional| M[DeFi Deposit]
    
    E -->|Direct Access| L
    
    style F fill:#8b5cf6
    style I fill:#10b981
    style L fill:#10b981
    style H fill:#f59e0b`;

  const wormholeBridgeFlow = `graph TD
    A[User Wallet] -->|1. Approve & Transfer| B[Wormhole Bridge Contract]
    B -->|2. Lock/Burn Tokens| C[Source Chain]
    C -->|3. Emit Event| D[Guardian Network]
    D -->|4. Observe & Validate| E{19 Guardians}
    E -->|5. 13+ Signatures| F[VAA Generated]
    F -->|6. VAA Available| G[WormholeScan API]
    G -->|7. Poll for VAA| H[Tempo Monitoring]
    H -->|8. Display Status| A
    A -->|9. Switch Chain & Claim| I[Destination Chain Contract]
    I -->|10. Verify VAA| J[Unlock/Mint Tokens]
    J -->|11. Transfer to User| A
    
    style A fill:#3b82f6,stroke:#1e40af,color:#fff
    style B fill:#8b5cf6,stroke:#6d28d9,color:#fff
    style C fill:#eab308,stroke:#ca8a04,color:#000
    style D fill:#ec4899,stroke:#be185d,color:#fff
    style E fill:#f97316,stroke:#c2410c,color:#fff
    style F fill:#10b981,stroke:#059669,color:#fff
    style G fill:#eab308,stroke:#ca8a04,color:#000
    style H fill:#06b6d4,stroke:#0891b2,color:#fff
    style I fill:#8b5cf6,stroke:#6d28d9,color:#fff
    style J fill:#10b981,stroke:#059669,color:#fff`;

  const steps = [
    {
      number: 1,
      title: "Device Reports Metrics",
      description: "Your device sends data to report-device-event API"
    },
    {
      number: 2,
      title: "Backend Calculates Rewards",
      description: "Multi-factor formula applies bonuses and multipliers"
    },
    {
      number: 3,
      title: "Rewards Accumulate",
      description: "Stored in depin_rewards table until claim threshold reached"
    },
    {
      number: 4,
      title: "User Initiates Claim",
      description: "Select destination chain and confirm bridge"
    },
    {
      number: 5,
      title: "Wormhole Bridge Process",
      description: "Guardian network validates and generates VAA"
    },
    {
      number: 6,
      title: "USDC Arrives on Chain",
      description: "Destination chain receives and releases funds"
    }
  ];

  return (
    <div className="space-y-8">
      <Card className="p-8">
        <div className="flex items-center gap-3 mb-6">
          <Waves className="w-8 h-8 text-purple-400" />
          <h2 className="text-3xl font-bold">Complete Integration Flow</h2>
        </div>
        
        <p className="text-muted-foreground mb-8">
          Follow the journey of your DePIN rewards from device reporting to cross-chain claiming via Wormhole.
        </p>

        <div className="bg-muted/30 p-6 rounded-lg mb-8">
          <Mermaid chart={flowDiagram} />
        </div>

        <div className="mb-8">
          <h3 className="text-2xl font-bold mb-4">Wormhole Bridge Flow</h3>
          <p className="text-muted-foreground mb-4">
            Detailed visualization of the cross-chain bridging process from source to destination chain.
          </p>
          <div className="bg-muted/30 p-6 rounded-lg">
            <Mermaid chart={wormholeBridgeFlow} />
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-2xl font-bold mb-2">Step-by-Step Process</h3>
          <p className="text-muted-foreground">
            Understanding each stage of the reward claiming journey.
          </p>
        </div>

        <div className="grid gap-6">
          {steps.map((step, index) => (
            <Card key={index} className="p-6 hover:border-primary/40 transition-colors">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-xl font-bold">{step.number}</span>
                </div>
                
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </div>
              
              {index < steps.length - 1 && (
                <div className="flex justify-center mt-4">
                  <ArrowRight className="w-6 h-6 text-muted-foreground" />
                </div>
              )}
            </Card>
          ))}
        </div>

        <Card className="p-6 mt-8 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-500/20">
          <div className="flex items-start gap-4">
            <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-bold mb-2">End-to-End Time</h4>
              <p className="text-sm text-muted-foreground">
                From clicking "Claim" to receiving funds on destination chain: <span className="text-green-400 font-semibold">~2-3 minutes</span> average
              </p>
            </div>
          </div>
        </Card>
      </Card>
    </div>
  );
};

export default WormholeIntegrationFlow;
