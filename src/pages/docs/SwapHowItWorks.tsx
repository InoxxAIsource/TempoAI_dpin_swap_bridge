import DocSection from '@/components/docs/DocSection';
import Mermaid from '@/components/docs/Mermaid';
import TransactionFlowDiagram from '@/components/docs/bridge-swap/TransactionFlowDiagram';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Zap, Network, TrendingUp, Lock } from 'lucide-react';

const SwapHowItWorks = () => {
  const routeOptimizationChart = `
graph TD
    A[User Swaps ETH → USDC<br/>Ethereum → Polygon] --> B[Wormhole Connect]
    
    B --> C{Route Optimizer}
    
    C --> D[Check DEX 1: Uniswap]
    C --> E[Check DEX 2: Curve]
    C --> F[Check DEX 3: 1inch]
    C --> G[Check DEX 4: Native Bridge + Swap]
    
    D --> H[Quote: 1 ETH = 2,490 USDC<br/>Fee: 0.3%]
    E --> I[Quote: 1 ETH = 2,495 USDC<br/>Fee: 0.04%]
    F --> J[Quote: 1 ETH = 2,498 USDC<br/>Fee: 0.25%]
    G --> K[Quote: 1 ETH = 2,485 USDC<br/>Fee: 0.5%]
    
    H --> L{Best Rate?}
    I --> L
    J --> L
    K --> L
    
    L -->|Winner: 1inch| M[Execute via 1inch<br/>on Polygon]
    
    M --> N[User receives 2,498 USDC]
    
    style M fill:#90EE90
    style N fill:#90EE90
`;

  const architectureChart = `
graph TD
    A[User Wallet] -->|1. Approve & Initiate| B[Wormhole Connect Widget]
    
    B -->|2. Lock/Burn Source Token| C[Source Chain Contract]
    
    C -->|3. Emit Event| D[Guardian Network]
    D -->|4. Sign VAA| E[Wormhole Core]
    
    E -->|5. Route to DEX Aggregator| F[Destination DEX Aggregator]
    
    F -->|6. Query Multiple DEXs| G[DEX 1]
    F -->|6. Query Multiple DEXs| H[DEX 2]
    F -->|6. Query Multiple DEXs| I[DEX 3]
    
    G -->|7. Return Quote| F
    H -->|7. Return Quote| F
    I -->|7. Return Quote| F
    
    F -->|8. Select Best Route| J[Optimal DEX]
    
    J -->|9. Execute Swap| K[Destination Chain]
    K -->|10. Transfer Tokens| A
    
    style F fill:#FFD700
    style J fill:#90EE90
`;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Swap: How It Works</h1>
        <p className="text-xl text-muted-foreground">
          Technical deep dive into atomic swaps, route optimization, DEX aggregation, and automatic execution
        </p>
      </div>

      <DocSection
        id="overview"
        title="Technical Architecture"
        subtitle="How Wormhole Connect enables atomic swaps"
      >
        <p className="text-lg mb-6">
          Cross-chain swap combines three distinct technologies:
        </p>

        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Network className="h-5 w-5 text-primary" />
                Wormhole Bridge
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p className="mb-2">
                Secure message passing between blockchains, verified by 19 guardian validators (13/19 consensus required).
              </p>
              <p className="text-xs">
                Same security model as traditional bridging - your tokens are locked/burned on source and unlocked/minted 
                on destination after guardian validation.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="h-5 w-5 text-primary" />
                DEX Aggregation
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p className="mb-2">
                Routes your swap through the best available decentralized exchange (Uniswap, Curve, 1inch, etc.) 
                on the destination chain.
              </p>
              <p className="text-xs">
                Real-time price comparison ensures you get the best rate without manually checking multiple DEXs.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Zap className="h-5 w-5 text-primary" />
                Atomic Execution
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p className="mb-2">
                The entire flow (bridge + swap) is executed automatically after you sign one transaction. No manual claiming.
              </p>
              <p className="text-xs">
                The VAA (guardian-signed proof) is automatically submitted to the destination DEX smart contract, 
                which verifies it and executes the swap in a single on-chain transaction.
              </p>
            </CardContent>
          </Card>
        </div>
      </DocSection>

      <DocSection
        id="transaction-flow"
        title="Complete Transaction Flow"
        subtitle="Step-by-step breakdown with visual diagrams"
      >
        <TransactionFlowDiagram />

        <div className="mt-8 space-y-6">
          <div>
            <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
              <span className="bg-primary/20 text-primary px-2 py-1 rounded text-sm">Step 1</span>
              User Initiates Swap on Source Chain
            </h3>
            <p className="text-muted-foreground mb-3">
              You sign a transaction approving the Wormhole Connect contract to spend your source tokens. This transaction:
            </p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Locks your tokens in the source chain contract (or burns them if they're Wormhole-wrapped)</li>
              <li>Encodes swap parameters: destination chain, target token, recipient address, slippage tolerance</li>
              <li>Emits an event that guardians monitor</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
              <span className="bg-primary/20 text-primary px-2 py-1 rounded text-sm">Step 2</span>
              Guardian Observation & VAA Generation
            </h3>
            <p className="text-muted-foreground mb-3">
              All 19 Wormhole guardians independently verify your transaction. Once 13 agree it's valid, they collectively 
              sign a VAA (Verified Action Approval) that includes:
            </p>
            <div className="bg-muted/50 p-4 rounded-lg text-sm">
              <ul className="space-y-1">
                <li>• Source chain ID and transaction hash</li>
                <li>• Token locked (type and amount)</li>
                <li>• Destination chain and target token</li>
                <li>• Recipient address</li>
                <li>• Unique nonce (prevents replay attacks)</li>
                <li>• 13+ guardian signatures</li>
              </ul>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
              <span className="bg-primary/20 text-primary px-2 py-1 rounded text-sm">Step 3</span>
              Automatic Route Selection (DEX Aggregation)
            </h3>
            <p className="text-muted-foreground mb-3">
              Once the VAA is ready, Wormhole Connect's DEX aggregator queries multiple decentralized exchanges on the 
              destination chain to find the best swap route. This happens automatically without user intervention.
            </p>
            <Alert>
              <AlertDescription>
                <strong>Real-time Optimization:</strong> The aggregator considers liquidity depth, slippage, fees, 
                and price impact across all available DEXs. It may even split your swap across multiple DEXs for 
                optimal execution.
              </AlertDescription>
            </Alert>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
              <span className="bg-primary/20 text-primary px-2 py-1 rounded text-sm">Step 4</span>
              Swap Execution on Destination Chain
            </h3>
            <p className="text-muted-foreground mb-3">
              The aggregator submits the VAA to the selected DEX's smart contract. This contract:
            </p>
            <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
              <li>Verifies the 13 guardian signatures on the VAA</li>
              <li>Checks the VAA hasn't been used before (replay protection)</li>
              <li>Unlocks/mints the bridged tokens to itself (temporary custody)</li>
              <li>Executes the swap through the optimal DEX(s)</li>
              <li>Transfers the swapped tokens directly to your recipient address</li>
            </ol>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
              <span className="bg-primary/20 text-primary px-2 py-1 rounded text-sm">Step 5</span>
              Tokens Delivered Automatically
            </h3>
            <p className="text-muted-foreground">
              Your swapped tokens arrive in your wallet on the destination chain. No claiming, no wallet switching, 
              no additional transactions required. The entire process from initiation to delivery typically takes 
              5-20 minutes depending on source chain finality.
            </p>
          </div>
        </div>
      </DocSection>

      <DocSection
        id="route-optimization"
        title="Route Optimization Algorithm"
        subtitle="How the best swap route is selected"
      >
        <Mermaid chart={routeOptimizationChart} />

        <div className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Multi-DEX Quote Comparison</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-3">
              <p>
                When you initiate a swap, the aggregator simultaneously queries multiple DEXs on the destination chain:
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li><strong>Uniswap V2/V3:</strong> Large liquidity pools, standard 0.3% fee (or 0.05%/1% for V3)</li>
                <li><strong>Curve:</strong> Optimized for stablecoin swaps, very low slippage (0.04% fee)</li>
                <li><strong>1inch:</strong> Meta-aggregator that checks other DEXs and optimizes routes</li>
                <li><strong>SushiSwap:</strong> Alternative AMM with competitive fees</li>
                <li><strong>Balancer:</strong> Multi-token pools with customizable fees</li>
              </ul>
              <p className="mt-3">
                Each DEX returns a quote: <em>"I can swap X amount of token A for Y amount of token B with Z slippage."</em> 
                The aggregator selects the quote that gives you the most destination tokens.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Slippage and Price Impact</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-3">
              <p>
                <strong>Slippage:</strong> The difference between expected price and executed price due to market movement 
                during your transaction. You set slippage tolerance (e.g., 1%) to protect against unfavorable execution.
              </p>
              <p>
                <strong>Price Impact:</strong> The effect of your trade size on the market price. Large trades in low-liquidity 
                pools cause higher price impact (worse rate). The aggregator factors this into route selection.
              </p>
              <div className="bg-muted/50 p-3 rounded-lg mt-3">
                <p className="text-xs">
                  <strong>Example:</strong> Swapping 1 ETH might have 0.1% price impact on Uniswap's deep ETH/USDC pool, 
                  but 2% on a smaller DEX. The aggregator chooses Uniswap despite slightly higher fees because net output is better.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Split Routing (Advanced)</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-3">
              <p>
                For large swaps, the aggregator may split your order across multiple DEXs to minimize price impact:
              </p>
              <div className="bg-muted/50 p-3 rounded-lg">
                <p className="text-xs mb-2">
                  <strong>Example:</strong> Swapping 10 ETH for USDC might be split as:
                </p>
                <ul className="text-xs space-y-1 ml-4">
                  <li>• 6 ETH via Uniswap V3 (deepest liquidity, 0.05% fee)</li>
                  <li>• 4 ETH via Curve (lower slippage for remainder)</li>
                </ul>
                <p className="text-xs mt-2">
                  This results in better overall execution than routing all 10 ETH through a single pool.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </DocSection>

      <DocSection
        id="system-architecture"
        title="Full System Architecture"
        subtitle="How all components work together"
      >
        <Mermaid chart={architectureChart} />

        <div className="grid md:grid-cols-2 gap-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-primary" />
                Security Layers
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <div>
                <strong className="text-foreground">1. Guardian Consensus:</strong>
                <p>13/19 threshold signature scheme prevents single-point-of-failure attacks</p>
              </div>
              <div>
                <strong className="text-foreground">2. VAA Verification:</strong>
                <p>Destination contracts cryptographically verify all 13+ signatures before execution</p>
              </div>
              <div>
                <strong className="text-foreground">3. Replay Protection:</strong>
                <p>Each VAA has a unique nonce and can only be used once</p>
              </div>
              <div>
                <strong className="text-foreground">4. Smart Contract Audits:</strong>
                <p>All DEXs integrated have been audited by top security firms</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Performance Optimizations</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <div>
                <strong className="text-foreground">Parallel Quote Fetching:</strong>
                <p>All DEXs are queried simultaneously for fastest route selection</p>
              </div>
              <div>
                <strong className="text-foreground">Gas Optimization:</strong>
                <p>Smart contract interactions are batched to minimize total gas cost</p>
              </div>
              <div>
                <strong className="text-foreground">Failover Mechanisms:</strong>
                <p>If one DEX route fails, the system automatically retries with the next-best option</p>
              </div>
              <div>
                <strong className="text-foreground">Caching:</strong>
                <p>Recent price quotes are cached to speed up estimation and display</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </DocSection>

      <DocSection
        id="comparison"
        title="Swap vs Bridge: Key Differences"
        subtitle="Understanding when to use each"
      >
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3">Feature</th>
                <th className="text-left p-3 bg-blue-500/10">Traditional Bridge</th>
                <th className="text-left p-3 bg-green-500/10">Cross-Chain Swap</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <tr className="border-b">
                <td className="p-3 font-semibold">User Actions</td>
                <td className="p-3 bg-blue-500/5">Manual claiming required</td>
                <td className="p-3 bg-green-500/5">Fully automatic</td>
              </tr>
              <tr className="border-b">
                <td className="p-3 font-semibold">Wallet Switching</td>
                <td className="p-3 bg-blue-500/5">Yes, must switch to destination</td>
                <td className="p-3 bg-green-500/5">No, stays on source</td>
              </tr>
              <tr className="border-b">
                <td className="p-3 font-semibold">Destination Gas</td>
                <td className="p-3 bg-blue-500/5">Required (user pays)</td>
                <td className="p-3 bg-green-500/5">Not required</td>
              </tr>
              <tr className="border-b">
                <td className="p-3 font-semibold">Token Output</td>
                <td className="p-3 bg-blue-500/5">Same token on new chain</td>
                <td className="p-3 bg-green-500/5">Different token (swapped)</td>
              </tr>
              <tr className="border-b">
                <td className="p-3 font-semibold">Total Time</td>
                <td className="p-3 bg-blue-500/5">5-20 min + user claim time</td>
                <td className="p-3 bg-green-500/5">5-20 min (fully automated)</td>
              </tr>
              <tr className="border-b">
                <td className="p-3 font-semibold">Fees</td>
                <td className="p-3 bg-blue-500/5">Bridge fee + source gas + dest gas</td>
                <td className="p-3 bg-green-500/5">Bridge fee + source gas + swap fee</td>
              </tr>
              <tr className="border-b">
                <td className="p-3 font-semibold">Use Case</td>
                <td className="p-3 bg-blue-500/5">Moving same asset to another chain</td>
                <td className="p-3 bg-green-500/5">Converting token type + chain</td>
              </tr>
            </tbody>
          </table>
        </div>
      </DocSection>

      <DocSection
        id="next-steps"
        title="Next Steps"
      >
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-6 rounded-lg">
          <h3 className="font-semibold text-lg mb-4">Continue Learning:</h3>
          <ul className="space-y-2">
            <li>
              <a href="/docs/swap/best-practices" className="text-primary hover:underline font-medium">
                → Swap Best Practices
              </a>
              <span className="text-muted-foreground ml-2">
                Learn optimization strategies, security tips, and how to minimize costs
              </span>
            </li>
            <li>
              <a href="/swap" className="text-primary hover:underline font-medium">
                → Try Swapping
              </a>
              <span className="text-muted-foreground ml-2">
                Start your first cross-chain swap (testnet recommended)
              </span>
            </li>
          </ul>
        </div>
      </DocSection>
    </div>
  );
};

export default SwapHowItWorks;
