import DocSection from '@/components/docs/DocSection';
import Callout from '@/components/docs/Callout';
import CodeBlock from '@/components/docs/CodeBlock';
import { Code, Package, BookOpen, Github } from 'lucide-react';

const APISDKReference = () => {
  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-[42px] md:text-[52px] font-bold mb-4 font-playfair text-foreground leading-tight">
          SDK Reference
        </h1>
        <p className="text-[18px] text-muted-foreground leading-[1.8] max-w-[720px]">
          TypeScript SDK for seamless integration with Tempo APIs. Type-safe, fully documented, and easy to use.
        </p>
      </div>

      <DocSection 
        id="installation" 
        title="Installation"
        subtitle="Install the Tempo SDK via npm or yarn"
      >
        <CodeBlock 
          language="bash" 
          code={`# Using npm
npm install @tempo/sdk @supabase/supabase-js

# Using yarn
yarn add @tempo/sdk @supabase/supabase-js

# Using pnpm
pnpm add @tempo/sdk @supabase/supabase-js`}
        />

        <Callout type="info" title="Coming Soon">
          The Tempo SDK is currently in development. For now, use the Supabase client directly as shown in the API documentation.
        </Callout>
      </DocSection>

      <DocSection 
        id="quickstart" 
        title="Quick Start"
        subtitle="Initialize and start using the SDK"
      >
        <h3 className="font-semibold text-[17px] mb-3">Basic Setup</h3>
        <CodeBlock 
          language="typescript" 
          code={`import { TempoClient } from '@tempo/sdk';

// Initialize the client
const tempo = new TempoClient({
  url: 'https://fhmyhvrejofybzdgzxdc.supabase.co',
  anonKey: 'your-anon-key'
});

// Sign in
await tempo.auth.signIn({
  email: 'user@example.com',
  password: 'secure-password'
});

// Fetch user profile
const profile = await tempo.users.getProfile();
console.log(profile);

// Connect a wallet
await tempo.wallets.connect({
  address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
  chainType: 'evm',
  chainName: 'Ethereum'
});`}
        />
      </DocSection>

      <DocSection 
        id="authentication" 
        title="Authentication Module"
        subtitle="tempo.auth"
      >
        <h3 className="font-semibold text-[17px] mb-3">Sign Up</h3>
        <CodeBlock 
          language="typescript" 
          code={`const { user, session } = await tempo.auth.signUp({
  email: 'user@example.com',
  password: 'secure-password',
  username: 'johndoe'
});`}
        />

        <h3 className="font-semibold text-[17px] mb-3 mt-6">Sign In</h3>
        <CodeBlock 
          language="typescript" 
          code={`const { user, session } = await tempo.auth.signIn({
  email: 'user@example.com',
  password: 'secure-password'
});`}
        />

        <h3 className="font-semibold text-[17px] mb-3 mt-6">Sign Out</h3>
        <CodeBlock 
          language="typescript" 
          code={`await tempo.auth.signOut();`}
        />

        <h3 className="font-semibold text-[17px] mb-3 mt-6">Get Current User</h3>
        <CodeBlock 
          language="typescript" 
          code={`const user = tempo.auth.getCurrentUser();
console.log(user);`}
        />
      </DocSection>

      <DocSection 
        id="users" 
        title="User Management Module"
        subtitle="tempo.users"
      >
        <h3 className="font-semibold text-[17px] mb-3">Get Profile</h3>
        <CodeBlock 
          language="typescript" 
          code={`const profile = await tempo.users.getProfile();

// Returns: UserProfile with stats, wallets, and recent activity
console.log(profile.stats.total_bridges);
console.log(profile.wallets);
console.log(profile.recent_activity);`}
        />

        <h3 className="font-semibold text-[17px] mb-3 mt-6">Update Profile</h3>
        <CodeBlock 
          language="typescript" 
          code={`await tempo.users.updateProfile({
  username: 'newusername',
  preferred_chain: 'Arbitrum',
  auto_claim_threshold: 150,
  gas_alerts_enabled: false
});`}
        />
      </DocSection>

      <DocSection 
        id="wallets" 
        title="Wallet Management Module"
        subtitle="tempo.wallets"
      >
        <h3 className="font-semibold text-[17px] mb-3">List Wallets</h3>
        <CodeBlock 
          language="typescript" 
          code={`const wallets = await tempo.wallets.list();

wallets.forEach(wallet => {
  console.log(\`\${wallet.chain_name}: \${wallet.wallet_address}\`);
  console.log(\`Primary: \${wallet.is_primary}\`);
});`}
        />

        <h3 className="font-semibold text-[17px] mb-3 mt-6">Connect Wallet</h3>
        <CodeBlock 
          language="typescript" 
          code={`const wallet = await tempo.wallets.connect({
  address: '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM',
  chainType: 'solana',
  chainName: 'Solana'
});

console.log('Connected wallet:', wallet.id);`}
        />

        <h3 className="font-semibold text-[17px] mb-3 mt-6">Disconnect Wallet</h3>
        <CodeBlock 
          language="typescript" 
          code={`await tempo.wallets.disconnect(walletId);`}
        />

        <h3 className="font-semibold text-[17px] mb-3 mt-6">Set Primary Wallet</h3>
        <CodeBlock 
          language="typescript" 
          code={`await tempo.wallets.setPrimary(walletId);`}
        />
      </DocSection>

      <DocSection 
        id="depin" 
        title="DePIN Module"
        subtitle="tempo.depin"
      >
        <h3 className="font-semibold text-[17px] mb-3">Report Device Event</h3>
        <CodeBlock 
          language="typescript" 
          code={`const event = await tempo.depin.reportEvent({
  deviceId: 'device-12345',
  eventType: 'uptime_report',
  metrics: {
    uptime_hours: 24,
    data_transferred_gb: 150.5,
    cpu_usage_avg: 45.2
  }
});

console.log('Reward earned:', event.reward_amount);`}
        />

        <h3 className="font-semibold text-[17px] mb-3 mt-6">Check Pending Rewards</h3>
        <CodeBlock 
          language="typescript" 
          code={`const rewards = await tempo.depin.getPendingRewards();

console.log('Total pending:', rewards.total_pending);
console.log('By chain:', rewards.rewards_by_chain);
console.log('By device:', rewards.rewards_by_device);`}
        />

        <h3 className="font-semibold text-[17px] mb-3 mt-6">Create Batch Claim</h3>
        <CodeBlock 
          language="typescript" 
          code={`const claim = await tempo.depin.createBatchClaim({
  deviceIds: ['device-12345', 'device-67890'],
  destinationChain: 'Solana',
  destinationAddress: '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM'
});

console.log('Claim ID:', claim.claim_id);
console.log('Status:', claim.status);
console.log('Estimated completion:', claim.estimated_completion);`}
        />
      </DocSection>

      <DocSection 
        id="bridge" 
        title="Bridge Module"
        subtitle="tempo.bridge"
      >
        <h3 className="font-semibold text-[17px] mb-3">Estimate Fees</h3>
        <CodeBlock 
          language="typescript" 
          code={`const estimate = await tempo.bridge.estimateFees({
  fromChain: 'Ethereum',
  toChain: 'Solana',
  token: 'USDC',
  amount: 100
});

console.log('Total cost:', estimate.total_cost_usd);
console.log('Gas fees:', estimate.estimated_gas_usd);
console.log('Bridge fee:', estimate.bridge_fee);
console.log('Estimated time:', estimate.estimated_time_minutes);`}
        />

        <h3 className="font-semibold text-[17px] mb-3 mt-6">Check Transfer Status</h3>
        <CodeBlock 
          language="typescript" 
          code={`const status = await tempo.bridge.getTransferStatus(txId);

console.log('Status:', status.status);
console.log('From:', status.from_chain);
console.log('To:', status.to_chain);
console.log('Steps:', status.steps);

// Subscribe to status updates
tempo.bridge.onStatusChange(txId, (newStatus) => {
  console.log('Status updated:', newStatus.status);
  if (newStatus.status === 'completed') {
    console.log('Transfer completed!');
  }
});`}
        />

        <h3 className="font-semibold text-[17px] mb-3 mt-6">Fetch Wallet Balances</h3>
        <CodeBlock 
          language="typescript" 
          code={`const balances = await tempo.bridge.getWalletBalances({
  address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
  chains: ['Ethereum', 'Polygon', 'Arbitrum']
});

console.log('Total value:', balances.total_value_usd);
balances.balances.forEach(chain => {
  console.log(\`\${chain.chain}: \${chain.native_balance} \${chain.native_symbol}\`);
});`}
        />
      </DocSection>

      <DocSection 
        id="error-handling" 
        title="Error Handling"
      >
        <p className="text-[16px] text-foreground/90 leading-[1.8] mb-6">
          The SDK provides typed error classes for easier error handling:
        </p>

        <CodeBlock 
          language="typescript" 
          code={`import { TempoError, AuthError, RateLimitError, ValidationError } from '@tempo/sdk';

try {
  await tempo.users.updateProfile({ username: 'newname' });
} catch (error) {
  if (error instanceof AuthError) {
    console.error('Authentication failed:', error.message);
    // Redirect to login
  } else if (error instanceof RateLimitError) {
    console.error('Rate limited. Retry after:', error.retryAfter);
    // Wait and retry
  } else if (error instanceof ValidationError) {
    console.error('Invalid input:', error.fields);
    // Show validation errors to user
  } else if (error instanceof TempoError) {
    console.error('API error:', error.message, error.statusCode);
  } else {
    console.error('Unknown error:', error);
  }
}`}
        />
      </DocSection>

      <DocSection 
        id="typescript-support" 
        title="TypeScript Support"
      >
        <p className="text-[16px] text-foreground/90 leading-[1.8] mb-6">
          The SDK is written in TypeScript and provides full type definitions:
        </p>

        <CodeBlock 
          language="typescript" 
          code={`import type { 
  UserProfile, 
  WalletConnection, 
  PendingRewards,
  BridgeFeeEstimate,
  TransferStatus 
} from '@tempo/sdk';

// All API responses are fully typed
const profile: UserProfile = await tempo.users.getProfile();
const wallets: WalletConnection[] = await tempo.wallets.list();
const rewards: PendingRewards = await tempo.depin.getPendingRewards();
const estimate: BridgeFeeEstimate = await tempo.bridge.estimateFees({...});
const status: TransferStatus = await tempo.bridge.getTransferStatus(txId);`}
        />
      </DocSection>

      <DocSection 
        id="realtime-subscriptions" 
        title="Real-time Subscriptions"
      >
        <p className="text-[16px] text-foreground/90 leading-[1.8] mb-6">
          Subscribe to real-time updates for user activities, rewards, and transfers:
        </p>

        <CodeBlock 
          language="typescript" 
          code={`// Subscribe to new rewards
const rewardsSubscription = tempo.depin.onNewRewards((reward) => {
  console.log('New reward:', reward.amount, reward.device_id);
  // Update UI
});

// Subscribe to wallet changes
const walletsSubscription = tempo.wallets.onWalletChange((wallet) => {
  console.log('Wallet updated:', wallet.wallet_address);
  // Refresh wallet list
});

// Subscribe to transfer status changes
const transferSubscription = tempo.bridge.onTransferUpdate((transfer) => {
  console.log('Transfer updated:', transfer.tx_id, transfer.status);
  // Update progress bar
});

// Unsubscribe when done
rewardsSubscription.unsubscribe();
walletsSubscription.unsubscribe();
transferSubscription.unsubscribe();`}
        />
      </DocSection>

      <DocSection 
        id="resources" 
        title="Additional Resources"
      >
        <div className="grid md:grid-cols-2 gap-6">
          <div className="border border-border/50 rounded-lg p-6 bg-card/30">
            <div className="flex items-center gap-3 mb-3">
              <Github className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-[17px]">GitHub Repository</h3>
            </div>
            <p className="text-[14px] text-muted-foreground leading-[1.7] mb-3">
              View the SDK source code, report issues, and contribute
            </p>
            <a 
              href="https://github.com/tempo-protocol/sdk" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline text-[14px]"
            >
              github.com/tempo-protocol/sdk →
            </a>
          </div>

          <div className="border border-border/50 rounded-lg p-6 bg-card/30">
            <div className="flex items-center gap-3 mb-3">
              <Package className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-[17px]">NPM Package</h3>
            </div>
            <p className="text-[14px] text-muted-foreground leading-[1.7] mb-3">
              View package details and version history
            </p>
            <a 
              href="https://www.npmjs.com/package/@tempo/sdk" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline text-[14px]"
            >
              npmjs.com/package/@tempo/sdk →
            </a>
          </div>

          <div className="border border-border/50 rounded-lg p-6 bg-card/30">
            <div className="flex items-center gap-3 mb-3">
              <BookOpen className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-[17px]">Example Projects</h3>
            </div>
            <p className="text-[14px] text-muted-foreground leading-[1.7] mb-3">
              Explore example integrations and use cases
            </p>
            <a 
              href="https://github.com/tempo-protocol/examples" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline text-[14px]"
            >
              View examples →
            </a>
          </div>

          <div className="border border-border/50 rounded-lg p-6 bg-card/30">
            <div className="flex items-center gap-3 mb-3">
              <Code className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-[17px]">API Reference</h3>
            </div>
            <p className="text-[14px] text-muted-foreground leading-[1.7] mb-3">
              Complete API documentation and guides
            </p>
            <a 
              href="/docs/api/overview" 
              className="text-primary hover:underline text-[14px]"
            >
              View API docs →
            </a>
          </div>
        </div>
      </DocSection>
    </div>
  );
};

export default APISDKReference;
