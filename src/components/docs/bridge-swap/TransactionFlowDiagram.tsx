import Mermaid from '@/components/docs/Mermaid';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const TransactionFlowDiagram = () => {
  const bridgeFlow = `
sequenceDiagram
    participant User
    participant SourceChain as Source Chain
    participant Guardians as Guardian Network
    participant Wormhole as Wormhole Core
    participant DestChain as Destination Chain
    
    User->>SourceChain: Lock/Burn Tokens
    Note over SourceChain: Transaction confirmed
    SourceChain->>Guardians: Emit bridge event
    
    loop Guardian Consensus
        Guardians->>Guardians: Verify (13/19 required)
    end
    
    Guardians->>Wormhole: Sign VAA
    Note over Wormhole: VAA = Verified Action Approval
    
    User->>User: Switch wallet to destination chain
    User->>DestChain: Submit VAA to claim tokens
    DestChain->>DestChain: Verify VAA signatures
    DestChain->>User: Mint/Unlock tokens
`;

  const swapFlow = `
sequenceDiagram
    participant User
    participant SourceChain as Source Chain
    participant Guardians as Guardian Network
    participant DestDEX as Destination DEX
    participant DestChain as Destination Chain
    
    User->>SourceChain: Initiate Swap
    Note over SourceChain: Lock/Burn tokens
    
    SourceChain->>Guardians: Emit swap event
    
    loop Guardian Consensus
        Guardians->>Guardians: Verify (13/19)
    end
    
    Guardians->>DestDEX: Automatic VAA submission
    Note over DestDEX: No user action required
    
    DestDEX->>DestDEX: Execute optimal swap route
    Note over DestDEX: Best rate across DEXs
    
    DestDEX->>DestChain: Deliver swapped tokens
    DestChain->>User: Tokens arrive automatically
`;

  const comparisonFlow = `
graph TD
    A[User Initiates] --> B{Transaction Type?}
    
    B -->|Bridge| C[Lock on Source]
    C --> D[Guardian Consensus]
    D --> E[VAA Generated]
    E --> F[User Switches Wallet]
    F --> G[User Claims Manually]
    G --> H[Receive SAME Token]
    
    B -->|Swap| I[Lock on Source]
    I --> J[Guardian Consensus]
    J --> K[VAA Generated]
    K --> L[Auto-Claim & Swap]
    L --> M[Receive DIFFERENT Token]
    
    style F fill:#ff9999
    style G fill:#ff9999
    style L fill:#99ff99
    style M fill:#99ff99
`;

  return (
    <div className="space-y-6">
      <Tabs defaultValue="bridge" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="bridge">Bridge Flow</TabsTrigger>
          <TabsTrigger value="swap">Swap Flow</TabsTrigger>
          <TabsTrigger value="comparison">Comparison</TabsTrigger>
        </TabsList>

        <TabsContent value="bridge" className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Traditional Bridge Transaction Flow</h3>
            <p className="text-sm text-muted-foreground mb-4">
              User must manually switch wallets and claim tokens on the destination chain. Requires destination gas.
            </p>
          </div>
          <Mermaid chart={bridgeFlow} />
          <div className="bg-muted/50 p-4 rounded-lg text-sm">
            <p className="font-semibold mb-2">Key Steps:</p>
            <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
              <li>User locks/burns tokens on source chain</li>
              <li>Guardians observe and reach consensus (13/19 signatures)</li>
              <li>VAA becomes available for redemption</li>
              <li><strong>User action required:</strong> Switch wallet, submit claim transaction</li>
              <li>Destination chain verifies VAA and mints/unlocks tokens</li>
            </ol>
          </div>
        </TabsContent>

        <TabsContent value="swap" className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Atomic Swap Transaction Flow</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Fully automated process. User only initiates; claiming and swapping happen automatically.
            </p>
          </div>
          <Mermaid chart={swapFlow} />
          <div className="bg-muted/50 p-4 rounded-lg text-sm">
            <p className="font-semibold mb-2">Key Differences:</p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li><strong>No manual claiming:</strong> VAA is automatically submitted to destination</li>
              <li><strong>DEX integration:</strong> Best swap route is executed on destination</li>
              <li><strong>No wallet switching:</strong> User doesn't need to change networks</li>
              <li><strong>Different token delivered:</strong> Swap happens as part of bridge flow</li>
              <li><strong>Single transaction:</strong> User only signs once on source chain</li>
            </ul>
          </div>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Bridge vs Swap: Visual Comparison</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Red nodes indicate manual user actions; green nodes are automated processes.
            </p>
          </div>
          <Mermaid chart={comparisonFlow} />
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <div className="bg-muted/50 p-4 rounded-lg text-sm">
              <p className="font-semibold mb-2 text-red-600">Bridge: User Actions Required</p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Switch wallet to destination chain</li>
                <li>Submit claim transaction (costs gas)</li>
                <li>Must have destination gas beforehand</li>
                <li>Total time depends on user responsiveness</li>
              </ul>
            </div>
            <div className="bg-muted/50 p-4 rounded-lg text-sm">
              <p className="font-semibold mb-2 text-green-600">Swap: Fully Automated</p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>No wallet switching needed</li>
                <li>No claim transaction to submit</li>
                <li>No destination gas required</li>
                <li>Total time only depends on chain finality</li>
              </ul>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TransactionFlowDiagram;
