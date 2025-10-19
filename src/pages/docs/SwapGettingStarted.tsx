import DocSection from '@/components/docs/DocSection';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeftRight, Zap, DollarSign, Shield, CheckCircle2 } from 'lucide-react';

const SwapGettingStarted = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Swap: Getting Started</h1>
        <p className="text-xl text-muted-foreground">
          Execute cross-chain token swaps in a single transaction with automatic best route finding
        </p>
      </div>

      <DocSection
        id="introduction"
        title="What is Cross-Chain Swap?"
        subtitle="Understanding atomic swaps vs traditional bridging"
      >
        <p className="text-lg mb-4">
          Cross-chain swap allows you to exchange tokens across different blockchains in a <strong>single atomic transaction</strong>. 
          Unlike traditional bridging (which requires separate transfer and claim steps), swaps deliver your destination 
          token directly to your wallet with no manual claiming required.
        </p>

        <div className="grid md:grid-cols-2 gap-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowLeftRight className="h-5 w-5 text-blue-500" />
                Traditional Bridge
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <ol className="space-y-2">
                <li>1️⃣ Lock tokens on source chain</li>
                <li>2️⃣ Wait for guardian consensus (2-15 min)</li>
                <li>3️⃣ Switch wallet to destination chain</li>
                <li>4️⃣ Manually claim tokens (requires gas)</li>
                <li>5️⃣ Receive <strong>same token</strong> on new chain</li>
              </ol>
              <div className="mt-3 p-2 bg-muted/50 rounded text-xs">
                <strong>Use Case:</strong> Moving funds between chains while keeping the same token
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                Cross-Chain Swap (Atomic)
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <ol className="space-y-2">
                <li>1️⃣ Initiate swap on source chain</li>
                <li>2️⃣ Route automatically optimized (bridge + DEX)</li>
                <li>3️⃣ <strong>No manual claiming</strong></li>
                <li>4️⃣ <strong>No wallet switching</strong></li>
                <li>5️⃣ Receive <strong>different token</strong> directly</li>
              </ol>
              <div className="mt-3 p-2 bg-primary/10 rounded text-xs">
                <strong>Use Case:</strong> Converting tokens across chains (e.g., ETH on Ethereum → USDC on Polygon)
              </div>
            </CardContent>
          </Card>
        </div>

        <Alert className="mt-6">
          <AlertDescription>
            <strong>Key Difference:</strong> Swap = Bridge + DEX Swap in one transaction. You send Token A on Chain X 
            and receive Token B on Chain Y, all without manual intervention. The protocol handles bridging, swapping, 
            and delivery atomically.
          </AlertDescription>
        </Alert>
      </DocSection>

      <DocSection
        id="why-swap"
        title="Why Use Cross-Chain Swap?"
        subtitle="Benefits over traditional methods"
      >
        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                Single Transaction
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                No need to bridge first, then swap on a DEX. Everything happens in one tx. Saves time, gas, 
                and reduces points of failure.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                Native Token Delivery
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Receive native tokens (not wrapped versions). For example, swap ETH on Ethereum directly to native 
                USDC on Polygon, no WETH or manual unwrapping needed.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                Best Routes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Wormhole Connect aggregates liquidity across multiple DEXs (Uniswap, Curve, 1inch, etc.) to find the 
                best rate automatically. You get optimal pricing without manual research.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                No Destination Gas Required
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Since claiming is automatic, you don't need to pre-fund your destination wallet with native tokens. 
                Simplifies the process for users new to a chain.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                AI Integration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Tempo's AI Assistant can automatically initiate swaps as part of yield strategies. 
                Example: "Find best USDC yield" → AI swaps your ETH to USDC on optimal chain and deposits.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                Secure & Transparent
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Same Wormhole guardian security as bridging (13/19 multisig). All routes and fees are displayed upfront 
                with no hidden costs.
              </p>
            </CardContent>
          </Card>
        </div>
      </DocSection>

      <DocSection
        id="quick-start"
        title="Your First Cross-Chain Swap"
        subtitle="Step-by-step walkthrough"
      >
        <div className="space-y-6">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
              1
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Connect Your Wallet</h3>
              <p className="text-muted-foreground mb-3">
                Navigate to <a href="/swap" className="text-primary hover:underline">/swap</a> and connect your wallet. 
                Tempo supports MetaMask, WalletConnect, Coinbase Wallet, and other EVM wallets, plus Phantom for Solana.
              </p>
              <Alert>
                <AlertDescription>
                  <strong>Testnet Available:</strong> Practice on testnet networks first! Switch to "Testnet" mode in 
                  the widget and use free testnet tokens. Get tokens from faucets linked on the page.
                </AlertDescription>
              </Alert>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
              2
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Select Source and Destination</h3>
              <p className="text-muted-foreground mb-3">
                Choose:
              </p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li><strong>Source Chain:</strong> Where your tokens are now (e.g., Ethereum)</li>
                <li><strong>Source Token:</strong> What you want to swap (e.g., ETH)</li>
                <li><strong>Destination Chain:</strong> Where you want tokens sent (e.g., Polygon)</li>
                <li><strong>Destination Token:</strong> What you want to receive (e.g., USDC)</li>
              </ul>
              <div className="bg-muted/50 p-4 rounded-lg mt-3">
                <p className="text-sm">
                  <strong>Example:</strong> Swap 0.5 ETH on Ethereum Sepolia → 800 USDC on Polygon Amoy (testnet)
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
              3
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Enter Amount and Review Route</h3>
              <p className="text-muted-foreground mb-3">
                Enter the amount of source token you want to swap. The widget will automatically:
              </p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Find the best route (which DEXs to use, which bridge path)</li>
                <li>Calculate expected output amount</li>
                <li>Show estimated fees (gas + swap fees + bridge fee)</li>
                <li>Display price impact and slippage tolerance</li>
              </ul>
              <Alert className="mt-3">
                <AlertDescription>
                  <strong>Pro Tip:</strong> If the output amount seems low or price impact is high (&gt;5%), try:
                  <ul className="mt-1 space-y-1 ml-4">
                    <li>• Swapping a smaller amount</li>
                    <li>• Choosing a different destination chain with deeper liquidity</li>
                    <li>• Adjusting slippage tolerance (for volatile markets)</li>
                  </ul>
                </AlertDescription>
              </Alert>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
              4
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Approve and Execute Swap</h3>
              <p className="text-muted-foreground mb-3">
                Click <strong>"Approve"</strong> to allow the swap contract to access your source token (one-time approval per token). 
                Then click <strong>"Swap"</strong> to execute. Your wallet will prompt you to sign the transaction.
              </p>
              <Alert>
                <AlertDescription>
                  <strong>Important:</strong> Double-check the destination chain and token before confirming. Blockchain 
                  transactions are irreversible!
                </AlertDescription>
              </Alert>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
              5
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Wait for Completion (Automatic)</h3>
              <p className="text-muted-foreground mb-3">
                Unlike bridging, you don't need to do anything after initiating. The protocol handles:
              </p>
              <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                <li>Locking/burning your source tokens</li>
                <li>Guardian validation (2-15 min depending on source chain finality)</li>
                <li>Swapping on destination DEXs for best rate</li>
                <li>Delivering destination tokens to your address</li>
              </ol>
              <div className="bg-muted/50 p-4 rounded-lg mt-3">
                <p className="text-sm">
                  <strong>Timeline:</strong> Most swaps complete in 5-20 minutes total. Fast chains like Solana finish in under 2 minutes!
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
              ✓
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2 text-green-600">Swap Complete!</h3>
              <p className="text-muted-foreground mb-3">
                Your destination tokens are now in your wallet on the destination chain. Check your balance in:
              </p>
              <ul className="space-y-1">
                <li>• <a href="/portfolio" className="text-primary hover:underline">Tempo Portfolio</a> (multi-chain view)</li>
                <li>• Your wallet (may need to manually add token address)</li>
                <li>• Block explorer for destination chain (verify transaction)</li>
              </ul>
            </div>
          </div>
        </div>
      </DocSection>

      <DocSection
        id="testnet-practice"
        title="Practice on Testnet First"
        subtitle="Free tokens for testing"
      >
        <p className="text-lg mb-6">
          Before swapping real assets, practice on testnet networks with free tokens. This lets you familiarize yourself 
          with the interface and transaction flow without any financial risk.
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Why Testnet?
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p>Testnet lets you:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Understand the swap interface without risk</li>
                <li>See how route optimization works</li>
                <li>Experience the full transaction flow</li>
                <li>Test different chain combinations</li>
                <li>Verify your wallet is set up correctly</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" />
                Get Free Testnet Tokens
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p className="mb-3">Faucet links for supported testnets:</p>
              <ul className="space-y-2">
                <li>
                  <a href="https://sepoliafaucet.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    Sepolia ETH ↗
                  </a>
                </li>
                <li>
                  <a href="https://faucet.solana.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    Solana Devnet SOL ↗
                  </a>
                </li>
                <li>
                  <a href="https://faucet.quicknode.com/arbitrum/sepolia" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    Arbitrum Sepolia ETH ↗
                  </a>
                </li>
                <li>
                  <a href="https://faucet.polygon.technology" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    Polygon Amoy MATIC ↗
                  </a>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <Alert className="mt-6">
          <AlertDescription>
            <strong>Recommended First Swap:</strong> Get Sepolia ETH from faucet → Swap 0.01 ETH on Sepolia to USDC on 
            Arbitrum Sepolia. This tests cross-chain swap with minimal wait time (both fast chains).
          </AlertDescription>
        </Alert>
      </DocSection>

      <DocSection
        id="common-use-cases"
        title="Common Use Cases"
        subtitle="When to use cross-chain swap"
      >
        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Quick Token Conversion</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                You have ETH on Ethereum but need USDC on Polygon for a DeFi strategy. Swap directly instead of 
                bridging ETH then swapping on Polygon DEX.
              </p>
              <p className="text-sm">
                <strong>Saves:</strong> One transaction, one set of gas fees, manual DEX interaction
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>AI-Driven Strategies</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                The AI Assistant recommends a yield opportunity on a different chain and with a different asset. 
                It automatically swaps your current holdings to the optimal token + chain.
              </p>
              <p className="text-sm">
                <strong>Example:</strong> "Find best yield" → AI swaps ETH → USDC on Arbitrum → deposits in Aave
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Portfolio Rebalancing</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                You want to reduce ETH exposure and increase stablecoin holdings across multiple chains. 
                Swap ETH on various chains directly to USDC on your preferred chain.
              </p>
              <p className="text-sm">
                <strong>Strategy:</strong> Consolidate all assets into USDC on Base for minimal fees
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Access New Ecosystems</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                You're on Ethereum and want to try Solana DeFi. Swap your ETH/USDC directly to SOL or USDC on Solana 
                in one transaction.
              </p>
              <p className="text-sm">
                <strong>Benefit:</strong> No need to learn Solana bridges or DEXs first
              </p>
            </CardContent>
          </Card>
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
              <a href="/docs/swap/how-it-works" className="text-primary hover:underline font-medium">
                → How Swap Works
              </a>
              <span className="text-muted-foreground ml-2">
                Technical deep dive into atomic swaps, route optimization, and DEX aggregation
              </span>
            </li>
            <li>
              <a href="/docs/swap/best-practices" className="text-primary hover:underline font-medium">
                → Swap Best Practices
              </a>
              <span className="text-muted-foreground ml-2">
                Optimization tips, security guidelines, and advanced strategies
              </span>
            </li>
            <li>
              <a href="/swap" className="text-primary hover:underline font-medium">
                → Try Swapping on Testnet
              </a>
              <span className="text-muted-foreground ml-2">
                Practice with free testnet tokens
              </span>
            </li>
          </ul>
        </div>
      </DocSection>
    </div>
  );
};

export default SwapGettingStarted;
