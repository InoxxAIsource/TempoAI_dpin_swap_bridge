import DocSection from '@/components/docs/DocSection';
import Callout from '@/components/docs/Callout';
import CodeBlock from '@/components/docs/CodeBlock';
import { User, Wallet, Settings, Activity } from 'lucide-react';

const APIUserManagement = () => {
  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-[42px] md:text-[52px] font-bold mb-4 font-playfair text-foreground leading-tight">
          User Management API
        </h1>
        <p className="text-[18px] text-muted-foreground leading-[1.8] max-w-[720px]">
          Manage user profiles, wallet connections, preferences, and activity history through our comprehensive API endpoints.
        </p>
      </div>

      <DocSection 
        id="endpoints-overview" 
        title="Endpoints Overview"
      >
        <div className="grid md:grid-cols-2 gap-6">
          <div className="border border-border/50 rounded-lg p-6 bg-card/30">
            <div className="flex items-center gap-3 mb-3">
              <User className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-[17px]">User Profile</h3>
            </div>
            <p className="text-[14px] text-muted-foreground leading-[1.7] mb-3">
              Fetch and update user profile information, stats, and preferences
            </p>
            <div className="space-y-1">
              <code className="text-[13px] px-2 py-1 bg-muted/50 rounded block">GET /user-profile</code>
              <code className="text-[13px] px-2 py-1 bg-muted/50 rounded block">PUT /user-profile</code>
            </div>
          </div>

          <div className="border border-border/50 rounded-lg p-6 bg-card/30">
            <div className="flex items-center gap-3 mb-3">
              <Wallet className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-[17px]">Wallet Connections</h3>
            </div>
            <p className="text-[14px] text-muted-foreground leading-[1.7] mb-3">
              Manage connected wallets and set primary wallet preferences
            </p>
            <div className="space-y-1">
              <code className="text-[13px] px-2 py-1 bg-muted/50 rounded block">GET /user-wallets</code>
              <code className="text-[13px] px-2 py-1 bg-muted/50 rounded block">POST /user-wallets</code>
              <code className="text-[13px] px-2 py-1 bg-muted/50 rounded block">DELETE /user-wallets</code>
            </div>
          </div>
        </div>
      </DocSection>

      <DocSection 
        id="get-profile" 
        title="Get User Profile"
        subtitle="GET /user-profile"
      >
        <p className="text-[16px] text-foreground/90 leading-[1.8] mb-6">
          Retrieve the authenticated user's complete profile including stats, connected wallets, and recent activity.
        </p>

        <h3 className="font-semibold text-[17px] mb-3">Request</h3>
        <CodeBlock 
          language="typescript" 
          code={`const { data, error } = await supabase.functions.invoke('user-profile', {
  method: 'GET',
  headers: {
    Authorization: \`Bearer \${accessToken}\`
  }
});

console.log(data);`}
        />

        <h3 className="font-semibold text-[17px] mb-3 mt-6">Response</h3>
        <CodeBlock 
          language="json" 
          code={`{
  "profile": {
    "id": "user-uuid",
    "username": "johndoe",
    "avatar_url": "https://...",
    "preferred_chain": "Solana",
    "auto_claim_threshold": 100,
    "gas_alerts_enabled": true,
    "notification_preferences": {
      "email": true,
      "push": false,
      "telegram": false
    },
    "total_bridges": 15,
    "total_swaps": 32,
    "total_depin_earnings": 450.75,
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-10-22T14:20:00Z"
  },
  "wallets": [
    {
      "id": "wallet-uuid",
      "wallet_address": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
      "chain_type": "evm",
      "chain_name": "Ethereum",
      "is_primary": true,
      "connected_at": "2024-01-15T10:35:00Z"
    }
  ],
  "recent_activity": [
    {
      "id": "activity-uuid",
      "activity_type": "bridge",
      "status": "completed",
      "details": {
        "from_chain": "Ethereum",
        "to_chain": "Solana",
        "amount": 100
      },
      "created_at": "2024-10-22T12:00:00Z",
      "completed_at": "2024-10-22T12:05:00Z"
    }
  ],
  "stats": {
    "total_activities": 47,
    "completed_activities": 42,
    "pending_activities": 3,
    "failed_activities": 2
  }
}`}
        />

        <Callout type="info" title="Stats Auto-Update">
          User stats are automatically updated via database triggers when activities are completed.
        </Callout>
      </DocSection>

      <DocSection 
        id="update-profile" 
        title="Update User Profile"
        subtitle="PUT /user-profile"
      >
        <p className="text-[16px] text-foreground/90 leading-[1.8] mb-6">
          Update user profile preferences and settings.
        </p>

        <h3 className="font-semibold text-[17px] mb-3">Request Body</h3>
        <CodeBlock 
          language="typescript" 
          code={`const { data, error } = await supabase.functions.invoke('user-profile', {
  method: 'PUT',
  headers: {
    Authorization: \`Bearer \${accessToken}\`,
    'Content-Type': 'application/json'
  },
  body: {
    username: 'newusername',
    preferred_chain: 'Arbitrum',
    auto_claim_threshold: 150,
    gas_alerts_enabled: false,
    notification_preferences: {
      email: true,
      push: true,
      telegram: false
    }
  }
});`}
        />

        <h3 className="font-semibold text-[17px] mb-3 mt-6">Allowed Fields</h3>
        <div className="space-y-3">
          <div className="border-l-4 border-l-primary/50 pl-4">
            <code className="text-[14px]">username</code>
            <p className="text-[14px] text-muted-foreground mt-1">User's display name (string)</p>
          </div>
          <div className="border-l-4 border-l-primary/50 pl-4">
            <code className="text-[14px]">avatar_url</code>
            <p className="text-[14px] text-muted-foreground mt-1">URL to user's avatar image (string)</p>
          </div>
          <div className="border-l-4 border-l-primary/50 pl-4">
            <code className="text-[14px]">preferred_chain</code>
            <p className="text-[14px] text-muted-foreground mt-1">User's preferred blockchain (string)</p>
          </div>
          <div className="border-l-4 border-l-primary/50 pl-4">
            <code className="text-[14px]">auto_claim_threshold</code>
            <p className="text-[14px] text-muted-foreground mt-1">Minimum amount for auto-claiming rewards (number)</p>
          </div>
          <div className="border-l-4 border-l-primary/50 pl-4">
            <code className="text-[14px]">gas_alerts_enabled</code>
            <p className="text-[14px] text-muted-foreground mt-1">Enable/disable gas price alerts (boolean)</p>
          </div>
          <div className="border-l-4 border-l-primary/50 pl-4">
            <code className="text-[14px]">notification_preferences</code>
            <p className="text-[14px] text-muted-foreground mt-1">Notification channel preferences (object)</p>
          </div>
        </div>

        <h3 className="font-semibold text-[17px] mb-3 mt-6">Response</h3>
        <CodeBlock 
          language="json" 
          code={`{
  "profile": {
    "id": "user-uuid",
    "username": "newusername",
    "preferred_chain": "Arbitrum",
    "auto_claim_threshold": 150,
    "gas_alerts_enabled": false,
    "notification_preferences": {
      "email": true,
      "push": true,
      "telegram": false
    },
    "updated_at": "2024-10-22T15:30:00Z"
  }
}`}
        />
      </DocSection>

      <DocSection 
        id="get-wallets" 
        title="Get Connected Wallets"
        subtitle="GET /user-wallets"
      >
        <p className="text-[16px] text-foreground/90 leading-[1.8] mb-6">
          Retrieve all wallet connections for the authenticated user.
        </p>

        <h3 className="font-semibold text-[17px] mb-3">Request</h3>
        <CodeBlock 
          language="typescript" 
          code={`const { data, error } = await supabase.functions.invoke('user-wallets', {
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
  "wallets": [
    {
      "id": "wallet-uuid-1",
      "wallet_address": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
      "chain_type": "evm",
      "chain_name": "Ethereum",
      "is_primary": true,
      "connected_at": "2024-01-15T10:35:00Z"
    },
    {
      "id": "wallet-uuid-2",
      "wallet_address": "9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM",
      "chain_type": "solana",
      "chain_name": "Solana",
      "is_primary": false,
      "connected_at": "2024-02-20T14:20:00Z"
    }
  ]
}`}
        />
      </DocSection>

      <DocSection 
        id="connect-wallet" 
        title="Connect Wallet"
        subtitle="POST /user-wallets"
      >
        <p className="text-[16px] text-foreground/90 leading-[1.8] mb-6">
          Connect a new wallet to the user's account.
        </p>

        <h3 className="font-semibold text-[17px] mb-3">Request Body</h3>
        <CodeBlock 
          language="typescript" 
          code={`const { data, error } = await supabase.functions.invoke('user-wallets', {
  method: 'POST',
  headers: {
    Authorization: \`Bearer \${accessToken}\`,
    'Content-Type': 'application/json'
  },
  body: {
    wallet_address: "9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM",
    chain_type: "solana",
    chain_name: "Solana"
  }
});`}
        />

        <Callout type="tip" title="First Wallet as Primary">
          If this is the first wallet connected to the account, it will automatically be set as the primary wallet.
        </Callout>

        <h3 className="font-semibold text-[17px] mb-3 mt-6">Response</h3>
        <CodeBlock 
          language="json" 
          code={`{
  "wallet": {
    "id": "wallet-uuid",
    "wallet_address": "9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM",
    "chain_type": "solana",
    "chain_name": "Solana",
    "is_primary": false,
    "connected_at": "2024-10-22T15:45:00Z"
  }
}`}
        />
      </DocSection>

      <DocSection 
        id="disconnect-wallet" 
        title="Disconnect Wallet"
        subtitle="DELETE /user-wallets"
      >
        <p className="text-[16px] text-foreground/90 leading-[1.8] mb-6">
          Remove a wallet connection from the user's account.
        </p>

        <h3 className="font-semibold text-[17px] mb-3">Request Body</h3>
        <CodeBlock 
          language="typescript" 
          code={`const { data, error } = await supabase.functions.invoke('user-wallets', {
  method: 'DELETE',
  headers: {
    Authorization: \`Bearer \${accessToken}\`,
    'Content-Type': 'application/json'
  },
  body: {
    wallet_id: "wallet-uuid"
  }
});`}
        />

        <Callout type="warning" title="Primary Wallet Update">
          If you disconnect the primary wallet, another wallet will automatically be promoted to primary.
        </Callout>

        <h3 className="font-semibold text-[17px] mb-3 mt-6">Response</h3>
        <CodeBlock 
          language="json" 
          code={`{
  "message": "Wallet disconnected successfully",
  "new_primary_wallet_id": "wallet-uuid-2"
}`}
        />
      </DocSection>

      <DocSection 
        id="set-primary-wallet" 
        title="Set Primary Wallet"
        subtitle="PUT /user-wallets"
      >
        <p className="text-[16px] text-foreground/90 leading-[1.8] mb-6">
          Set a specific wallet as the primary wallet for the user's account.
        </p>

        <h3 className="font-semibold text-[17px] mb-3">Request Body</h3>
        <CodeBlock 
          language="typescript" 
          code={`const { data, error } = await supabase.functions.invoke('user-wallets', {
  method: 'PUT',
  headers: {
    Authorization: \`Bearer \${accessToken}\`,
    'Content-Type': 'application/json'
  },
  body: {
    wallet_id: "wallet-uuid"
  }
});`}
        />

        <h3 className="font-semibold text-[17px] mb-3 mt-6">Response</h3>
        <CodeBlock 
          language="json" 
          code={`{
  "message": "Primary wallet updated successfully"
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
            <code className="text-[14px]">404 - Not Found</code>
            <p className="text-[14px] text-muted-foreground mt-1">Wallet or profile not found</p>
          </div>
          <div className="border-l-4 border-l-red-500 pl-4">
            <code className="text-[14px]">409 - Conflict</code>
            <p className="text-[14px] text-muted-foreground mt-1">Wallet already connected to another account</p>
          </div>
          <div className="border-l-4 border-l-red-500 pl-4">
            <code className="text-[14px]">422 - Unprocessable Entity</code>
            <p className="text-[14px] text-muted-foreground mt-1">Invalid request body or parameters</p>
          </div>
        </div>
      </DocSection>
    </div>
  );
};

export default APIUserManagement;
