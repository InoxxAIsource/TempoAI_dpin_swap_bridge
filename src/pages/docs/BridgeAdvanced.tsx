import DocSection from '@/components/docs/DocSection';
import TroubleshootingAccordion from '@/components/docs/bridge-swap/TroubleshootingAccordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Zap, Repeat, FileText, History, Settings, AlertTriangle } from 'lucide-react';

const BridgeAdvanced = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Bridge: Advanced Features</h1>
        <p className="text-xl text-muted-foreground">
          Optimize your bridging with fee estimation, batch operations, AI integration, and expert troubleshooting
        </p>
      </div>

      <DocSection
        id="fee-estimation"
        title="Fee Estimation System"
        subtitle="Understand costs before you bridge"
      >
        <p className="text-lg mb-6">
          Tempo Bridge includes a real-time fee estimator that calculates total costs across all three components 
          (bridge fee, source gas, destination gas) before you commit to a transaction.
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                How It Works
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-3">
              <p>
                The estimator calls the <code className="bg-muted px-1 rounded">estimate-bridge-fees</code> edge 
                function, which:
              </p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Calculates bridge fee (0.1% of amount)</li>
                <li>Fetches current gas prices from both chains</li>
                <li>Estimates gas units needed for approval, transfer, and claim</li>
                <li>Converts all costs to USD for easy comparison</li>
              </ol>
              <Alert className="mt-3">
                <AlertDescription>
                  <strong>Logged to Database:</strong> Every estimate is stored so you can review historical costs 
                  and optimize your bridging strategy.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Using the Estimator</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-3">
              <ol className="list-decimal list-inside space-y-2">
                <li>Select your source chain, destination chain, and token</li>
                <li>Enter the amount you want to bridge</li>
                <li>Click <strong>"Estimate Fees"</strong> button</li>
                <li>Review the breakdown: bridge fee, source gas, destination gas, total</li>
                <li>Decide if the cost is acceptable for your transfer size</li>
              </ol>
              <div className="bg-muted/50 p-3 rounded-lg mt-3">
                <p className="text-xs">
                  <strong>Pro Tip:</strong> For small amounts (&lt;$100), bridge to Layer 2s (Arbitrum, Optimism, Base) 
                  to minimize percentage cost. For large amounts (&gt;$10k), even Ethereum mainnet is cost-efficient.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </DocSection>

      <DocSection
        id="gas-alerts"
        title="Gas Alert Monitoring"
        subtitle="Never get stuck without destination gas"
      >
        <p className="text-lg mb-6">
          The Gas Alert Card automatically detects if you have insufficient native tokens on the destination chain 
          to complete your claim transaction. It displays warnings and suggests actions before you initiate a bridge.
        </p>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              How Gas Alerts Help
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm text-muted-foreground">
              <div>
                <strong className="text-foreground">Before Bridging:</strong>
                <p>
                  When you select a destination chain, Tempo checks your wallet balance for that chain's native token. 
                  If you have &lt;$1 worth, a warning appears suggesting you obtain gas tokens first.
                </p>
              </div>
              <div>
                <strong className="text-foreground">After Bridging:</strong>
                <p>
                  If your bridge transaction completes but you still lack destination gas, the Monitoring Panel shows 
                  a persistent alert with links to faucets (testnet) or DEXs/bridges (mainnet).
                </p>
              </div>
              <Alert className="mt-3">
                <AlertDescription>
                  <strong>Recommendation:</strong> Always obtain a small amount of destination gas BEFORE bridging. 
                  For example, get 0.01 MATIC on Polygon before bridging there, so you can claim immediately.
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>
      </DocSection>

      <DocSection
        id="token-wrapping"
        title="Token Wrapping Helper"
        subtitle="Convert between native and wrapped tokens"
      >
        <p className="text-lg mb-6">
          Some DeFi protocols require wrapped tokens (like WETH instead of ETH), while others work better with native 
          tokens. Tempo Bridge includes a Token Wrap Helper to convert between the two.
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Repeat className="h-5 w-5 text-primary" />
                Supported Conversions
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <ul className="space-y-2">
                <li>
                  <strong>ETH ↔ WETH:</strong> On Ethereum, Arbitrum, Optimism, Base, Aurora
                </li>
                <li>
                  <strong>MATIC ↔ WMATIC:</strong> On Polygon
                </li>
                <li>
                  <strong>AVAX ↔ WAVAX:</strong> On Avalanche
                </li>
                <li>
                  <strong>BNB ↔ WBNB:</strong> On BNB Chain
                </li>
                <li>
                  <strong>FTM ↔ WFTM:</strong> On Fantom
                </li>
              </ul>
              <p className="mt-3 text-xs">
                Wrapping is a 1:1 process (no fees except gas). 1 ETH always equals 1 WETH.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>When to Wrap</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-3">
              <div>
                <strong className="text-foreground">Wrap (Native → Wrapped):</strong>
                <p>
                  When depositing into protocols like Aave, Compound, or Uniswap that require ERC-20 tokens. Native 
                  ETH is not an ERC-20 token, so it must be wrapped first.
                </p>
              </div>
              <div>
                <strong className="text-foreground">Unwrap (Wrapped → Native):</strong>
                <p>
                  When you want to pay gas, send to an exchange that only accepts native tokens, or prefer holding 
                  "real" ETH rather than the wrapped version.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </DocSection>

      <DocSection
        id="ai-integration"
        title="AI Assistant Integration"
        subtitle="Automated cross-chain strategies"
      >
        <p className="text-lg mb-6">
          The AI Assistant can automatically initiate bridge transactions as part of complex DeFi workflows, 
          saving you time and ensuring optimal execution paths.
        </p>

        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Automated Bridging</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p className="mb-2">
                When you ask the AI to execute a yield strategy on a different chain, it automatically:
              </p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Checks your current balance</li>
                <li>Initiates bridge to target chain</li>
                <li>Monitors transaction status</li>
                <li>Claims tokens on destination</li>
                <li>Executes the DeFi strategy</li>
              </ol>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Strategy Optimization</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p className="mb-2">
                The AI considers bridge costs when recommending strategies:
              </p>
              <ul className="space-y-1">
                <li>• Compares net APY after bridge fees</li>
                <li>• Suggests optimal chains for your balance size</li>
                <li>• Warns if fees outweigh yield benefits</li>
                <li>• Recommends consolidation strategies</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">DePIN Rewards Flow</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p className="mb-3">
                After claiming DePIN rewards (on Polygon), the AI can automatically:
              </p>
              <div className="bg-muted/50 p-2 rounded text-xs">
                "Bridge my DePIN rewards to Arbitrum and deposit into Aave for USDC yield"
              </div>
              <p className="mt-2">
                All executed in a single workflow with no manual intervention required.
              </p>
            </CardContent>
          </Card>
        </div>

        <Alert className="mt-6">
          <AlertDescription>
            <strong>Try it:</strong> Go to the <a href="/chat" className="text-primary hover:underline">/chat</a> page 
            and ask: <em>"What's the best yield for USDC across all chains?"</em> The AI will factor in bridge costs 
            and suggest the optimal path.
          </AlertDescription>
        </Alert>
      </DocSection>

      <DocSection
        id="manual-import"
        title="Manual Transaction Import"
        subtitle="Track existing bridge transactions"
      >
        <p className="text-lg mb-6">
          If you initiated a bridge transaction outside of Tempo (e.g., directly on Wormhole Portal or another 
          interface), you can import it into Tempo's Monitoring Panel for tracking.
        </p>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              How to Import
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-3 text-sm text-muted-foreground">
              <li>
                <strong className="text-foreground">Navigate to Bridge Page:</strong> Go to <a href="/bridge" className="text-primary hover:underline">/bridge</a>
              </li>
              <li>
                <strong className="text-foreground">Click "Import Transaction":</strong> Located below the Monitoring Panel
              </li>
              <li>
                <strong className="text-foreground">Enter Details:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Transaction hash from source chain</li>
                  <li>Source chain name</li>
                  <li>Destination chain name (if known)</li>
                </ul>
              </li>
              <li>
                <strong className="text-foreground">Click "Import":</strong> Tempo queries WormholeScan API for the VAA
              </li>
              <li>
                <strong className="text-foreground">Track Status:</strong> Transaction now appears in Monitoring Panel
              </li>
            </ol>
            <Alert className="mt-4">
              <AlertDescription>
                <strong>Note:</strong> Manual import only works for transactions that have been confirmed on the source 
                chain and picked up by guardians. Very recent transactions (&lt;5 min) may not be found yet.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </DocSection>

      <DocSection
        id="transaction-history"
        title="Transaction History & Status Tracking"
        subtitle="Review past bridges and monitor active ones"
      >
        <p className="text-lg mb-6">
          Every bridge transaction initiated through Tempo is automatically logged to the database and displayed in 
          the Monitoring Panel and Transaction History page.
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5 text-primary" />
                Monitoring Panel
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p className="mb-3">
                Located on the <a href="/bridge" className="text-primary hover:underline">/bridge</a> page below the 
                widget. Shows real-time status for:
              </p>
              <ul className="space-y-1">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                  <strong>Pending:</strong> Awaiting source chain finality
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  <strong>Completed:</strong> VAA signed, ready to claim
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <strong>Claimed:</strong> Tokens received on destination
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  <strong>Failed:</strong> Error occurred, retry needed
                </li>
              </ul>
              <p className="mt-3 text-xs">
                Click any transaction to view full details including transaction hashes, VAA ID, and guardian signatures.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Transaction History Page</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p className="mb-3">
                View all your bridge transactions at <a href="/transactions" className="text-primary hover:underline">/transactions</a>. 
                Includes:
              </p>
              <ul className="space-y-1">
                <li>• Source and destination chains</li>
                <li>• Token type and amount</li>
                <li>• Timestamps (initiated, completed, claimed)</li>
                <li>• Fee breakdown</li>
                <li>• Links to block explorers</li>
                <li>• Status and action buttons (claim if needed)</li>
              </ul>
              <div className="bg-muted/50 p-3 rounded-lg mt-3 text-xs">
                <strong>Filter & Search:</strong> Filter by chain, token, status, or date range to find specific transactions quickly.
              </div>
            </CardContent>
          </Card>
        </div>
      </DocSection>

      <DocSection
        id="batch-operations"
        title="Batch Operations"
        subtitle="Bridge multiple tokens or to multiple destinations"
      >
        <p className="text-lg mb-6">
          For advanced users, Tempo supports batching multiple bridge transactions to save time and optimize gas costs.
        </p>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              Batch Bridge Setup
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-3">
            <p>
              <strong className="text-foreground">Use Case:</strong> You have USDC, USDT, and WETH on Ethereum and want 
              to bridge all three to Arbitrum. Instead of three separate transactions:
            </p>
            <ol className="list-decimal list-inside space-y-2">
              <li>Click "Batch Mode" on the Bridge page</li>
              <li>Add multiple token/amount pairs</li>
              <li>Select single destination chain</li>
              <li>Click "Execute Batch" - approvals and transfers are batched</li>
              <li>All transactions use the same nonce range for faster processing</li>
            </ol>
            <Alert className="mt-3">
              <AlertDescription>
                <strong>Gas Savings:</strong> Batching can save 10-30% on total gas costs compared to individual 
                transactions, especially on high-fee chains like Ethereum.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </DocSection>

      <DocSection
        id="troubleshooting"
        title="Troubleshooting Guide"
        subtitle="Common issues and solutions"
      >
        <p className="text-lg mb-6">
          Most bridge issues can be resolved with these steps. Click any question to see detailed solutions:
        </p>

        <TroubleshootingAccordion />
      </DocSection>

      <DocSection
        id="optimization-tips"
        title="Optimization Tips"
        subtitle="Expert strategies for efficient bridging"
      >
        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>💡 Cost Optimization</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p><strong>Bridge large amounts less frequently:</strong> Fixed costs (gas) are amortized better</p>
              <p><strong>Use Layer 2s as hubs:</strong> Bridge from Ethereum → Arbitrum → other L2s to save gas</p>
              <p><strong>Monitor gas prices:</strong> Bridge during off-peak hours (weekends, late nights UTC)</p>
              <p><strong>Consider stablecoin routes:</strong> USDC has deepest liquidity, lowest slippage</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>⚡ Speed Optimization</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p><strong>Choose fast source chains:</strong> Solana (30s) and Celo (5s) vs Ethereum (15min)</p>
              <p><strong>Pre-claim gas ready:</strong> Have destination gas tokens before bridging</p>
              <p><strong>Use automated claiming:</strong> Let the AI Assistant handle claim step</p>
              <p><strong>Avoid network congestion:</strong> Check block explorers for current congestion</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>🔒 Security Best Practices</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p><strong>Test on testnet first:</strong> Always practice with free tokens before mainnet</p>
              <p><strong>Verify recipient address:</strong> Double-check destination address before confirming</p>
              <p><strong>Use hardware wallets:</strong> For large amounts, use Ledger/Trezor for signing</p>
              <p><strong>Check official contracts:</strong> Verify you're interacting with official Wormhole contracts</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>🎯 Strategy Tips</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p><strong>Consolidate on L2s:</strong> Keep most assets on Arbitrum/Optimism for flexibility</p>
              <p><strong>Bridge for yield:</strong> Only bridge if destination APY &gt; bridge cost / time</p>
              <p><strong>Use AI insights:</strong> Ask AI for optimal bridge paths considering all costs</p>
              <p><strong>Track in portfolio:</strong> Monitor cross-chain positions in /portfolio page</p>
            </CardContent>
          </Card>
        </div>
      </DocSection>

      <DocSection
        id="next-steps"
        title="Next Steps"
      >
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-6 rounded-lg">
          <h3 className="font-semibold text-lg mb-4">Related Documentation:</h3>
          <ul className="space-y-2">
            <li>
              <a href="/docs/swap/getting-started" className="text-primary hover:underline font-medium">
                → Swap: Getting Started
              </a>
              <span className="text-muted-foreground ml-2">
                Learn about atomic cross-chain swaps (no claiming required)
              </span>
            </li>
            <li>
              <a href="/docs/depin/wormhole" className="text-primary hover:underline font-medium">
                → DePIN & Wormhole Integration
              </a>
              <span className="text-muted-foreground ml-2">
                How DePIN rewards use bridge infrastructure
              </span>
            </li>
            <li>
              <a href="/bridge" className="text-primary hover:underline font-medium">
                → Try Bridging
              </a>
              <span className="text-muted-foreground ml-2">
                Start your first bridge transaction
              </span>
            </li>
          </ul>
        </div>
      </DocSection>
    </div>
  );
};

export default BridgeAdvanced;
