import { Card } from '@/components/ui/card';
import { Shield, Users, CheckCircle2, AlertCircle, Lock, Eye } from 'lucide-react';
import Mermaid from '../docs/Mermaid';

const WormholeSecurityCard = () => {
  const guardianDiagram = `graph TB
    A[Your Bridge Transaction] --> B[19 Guardian Validators]
    B --> C1[Jump Crypto ✓]
    B --> C2[Coinbase Cloud ✓]
    B --> C3[Everstake ✓]
    B --> C4[Chorus One ✓]
    B --> C5[+ 15 More Validators]
    
    C1 --> D{13/19 Signatures?}
    C2 --> D
    C3 --> D
    C4 --> D
    C5 --> D
    
    D -->|Yes| E[VAA Generated ✓]
    D -->|No| F[Transaction Rejected ✗]
    
    E --> G[Destination Chain Receives Funds]
    
    style E fill:#10b981
    style F fill:#ef4444
    style D fill:#f59e0b`;

  const vaaProcess = [
    {
      step: 1,
      title: "Source Transaction",
      description: "User locks USDC on source chain (e.g., Ethereum Sepolia)",
      icon: Lock
    },
    {
      step: 2,
      title: "Guardian Observation",
      description: "19 independent validators monitor the transaction",
      icon: Eye
    },
    {
      step: 3,
      title: "Cryptographic Signing",
      description: "Each Guardian creates a unique cryptographic signature",
      icon: Shield
    },
    {
      step: 4,
      title: "Consensus Threshold",
      description: "13 out of 19 signatures required (supermajority)",
      icon: Users
    },
    {
      step: 5,
      title: "VAA Creation",
      description: "Verified Action Approval generated with all signatures",
      icon: CheckCircle2
    },
    {
      step: 6,
      title: "Destination Redemption",
      description: "Smart contract verifies VAA and releases funds",
      icon: CheckCircle2
    }
  ];

  const securityMetrics = [
    {
      metric: "Total Volume Secured",
      value: "$40B+",
      description: "Since launch across all chains"
    },
    {
      metric: "Connected Chains",
      value: "30+",
      description: "EVM and non-EVM networks"
    },
    {
      metric: "Guardian Validators",
      value: "19",
      description: "Independent institutional operators"
    },
    {
      metric: "Consensus Required",
      value: "13/19",
      description: "Supermajority (68.4%) threshold"
    },
    {
      metric: "Average Bridge Time",
      value: "2 min",
      description: "From source to destination"
    },
    {
      metric: "Successful Bridges",
      value: "99.8%",
      description: "Transaction success rate"
    }
  ];

  const safetyTips = [
    {
      tip: "Always verify destination address",
      status: "critical"
    },
    {
      tip: "Start with small test amount ($10-20)",
      status: "recommended"
    },
    {
      tip: "Check VAA status on WormholeScan",
      status: "recommended"
    },
    {
      tip: "Save transaction hash for tracking",
      status: "recommended"
    },
    {
      tip: "Allow 2-5 minutes for completion",
      status: "info"
    },
    {
      tip: "Don't close browser during bridge",
      status: "warning"
    },
    {
      tip: "Don't bridge to unknown chains",
      status: "warning"
    }
  ];

  return (
    <div className="space-y-8">
      <Card className="p-8">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="w-8 h-8 text-green-400" />
          <h2 className="text-3xl font-bold">Security & Trust</h2>
        </div>

        <p className="text-muted-foreground mb-8">
          Wormhole uses a decentralized Guardian network to secure cross-chain transfers. 
          No single entity can approve transactions—it requires consensus from 13 out of 19 independent validators.
        </p>

        {/* Guardian Network Diagram */}
        <div className="mb-8">
          <h3 className="text-xl font-bold mb-4">Guardian Network Architecture</h3>
          <div className="bg-muted/30 p-6 rounded-lg">
            <Mermaid chart={guardianDiagram} />
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            Every bridge transaction must be independently verified by at least 13 Guardian validators 
            before funds are released on the destination chain.
          </p>
        </div>

        {/* VAA Process */}
        <div className="mb-8">
          <h3 className="text-xl font-bold mb-4">VAA (Verified Action Approval) Process</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {vaaProcess.map((item, index) => (
              <Card key={index} className="p-4 hover:border-primary/40 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Step {item.step}</div>
                    <div className="font-bold mb-1 text-sm">{item.title}</div>
                    <div className="text-xs text-muted-foreground">{item.description}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Security Metrics */}
        <div className="mb-8">
          <h3 className="text-xl font-bold mb-4">Security Track Record</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {securityMetrics.map((item, index) => (
              <Card key={index} className="p-6 text-center">
                <div className="text-3xl font-bold text-primary mb-2">{item.value}</div>
                <div className="font-semibold mb-1">{item.metric}</div>
                <div className="text-xs text-muted-foreground">{item.description}</div>
              </Card>
            ))}
          </div>
        </div>

        {/* Notable Guardians */}
        <Card className="p-6 bg-muted/30 mb-8">
          <h4 className="font-bold mb-4">Notable Guardian Validators</h4>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
              <div>
                <div className="font-semibold">Jump Crypto</div>
                <div className="text-xs text-muted-foreground">Leading crypto trading firm</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
              <div>
                <div className="font-semibold">Coinbase Cloud</div>
                <div className="text-xs text-muted-foreground">Institutional infrastructure</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
              <div>
                <div className="font-semibold">Everstake</div>
                <div className="text-xs text-muted-foreground">Top staking provider</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
              <div>
                <div className="font-semibold">Chorus One</div>
                <div className="text-xs text-muted-foreground">Validator infrastructure</div>
              </div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            + 15 additional institutional validators ensuring decentralization
          </p>
        </Card>

        {/* User Safety Tips */}
        <div>
          <h3 className="text-xl font-bold mb-4">User Safety Tips</h3>
          <div className="grid md:grid-cols-2 gap-3">
            {safetyTips.map((item, index) => (
              <Card 
                key={index} 
                className={`p-4 ${
                  item.status === 'critical' ? 'border-red-500/30 bg-red-500/5' :
                  item.status === 'recommended' ? 'border-green-500/30 bg-green-500/5' :
                  item.status === 'warning' ? 'border-yellow-500/30 bg-yellow-500/5' :
                  'border-blue-500/30 bg-blue-500/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  {item.status === 'critical' || item.status === 'recommended' ? (
                    <CheckCircle2 className={`w-5 h-5 flex-shrink-0 ${
                      item.status === 'critical' ? 'text-red-400' : 'text-green-400'
                    }`} />
                  ) : (
                    <AlertCircle className={`w-5 h-5 flex-shrink-0 ${
                      item.status === 'warning' ? 'text-yellow-400' : 'text-blue-400'
                    }`} />
                  )}
                  <span className="text-sm">{item.tip}</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Card>

      {/* Bottom Summary */}
      <Card className="p-8 bg-gradient-to-br from-green-500/10 to-blue-500/10 border-green-500/20">
        <div className="flex items-start gap-4">
          <Shield className="w-8 h-8 text-green-400 flex-shrink-0" />
          <div>
            <h3 className="text-xl font-bold mb-3">Security Summary</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <span><strong>Decentralized consensus:</strong> 13/19 validators must agree before any funds move</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <span><strong>Battle-tested:</strong> $40B+ secured since launch with 99.8% success rate</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <span><strong>Institutional validators:</strong> Top-tier operators like Coinbase and Jump Crypto</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <span><strong>Transparent process:</strong> All transactions visible on WormholeScan explorer</span>
              </li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default WormholeSecurityCard;
