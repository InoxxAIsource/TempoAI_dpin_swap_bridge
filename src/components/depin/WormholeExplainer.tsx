import { Network, Zap, Lock, TrendingUp, Globe, DollarSign, ArrowRight, Shield, ZoomIn } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import diagramTempoImage from '@/assets/diagram_tempo.png';

const WormholeExplainer = () => {

  const chains = [
    { name: 'Ethereum', benefit: 'Maximum Security + Liquidity', icon: '🔷' },
    { name: 'Polygon', benefit: 'Ultra-Low Fees + Fast Transactions', icon: '🟣' },
    { name: 'Avalanche', benefit: 'High Throughput + Subnets', icon: '🔺' },
    { name: 'Base', benefit: 'Coinbase Ecosystem Integration', icon: '🔵' },
    { name: 'Arbitrum', benefit: 'L2 Scalability + Low Costs', icon: '🔶' },
    { name: 'Optimism', benefit: 'Ethereum L2 + Low Fees', icon: '🔴' },
    { name: 'BNB Chain', benefit: 'Wide Adoption + Fast Finality', icon: '🟡' }
  ];

  const useCases = [
    {
      scenario: 'Low-Fee DeFi',
      action: 'Bridge $100 USDC to Polygon',
      benefit: 'Deposit in Aave at 6% APY with minimal gas costs',
      cost: '~$0.50'
    },
    {
      scenario: 'High-Value Security',
      action: 'Keep earnings on Ethereum',
      benefit: 'Maximum security for large balances',
      cost: 'No bridge fee'
    },
    {
      scenario: 'Liquidity Mining',
      action: 'Bridge to Avalanche',
      benefit: 'Access to high-yield liquidity pools (12%+ APY)',
      cost: '~$1.50'
    },
    {
      scenario: 'Stable Storage',
      action: 'Bridge to Base',
      benefit: 'Integrate with Coinbase ecosystem, easy fiat off-ramp',
      cost: '~$0.30'
    }
  ];

  return (
    <div className="space-y-12">
      {/* What is Wormhole */}
      <div>
        <h3 className="text-3xl font-bold mb-6">What is Wormhole?</h3>
        <Card className="p-8 bg-gradient-to-br from-purple-500/5 to-blue-500/5 border-purple-500/20">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <p className="text-lg mb-6 leading-relaxed">
                Wormhole is a <span className="text-primary font-semibold">cross-chain interoperability protocol</span> that 
                connects 30+ blockchain networks, enabling seamless transfer of tokens, data, and messages.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-semibold mb-1">Guardian Network</div>
                    <div className="text-sm text-muted-foreground">19 validators secure every cross-chain message</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Lock className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-semibold mb-1">VAA (Verified Action Approval)</div>
                    <div className="text-sm text-muted-foreground">Cryptographic proof verified by multiple chains</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-semibold mb-1">Fast & Reliable</div>
                    <div className="text-sm text-muted-foreground">Transfers complete in under 2 minutes</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="text-6xl mb-4">🌊</div>
                <div className="text-2xl font-bold">30+ Chains</div>
                <div className="text-muted-foreground">Connected via Wormhole</div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Why Wormhole for DePIN */}
      <div>
        <h3 className="text-3xl font-bold mb-6">Why Wormhole for DePIN?</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6">
            <Network className="w-8 h-8 text-primary mb-4" />
            <h4 className="text-xl font-bold mb-3">Chain Flexibility</h4>
            <p className="text-muted-foreground mb-4">
              Your solar panel in California earns on Ethereum, but you can use those rewards on any 
              connected chain. Choose the best ecosystem for your needs.
            </p>
            <div className="text-sm text-primary">Earn once → Use anywhere</div>
          </Card>

          <Card className="p-6">
            <DollarSign className="w-8 h-8 text-primary mb-4" />
            <h4 className="text-xl font-bold mb-3">Cost Optimization</h4>
            <p className="text-muted-foreground mb-4">
              High-value transactions on Ethereum for security, frequent small transactions on Polygon 
              for low fees. Optimize for your use case.
            </p>
            <div className="text-sm text-primary">Save on gas fees</div>
          </Card>

          <Card className="p-6">
            <TrendingUp className="w-8 h-8 text-primary mb-4" />
            <h4 className="text-xl font-bold mb-3">DeFi Opportunities</h4>
            <p className="text-muted-foreground mb-4">
              Access different DeFi protocols across chains. Bridge to Avalanche for high yields, 
              Polygon for lending, or Base for Coinbase integration.
            </p>
            <div className="text-sm text-primary">Maximize returns</div>
          </Card>

          <Card className="p-6">
            <Globe className="w-8 h-8 text-primary mb-4" />
            <h4 className="text-xl font-bold mb-3">Future-Proof</h4>
            <p className="text-muted-foreground mb-4">
              Not locked to a single chain. As new chains emerge and ecosystems evolve, you can 
              adapt your strategy without losing access to your earnings.
            </p>
            <div className="text-sm text-primary">Adapt & grow</div>
          </Card>
        </div>
      </div>

      {/* Technical Flow */}
      <div>
        <h3 className="text-3xl font-bold mb-6">How It Works (Technical)</h3>
        <Dialog>
          <DialogTrigger asChild>
            <div className="my-8 p-6 rounded-xl border border-border bg-card/50 overflow-x-auto cursor-pointer hover:border-primary/50 transition-colors relative group">
              <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <ZoomIn className="w-5 h-5" />
              </div>
              <img 
                src={diagramTempoImage} 
                alt="Wormhole Technical Flow Diagram" 
                className="w-full h-auto min-w-[800px]"
              />
            </div>
          </DialogTrigger>
          <DialogContent className="max-w-[95vw] max-h-[95vh] overflow-auto">
            <img 
              src={diagramTempoImage} 
              alt="Wormhole Technical Flow Diagram - Zoomed" 
              className="w-full h-auto"
            />
          </DialogContent>
        </Dialog>
        
        <Card className="p-6 mt-6 bg-muted/30">
          <h4 className="text-lg font-bold mb-4">Step-by-Step Breakdown:</h4>
          <ol className="space-y-3 text-sm">
            <li className="flex gap-3">
              <span className="text-primary font-semibold">1.</span>
              <span>Your device earns $105 USDC over 30 days on Ethereum testnet</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-semibold">2.</span>
              <span>You click "Bridge to Polygon" in the app</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-semibold">3.</span>
              <span>Wormhole smart contract locks your $105 USDC on Ethereum</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-semibold">4.</span>
              <span>19 Guardian validators observe and sign a VAA (cryptographic proof)</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-semibold">5.</span>
              <span>VAA is submitted to Polygon contract</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-semibold">6.</span>
              <span>Polygon releases equivalent $105 USDC to your wallet</span>
            </li>
            <li className="flex gap-3">
              <span className="text-primary font-semibold">7.</span>
              <span className="text-green-400 font-semibold">Complete! Total time: ~2 minutes, Cost: ~$0.50</span>
            </li>
          </ol>
        </Card>
      </div>

      {/* Supported Chains */}
      <div>
        <h3 className="text-3xl font-bold mb-6">Supported Chains</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {chains.map((chain, index) => (
            <Card key={index} className="p-5 hover:shadow-lg hover:shadow-primary/10 transition-all cursor-pointer">
              <div className="flex items-center gap-3 mb-3">
                <div className="text-3xl">{chain.icon}</div>
                <div className="font-bold text-lg">{chain.name}</div>
              </div>
              <div className="text-sm text-muted-foreground">{chain.benefit}</div>
            </Card>
          ))}
        </div>
      </div>

      {/* Use Cases */}
      <div>
        <h3 className="text-3xl font-bold mb-6">Real-World Use Cases</h3>
        <div className="space-y-4">
          {useCases.map((useCase, index) => (
            <Card key={index} className="p-6">
              <div className="flex items-start justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold">
                      {useCase.scenario}
                    </span>
                    <span className="text-xs text-muted-foreground">Cost: {useCase.cost}</span>
                  </div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-sm font-semibold">Action:</span>
                    <span className="text-sm text-muted-foreground">{useCase.action}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <ArrowRight className="w-4 h-4 text-primary" />
                    <span className="text-sm text-primary font-semibold">{useCase.benefit}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Future of Wormhole + DePIN */}
      <div>
        <h3 className="text-3xl font-bold mb-6">Future: Omnichain DePIN</h3>
        <Card className="p-8 bg-gradient-to-br from-primary/10 via-purple-500/10 to-blue-500/10">
          <div className="space-y-6">
            <p className="text-lg leading-relaxed">
              The future of DePIN is <span className="text-primary font-semibold">omnichain</span>: devices 
              earning across multiple chains simultaneously, with rewards automatically optimized for the 
              best yields and lowest costs.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-bold mb-2 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-primary" />
                  Coming Soon
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Automatic yield optimization across chains</li>
                  <li>• Multi-chain device registry</li>
                  <li>• Cross-chain governance voting</li>
                  <li>• Instant liquidity aggregation</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-2 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Long-Term Vision
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Global DePIN network across 50+ chains</li>
                  <li>• AI-powered reward routing</li>
                  <li>• Zero-knowledge device proofs</li>
                  <li>• Decentralized oracle network</li>
                </ul>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default WormholeExplainer;
