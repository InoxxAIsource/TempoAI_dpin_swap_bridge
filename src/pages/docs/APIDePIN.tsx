import DocSection from '@/components/docs/DocSection';
import Callout from '@/components/docs/Callout';
import CodeBlock from '@/components/docs/CodeBlock';
import { Cpu, TrendingUp, Gift, Database } from 'lucide-react';

const APIDePIN = () => {
  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-[42px] md:text-[52px] font-bold mb-4 font-playfair text-foreground leading-tight">
          DePIN API
        </h1>
        <p className="text-[18px] text-muted-foreground leading-[1.8] max-w-[720px]">
          Integrate with the Decentralized Physical Infrastructure Network. Register devices, track performance, 
          and manage reward claims.
        </p>
      </div>

      <DocSection 
        id="endpoints-overview" 
        title="Endpoints Overview"
      >
        <div className="grid md:grid-cols-2 gap-6">
          <div className="border border-border/50 rounded-lg p-6 bg-card/30">
            <div className="flex items-center gap-3 mb-3">
              <Cpu className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-[17px]">Device Management</h3>
            </div>
            <p className="text-[14px] text-muted-foreground leading-[1.7] mb-3">
              Register and monitor DePIN devices
            </p>
            <code className="text-[13px] px-2 py-1 bg-muted/50 rounded block">POST /report-device-event</code>
          </div>

          <div className="border border-border/50 rounded-lg p-6 bg-card/30">
            <div className="flex items-center gap-3 mb-3">
              <Gift className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-[17px]">Reward Management</h3>
            </div>
            <p className="text-[14px] text-muted-foreground leading-[1.7] mb-3">
              Check and claim pending rewards
            </p>
            <div className="space-y-1">
              <code className="text-[13px] px-2 py-1 bg-muted/50 rounded block">GET /check-pending-rewards</code>
              <code className="text-[13px] px-2 py-1 bg-muted/50 rounded block">POST /create-batch-claim</code>
            </div>
          </div>
        </div>
      </DocSection>

      <DocSection 
        id="report-device-event" 
        title="Report Device Event"
        subtitle="POST /report-device-event"
      >
        <p className="text-[16px] text-foreground/90 leading-[1.8] mb-6">
          Report device activity and performance metrics to earn rewards. This endpoint is typically called by IoT devices or monitoring software.
        </p>

        <h3 className="font-semibold text-[17px] mb-3">Request Body</h3>
        <CodeBlock 
          language="typescript" 
          code={`const { data, error } = await supabase.functions.invoke('report-device-event', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: {
    device_id: "device-12345",
    event_type: "uptime_report",
    metrics: {
      uptime_hours: 24,
      data_transferred_gb: 150.5,
      cpu_usage_avg: 45.2,
      bandwidth_mbps: 100,
      location: {
        lat: 40.7128,
        lng: -74.0060
      }
    },
    signature: "0x..." // Optional: Device signature for verification
  }
});`}
        />

        <Callout type="info" title="Public Endpoint">
          This endpoint does not require authentication to allow IoT devices to report without user sessions. 
          Use device signatures for verification instead.
        </Callout>

        <h3 className="font-semibold text-[17px] mb-3 mt-6">Event Types</h3>
        <div className="space-y-3">
          <div className="border-l-4 border-l-primary/50 pl-4">
            <code className="text-[14px]">uptime_report</code>
            <p className="text-[14px] text-muted-foreground mt-1">Report device uptime and availability</p>
          </div>
          <div className="border-l-4 border-l-primary/50 pl-4">
            <code className="text-[14px]">data_transfer</code>
            <p className="text-[14px] text-muted-foreground mt-1">Report data bandwidth provided</p>
          </div>
          <div className="border-l-4 border-l-primary/50 pl-4">
            <code className="text-[14px]">storage_provided</code>
            <p className="text-[14px] text-muted-foreground mt-1">Report storage capacity provided</p>
          </div>
          <div className="border-l-4 border-l-primary/50 pl-4">
            <code className="text-[14px]">compute_task</code>
            <p className="text-[14px] text-muted-foreground mt-1">Report compute tasks completed</p>
          </div>
        </div>

        <h3 className="font-semibold text-[17px] mb-3 mt-6">Response</h3>
        <CodeBlock 
          language="json" 
          code={`{
  "event_id": "event-uuid",
  "reward_amount": 0.5,
  "status": "verified",
  "message": "Event recorded and reward calculated"
}`}
        />
      </DocSection>

      <DocSection 
        id="check-pending-rewards" 
        title="Check Pending Rewards"
        subtitle="GET /check-pending-rewards"
      >
        <p className="text-[16px] text-foreground/90 leading-[1.8] mb-6">
          Check the total pending rewards across all registered devices for the authenticated user.
        </p>

        <h3 className="font-semibold text-[17px] mb-3">Request</h3>
        <CodeBlock 
          language="typescript" 
          code={`const { data, error } = await supabase.functions.invoke('check-pending-rewards', {
  method: 'GET',
  headers: {
    Authorization: \`Bearer \${accessToken}\`
  }
});`}
        />

        <h3 className="font-semibold text-[17px] mb-3 mt-6">Response</h3>
        <CodeBlock 
          language="json" 
          code={`{
  "total_pending": 245.75,
  "rewards_by_chain": {
    "Ethereum": 120.5,
    "Solana": 85.25,
    "Arbitrum": 40.0
  },
  "rewards_by_device": [
    {
      "device_id": "device-12345",
      "device_name": "My Storage Node",
      "pending_amount": 150.0,
      "chain": "Ethereum",
      "last_reward_at": "2024-10-22T10:00:00Z"
    },
    {
      "device_id": "device-67890",
      "device_name": "Bandwidth Provider",
      "pending_amount": 95.75,
      "chain": "Solana",
      "last_reward_at": "2024-10-22T12:30:00Z"
    }
  ],
  "claimable": true,
  "next_claim_available_at": "2024-10-23T00:00:00Z"
}`}
        />

        <Callout type="tip" title="Claim Threshold">
          Users can set an auto-claim threshold in their profile. When rewards exceed this amount, 
          they can be automatically claimed.
        </Callout>
      </DocSection>

      <DocSection 
        id="create-batch-claim" 
        title="Create Batch Claim"
        subtitle="POST /create-batch-claim"
      >
        <p className="text-[16px] text-foreground/90 leading-[1.8] mb-6">
          Create a batch claim to withdraw multiple pending rewards across devices and chains in a single transaction.
        </p>

        <h3 className="font-semibold text-[17px] mb-3">Request Body</h3>
        <CodeBlock 
          language="typescript" 
          code={`const { data, error } = await supabase.functions.invoke('create-batch-claim', {
  method: 'POST',
  headers: {
    Authorization: \`Bearer \${accessToken}\`,
    'Content-Type': 'application/json'
  },
  body: {
    device_ids: ["device-12345", "device-67890"],
    destination_chain: "Solana",
    destination_address: "9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM"
  }
});`}
        />

        <h3 className="font-semibold text-[17px] mb-3 mt-6">Response</h3>
        <CodeBlock 
          language="json" 
          code={`{
  "claim_id": "claim-uuid",
  "total_amount": 245.75,
  "destination_chain": "Solana",
  "status": "pending",
  "estimated_completion": "2024-10-22T16:30:00Z",
  "wormhole_tx_id": "wormhole-tx-uuid",
  "steps": [
    {
      "step": 1,
      "description": "Preparing claim on smart contract",
      "status": "in_progress"
    },
    {
      "step": 2,
      "description": "Bridging funds via Wormhole",
      "status": "pending"
    },
    {
      "step": 3,
      "description": "Delivering to destination wallet",
      "status": "pending"
    }
  ]
}`}
        />

        <Callout type="warning" title="Cross-Chain Claims">
          When claiming to a different chain, the process involves Wormhole bridging which may take 5-15 minutes. 
          Monitor the claim status using the wormhole_tx_id.
        </Callout>
      </DocSection>

      <DocSection 
        id="prepare-claim-funds" 
        title="Prepare Claim Funds"
        subtitle="POST /prepare-claim-funds"
      >
        <p className="text-[16px] text-foreground/90 leading-[1.8] mb-6">
          Prepare funds on the smart contract for claiming. This is the first step in the claim process.
        </p>

        <h3 className="font-semibold text-[17px] mb-3">Request Body</h3>
        <CodeBlock 
          language="typescript" 
          code={`const { data, error } = await supabase.functions.invoke('prepare-claim-funds', {
  method: 'POST',
  headers: {
    Authorization: \`Bearer \${accessToken}\`,
    'Content-Type': 'application/json'
  },
  body: {
    claim_id: "claim-uuid",
    device_ids: ["device-12345", "device-67890"]
  }
});`}
        />

        <h3 className="font-semibold text-[17px] mb-3 mt-6">Response</h3>
        <CodeBlock 
          language="json" 
          code={`{
  "contract_tx_hash": "0x...",
  "contract_address": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
  "prepared_amount": 245.75,
  "status": "prepared",
  "block_number": 18234567
}`}
        />
      </DocSection>

      <DocSection 
        id="transfer-reward-eth" 
        title="Transfer Reward ETH"
        subtitle="POST /transfer-reward-eth"
      >
        <p className="text-[16px] text-foreground/90 leading-[1.8] mb-6">
          Transfer prepared rewards from the smart contract to the user's destination wallet.
        </p>

        <h3 className="font-semibold text-[17px] mb-3">Request Body</h3>
        <CodeBlock 
          language="typescript" 
          code={`const { data, error } = await supabase.functions.invoke('transfer-reward-eth', {
  method: 'POST',
  headers: {
    Authorization: \`Bearer \${accessToken}\`,
    'Content-Type': 'application/json'
  },
  body: {
    claim_id: "claim-uuid",
    recipient_address: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    amount: 245.75
  }
});`}
        />

        <h3 className="font-semibold text-[17px] mb-3 mt-6">Response</h3>
        <CodeBlock 
          language="json" 
          code={`{
  "transfer_tx_hash": "0x...",
  "amount_transferred": 245.75,
  "recipient": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
  "gas_used": "0.0021",
  "status": "completed",
  "block_number": 18234568
}`}
        />
      </DocSection>

      <DocSection 
        id="simulate-device-events" 
        title="Simulate Device Events"
        subtitle="POST /simulate-device-events"
      >
        <p className="text-[16px] text-foreground/90 leading-[1.8] mb-6">
          For testing purposes, simulate device events to generate sample rewards data.
        </p>

        <Callout type="warning" title="Testing Only">
          This endpoint is for development and testing only. It should be disabled in production environments.
        </Callout>

        <h3 className="font-semibold text-[17px] mb-3">Request Body</h3>
        <CodeBlock 
          language="typescript" 
          code={`const { data, error } = await supabase.functions.invoke('simulate-device-events', {
  method: 'POST',
  headers: {
    Authorization: \`Bearer \${accessToken}\`,
    'Content-Type': 'application/json'
  },
  body: {
    device_id: "device-12345",
    event_count: 10,
    event_type: "uptime_report"
  }
});`}
        />

        <h3 className="font-semibold text-[17px] mb-3 mt-6">Response</h3>
        <CodeBlock 
          language="json" 
          code={`{
  "events_created": 10,
  "total_rewards_generated": 25.5,
  "device_id": "device-12345"
}`}
        />
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
            <code className="text-[14px]">404 - Device Not Found</code>
            <p className="text-[14px] text-muted-foreground mt-1">The specified device_id is not registered</p>
          </div>
          <div className="border-l-4 border-l-red-500 pl-4">
            <code className="text-[14px]">422 - Below Claim Threshold</code>
            <p className="text-[14px] text-muted-foreground mt-1">Pending rewards are below the minimum claim threshold</p>
          </div>
          <div className="border-l-4 border-l-red-500 pl-4">
            <code className="text-[14px]">429 - Rate Limited</code>
            <p className="text-[14px] text-muted-foreground mt-1">Too many claim requests. Wait before retrying</p>
          </div>
          <div className="border-l-4 border-l-red-500 pl-4">
            <code className="text-[14px]">503 - Smart Contract Error</code>
            <p className="text-[14px] text-muted-foreground mt-1">Error interacting with the smart contract</p>
          </div>
        </div>
      </DocSection>
    </div>
  );
};

export default APIDePIN;
