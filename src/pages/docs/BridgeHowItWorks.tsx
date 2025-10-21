import DocSection from '@/components/docs/DocSection';
import Mermaid from '@/components/docs/Mermaid';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Shield, Network, FileCheck, Zap, Maximize2 } from 'lucide-react';
import transactionFlowImage from '@/assets/transaction-flow-diagram.png';
import architectureImage from '@/assets/architecture-diagram.png';

const BridgeHowItWorks = () => {
  const transactionFlowChart = `
sequenceDiagram
    participant User
    participant SourceChain as Source Chain<br/>(e.g., Ethereum)
    participant Guardians as Guardian Network<br/>(19 Validators)
    participant Wormhole as Wormhole Core
    participant DestChain as Destination Chain<br/>(e.g., Polygon)
    
    User->>SourceChain: 1. Lock/Burn Tokens
    Note over SourceChain: Emit bridge event
    SourceChain->>Guardians: 2. Event notification
    
    loop Guardian Consensus
        Guardians->>Guardians: Verify transaction
    end
    
    Guardians->>Wormhole: 3. Sign VAA (13/19 signatures)
    Note over Wormhole: VAA = Verified Action Approval
    
    Wormhole->>DestChain: 4. Submit VAA for redemption
    Note over User: Switch wallet to destination chain
    User->>DestChain: 5. Claim tokens (redeem VAA)
    DestChain->>User: 6. Mint/Unlock tokens
`;

const architectureChart = `
graph TD
    A[User Wallet] -->|1. Approve & Transfer| B[Wormhole Bridge Contract]
    B -->|2. Lock/Burn Tokens| C[Source Chain]
    C -->|3. Emit Event| D[Guardian Network]
    
    D -->|4. Observe & Validate| E{19 Guardians}
    E -->|5. 13+ Signatures| F[VAA Generated]
    
    F -->|6. VAA Available| G[WormholeScan API]
    G -->|7. Poll for VAA| H[Tempo Monitoring]
    
    H -->|8. Display Status| A
    A -->|9. Switch Chain & Claim| I[Destination Chain Contract]
    I -->|10. Verify VAA| J[Unlock/Mint Tokens]
    J -->|11. Transfer to User| A
    
    style A fill:#3b82f6,stroke:#1e40af,color:#fff
    style B fill:#8b5cf6,stroke:#6d28d9,color:#fff
    style C fill:#eab308,stroke:#ca8a04,color:#000
    style D fill:#ec4899,stroke:#be185d,color:#fff
    style E fill:#f97316,stroke:#c2410c,color:#fff
    style F fill:#10b981,stroke:#059669,color:#fff
    style G fill:#eab308,stroke:#ca8a04,color:#000
    style H fill:#06b6d4,stroke:#0891b2,color:#fff
    style I fill:#8b5cf6,stroke:#6d28d9,color:#fff
    style J fill:#10b981,stroke:#059669,color:#fff
`;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">How Bridge Works</h1>
        <p className="text-xl text-muted-foreground">
          Understanding the technical architecture and transaction lifecycle of Wormhole-powered bridging
        </p>
      </div>

      <DocSection
        id="overview"
        title="Technical Overview"
        subtitle="The architecture behind secure cross-chain transfers"
      >
        <p className="text-lg mb-6">
          Tempo Bridge leverages <strong>Wormhole</strong>, a generic message-passing protocol secured by a network 
          of 19 guardian validators. Unlike many bridges that rely on single-entity trust, Wormhole requires 
          consensus from 13 out of 19 guardians before any transaction is considered valid.
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Guardian Network
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                19 reputable validator nodes including Jump Crypto, Certus One, Staked, Figment, and other 
                top blockchain infrastructure providers. Each runs independent monitoring software.
              </p>
              <div className="bg-muted/50 p-3 rounded-lg text-xs">
                <strong>Security Model:</strong> 13/19 threshold signature scheme (TSS). Attackers would need 
                to compromise 7 major companies simultaneously to forge a transaction.
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileCheck className="h-5 w-5 text-primary" />
                VAA (Verified Action Approval)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                A cryptographically signed message that proves a transaction happened on the source chain. 
                Think of it as a "proof of lock" that can be redeemed on the destination chain.
              </p>
              <div className="bg-muted/50 p-3 rounded-lg text-xs">
                <strong>VAA Contains:</strong> Source chain ID, token address, amount, sender, recipient, 
                unique nonce, and 13+ guardian signatures.
              </div>
            </CardContent>
          </Card>
        </div>
      </DocSection>

      <DocSection
        id="transaction-lifecycle"
        title="Transaction Lifecycle"
        subtitle="Step-by-step breakdown of a bridge transaction"
      >
        <Dialog>
          <DialogTrigger asChild>
            <div className="relative group cursor-pointer my-8 rounded-xl border border-border bg-card/50 overflow-hidden hover:border-primary/50 transition-colors p-2 w-fit mx-auto">
              <img 
                src={transactionFlowImage} 
                alt="Transaction Flow Diagram - Cross-chain bridge sequence showing 6 steps from lock/burn tokens to mint/unlock tokens"
                className="h-auto"
                style={{ width: '800px', maxWidth: '100%' }}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-primary text-primary-foreground rounded-full p-3">
                  <Maximize2 className="h-6 w-6" />
                </div>
              </div>
            </div>
          </DialogTrigger>
          <DialogContent className="max-w-[90vw] w-full h-[90vh]">
            <img 
              src={transactionFlowImage} 
              alt="Transaction Flow Diagram - Cross-chain bridge sequence showing 6 steps from lock/burn tokens to mint/unlock tokens"
              className="w-full h-full object-contain"
            />
          </DialogContent>
        </Dialog>

        <div className="space-y-6 mt-8">
          <div>
            <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
              <span className="bg-primary/20 text-primary px-2 py-1 rounded text-sm">Step 1</span>
              Lock or Burn Tokens on Source Chain
            </h3>
            <p className="text-muted-foreground">
              When you initiate a bridge, your tokens are either <strong>locked</strong> in a custody contract 
              (for native tokens like USDC) or <strong>burned</strong> (for Wormhole-wrapped tokens). This prevents 
              double-spending and ensures the total supply remains constant.
            </p>
            <Alert className="mt-3">
              <AlertDescription>
                <strong>Security Note:</strong> The locking contract uses multi-signature control and time-locked 
                upgrades, meaning no single entity can access locked funds.
              </AlertDescription>
            </Alert>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
              <span className="bg-primary/20 text-primary px-2 py-1 rounded text-sm">Step 2</span>
              Guardian Observation
            </h3>
            <p className="text-muted-foreground">
              All 19 guardians monitor the source chain for bridge events. Each guardian independently verifies:
            </p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground mt-2">
              <li>Transaction finality (enough confirmations to prevent reorgs)</li>
              <li>Correct contract interaction (not a fake event)</li>
              <li>Valid token address and amount</li>
              <li>Proper recipient encoding</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
              <span className="bg-primary/20 text-primary px-2 py-1 rounded text-sm">Step 3</span>
              VAA Generation (Consensus)
            </h3>
            <p className="text-muted-foreground">
              Once 13 out of 19 guardians agree the transaction is valid, they collectively sign a VAA message. 
              This typically takes 2-15 minutes depending on source chain finality:
            </p>
            <div className="bg-muted/50 p-4 rounded-lg mt-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Ethereum:</span>
                <span className="font-semibold">~15 minutes (finality)</span>
              </div>
              <div className="flex justify-between">
                <span>Polygon:</span>
                <span className="font-semibold">~5-10 minutes</span>
              </div>
              <div className="flex justify-between">
                <span>Arbitrum/Optimism:</span>
                <span className="font-semibold">~2-5 minutes</span>
              </div>
              <div className="flex justify-between">
                <span>Solana:</span>
                <span className="font-semibold">~30 seconds</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
              <span className="bg-primary/20 text-primary px-2 py-1 rounded text-sm">Step 4</span>
              VAA Submission to Destination
            </h3>
            <p className="text-muted-foreground">
              The VAA is now available for redemption on the destination chain. In Tempo's interface, this is 
              when the status changes to <strong>"Ready to Claim"</strong>. At this point, the guardians' work is done.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
              <span className="bg-primary/20 text-primary px-2 py-1 rounded text-sm">Step 5</span>
              User Claims Tokens (Redemption)
            </h3>
            <p className="text-muted-foreground mb-3">
              You (the user) must switch your wallet to the destination chain and submit a "claim" transaction. 
              This transaction includes the VAA as proof. The destination chain contract:
            </p>
            <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
              <li>Verifies the 13 guardian signatures on the VAA</li>
              <li>Checks the VAA hasn't been redeemed before (replay protection)</li>
              <li>Mints or unlocks the tokens to your address</li>
            </ol>
            <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-lg mt-3">
              <p className="text-sm">
                <strong>⚠️ Gas Requirement:</strong> You need a small amount of the destination chain's native token 
                (e.g., MATIC for Polygon, ETH for Arbitrum) to pay for the claim transaction. If you don't have any, 
                use a faucet or the "Gas Alert" feature in Tempo.
              </p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
              <span className="bg-primary/20 text-primary px-2 py-1 rounded text-sm">Step 6</span>
              Transaction Complete
            </h3>
            <p className="text-muted-foreground">
              Once the claim transaction confirms, your tokens are now on the destination chain and fully under your 
              control. The bridge transaction is complete!
            </p>
          </div>
        </div>
      </DocSection>

      <DocSection
        id="architecture"
        title="Full System Architecture"
        subtitle="How Tempo integrates with Wormhole"
      >
        <Dialog>
          <DialogTrigger asChild>
            <div className="relative group cursor-pointer my-8 rounded-xl border border-border bg-card/50 overflow-hidden hover:border-primary/50 transition-colors p-2 w-fit mx-auto">
              <img 
                src={architectureImage} 
                alt="System Architecture Diagram - Complete flow showing 11 steps from user wallet through Wormhole bridge to destination chain"
                className="h-auto"
                style={{ width: '800px', maxWidth: '100%' }}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-primary text-primary-foreground rounded-full p-3">
                  <Maximize2 className="h-6 w-6" />
                </div>
              </div>
            </div>
          </DialogTrigger>
          <DialogContent className="max-w-[90vw] w-full h-[90vh]">
            <img 
              src={architectureImage} 
              alt="System Architecture Diagram - Complete flow showing 11 steps from user wallet through Wormhole bridge to destination chain"
              className="w-full h-full object-contain"
            />
          </DialogContent>
        </Dialog>

        <div className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                Tempo Monitoring Panel
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                Tempo continuously polls the <strong>WormholeScan API</strong> to track your bridge transactions. 
                The Monitoring Panel shows real-time status updates:
              </p>
              <ul className="text-sm space-y-1">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                  <strong>Pending:</strong> Waiting for source chain finality
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  <strong>Completed:</strong> Guardians have signed VAA
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <strong>Ready to Claim:</strong> VAA available, click to redeem
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                  <strong>Claimed:</strong> Tokens successfully received
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Database Transaction Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Every bridge transaction is logged in Tempo's database with the following data:
              </p>
              <div className="bg-muted/50 p-3 rounded-lg mt-3 text-xs font-mono">
                <div>• Transaction hash (source chain)</div>
                <div>• VAA ID (Wormhole unique identifier)</div>
                <div>• Source & destination chains</div>
                <div>• Token address, amount, sender, recipient</div>
                <div>• Status updates and timestamps</div>
                <div>• Claim transaction hash (once redeemed)</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DocSection>

      <DocSection
        id="security"
        title="Security Considerations"
        subtitle="What makes Wormhole secure?"
      >
        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Multi-Guardian Consensus</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p className="mb-2">
                <strong>13/19 threshold</strong> means an attacker would need to compromise at least 7 independent, 
                geographically distributed companies simultaneously. This is economically and technically infeasible.
              </p>
              <p>
                Each guardian is incentivized to maintain reputation and runs secure, audited infrastructure.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Immutable Message Passing</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p className="mb-2">
                VAAs are cryptographically signed and contain all transaction data. Any tampering invalidates the 
                signatures, making forgery impossible without guardian private keys.
              </p>
              <p>
                Replay protection ensures each VAA can only be redeemed once.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Smart Contract Audits</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p>
                Wormhole contracts have been audited by multiple top firms including Trail of Bits, Neodyme, 
                Kudelski Security, and OtterSec. The codebase is open-source and battle-tested with over $30B 
                in cumulative transfer volume.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Upgradability Controls</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p>
                Contract upgrades require multi-signature approval with time delays, giving the community time 
                to review changes. No single entity can unilaterally modify bridge logic.
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
          <h3 className="font-semibold text-lg mb-4">Explore Further:</h3>
          <ul className="space-y-2">
            <li>
              <a href="/docs/bridge/networks" className="text-primary hover:underline font-medium">
                → Networks & Tokens
              </a>
              <span className="text-muted-foreground ml-2">
                See which chains and tokens are supported
              </span>
            </li>
            <li>
              <a href="/docs/bridge/advanced" className="text-primary hover:underline font-medium">
                → Advanced Features
              </a>
              <span className="text-muted-foreground ml-2">
                Fee estimation, troubleshooting, and optimization tips
              </span>
            </li>
            <li>
              <a href="https://wormhole.com/docs/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">
                → Wormhole Official Docs ↗
              </a>
              <span className="text-muted-foreground ml-2">
                Dive deeper into the protocol itself
              </span>
            </li>
          </ul>
        </div>
      </DocSection>
    </div>
  );
};

export default BridgeHowItWorks;
