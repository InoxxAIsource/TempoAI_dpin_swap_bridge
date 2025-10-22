import DocSection from '@/components/docs/DocSection';
import Callout from '@/components/docs/Callout';
import CodeBlock from '@/components/docs/CodeBlock';
import { Zap, Shield, TrendingUp, DollarSign } from 'lucide-react';

const APIRateLimits = () => {
  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-[42px] md:text-[52px] font-bold mb-4 font-playfair text-foreground leading-tight">
          Rate Limits & Pricing
        </h1>
        <p className="text-[18px] text-muted-foreground leading-[1.8] max-w-[720px]">
          Understand Tempo's usage-based pricing model, rate limits, and best practices for optimizing your API usage.
        </p>
      </div>

      <DocSection 
        id="rate-limits" 
        title="Rate Limits"
        subtitle="API request limits per user and endpoint"
      >
        <p className="text-[16px] text-foreground/90 leading-[1.8] mb-6">
          Tempo implements rate limiting to ensure fair usage and system stability. Limits are applied per authenticated user.
        </p>

        <div className="border border-border/50 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-4 font-semibold text-[15px]">Endpoint Category</th>
                <th className="text-left p-4 font-semibold text-[15px]">Rate Limit</th>
                <th className="text-left p-4 font-semibold text-[15px]">Window</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              <tr>
                <td className="p-4 text-[14px]">Authentication (signup/login)</td>
                <td className="p-4 text-[14px] font-mono">10 requests</td>
                <td className="p-4 text-[14px]">per 15 minutes</td>
              </tr>
              <tr>
                <td className="p-4 text-[14px]">User Profile & Wallets</td>
                <td className="p-4 text-[14px] font-mono">100 requests</td>
                <td className="p-4 text-[14px]">per minute</td>
              </tr>
              <tr>
                <td className="p-4 text-[14px]">DePIN Device Events</td>
                <td className="p-4 text-[14px] font-mono">1000 requests</td>
                <td className="p-4 text-[14px]">per minute</td>
              </tr>
              <tr>
                <td className="p-4 text-[14px]">DePIN Reward Claims</td>
                <td className="p-4 text-[14px] font-mono">10 requests</td>
                <td className="p-4 text-[14px]">per hour</td>
              </tr>
              <tr>
                <td className="p-4 text-[14px]">Bridge Fee Estimates</td>
                <td className="p-4 text-[14px] font-mono">60 requests</td>
                <td className="p-4 text-[14px]">per minute</td>
              </tr>
              <tr>
                <td className="p-4 text-[14px]">Transfer Status Checks</td>
                <td className="p-4 text-[14px] font-mono">120 requests</td>
                <td className="p-4 text-[14px]">per minute</td>
              </tr>
              <tr>
                <td className="p-4 text-[14px]">Portfolio Fetching</td>
                <td className="p-4 text-[14px] font-mono">20 requests</td>
                <td className="p-4 text-[14px]">per hour</td>
              </tr>
            </tbody>
          </table>
        </div>

        <Callout type="info" title="Rate Limit Headers">
          All API responses include rate limit headers: <code>X-RateLimit-Limit</code>, <code>X-RateLimit-Remaining</code>, 
          and <code>X-RateLimit-Reset</code>
        </Callout>
      </DocSection>

      <DocSection 
        id="handling-rate-limits" 
        title="Handling Rate Limits"
        subtitle="Best practices for staying within limits"
      >
        <p className="text-[16px] text-foreground/90 leading-[1.8] mb-6">
          When you exceed a rate limit, the API returns a <code>429 Too Many Requests</code> status code with details on when you can retry.
        </p>

        <h3 className="font-semibold text-[17px] mb-3">Error Response</h3>
        <CodeBlock 
          language="json" 
          code={`{
  "error": "Rate limit exceeded",
  "message": "Too many requests. Please retry after 2024-10-22T16:00:00Z",
  "retry_after": 45,
  "limit": 100,
  "window": "1 minute"
}`}
        />

        <h3 className="font-semibold text-[17px] mb-3 mt-6">Implementing Retry Logic</h3>
        <CodeBlock 
          language="typescript" 
          code={`async function callAPIWithRetry(endpoint: string, options: any, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const { data, error } = await supabase.functions.invoke(endpoint, options);
      
      if (error) {
        if (error.status === 429) {
          // Rate limited - wait and retry
          const retryAfter = error.retry_after || 60;
          console.log(\`Rate limited. Retrying after \${retryAfter} seconds...\`);
          await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
          continue;
        }
        throw error;
      }
      
      return data;
    } catch (err) {
      if (i === maxRetries - 1) throw err;
    }
  }
}

// Usage
const profile = await callAPIWithRetry('user-profile', {
  method: 'GET',
  headers: { Authorization: \`Bearer \${token}\` }
});`}
        />
      </DocSection>

      <DocSection 
        id="usage-tiers" 
        title="Usage Tiers"
        subtitle="Lovable Cloud pricing based on actual usage"
      >
        <p className="text-[16px] text-foreground/90 leading-[1.8] mb-6">
          Tempo runs on Lovable Cloud with usage-based pricing. You only pay for what you use, with generous free tier limits.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="border border-border/50 rounded-lg p-6 bg-card/30">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <Zap className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-[18px]">Free Tier</h3>
            </div>
            <p className="text-[24px] font-bold mb-2">$0<span className="text-[16px] font-normal text-muted-foreground">/month</span></p>
            <ul className="space-y-2 text-[14px] text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">✓</span>
                <span>500 MB database storage</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">✓</span>
                <span>10,000 edge function invocations</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">✓</span>
                <span>1 GB file storage</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">✓</span>
                <span>Community support</span>
              </li>
            </ul>
          </div>

          <div className="border-2 border-primary rounded-lg p-6 bg-primary/5 relative">
            <div className="absolute -top-3 left-6 px-3 py-1 bg-primary text-primary-foreground text-[12px] font-semibold rounded-full">
              POPULAR
            </div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-primary/20">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-[18px]">Pay As You Go</h3>
            </div>
            <p className="text-[24px] font-bold mb-2">Usage-Based</p>
            <ul className="space-y-2 text-[14px] text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">✓</span>
                <span>$0.125 per GB database storage</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">✓</span>
                <span>$2 per 1M edge function invocations</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">✓</span>
                <span>$0.021 per GB file storage</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">✓</span>
                <span>Email support</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">✓</span>
                <span>Higher rate limits</span>
              </li>
            </ul>
          </div>

          <div className="border border-border/50 rounded-lg p-6 bg-card/30">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-[18px]">Enterprise</h3>
            </div>
            <p className="text-[24px] font-bold mb-2">Custom</p>
            <ul className="space-y-2 text-[14px] text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">✓</span>
                <span>Dedicated infrastructure</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">✓</span>
                <span>Custom rate limits</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">✓</span>
                <span>SLA guarantees</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">✓</span>
                <span>Priority support</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">✓</span>
                <span>Custom contract</span>
              </li>
            </ul>
          </div>
        </div>
      </DocSection>

      <DocSection 
        id="cost-breakdown" 
        title="Cost Breakdown"
        subtitle="Understanding your API usage costs"
      >
        <h3 className="font-semibold text-[17px] mb-3">Edge Function Costs</h3>
        <p className="text-[16px] text-foreground/90 leading-[1.8] mb-4">
          Each API call to Tempo endpoints counts as one edge function invocation.
        </p>

        <div className="border border-border/50 rounded-lg p-6 bg-muted/20 mb-6">
          <h4 className="font-semibold text-[16px] mb-3">Example Monthly Usage</h4>
          <div className="space-y-2 text-[14px]">
            <div className="flex justify-between">
              <span>100,000 API calls</span>
              <span className="font-mono">$0.20</span>
            </div>
            <div className="flex justify-between">
              <span>2 GB database storage</span>
              <span className="font-mono">$0.25</span>
            </div>
            <div className="flex justify-between">
              <span>5 GB file storage</span>
              <span className="font-mono">$0.11</span>
            </div>
            <div className="border-t border-border/50 pt-2 mt-2 flex justify-between font-semibold">
              <span>Total</span>
              <span className="font-mono">$0.56</span>
            </div>
          </div>
        </div>

        <Callout type="tip" title="Free Tier First">
          Free tier resources are consumed first each month before any charges apply.
        </Callout>
      </DocSection>

      <DocSection 
        id="optimization-tips" 
        title="Optimization Tips"
        subtitle="Reduce costs and stay within rate limits"
      >
        <div className="space-y-4">
          <div className="flex gap-4 items-start">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
              <span className="text-primary font-semibold">1</span>
            </div>
            <div>
              <h3 className="font-semibold text-[17px] mb-2">Cache Responses</h3>
              <p className="text-[15px] text-muted-foreground leading-[1.7]">
                Cache user profiles, wallet balances, and portfolio data client-side. Refresh only when needed (e.g., every 5 minutes).
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
              <span className="text-primary font-semibold">2</span>
            </div>
            <div>
              <h3 className="font-semibold text-[17px] mb-2">Batch Operations</h3>
              <p className="text-[15px] text-muted-foreground leading-[1.7]">
                Use batch claim endpoints to process multiple devices in a single API call instead of individual requests.
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
              <span className="text-primary font-semibold">3</span>
            </div>
            <div>
              <h3 className="font-semibold text-[17px] mb-2">Use Webhooks</h3>
              <p className="text-[15px] text-muted-foreground leading-[1.7]">
                Instead of polling for status updates, set up webhooks to receive notifications when transfers complete.
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
              <span className="text-primary font-semibold">4</span>
            </div>
            <div>
              <h3 className="font-semibold text-[17px] mb-2">Implement Exponential Backoff</h3>
              <p className="text-[15px] text-muted-foreground leading-[1.7]">
                When retrying failed requests, use exponential backoff to avoid hitting rate limits repeatedly.
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
              <span className="text-primary font-semibold">5</span>
            </div>
            <div>
              <h3 className="font-semibold text-[17px] mb-2">Monitor Your Usage</h3>
              <p className="text-[15px] text-muted-foreground leading-[1.7]">
                Track your API usage through the Lovable Cloud dashboard to identify optimization opportunities.
              </p>
            </div>
          </div>
        </div>
      </DocSection>

      <DocSection 
        id="monitoring" 
        title="Usage Monitoring"
      >
        <p className="text-[16px] text-foreground/90 leading-[1.8] mb-6">
          Monitor your API usage and costs in real-time through the Lovable Cloud backend interface.
        </p>

        <div className="border border-border/50 rounded-lg p-6 bg-card/30">
          <h3 className="font-semibold text-[17px] mb-3">Available Metrics</h3>
          <ul className="space-y-2 text-[15px]">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>Total API calls per endpoint</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>Database storage usage over time</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>File storage consumption</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>Rate limit violations</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>Estimated monthly cost</span>
            </li>
          </ul>
        </div>
      </DocSection>
    </div>
  );
};

export default APIRateLimits;
