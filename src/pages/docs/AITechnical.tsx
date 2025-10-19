import DocSection from '@/components/docs/DocSection';
import CodeBlock from '@/components/docs/CodeBlock';
import diagramTempo from '@/assets/diagram_tempo.png';

const AITechnical = () => {
  return (
    <div className="space-y-16">
      {/* Complete Workflow */}
      <DocSection 
        title="Complete Workflow"
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

      {/* Technical Deep Dive */}
      <DocSection 
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
    </div>
  );
};

export default AITechnical;
