import PageLayout from '@/components/layout/PageLayout';
import DocHero from '@/components/docs/DocHero';
import DocSection from '@/components/docs/DocSection';
import CodeBlock from '@/components/docs/CodeBlock';
import FeatureCard from '@/components/docs/FeatureCard';
import UseCaseCard from '@/components/docs/UseCaseCard';
import Mermaid from '@/components/docs/Mermaid';
import diagramTempo from '@/assets/diagram_tempo.png';
import multiStepDiagram from '@/assets/multi-step-diagram.png';
import { Brain, Zap, TrendingUp, MessageSquare, MousePointerClick, Shield, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Docs = () => {
  const navigate = useNavigate();

  return (
    <PageLayout showFooter={true}>
      <DocHero />
      
      <div className="max-w-6xl mx-auto px-6 md:px-12 py-12">
        {/* What is Tempo AI */}
        <DocSection 
          id="what-is-tempo" 
          title="What is Tempo AI?"
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
          id="why-unique" 
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
            <div>
              <h3 className="text-2xl font-bold mb-4">A. Wormhole Constraint Awareness</h3>
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

            <div>
              <h3 className="text-2xl font-bold mb-4">B. Multi-Step Intelligence</h3>
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

            <div>
              <h3 className="text-2xl font-bold mb-4">C. Execution Card System</h3>
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

        {/* How It Works */}
        <DocSection 
          id="how-it-works" 
          title="How It Works: Complete Workflow"
          subtitle="Behind the scenes of every conversation"
        >
          <div className="my-8 flex justify-center">
            <img 
              src={diagramTempo} 
              alt="Complete Workflow - Behind the scenes of every conversation"
              className="max-w-full h-auto rounded-xl border border-border bg-card/50 p-6"
            />
          </div>

          <div className="space-y-8 mt-12">
            {[
              {
                step: "Step 1: User Input & Context Gathering",
                description: "When you send a message, Tempo AI first checks if you have a connected wallet. If yes, it fetches your portfolio data - balances across all chains, pending transactions, and historical yield positions. This context makes responses incredibly personalized."
              },
              {
                step: "Step 2: Intelligent Query Detection",
                description: "The AI analyzes your question to detect if you're asking about yield opportunities, cross-chain transfers, swap rates, or general DeFi guidance. If it's yield-related, it triggers a real-time fetch from DeFi Llama's API."
              },
              {
                step: "Step 3: Wormhole Validation Filter",
                description: "This is the secret sauce. Before showing you any yield opportunity, the system runs it through isValidWormholeYield() to ensure the chain is supported on Wormhole testnet, the token can actually be bridged, and the protocol is accessible from your current position. Invalid options are silently filtered out - you only see what's actually achievable."
              },
              {
                step: "Step 4: Response Generation",
                description: "The AI crafts a conversational response that acknowledges your situation, explains the best path forward, highlights any blockers (e.g., 'You need to wrap ETH first'), and provides APY estimates and risk assessments."
              },
              {
                step: "Step 5: Execution Cards",
                description: "If the response involves an action, Tempo AI automatically generates an Execution Card with pre-filled transaction details, gas estimates, execution time estimates, and one-click routing to the right interface."
              },
              {
                step: "Step 6: Transaction Tracking",
                description: "When you execute an action through Wormhole widgets, the transaction is logged to the database with transaction hash, source/destination chains, token amounts, status (pending/completed), and redemption requirements. This enables the 'Claim' feature and portfolio tracking."
              },
              {
                step: "Step 7: Follow-Up Prompts",
                description: "After each AI response, 4 contextual follow-up prompts appear inline. These adapt based on your last question, your portfolio state, and market conditions. They help you explore related topics without typing."
              }
            ].map((item, idx) => (
              <div key={idx} className="p-6 rounded-xl border border-border bg-card/50">
                <h4 className="text-xl font-semibold mb-3">{item.step}</h4>
                <p className="text-muted-foreground leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </DocSection>

        {/* Real-World Use Cases */}
        <DocSection 
          id="use-cases" 
          title="Real-World Use Cases"
          subtitle="See Tempo AI in action"
        >
          <UseCaseCard
            title="Case Study 1: Simple Yield Hunt"
            userQuery="Show me the best USDC yields"
            steps={[
              "Scans 50+ protocols",
              "Filters for USDC stablecoin yields",
              "Validates Wormhole compatibility",
              "Ranks by APY",
              "Shows top 3 with execution cards"
            ]}
            result="User deposits to Aave on Optimism with 5.2% APY in 2 clicks"
          />

          <UseCaseCard
            title="Case Study 2: Complex Multi-Chain Journey"
            userQuery="I have ETH on Ethereum, want to earn with WSOL on Solana"
            steps={[
              "Detects: Source = ETH on Ethereum",
              "Detects: Target = WSOL yield on Solana",
              "Problem: Can't directly bridge ETH to Solana (not supported)",
              "Solution: Multi-step path",
              "  ├─ Step 1: Swap ETH → USDC on Ethereum",
              "  ├─ Step 2: Bridge USDC to Solana (Wormhole)",
              "  ├─ Step 3: Swap USDC → WSOL on Solana",
              "  └─ Step 4: Deposit WSOL to yield protocol",
              "Generates 4 sequential execution cards"
            ]}
            result="Guided step-by-step with zero manual research"
          />
        </DocSection>

        {/* Technical Deep Dive */}
        <DocSection 
          id="technical" 
          title="Technical Deep Dive"
          subtitle="For developers building on Wormhole"
        >
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">Component 1: AI Edge Function</h3>
              <CodeBlock
                filename="supabase/functions/ai-defi-assistant/index.ts"
                language="typescript"
                code={`// Server-side Deno function
// Purpose: Process chat messages, fetch yields, stream AI responses

Key Features:
- Portfolio-aware prompting
- Wormhole constraint injection
- Real-time yield data integration
- Streaming SSE responses
- Gemini 2.5 Flash integration`}
              />
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-4">Component 2: Chat Interface</h3>
              <CodeBlock
                filename="src/components/chat/ChatInterface.tsx"
                language="typescript"
                code={`// Frontend React component
// Purpose: Main chat UI with message rendering

Key Features:
- Real-time message streaming
- Dynamic follow-up prompts (rotating based on context)
- Execution card rendering
- Portfolio context provider
- Conversation persistence`}
              />
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-4">Component 3: Execution Cards</h3>
              <CodeBlock
                filename="src/components/chat/ExecutionCard.tsx"
                language="typescript"
                code={`// Frontend React component
// Purpose: Actionable transaction cards

Key Features:
- Smart routing (bridge/swap/yield)
- Gas estimation display
- Wallet connection validation
- Protocol URL generation
- Pre-filled transaction details`}
              />
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-4">Component 4: Wormhole Widgets</h3>
              <CodeBlock
                filename="src/components/bridge/ & src/components/swap/"
                language="typescript"
                code={`// WormholeConnectWidget.tsx & WormholeSwapWidget.tsx
// Purpose: Embedded Wormhole SDK interfaces

Key Features:
- Transaction event listeners
- Supabase logging integration
- RPC health monitoring
- Custom theming
- Multi-wallet support (EVM + Solana)`}
              />
            </div>
          </div>
        </DocSection>

        {/* Wormhole Builder Program */}
        <DocSection 
          id="builder-program" 
          title="Wormhole Builder Program Alignment"
          subtitle="Why this matters for the Wormhole ecosystem"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-xl border border-border bg-card/50">
              <h4 className="text-xl font-semibold mb-3">1. User Adoption Accelerator</h4>
              <p className="text-muted-foreground leading-relaxed">
                Cross-chain UX is notoriously complex. Tempo AI abstracts away manual chain/token compatibility research, multi-step transaction planning, gas estimation calculations, and protocol discovery. This lowers the barrier for non-technical users to leverage Wormhole, expanding the addressable market.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-border bg-card/50">
              <h4 className="text-xl font-semibold mb-3">2. Testnet Feedback Generator</h4>
              <p className="text-muted-foreground leading-relaxed">
                By logging every interaction and transaction, Tempo AI creates a rich dataset showing common user pain points, most-requested but unsupported routes, RPC reliability issues, and UX friction areas. This feedback loop helps Wormhole prioritize mainnet improvements.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-border bg-card/50">
              <h4 className="text-xl font-semibold mb-3">3. Developer Education Tool</h4>
              <p className="text-muted-foreground leading-relaxed">
                The execution cards and multi-step workflows serve as living documentation for how to properly integrate Wormhole: correct API usage patterns, error handling strategies, transaction lifecycle management, and cross-chain state synchronization. Other builders can learn by studying Tempo's architecture.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-border bg-card/50">
              <h4 className="text-xl font-semibold mb-3">4. Ecosystem Showcasing</h4>
              <p className="text-muted-foreground leading-relaxed">
                Tempo AI integrates multiple DeFi protocols (Aave, Compound, Curve) accessible through Wormhole, demonstrating real yield opportunities across chains, practical use cases beyond simple transfers, composability of Wormhole with existing DeFi, and value proposition of cross-chain liquidity.
              </p>
            </div>
          </div>
        </DocSection>

        {/* Get Started */}
        <DocSection 
          id="get-started" 
          title="Get Started"
          subtitle="Try Tempo AI now"
        >
          <div className="p-8 rounded-xl border border-primary/50 bg-primary/5">
            <h4 className="text-2xl font-bold mb-6">Try Tempo AI Now:</h4>
            <ol className="space-y-3 mb-8 text-lg">
              <li className="flex items-start gap-3">
                <span className="font-bold text-primary">1.</span>
                <span>Click "AI Assistant" in the navigation</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="font-bold text-primary">2.</span>
                <span>Connect your wallet (EVM and/or Solana)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="font-bold text-primary">3.</span>
                <span>Ask: "What are the best yields for USDC?"</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="font-bold text-primary">4.</span>
                <span>Follow the execution cards to earn</span>
              </li>
            </ol>

            <Button 
              size="lg" 
              onClick={() => navigate('/chat')}
              className="w-full md:w-auto"
            >
              Open AI Assistant
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          <div className="mt-8">
            <h4 className="text-xl font-bold mb-4">Example Prompts to Try:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                "Show me cross-chain opportunities for my portfolio",
                "How do I bridge USDC from Ethereum to Arbitrum?",
                "What's the safest yield strategy for beginners?",
                "Explain how Wormhole swap works"
              ].map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => navigate('/chat')}
                  className="p-4 text-left rounded-lg border border-border bg-card/50 hover:bg-card hover:border-primary/50 transition-all"
                >
                  <p className="text-sm text-muted-foreground">"{prompt}"</p>
                </button>
              ))}
            </div>
          </div>
        </DocSection>
      </div>
    </PageLayout>
  );
};

export default Docs;
