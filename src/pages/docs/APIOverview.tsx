import { Link } from 'react-router-dom';
import DocSection from '@/components/docs/DocSection';
import Callout from '@/components/docs/Callout';
import CodeBlock from '@/components/docs/CodeBlock';
import { Code, Lock, Zap, Database, RefreshCw } from 'lucide-react';

const APIOverview = () => {
  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-[42px] md:text-[52px] font-bold mb-4 font-playfair text-foreground leading-tight">
          Tempo API Overview
        </h1>
        <p className="text-[18px] text-muted-foreground leading-[1.8] max-w-[720px]">
          Build powerful DeFi applications with Tempo's comprehensive REST APIs. Access user profiles, 
          DePIN rewards, cross-chain bridging, and more.
        </p>
        
        <Callout type="warning" title="Development Status" className="mt-6">
          The Tempo API is currently in active development. Features, endpoints, and response formats may change. 
          We recommend testing thoroughly and staying updated with our changelog for any breaking changes.
        </Callout>
      </div>

      <DocSection 
        id="introduction" 
        title="Introduction"
        subtitle="Learn about Tempo's API capabilities and how to get started"
      >
        <p className="text-[16px] text-foreground/90 leading-[1.8]">
          Tempo provides a suite of RESTful APIs that enable developers to integrate DeFi functionality 
          into their applications. Our APIs are built on Tempo's backend infrastructure and provide secure, scalable 
          access to user data, DePIN networks, and cross-chain operations.
        </p>

        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <div className="border border-border/50 rounded-lg p-6 bg-card/30">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Lock className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-[17px]">Secure by Default</h3>
            </div>
            <p className="text-[14px] text-muted-foreground leading-[1.7]">
              All endpoints use JWT authentication and Row-Level Security (RLS) policies
            </p>
          </div>

          <div className="border border-border/50 rounded-lg p-6 bg-card/30">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Zap className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-[17px]">Real-time Ready</h3>
            </div>
            <p className="text-[14px] text-muted-foreground leading-[1.7]">
              Subscribe to real-time updates for transactions, rewards, and user activities
            </p>
          </div>

          <div className="border border-border/50 rounded-lg p-6 bg-card/30">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Database className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-[17px]">Scalable Infrastructure</h3>
            </div>
            <p className="text-[14px] text-muted-foreground leading-[1.7]">
              Built on Supabase for automatic scaling from prototype to production
            </p>
          </div>

          <div className="border border-border/50 rounded-lg p-6 bg-card/30">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <RefreshCw className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-[17px]">RESTful Design</h3>
            </div>
            <p className="text-[14px] text-muted-foreground leading-[1.7]">
              Standard HTTP methods and JSON responses for easy integration
            </p>
          </div>
        </div>
      </DocSection>

      <DocSection 
        id="base-url" 
        title="Base URL"
        subtitle="All API requests are made to the following base URL"
      >
        <CodeBlock language="bash" code={`https://fhmyhvrejofybzdgzxdc.supabase.co/functions/v1/`} />
        
        <Callout type="info" title="Project-Specific URLs">
          Each Tempo deployment has its own unique base URL. The URL above is for this project's backend.
        </Callout>
      </DocSection>

      <DocSection 
        id="api-categories" 
        title="API Categories"
        subtitle="Tempo APIs are organized into the following categories"
      >
        <div className="space-y-6">
          <div className="border-l-4 border-l-primary pl-6 py-2">
            <h3 className="font-semibold text-[17px] mb-2">
              <Link to="/docs/api/user-management" className="text-primary hover:underline">
                User Management API
              </Link>
            </h3>
            <p className="text-[15px] text-muted-foreground leading-[1.7]">
              Manage user profiles, wallet connections, preferences, and activity history
            </p>
            <div className="flex gap-2 mt-2">
              <code className="text-[13px] px-2 py-1 bg-muted/50 rounded">GET /user-profile</code>
              <code className="text-[13px] px-2 py-1 bg-muted/50 rounded">PUT /user-profile</code>
              <code className="text-[13px] px-2 py-1 bg-muted/50 rounded">GET /user-wallets</code>
            </div>
          </div>

          <div className="border-l-4 border-l-primary pl-6 py-2">
            <h3 className="font-semibold text-[17px] mb-2">
              <Link to="/docs/api/depin" className="text-primary hover:underline">
                DePIN API
              </Link>
            </h3>
            <p className="text-[15px] text-muted-foreground leading-[1.7]">
              Register devices, track rewards, and manage DePIN network participation
            </p>
            <div className="flex gap-2 mt-2">
              <code className="text-[13px] px-2 py-1 bg-muted/50 rounded">POST /report-device-event</code>
              <code className="text-[13px] px-2 py-1 bg-muted/50 rounded">GET /check-pending-rewards</code>
            </div>
          </div>

          <div className="border-l-4 border-l-primary pl-6 py-2">
            <h3 className="font-semibold text-[17px] mb-2">
              <Link to="/docs/api/bridge-swap" className="text-primary hover:underline">
                Bridge & Swap API
              </Link>
            </h3>
            <p className="text-[15px] text-muted-foreground leading-[1.7]">
              Execute cross-chain transfers, estimate fees, and monitor transaction status
            </p>
            <div className="flex gap-2 mt-2">
              <code className="text-[13px] px-2 py-1 bg-muted/50 rounded">POST /estimate-bridge-fees</code>
              <code className="text-[13px] px-2 py-1 bg-muted/50 rounded">GET /check-transfer-status</code>
            </div>
          </div>
        </div>
      </DocSection>

      <DocSection 
        id="quick-start" 
        title="Quick Start"
        subtitle="Get started with the Tempo API in minutes"
      >
        <div className="space-y-4">
          <p className="text-[16px] text-foreground/90 leading-[1.8]">
            Here's a quick example of authenticating and fetching a user profile:
          </p>

          <CodeBlock 
            language="typescript" 
            code={`import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client
const supabase = createClient(
  'https://fhmyhvrejofybzdgzxdc.supabase.co',
  'your-anon-key'
);

// Sign in the user
const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'secure-password'
});

if (authError) {
  console.error('Authentication failed:', authError);
  return;
}

// Get the access token
const token = authData.session.access_token;

// Call the user-profile API
const { data, error } = await supabase.functions.invoke('user-profile', {
  method: 'GET',
  headers: {
    Authorization: \`Bearer \${token}\`
  }
});

console.log('User profile:', data);`}
          />

          <Callout type="tip" title="Using the Supabase Client">
            We recommend using the Supabase JavaScript client library for seamless integration with 
            authentication and function invocation.
          </Callout>
        </div>
      </DocSection>

      <DocSection 
        id="next-steps" 
        title="Next Steps"
      >
        <div className="grid md:grid-cols-2 gap-4">
          <Link 
            to="/docs/api/authentication"
            className="border border-border/50 rounded-lg p-6 hover:border-primary/50 transition-colors bg-card/30"
          >
            <div className="flex items-center gap-3 mb-2">
              <Lock className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-[17px]">Authentication</h3>
            </div>
            <p className="text-[14px] text-muted-foreground leading-[1.7]">
              Learn how to authenticate API requests with JWT tokens
            </p>
          </Link>

          <Link 
            to="/docs/api/user-management"
            className="border border-border/50 rounded-lg p-6 hover:border-primary/50 transition-colors bg-card/30"
          >
            <div className="flex items-center gap-3 mb-2">
              <Code className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-[17px]">User Management API</h3>
            </div>
            <p className="text-[14px] text-muted-foreground leading-[1.7]">
              Explore user profile and wallet management endpoints
            </p>
          </Link>
        </div>
      </DocSection>
    </div>
  );
};

export default APIOverview;
