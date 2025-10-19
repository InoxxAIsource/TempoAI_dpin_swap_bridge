import DocSection from '@/components/docs/DocSection';
import FeatureCard from '@/components/docs/FeatureCard';
import CodeBlock from '@/components/docs/CodeBlock';
import Mermaid from '@/components/docs/Mermaid';
import multiStepDiagram from '@/assets/multi-step-diagram.png';
import { Brain, Zap, TrendingUp, MessageSquare, MousePointerClick, Shield, ArrowRight } from 'lucide-react';

const AIFeatures = () => {
  return (
    <div className="space-y-16">
      {/* Core Features Overview */}
      <DocSection 
        title="Core Features"
        subtitle="More than just a chatbot"
      >
        <div className="text-lg text-muted-foreground leading-relaxed space-y-4 mb-8">
          <p>
            Tempo AI isn't just another chatbot - it's your personal DeFi strategist that actually understands the complexities of cross-chain finance. Built specifically for the Wormhole ecosystem, it helps you navigate the often confusing world of bridging, swapping, and yield farming across multiple blockchains.
          </p>
          <p>
            Think of it as having a knowledgeable friend who's always up-to-date with the best yield opportunities and knows exactly how to move your assets between chains without hitting technical roadblocks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          <FeatureCard
            icon={Brain}
            title="Wormhole-Native Intelligence"
            description="Built-in knowledge of testnet limitations and chain-specific constraints"
          />
          <FeatureCard
            icon={Zap}
            title="Multi-Step Orchestration"
            description="Handles complex bridge + swap flows automatically"
          />
          <FeatureCard
            icon={TrendingUp}
            title="Real-Time Yield Data"
            description="Live DeFi opportunities from DeFi Llama API"
          />
          <FeatureCard
            icon={MessageSquare}
            title="Contextual Conversations"
            description="Remembers your portfolio and preferences"
          />
          <FeatureCard
            icon={MousePointerClick}
            title="One-Click Execution"
            description="Turns advice into actionable transaction cards"
          />
          <FeatureCard
            icon={Shield}
            title="Smart Validation"
            description="Prevents impossible transactions before you try"
          />
        </div>
      </DocSection>

      {/* Why Unique */}
      <DocSection 
        title="Why Tempo AI is Unique"
        subtitle="Built different from the ground up"
      >
        <div className="mb-8">
          <h3 className="text-2xl font-bold mb-4">Problem vs Solution</h3>
          <Mermaid chart={`graph LR
    A[Traditional DeFi] --> B[Manual Research]
    A --> C[Trial & Error]
    A --> D[Dead-End Bridges]
    A --> E[Fragmented UX]
    
    F[Tempo AI] --> G[AI-Powered Research]
    F --> H[Predictive Validation]
    F --> I[Smart Routing]
    F --> J[Unified Experience]
    
    style F fill:#4F46E5,stroke:#312E81,color:#fff
    style A fill:#EF4444,stroke:#991B1B,color:#fff`} />
        </div>

        <div className="space-y-8 mt-12">
          {/* Wormhole Constraint Awareness */}
          <div>
            <h3 className="text-2xl font-bold mb-4">Wormhole Constraint Awareness</h3>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Most AI assistants hallucinate about what's possible. Tempo AI doesn't. It has hardcoded knowledge of Wormhole's testnet capabilities and actively filters out impossible operations.
            </p>
            
            <div className="p-6 rounded-xl border border-border bg-card/50 mb-4">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <span className="text-red-400 text-xl">❌</span>
                  <div>
                    <p className="font-semibold mb-1">Other AIs:</p>
                    <p className="text-muted-foreground">"Just bridge native ETH to Base via Wormhole" (impossible)</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-400 text-xl">✅</span>
                  <div>
                    <p className="font-semibold mb-1">Tempo AI:</p>
                    <p className="text-muted-foreground">"Base can't receive native ETH through Wormhole. Let me show you how to wrap it to WETH first, then bridge."</p>
                  </div>
                </div>
              </div>
            </div>

            <CodeBlock
              filename="Built-in validation logic"
              language="typescript"
              code={`// Wormhole constraint validation
function isValidWormholeYield(protocol, chain, token) {
  // Base cannot receive native ETH via Wormhole
  if (chain === 'Base' && token === 'ETH') return false;
  
  // Solana testnet only supports USDC
  if (chain === 'Solana' && token !== 'USDC') return false;
  
  // Optimism testnet limitations
  if (chain === 'Optimism' && !['USDC', 'WETH'].includes(token)) {
    return false;
  }
  
  return true;
}`}
            />
          </div>

          {/* Multi-Step Intelligence */}
          <div>
            <h3 className="text-2xl font-bold mb-4">Multi-Step Intelligence</h3>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Getting from Point A to Point B in cross-chain DeFi often requires multiple steps. Tempo AI breaks down complex journeys into clear, executable stages.
            </p>

            <div className="my-8 flex justify-center">
              <img 
                src={multiStepDiagram} 
                alt="Multi-Step Intelligence - Tempo AI guides users through complex cross-chain yield strategies"
                className="max-w-full h-auto rounded-xl border border-border bg-card/50 p-6"
              />
            </div>
          </div>

          {/* Execution Card System */}
          <div>
            <h3 className="text-2xl font-bold mb-4">Execution Card System</h3>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Tempo AI doesn't just tell you what to do - it gives you clickable 'Execution Cards' that route you to the exact right interface with pre-filled details.
            </p>

            <div className="p-6 rounded-xl border border-border bg-card/50 mb-6 font-mono text-sm">
              <div className="border border-primary/50 rounded-lg overflow-hidden">
                <div className="bg-primary/10 px-4 py-3 border-b border-primary/50">
                  <p className="font-semibold">🔄 Cross-Chain Yield Strategy</p>
                </div>
                <div className="p-4 space-y-2 bg-card/50">
                  <p><span className="text-muted-foreground">Protocol:</span> Aave on Arbitrum</p>
                  <p><span className="text-muted-foreground">Token:</span> USDC</p>
                  <p><span className="text-muted-foreground">Current Chain:</span> Ethereum</p>
                  <p><span className="text-muted-foreground">Target Chain:</span> Arbitrum</p>
                  <p><span className="text-muted-foreground">Amount:</span> 1000 USDC</p>
                  <p><span className="text-muted-foreground">Est. APY:</span> 4.2%</p>
                  <p><span className="text-muted-foreground">Est. Gas:</span> ~$2.50</p>
                </div>
                <div className="px-4 py-3 border-t border-primary/50 bg-primary/5">
                  <button className="w-full py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
                    Bridge & Deposit
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg border border-border bg-card/50">
                <p className="font-semibold mb-2">Same-Chain Yield</p>
                <p className="text-sm text-muted-foreground">Opens protocol directly</p>
              </div>
              <div className="p-4 rounded-lg border border-border bg-card/50">
                <p className="font-semibold mb-2">Cross-Chain Yield</p>
                <p className="text-sm text-muted-foreground">Routes to Bridge → Protocol</p>
              </div>
              <div className="p-4 rounded-lg border border-border bg-card/50">
                <p className="font-semibold mb-2">Cross-Chain Swap</p>
                <p className="text-sm text-muted-foreground">Opens Wormhole Swap widget</p>
              </div>
            </div>
          </div>
        </div>
      </DocSection>
    </div>
  );
};

export default AIFeatures;
