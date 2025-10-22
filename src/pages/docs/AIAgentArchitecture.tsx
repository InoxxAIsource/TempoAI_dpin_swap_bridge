import DocHero from "@/components/docs/DocHero";
import DocSection from "@/components/docs/DocSection";
import Mermaid from "@/components/docs/Mermaid";
import aiArchitectureLayers from "@/assets/ai-architecture-layers.png";
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { ZoomIn } from 'lucide-react';

const AIAgentArchitecture = () => {
  return (
    <div className="space-y-12">
        <div>
          <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm mb-4">
            <span className="text-primary">Advanced</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">AI Agent Architecture</h1>
          <p className="text-xl text-muted-foreground">
            Deep dive into how AI trading agents work, their components, and cross-chain decision-making with Wormhole.
          </p>
        </div>

      <DocSection title="High-Level Architecture">
        <p className="text-lg mb-6">
          AI trading agents consist of three core layers that work together to analyze markets, 
          make decisions, and execute trades across multiple blockchains.
        </p>

        <Dialog>
          <DialogTrigger asChild>
            <div className="my-8 p-4 rounded-xl border border-border bg-card/50 cursor-pointer hover:border-primary/50 transition-colors relative group">
              <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <ZoomIn className="w-5 h-5" />
              </div>
              <img 
                src={aiArchitectureLayers} 
                alt="AI Agent Architecture - Three layer system showing Decision Engine, Execution Engine, and Monitoring & Feedback" 
                className="w-full h-auto"
              />
            </div>
          </DialogTrigger>
          <DialogContent className="max-w-[95vw] max-h-[95vh] overflow-auto">
            <img 
              src={aiArchitectureLayers} 
              alt="AI Agent Architecture - Zoomed" 
              className="w-full h-auto"
            />
          </DialogContent>
        </Dialog>
      </DocSection>

      <DocSection title="Layer 1: AI Decision Engine">
        <h3 className="text-xl font-semibold mb-4">Data Ingestion Pipeline</h3>
        <p className="mb-4">
          The AI model needs comprehensive market data to make informed decisions:
        </p>

        <Mermaid
          chart={`
graph LR
    A[DeFi Llama API] --> E[Data Aggregator]
    B[Tempo Portfolio API] --> E
    C[Wormhole Status] --> E
    D[Gas Price Oracles] --> E
    E --> F[Normalized Data]
    F --> G[AI Model Input]
    
    style E fill:#8b5cf6
    style G fill:#3b82f6
          `}
        />

        <h3 className="text-xl font-semibold mb-4 mt-8">AI Model Types & Decision Logic</h3>
        
        <div className="space-y-6">
          <div className="border rounded-lg p-6">
            <h4 className="text-lg font-semibold mb-3">LLM-Based Decision Flow</h4>
            <Mermaid
              chart={`
sequenceDiagram
    participant Data as Market Data
    participant LLM as LLM (GPT/Gemini)
    participant Parser as Response Parser
    participant Exec as Executor
    
    Data->>LLM: Formatted prompt with portfolio & yields
    LLM->>LLM: Analyze using reasoning
    LLM->>Parser: JSON decision object
    Parser->>Parser: Validate action feasibility
    Parser->>Exec: Execute: bridge_and_deposit
    Exec->>Exec: Call Wormhole SDK
              `}
            />
          </div>

          <div className="border rounded-lg p-6">
            <h4 className="text-lg font-semibold mb-3">RL Agent Decision Flow</h4>
            <Mermaid
              chart={`
graph TB
    A[State: Portfolio + Market] --> B[RL Policy Network]
    B --> C[Action Distribution]
    C --> D{Sample Action}
    D -->|Bridge| E[Wormhole Transfer]
    D -->|Deposit| F[Protocol Deposit]
    D -->|Hold| G[No Action]
    E --> H[Reward Calculation]
    F --> H
    G --> H
    H --> I[Update Policy]
    I --> B
    
    style B fill:#8b5cf6
    style H fill:#10b981
              `}
            />
          </div>

          <div className="border rounded-lg p-6">
            <h4 className="text-lg font-semibold mb-3">ML Classifier Decision Flow</h4>
            <Mermaid
              chart={`
graph LR
    A[Current Opportunities] --> B[Feature Engineering]
    B --> C[ML Classifier]
    C --> D[Profitability Scores]
    D --> E[Rank Opportunities]
    E --> F[Select Best Action]
    F --> G[Execute via Wormhole]
    
    style C fill:#8b5cf6
    style G fill:#3b82f6
              `}
            />
          </div>
        </div>
      </DocSection>

      <DocSection title="Layer 2: Execution Engine">
        <h3 className="text-xl font-semibold mb-4">Wormhole Integration Pattern</h3>
        <p className="mb-6">
          All agent types use the same execution pattern for cross-chain operations:
        </p>

        <Mermaid
          chart={`
sequenceDiagram
    participant Agent as AI Agent
    participant WH as Wormhole SDK
    participant Source as Source Chain
    participant Dest as Destination Chain
    participant Protocol as DeFi Protocol
    
    Agent->>WH: bridge(token, amount, chains)
    WH->>Source: Lock tokens
    Source->>WH: Emit LogMessage
    WH->>WH: Generate VAA
    WH->>Dest: Submit VAA
    Dest->>Agent: Bridged tokens received
    Agent->>Protocol: deposit(token, amount)
    Protocol->>Agent: Return aToken/receipt
          `}
        />

        <h3 className="text-xl font-semibold mb-4 mt-8">Multi-Protocol Execution</h3>
        <p className="mb-4">
          After bridging, agents can interact with multiple DeFi protocols:
        </p>

        <Mermaid
          chart={`
graph TB
    A[Bridged Assets] --> B{Agent Decision}
    B -->|Lending| C[Aave/Compound]
    B -->|LP| D[Uniswap V3]
    B -->|Staking| E[Lido]
    B -->|Stablecoin| F[Curve]
    
    C --> G[Monitor Position]
    D --> G
    E --> G
    F --> G
    
    G --> H{Rebalance Needed?}
    H -->|Yes| I[Withdraw + Bridge]
    H -->|No| J[Continue Earning]
    
    I --> A
    
    style B fill:#8b5cf6
    style G fill:#10b981
          `}
        />
      </DocSection>

      <DocSection title="Layer 3: Monitoring & Feedback">
        <h3 className="text-xl font-semibold mb-4">Performance Tracking Loop</h3>
        
        <Mermaid
          chart={`
graph TB
    A[Execute Action] --> B[Transaction Monitor]
    B --> C{Status?}
    C -->|Pending| D[Check VAA Status]
    C -->|Confirmed| E[Calculate ROI]
    C -->|Failed| F[Log Error]
    
    D --> G[Wait for Bridge]
    G --> C
    
    E --> H[Update Metrics]
    H --> I[Performance Dashboard]
    
    F --> J[Alert Agent]
    
    I --> K{Threshold Met?}
    K -->|Yes| L[Continue Strategy]
    K -->|No| M[Trigger Rebalance]
    
    M --> N[New Decision Cycle]
    L --> O[Schedule Next Run]
    
    style E fill:#10b981
    style F fill:#ef4444
    style H fill:#3b82f6
          `}
        />

        <h3 className="text-xl font-semibold mb-4 mt-8">Key Performance Metrics</h3>
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="border rounded-lg p-4">
            <h4 className="font-semibold mb-2">Return Metrics</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Realized APY (actual earnings)</li>
              <li>Unrealized APY (current positions)</li>
              <li>Gas costs as % of profits</li>
              <li>Bridge costs as % of profits</li>
            </ul>
          </div>
          <div className="border rounded-lg p-4">
            <h4 className="font-semibold mb-2">Operational Metrics</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Decision latency (time to execute)</li>
              <li>Bridge success rate</li>
              <li>Failed transaction rate</li>
              <li>Rebalancing frequency</li>
            </ul>
          </div>
        </div>
      </DocSection>

      <DocSection title="Agent State Management">
        <h3 className="text-xl font-semibold mb-4">State Flow Diagram</h3>
        
        <Mermaid
          chart={`
stateDiagram-v2
    [*] --> Idle
    Idle --> FetchingData: Scheduled trigger
    FetchingData --> Analyzing: Data ready
    Analyzing --> Planning: Decision made
    Planning --> Executing: Action plan ready
    
    Executing --> Bridging: Cross-chain needed
    Executing --> Depositing: Same chain operation
    
    Bridging --> WaitingForVAA: Bridge initiated
    WaitingForVAA --> Claiming: VAA available
    Claiming --> Depositing: Claim successful
    
    Depositing --> Monitoring: Deposit confirmed
    Monitoring --> Idle: Position active
    
    Analyzing --> Idle: No action needed
    
    Executing --> Error: Transaction failed
    Error --> Idle: Logged & alerted
          `}
        />
      </DocSection>

      <DocSection title="Scalability Architecture">
        <h3 className="text-xl font-semibold mb-4">Multi-Agent System Design</h3>
        <p className="mb-6">
          Advanced users can deploy multiple specialized agents that coordinate:
        </p>

        <Mermaid
          chart={`
graph TB
    subgraph "Coordinator Agent"
        A[Master Strategy]
    end
    
    subgraph "Specialized Agents"
        B[Stablecoin Agent]
        C[ETH Agent]
        D[LP Agent]
        E[Arbitrage Agent]
    end
    
    A --> B
    A --> C
    A --> D
    A --> E
    
    B --> F[Ethereum]
    B --> G[Arbitrum]
    C --> H[Optimism]
    C --> I[Base]
    D --> J[Polygon]
    E --> F
    E --> G
    
    style A fill:#8b5cf6
    style B fill:#3b82f6
    style C fill:#3b82f6
    style D fill:#3b82f6
    style E fill:#3b82f6
          `}
        />

        <p className="mt-6 text-muted-foreground">
          Each agent specializes in a specific asset class or strategy, coordinated by a master 
          agent that manages overall portfolio allocation and risk.
        </p>
      </DocSection>

      <DocSection title="Security Architecture">
        <h3 className="text-xl font-semibold mb-4">Multi-Layer Security Model</h3>
        
        <div className="space-y-4">
          <div className="border rounded-lg p-4">
            <h4 className="font-semibold mb-2">1. Key Management Layer</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Private keys stored in encrypted vaults (AWS KMS, HashiCorp Vault)</li>
              <li>Transaction signing happens in isolated environment</li>
              <li>Hot wallet limits enforced (e.g., max $10k in agent wallet)</li>
            </ul>
          </div>

          <div className="border rounded-lg p-4">
            <h4 className="font-semibold mb-2">2. Decision Validation Layer</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Sanity checks before execution (reasonable amounts, valid protocols)</li>
              <li>Slippage protection (max 1% deviation from expected)</li>
              <li>Rate limiting (max 1 action per 10 minutes)</li>
            </ul>
          </div>

          <div className="border rounded-lg p-4">
            <h4 className="font-semibold mb-2">3. Monitoring Layer</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Real-time alerts for unusual activity</li>
              <li>Emergency stop mechanism (pause all agents)</li>
              <li>Audit logging of all decisions and transactions</li>
            </ul>
          </div>
        </div>
      </DocSection>

      <DocSection title="Next Steps">
        <p className="mb-6">
          Now that you understand the architecture, explore specific AI model implementations:
        </p>
        
        <div className="flex gap-4">
          <a 
            href="/docs/ai-agent/ai-models" 
            className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Explore AI Models →
          </a>
          <a 
            href="/docs/ai-agent/wormhole" 
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-6 py-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
          >
            Wormhole Integration →
          </a>
        </div>
      </DocSection>
    </div>
  );
};

export default AIAgentArchitecture;
