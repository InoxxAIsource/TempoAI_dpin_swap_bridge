import DocSection from '@/components/docs/DocSection';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Wallet, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const BridgeGettingStarted = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Bridge: Getting Started</h1>
        <p className="text-xl text-muted-foreground">
          Learn how to transfer assets securely across different blockchain networks using Tempo's Wormhole-powered bridge.
        </p>
      </div>

      <DocSection
        id="introduction"
        title="What is Cross-Chain Bridging?"
        subtitle="Understanding the basics of blockchain bridges"
      >
        <p className="text-lg mb-4">
          Cross-chain bridging allows you to transfer digital assets (tokens, NFTs) from one blockchain to another. 
          Tempo Bridge uses <strong>Wormhole</strong>, one of the most secure and widely-used bridge protocols, to facilitate these transfers.
        </p>
        
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Why Bridge?</strong> Different blockchains have different strengths. Bridging lets you move assets to chains 
            with lower fees, faster transactions, or access to specific DeFi protocols and yield opportunities.
          </AlertDescription>
        </Alert>

        <div className="grid md:grid-cols-3 gap-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                Secure
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Protected by 19 guardian validators including top blockchain companies
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                Fast
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Most transactions complete in 2-15 minutes depending on network congestion
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                Universal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Supports 12+ blockchains including Ethereum, Solana, Arbitrum, and more
              </p>
            </CardContent>
          </Card>
        </div>
      </DocSection>

      <DocSection
        id="why-tempo"
        title="Why Use Tempo Bridge?"
        subtitle="Benefits of bridging through Tempo"
      >
        <div className="space-y-4">
          <div className="border-l-4 border-primary pl-4">
            <h3 className="font-semibold text-lg mb-2">🎯 DePIN Reward Claims</h3>
            <p className="text-muted-foreground">
              Bridge your DePIN rewards from Polygon to any chain. Claim rewards on low-fee networks, 
              then bridge to where you want to use them.
            </p>
          </div>

          <div className="border-l-4 border-primary pl-4">
            <h3 className="font-semibold text-lg mb-2">📈 Access Yield Opportunities</h3>
            <p className="text-muted-foreground">
              Move assets to chains with the best yield farming and staking opportunities. The AI Assistant 
              can automatically bridge your tokens to execute optimal strategies.
            </p>
          </div>

          <div className="border-l-4 border-primary pl-4">
            <h3 className="font-semibold text-lg mb-2">💰 Optimize for Gas Fees</h3>
            <p className="text-muted-foreground">
              Bridge to Layer 2 networks (Arbitrum, Optimism, Base) to enjoy significantly lower transaction costs 
              while maintaining Ethereum-level security.
            </p>
          </div>

          <div className="border-l-4 border-primary pl-4">
            <h3 className="font-semibold text-lg mb-2">🔄 AI-Integrated Workflows</h3>
            <p className="text-muted-foreground">
              The AI Assistant can automatically initiate bridges as part of complex DeFi strategies, 
              saving you time and ensuring optimal execution paths.
            </p>
          </div>
        </div>
      </DocSection>

      <DocSection
        id="quick-start"
        title="Your First Bridge Transaction"
        subtitle="Step-by-step walkthrough"
      >
        <div className="space-y-6">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
              1
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                <Wallet className="h-5 w-5" />
                Connect Your Wallet
              </h3>
              <p className="text-muted-foreground mb-3">
                Navigate to <a href="/bridge" className="text-primary hover:underline">/bridge</a> and connect 
                your wallet. Tempo supports MetaMask, WalletConnect, Phantom (for Solana), and other popular wallets.
              </p>
              <Alert>
                <AlertDescription>
                  <strong>Testnet First:</strong> Try on testnet networks (Sepolia, Solana Devnet) before using mainnet. 
                  Get free testnet tokens from faucets linked on the bridge page.
                </AlertDescription>
              </Alert>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
              2
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                <ArrowRight className="h-5 w-5" />
                Select Source and Destination
              </h3>
              <p className="text-muted-foreground">
                Choose which blockchain you're sending <strong>from</strong> (source) and which you're sending <strong>to</strong> (destination). 
                Make sure your wallet is connected to the source chain.
              </p>
              <div className="bg-muted/50 p-4 rounded-lg mt-3">
                <p className="text-sm">
                  <strong>Example:</strong> Bridge 100 USDC from Ethereum Sepolia → Polygon Sepolia
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
              3
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Enter Amount and Review Fees</h3>
              <p className="text-muted-foreground mb-3">
                Enter the amount you want to bridge. Review the estimated fees, which include:
              </p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Bridge fee (~0.1% of transfer amount)</li>
                <li>Source chain gas (paid in native token like ETH)</li>
                <li>Destination chain gas estimate (for claiming)</li>
              </ul>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
              4
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Approve and Initiate Transfer</h3>
              <p className="text-muted-foreground mb-3">
                Click "Approve" to allow the bridge contract to access your tokens (one-time per token), 
                then click "Transfer" to start the bridge transaction.
              </p>
              <Alert>
                <AlertDescription>
                  Your wallet will prompt you to sign the transaction. <strong>Double-check</strong> the destination 
                  address and amount before confirming.
                </AlertDescription>
              </Alert>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
              5
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Monitor and Claim</h3>
              <p className="text-muted-foreground mb-3">
                Once initiated, your transaction appears in the Monitoring Panel below the bridge widget. 
                Watch the status change from "Pending" → "Completed" → "Ready to Claim".
              </p>
              <div className="bg-muted/50 p-4 rounded-lg mt-3">
                <p className="text-sm">
                  <strong>Claiming:</strong> After guardian validation (2-15 min), switch your wallet to the destination chain 
                  and click "Claim" to receive your tokens. You'll need a small amount of the destination chain's native token for gas.
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
              ✓
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2 text-green-600">Transaction Complete!</h3>
              <p className="text-muted-foreground">
                Your tokens are now on the destination chain and ready to use. View your updated balance in the 
                <a href="/portfolio" className="text-primary hover:underline ml-1">Portfolio</a> page.
              </p>
            </div>
          </div>
        </div>
      </DocSection>

      <DocSection
        id="common-use-cases"
        title="Common Use Cases"
        subtitle="When and why to bridge"
      >
        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Claim DePIN Rewards</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                Your DePIN device rewards accumulate on Polygon. Bridge them to Ethereum mainnet or Layer 2s 
                to access a wider range of DeFi protocols.
              </p>
              <p className="text-sm">
                <strong>Typical Path:</strong> Polygon → Arbitrum (for low-cost DeFi)
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Execute Yield Strategies</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                The AI Assistant identifies high-yield opportunities across chains. Bridging enables automatic 
                execution of cross-chain strategies without manual intervention.
              </p>
              <p className="text-sm">
                <strong>Example:</strong> "Find best USDC yield" → Bridge to Optimism → Deposit in Aave
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Consolidate Assets</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                Have tokens scattered across multiple chains? Bridge them to a single chain for easier 
                portfolio management and lower overall gas costs.
              </p>
              <p className="text-sm">
                <strong>Strategy:</strong> Consolidate on Base or Arbitrum for minimal fees
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Access Solana Ecosystem</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                Bridge EVM assets to Solana to access its high-speed DeFi ecosystem, including Jupiter, 
                Raydium, and Kamino.
              </p>
              <p className="text-sm">
                <strong>Unique Benefit:</strong> Near-instant transactions and negligible fees on Solana
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
              <a href="/docs/bridge/how-it-works" className="text-primary hover:underline font-medium">
                → How Bridge Works
              </a>
              <span className="text-muted-foreground ml-2">
                Deep dive into Wormhole's technical architecture
              </span>
            </li>
            <li>
              <a href="/docs/bridge/networks" className="text-primary hover:underline font-medium">
                → Networks & Tokens
              </a>
              <span className="text-muted-foreground ml-2">
                Complete list of supported chains and tokens
              </span>
            </li>
            <li>
              <a href="/docs/bridge/advanced" className="text-primary hover:underline font-medium">
                → Advanced Features
              </a>
              <span className="text-muted-foreground ml-2">
                Fee estimation, batch operations, troubleshooting
              </span>
            </li>
          </ul>
        </div>
      </DocSection>
    </div>
  );
};

export default BridgeGettingStarted;
