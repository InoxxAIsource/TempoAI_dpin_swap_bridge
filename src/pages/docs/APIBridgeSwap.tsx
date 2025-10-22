import DocSection from '@/components/docs/DocSection';
import Callout from '@/components/docs/Callout';
import CodeBlock from '@/components/docs/CodeBlock';
import { ArrowLeftRight, RefreshCw, TrendingUp, DollarSign } from 'lucide-react';

const APIBridgeSwap = () => {
  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-[42px] md:text-[52px] font-bold mb-4 font-playfair text-foreground leading-tight">
          Bridge & Swap API
        </h1>
        <p className="text-[18px] text-muted-foreground leading-[1.8] max-w-[720px]">
          Execute cross-chain transfers and token swaps powered by Wormhole. Get fee estimates and track transaction status.
        </p>
      </div>

      <DocSection 
        id="endpoints-overview" 
        title="Endpoints Overview"
      >
        <div className="grid md:grid-cols-2 gap-6">
          <div className="border border-border/50 rounded-lg p-6 bg-card/30">
            <div className="flex items-center gap-3 mb-3">
              <DollarSign className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-[17px]">Fee Estimation</h3>
            </div>
            <p className="text-[14px] text-muted-foreground leading-[1.7] mb-3">
              Estimate gas and bridge fees before executing
            </p>
            <code className="text-[13px] px-2 py-1 bg-muted/50 rounded block">POST /estimate-bridge-fees</code>
          </div>

          <div className="border border-border/50 rounded-lg p-6 bg-card/30">
            <div className="flex items-center gap-3 mb-3">
              <RefreshCw className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-[17px]">Status Monitoring</h3>
            </div>
            <p className="text-[14px] text-muted-foreground leading-[1.7] mb-3">
              Track transfer status across chains
            </p>
            <code className="text-[13px] px-2 py-1 bg-muted/50 rounded block">GET /check-transfer-status</code>
          </div>
        </div>
      </DocSection>

      <DocSection 
        id="estimate-bridge-fees" 
        title="Estimate Bridge Fees"
        subtitle="POST /estimate-bridge-fees"
      >
        <p className="text-[16px] text-foreground/90 leading-[1.8] mb-6">
          Get a detailed breakdown of costs before executing a cross-chain transfer or swap.
        </p>

        <h3 className="font-semibold text-[17px] mb-3">Request Body</h3>
        <CodeBlock 
          language="typescript" 
          code={`const { data, error } = await supabase.functions.invoke('estimate-bridge-fees', {
  method: 'POST',
  headers: {
    Authorization: \`Bearer \${accessToken}\`,
    'Content-Type': 'application/json'
  },
  body: {
    from_chain: "Ethereum",
    to_chain: "Solana",
    token: "USDC",
    amount: 100
  }
});`}
        />

        <h3 className="font-semibold text-[17px] mb-3 mt-6">Supported Chains</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="px-3 py-2 bg-muted/30 rounded text-[14px]">Ethereum</div>
          <div className="px-3 py-2 bg-muted/30 rounded text-[14px]">Solana</div>
          <div className="px-3 py-2 bg-muted/30 rounded text-[14px]">Polygon</div>
          <div className="px-3 py-2 bg-muted/30 rounded text-[14px]">Arbitrum</div>
          <div className="px-3 py-2 bg-muted/30 rounded text-[14px]">Optimism</div>
          <div className="px-3 py-2 bg-muted/30 rounded text-[14px]">Base</div>
          <div className="px-3 py-2 bg-muted/30 rounded text-[14px]">Avalanche</div>
          <div className="px-3 py-2 bg-muted/30 rounded text-[14px]">BNB Chain</div>
        </div>

        <h3 className="font-semibold text-[17px] mb-3 mt-6">Response</h3>
        <CodeBlock 
          language="json" 
          code={`{
  "from_chain": "Ethereum",
  "to_chain": "Solana",
  "token": "USDC",
  "amount": 100,
  "estimated_gas_usd": 5.25,
  "bridge_fee": 0.10,
  "total_cost_usd": 5.35,
  "estimated_time_minutes": 15,
  "breakdown": {
    "source_chain_gas": 3.50,
    "destination_chain_gas": 1.75,
    "wormhole_protocol_fee": 0.10
  },
  "price_impact": 0.05,
  "min_received": 99.95
}`}
        />

        <Callout type="tip" title="Cost Optimization">
          Bridge fees vary significantly between chains. Consider bridging to Layer 2 solutions like Arbitrum 
          or Base for lower costs.
        </Callout>
      </DocSection>

      <DocSection 
        id="check-transfer-status" 
        title="Check Transfer Status"
        subtitle="GET /check-transfer-status"
      >
        <p className="text-[16px] text-foreground/90 leading-[1.8] mb-6">
          Monitor the progress of a cross-chain transfer using the Wormhole transaction ID or source transaction hash.
        </p>

        <h3 className="font-semibold text-[17px] mb-3">Query Parameters</h3>
        <CodeBlock 
          language="typescript" 
          code={`const { data, error } = await supabase.functions.invoke('check-transfer-status', {
  method: 'GET',
  headers: {
    Authorization: \`Bearer \${accessToken}\`
  },
  // Pass query parameters via body in Supabase functions
  body: {
    tx_id: "wormhole-tx-uuid",
    // OR use source transaction hash
    tx_hash: "0x..."
  }
});`}
        />

        <h3 className="font-semibold text-[17px] mb-3 mt-6">Response</h3>
        <CodeBlock 
          language="json" 
          code={`{
  "tx_id": "wormhole-tx-uuid",
  "status": "completed",
  "from_chain": "Ethereum",
  "to_chain": "Solana",
  "token": "USDC",
  "amount": 100,
  "source_tx_hash": "0x123...",
  "destination_tx_hash": "abc456...",
  "guardian_verified": true,
  "vaa": "0x789...",
  "created_at": "2024-10-22T14:00:00Z",
  "completed_at": "2024-10-22T14:12:00Z",
  "steps": [
    {
      "step": "initiated",
      "status": "completed",
      "timestamp": "2024-10-22T14:00:00Z",
      "tx_hash": "0x123..."
    },
    {
      "step": "guardian_verification",
      "status": "completed",
      "timestamp": "2024-10-22T14:05:00Z",
      "confirmations": 19
    },
    {
      "step": "destination_delivery",
      "status": "completed",
      "timestamp": "2024-10-22T14:12:00Z",
      "tx_hash": "abc456..."
    }
  ]
}`}
        />

        <h3 className="font-semibold text-[17px] mb-3 mt-6">Status Values</h3>
        <div className="space-y-3">
          <div className="border-l-4 border-l-yellow-500 pl-4">
            <code className="text-[14px]">pending</code>
            <p className="text-[14px] text-muted-foreground mt-1">Transaction initiated, waiting for confirmations</p>
          </div>
          <div className="border-l-4 border-l-blue-500 pl-4">
            <code className="text-[14px]">guardian_verification</code>
            <p className="text-[14px] text-muted-foreground mt-1">Waiting for Wormhole guardian signatures (19 required)</p>
          </div>
          <div className="border-l-4 border-l-purple-500 pl-4">
            <code className="text-[14px]">ready_to_claim</code>
            <p className="text-[14px] text-muted-foreground mt-1">VAA available, ready for manual redemption on destination chain</p>
          </div>
          <div className="border-l-4 border-l-green-500 pl-4">
            <code className="text-[14px]">completed</code>
            <p className="text-[14px] text-muted-foreground mt-1">Successfully delivered to destination wallet</p>
          </div>
          <div className="border-l-4 border-l-red-500 pl-4">
            <code className="text-[14px]">failed</code>
            <p className="text-[14px] text-muted-foreground mt-1">Transaction failed (funds are safe and can be recovered)</p>
          </div>
        </div>

        <Callout type="info" title="Manual Redemption">
          Some transfers require manual redemption on the destination chain. When status is <code>ready_to_claim</code>, 
          use the VAA to complete the transfer.
        </Callout>
      </DocSection>

      <DocSection 
        id="fetch-wallet-balances" 
        title="Fetch Wallet Balances"
        subtitle="POST /fetch-wallet-balances"
      >
        <p className="text-[16px] text-foreground/90 leading-[1.8] mb-6">
          Retrieve token balances across multiple chains for a wallet address.
        </p>

        <h3 className="font-semibold text-[17px] mb-3">Request Body</h3>
        <CodeBlock 
          language="typescript" 
          code={`const { data, error } = await supabase.functions.invoke('fetch-wallet-balances', {
  method: 'POST',
  headers: {
    Authorization: \`Bearer \${accessToken}\`,
    'Content-Type': 'application/json'
  },
  body: {
    wallet_address: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    chains: ["Ethereum", "Polygon", "Arbitrum"]
  }
});`}
        />

        <h3 className="font-semibold text-[17px] mb-3 mt-6">Response</h3>
        <CodeBlock 
          language="json" 
          code={`{
  "wallet_address": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
  "total_value_usd": 1547.80,
  "balances": [
    {
      "chain": "Ethereum",
      "native_balance": 0.5,
      "native_symbol": "ETH",
      "native_value_usd": 925.50,
      "tokens": [
        {
          "symbol": "USDC",
          "balance": 500,
          "decimals": 6,
          "value_usd": 500.00,
          "contract_address": "0xA0b86..."
        }
      ]
    },
    {
      "chain": "Polygon",
      "native_balance": 100,
      "native_symbol": "MATIC",
      "native_value_usd": 75.30,
      "tokens": [
        {
          "symbol": "USDC",
          "balance": 47,
          "decimals": 6,
          "value_usd": 47.00,
          "contract_address": "0x2791..."
        }
      ]
    }
  ],
  "last_updated": "2024-10-22T15:30:00Z"
}`}
        />
      </DocSection>

      <DocSection 
        id="wormhole-portfolio-fetcher" 
        title="Wormhole Portfolio Fetcher"
        subtitle="POST /wormhole-portfolio-fetcher"
      >
        <p className="text-[16px] text-foreground/90 leading-[1.8] mb-6">
          Fetch a comprehensive portfolio snapshot using Wormhole's cross-chain data aggregation.
        </p>

        <h3 className="font-semibold text-[17px] mb-3">Request Body</h3>
        <CodeBlock 
          language="typescript" 
          code={`const { data, error } = await supabase.functions.invoke('wormhole-portfolio-fetcher', {
  method: 'POST',
  headers: {
    Authorization: \`Bearer \${accessToken}\`,
    'Content-Type': 'application/json'
  },
  body: {
    wallet_address: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    network: "mainnet"
  }
});`}
        />

        <h3 className="font-semibold text-[17px] mb-3 mt-6">Response</h3>
        <CodeBlock 
          language="json" 
          code={`{
  "snapshot_id": "snapshot-uuid",
  "wallet_address": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
  "total_value_usd": 2847.95,
  "guardian_verified": true,
  "chains_queried": ["Ethereum", "Solana", "Polygon", "Arbitrum", "Optimism"],
  "snapshot_data": {
    "chains": [...],
    "tokens": [...],
    "nfts": [...]
  },
  "created_at": "2024-10-22T15:30:00Z"
}`}
        />

        <Callout type="tip" title="Guardian Verification">
          Portfolio snapshots with <code>guardian_verified: true</code> have been cross-checked by Wormhole guardians 
          for accuracy.
        </Callout>
      </DocSection>

      <DocSection 
        id="error-codes" 
        title="Error Codes"
      >
        <div className="space-y-4">
          <div className="border-l-4 border-l-red-500 pl-4">
            <code className="text-[14px]">401 - Unauthorized</code>
            <p className="text-[14px] text-muted-foreground mt-1">Missing or invalid authentication token</p>
          </div>
          <div className="border-l-4 border-l-red-500 pl-4">
            <code className="text-[14px]">400 - Unsupported Chain</code>
            <p className="text-[14px] text-muted-foreground mt-1">The specified chain is not supported for bridging</p>
          </div>
          <div className="border-l-4 border-l-red-500 pl-4">
            <code className="text-[14px]">404 - Transaction Not Found</code>
            <p className="text-[14px] text-muted-foreground mt-1">The specified transaction ID or hash was not found</p>
          </div>
          <div className="border-l-4 border-l-red-500 pl-4">
            <code className="text-[14px]">422 - Insufficient Balance</code>
            <p className="text-[14px] text-muted-foreground mt-1">Wallet balance too low for the requested bridge amount</p>
          </div>
          <div className="border-l-4 border-l-red-500 pl-4">
            <code className="text-[14px]">503 - RPC Node Unavailable</code>
            <p className="text-[14px] text-muted-foreground mt-1">Blockchain RPC node is temporarily unavailable</p>
          </div>
        </div>
      </DocSection>

      <DocSection 
        id="best-practices" 
        title="Best Practices"
      >
        <div className="space-y-4">
          <div className="flex gap-4 items-start">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
              <span className="text-primary font-semibold">1</span>
            </div>
            <div>
              <h3 className="font-semibold text-[17px] mb-2">Always Estimate Fees First</h3>
              <p className="text-[15px] text-muted-foreground leading-[1.7]">
                Call the fee estimation endpoint before executing transfers to show users the exact costs.
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
              <span className="text-primary font-semibold">2</span>
            </div>
            <div>
              <h3 className="font-semibold text-[17px] mb-2">Implement Status Polling</h3>
              <p className="text-[15px] text-muted-foreground leading-[1.7]">
                Poll the status endpoint every 30-60 seconds to track transfer progress and notify users of completion.
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
              <span className="text-primary font-semibold">3</span>
            </div>
            <div>
              <h3 className="font-semibold text-[17px] mb-2">Handle Manual Redemptions</h3>
              <p className="text-[15px] text-muted-foreground leading-[1.7]">
                Some transfers require manual redemption. Provide clear instructions when status is <code>ready_to_claim</code>.
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
              <span className="text-primary font-semibold">4</span>
            </div>
            <div>
              <h3 className="font-semibold text-[17px] mb-2">Cache Portfolio Snapshots</h3>
              <p className="text-[15px] text-muted-foreground leading-[1.7]">
                Portfolio fetching can be slow. Cache snapshots and refresh only when needed (e.g., every 5 minutes).
              </p>
            </div>
          </div>
        </div>
      </DocSection>
    </div>
  );
};

export default APIBridgeSwap;
