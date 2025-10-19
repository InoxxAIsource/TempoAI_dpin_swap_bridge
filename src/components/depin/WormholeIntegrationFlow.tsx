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

  const steps = [
    {
      number: 1,
      title: "Device Reports Metrics",
      description: "Your device sends data to report-device-event API",
      code: `// Device client reporting
await fetch('/api/report-device-event', {
  method: 'POST',
  body: JSON.stringify({
    device_id: "solar_panel_123",
    metrics: { energy_kwh: 35 },
    signature: "Ed25519_signature"
  })
});`
    },
    {
      number: 2,
      title: "Backend Calculates Rewards",
      description: "Multi-factor formula applies bonuses and multipliers",
      code: `// Reward calculation
const reward = 
  energy_kwh * BASE_RATE * 
  (verified ? 2 : 1) * 
  deviceMultiplier * 
  (uptime > 95 ? 1.5 : 1);`
    },
    {
      number: 3,
      title: "Rewards Accumulate",
      description: "Stored in depin_rewards table until claim threshold reached",
      code: `// Database insert
await supabase
  .from('depin_rewards')
  .insert({
    user_id, device_id,
    amount: reward_amount,
    status: 'pending'
  });`
    },
    {
      number: 4,
      title: "User Initiates Claim",
      description: "Select destination chain and confirm bridge",
      code: `// Create batch claim
await supabase.functions.invoke(
  'create-batch-claim',
  {
    body: {
      claimAmount: 100,
      destinationChain: 'polygon',
      walletAddress: '0x...'
    }
  }
);`
    },
    {
      number: 5,
      title: "Wormhole Bridge Process",
      description: "Guardian network validates and generates VAA",
      code: `// VAA polling (automatic)
const vaa = await fetch(
  'https://api.wormholescan.io/api/v1/vaas/' +
  '{chainId}/{emitter}/{sequence}'
);
// 19 Guardians sign
// 13/19 signatures required
// VAA generated in ~30-60 seconds`
    },
    {
      number: 6,
      title: "USDC Arrives on Chain",
      description: "Destination chain receives and releases funds",
      code: `// Automatic redemption
// or manual if needed
const tx = await redeemOnPolygon(vaa);
// USDC now in your wallet!`
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

        <div className="grid gap-6">
          {steps.map((step, index) => (
            <Card key={index} className="p-6 hover:border-primary/40 transition-colors">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-xl font-bold">{step.number}</span>
                </div>
                
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground mb-4">{step.description}</p>
                  
                  <Card className="p-4 bg-card border-muted">
                    <pre className="text-xs overflow-x-auto">
                      <code>{step.code}</code>
                    </pre>
                  </Card>
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
