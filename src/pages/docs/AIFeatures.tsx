import { Card } from '@/components/ui/card';
import { Bot, Wallet, TrendingUp, Repeat, Shield, Zap, BarChart3, MessageSquare } from 'lucide-react';
import FeatureCard from '@/components/docs/FeatureCard';

const AIFeatures = () => {
  const features = [
    {
      icon: Wallet,
      title: 'Portfolio Analysis',
      description: 'Get instant insights into your cross-chain holdings, token distribution, and performance metrics.',
      example: '"Show me my portfolio breakdown across all chains"'
    },
    {
      icon: TrendingUp,
      title: 'Yield Optimization',
      description: 'Discover the best DeFi protocols for earning yield based on your risk tolerance and token holdings.',
      example: '"Find me the highest APY for USDC with low risk"'
    },
    {
      icon: Repeat,
      title: 'Smart Bridging',
      description: 'Execute cross-chain transfers with automatic route optimization and cost comparison.',
      example: '"Bridge 500 USDC from Ethereum to Polygon using the cheapest route"'
    },
    {
      icon: Shield,
      title: 'Risk Assessment',
      description: 'Understand protocol risks, smart contract audits, and TVL before depositing funds.',
      example: '"Is Aave safe to deposit in? What are the risks?"'
    },
    {
      icon: Zap,
      title: 'Gas Optimization',
      description: 'Get real-time gas price alerts and recommendations for timing your transactions.',
      example: '"What\'s the best time to bridge to save on gas fees?"'
    },
    {
      icon: BarChart3,
      title: 'DePIN Management',
      description: 'Monitor device performance, claim rewards, and optimize your DePIN earnings.',
      example: '"Show my DePIN device earnings for the last 30 days"'
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-4">AI Assistant Features</h1>
        <p className="text-xl text-muted-foreground">
          Comprehensive capabilities designed to simplify your DeFi and DePIN experience.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {features.map((feature, index) => (
          <Card key={index} className="p-6">
            <feature.icon className="w-8 h-8 text-primary mb-4" />
            <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
            <p className="text-muted-foreground mb-3">{feature.description}</p>
            <Card className="p-3 bg-muted/30">
              <div className="flex items-start gap-2 text-sm">
                <MessageSquare className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground italic">{feature.example}</span>
              </div>
            </Card>
          </Card>
        ))}
      </div>

      <Card className="p-8">
        <h2 className="text-3xl font-bold mb-6">Conversational Intelligence</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-xl font-bold mb-3">Context Awareness</h3>
            <p className="text-muted-foreground mb-4">
              The AI remembers your conversation history and portfolio state, allowing for natural back-and-forth discussions.
            </p>
            <Card className="p-4 bg-muted/30">
              <div className="space-y-3 text-sm">
                <div className="flex gap-2">
                  <span className="text-primary">👤</span>
                  <span>"What's my USDC balance?"</span>
                </div>
                <div className="flex gap-2">
                  <Bot className="w-4 h-4 text-purple-400 mt-1" />
                  <span>"You have 1,250 USDC across 3 chains..."</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-primary">👤</span>
                  <span>"Put it all in the highest yield"</span>
                </div>
                <div className="flex gap-2">
                  <Bot className="w-4 h-4 text-purple-400 mt-1" />
                  <span>"I'll deposit your 1,250 USDC in Aave on Polygon (6.2% APY)..."</span>
                </div>
              </div>
            </Card>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-3">Multi-Step Actions</h3>
            <p className="text-muted-foreground mb-4">
              Complex workflows broken down into simple, guided steps with approval at each stage.
            </p>
            <Card className="p-4 bg-muted/30">
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold">1</div>
                  <span>Bridge USDC to Polygon ($0.50)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold">2</div>
                  <span>Approve Aave contract ($0.15)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold">3</div>
                  <span>Deposit in Aave pool ($0.20)</span>
                </div>
                <div className="pt-2 border-t border-border text-primary font-semibold">
                  Total: $0.85 • Est. time: 5 min
                </div>
              </div>
            </Card>
          </div>
        </div>
      </Card>

      <Card className="p-8 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-500/20">
        <h2 className="text-3xl font-bold mb-6">Advanced Capabilities</h2>
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
              <Zap className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold mb-2">Real-Time Data Integration</h3>
              <p className="text-muted-foreground">
                Live APY rates, gas prices, token prices, and liquidity data from multiple chains updated every few seconds.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
              <Shield className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold mb-2">Security First</h3>
              <p className="text-muted-foreground">
                All transactions require explicit wallet approval. The AI suggests strategies but you remain in full control.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
              <BarChart3 className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold mb-2">Personalized Recommendations</h3>
              <p className="text-muted-foreground">
                Suggestions adapt based on your portfolio size, risk profile, transaction history, and stated preferences.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold mb-2">Continuous Learning</h3>
              <p className="text-muted-foreground">
                The AI's knowledge base is regularly updated with new protocols, chains, and DeFi strategies as they emerge.
              </p>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-muted/30">
        <h3 className="text-xl font-bold mb-3">Coming Soon</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-yellow-400">🔜</span>
            <span>Voice commands for hands-free interaction</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-yellow-400">🔜</span>
            <span>Automated portfolio rebalancing</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-yellow-400">🔜</span>
            <span>Tax loss harvesting suggestions</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-yellow-400">🔜</span>
            <span>Multi-signature wallet support</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AIFeatures;
