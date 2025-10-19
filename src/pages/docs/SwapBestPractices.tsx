import DocSection from '@/components/docs/DocSection';
import FeesBreakdown from '@/components/docs/bridge-swap/FeesBreakdown';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, TrendingUp, AlertTriangle, CheckCircle2, Zap } from 'lucide-react';

const SwapBestPractices = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Swap: Best Practices</h1>
        <p className="text-xl text-muted-foreground">
          Expert strategies for optimal route selection, cost minimization, security, and advanced cross-chain swap techniques
        </p>
      </div>

      <DocSection
        id="route-selection"
        title="Choosing Optimal Swap Routes"
        subtitle="Maximize output, minimize costs"
      >
        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                High-Liquidity Pairs
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-3">
              <p>
                <strong>Best routes:</strong> Stablecoin-to-stablecoin or major-token-to-stablecoin swaps (e.g., ETH → USDC, 
                USDC → USDT) have the deepest liquidity and lowest slippage.
              </p>
              <div className="bg-muted/50 p-3 rounded-lg">
                <p className="text-xs mb-2"><strong>Example:</strong></p>
                <p className="text-xs">✅ Good: ETH (Ethereum) → USDC (Arbitrum) - deep liquidity on both sides</p>
                <p className="text-xs">❌ Avoid: Small altcoin → another small altcoin - high slippage risk</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Consider Two-Step Swaps
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-3">
              <p>
                For exotic token pairs, sometimes it's cheaper/better to do two swaps through a liquid intermediary:
              </p>
              <div className="bg-muted/50 p-3 rounded-lg">
                <p className="text-xs mb-2"><strong>Example:</strong></p>
                <p className="text-xs">Instead of: TokenA (Chain X) → TokenB (Chain Y) directly</p>
                <p className="text-xs mt-1">Consider: TokenA → USDC (Chain X), then bridge USDC to Chain Y, then USDC → TokenB</p>
                <p className="text-xs mt-2"><em>Total fees may be lower due to better liquidity at each step</em></p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Chain Selection Strategy</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-3">
              <p>
                <strong>For large swaps (&gt;$10k):</strong> Use chains with deep DEX liquidity (Ethereum, Arbitrum, Polygon)
              </p>
              <p>
                <strong>For small swaps (&lt;$1k):</strong> Prioritize low-fee chains (Solana, Celo, Polygon, Base) to keep 
                percentage cost down
              </p>
              <p>
                <strong>For speed:</strong> Source from fast-finality chains (Solana ~30s, Celo ~5s) instead of Ethereum (~15min)
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Timing Your Swaps</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p>
                <strong>Monitor gas prices:</strong> Ethereum gas varies significantly. Check{' '}
                <a href="https://etherscan.io/gastracker" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  Etherscan Gas Tracker
                </a>{' '}
                before swapping from Ethereum.
              </p>
              <p>
                <strong>Avoid high-volatility periods:</strong> Slippage increases during market dumps/pumps. Set higher 
                slippage tolerance or wait for stabilization.
              </p>
              <p>
                <strong>Use limit orders (if available):</strong> Some advanced interfaces let you set target rates instead of 
                market orders.
              </p>
            </CardContent>
          </Card>
        </div>
      </DocSection>

      <DocSection
        id="slippage"
        title="Understanding and Setting Slippage"
        subtitle="Balancing execution certainty with price protection"
      >
        <Alert className="mb-6">
          <AlertDescription>
            <strong>Slippage Tolerance:</strong> The maximum percentage difference between expected price and execution 
            price you're willing to accept. Set too low = transaction fails. Set too high = risk of unfavorable execution.
          </AlertDescription>
        </Alert>

        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Low Slippage (0.1-0.5%)</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p className="mb-3">
                <strong>Use for:</strong> Stablecoin swaps, high-liquidity pairs, stable market conditions
              </p>
              <div className="bg-green-500/10 p-2 rounded text-xs">
                ✅ <strong>Pros:</strong> Maximum price protection, best rate
              </div>
              <div className="bg-red-500/10 p-2 rounded text-xs mt-2">
                ❌ <strong>Cons:</strong> Higher risk of transaction reverting if market moves
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Medium Slippage (0.5-2%)</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p className="mb-3">
                <strong>Use for:</strong> Most cross-chain swaps, moderate liquidity pairs, normal market conditions
              </p>
              <div className="bg-green-500/10 p-2 rounded text-xs">
                ✅ <strong>Pros:</strong> Balanced - good rate with reasonable execution certainty
              </div>
              <div className="bg-yellow-500/10 p-2 rounded text-xs mt-2">
                ⚠️ <strong>Cons:</strong> Moderate price risk if market moves quickly
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">High Slippage (2-5%+)</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p className="mb-3">
                <strong>Use for:</strong> Low-liquidity tokens, volatile markets, large trade sizes, urgent execution
              </p>
              <div className="bg-green-500/10 p-2 rounded text-xs">
                ✅ <strong>Pros:</strong> Transaction almost always succeeds
              </div>
              <div className="bg-red-500/10 p-2 rounded text-xs mt-2">
                ❌ <strong>Cons:</strong> Risk of significant unfavorable execution, MEV bot frontrunning
              </div>
            </CardContent>
          </Card>
        </div>

        <Alert className="mt-6">
          <AlertDescription>
            <strong>Recommended Defaults:</strong>
            <ul className="mt-2 space-y-1 ml-4">
              <li>• Stablecoin swaps: <strong>0.1-0.3%</strong></li>
              <li>• Major tokens (ETH, BTC, BNB): <strong>0.5-1%</strong></li>
              <li>• Mid-cap altcoins: <strong>1-2%</strong></li>
              <li>• Small-cap/low-liquidity: <strong>3-5%</strong> (or avoid cross-chain swap, bridge then swap manually)</li>
            </ul>
          </AlertDescription>
        </Alert>
      </DocSection>

      <DocSection
        id="fee-optimization"
        title="Fee Optimization Calculator"
        subtitle="Estimate and minimize swap costs"
      >
        <FeesBreakdown />
      </DocSection>

      <DocSection
        id="security"
        title="Security Best Practices"
        subtitle="Protecting your assets during swaps"
      >
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Pre-Swap Verification Checklist
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong>Verify token addresses:</strong>
                    <p className="text-muted-foreground">
                      Confirm you're swapping the correct tokens, not fake versions. Check official token lists or CoinGecko.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong>Double-check recipient address:</strong>
                    <p className="text-muted-foreground">
                      Ensure the destination address is correct. Blockchain transactions are irreversible!
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong>Review expected output:</strong>
                    <p className="text-muted-foreground">
                      Check the estimated output amount. If it's significantly lower than market rate, investigate why 
                      (low liquidity? high price impact?).
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong>Verify total fees:</strong>
                    <p className="text-muted-foreground">
                      Understand all costs (bridge fee, source gas, swap fee). Make sure the total is acceptable for your 
                      transfer size.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong>Test on testnet first:</strong>
                    <p className="text-muted-foreground">
                      For large swaps (&gt;$5k), do a small testnet transaction first to verify the flow works as expected.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  Common Scam Warnings
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>
                  <strong>Fake tokens:</strong> Scammers create tokens with names similar to popular ones (e.g., "USDC" vs "USD-C"). 
                  Always verify contract addresses.
                </p>
                <p>
                  <strong>Phishing sites:</strong> Only use official Tempo interfaces. Bookmark the URL. Never click swap links 
                  from unknown sources.
                </p>
                <p>
                  <strong>Unlimited approvals:</strong> Revoke old token approvals periodically using tools like{' '}
                  <a href="https://revoke.cash" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    Revoke.cash
                  </a>
                </p>
                <p>
                  <strong>Fake customer support:</strong> Wormhole/Tempo support will NEVER ask for your private keys or seed phrase.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Advanced Security Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>
                  <strong>Use hardware wallets:</strong> For swaps &gt;$10k, use Ledger/Trezor to sign transactions. Protects 
                  against malware.
                </p>
                <p>
                  <strong>Separate hot/cold wallets:</strong> Keep large holdings in cold storage. Only transfer what you need 
                  to swap to a hot wallet.
                </p>
                <p>
                  <strong>Monitor transaction status:</strong> Watch the transaction in real-time on block explorers. If something 
                  looks wrong, investigate immediately.
                </p>
                <p>
                  <strong>Enable 2FA everywhere:</strong> Use 2FA on exchanges, wallets, and any platform that supports it.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </DocSection>

      <DocSection
        id="ai-integration"
        title="AI Assistant Integration"
        subtitle="Automated swaps as part of yield strategies"
      >
        <p className="text-lg mb-6">
          Tempo's AI Assistant can automatically execute swaps when finding optimal yield opportunities across chains. 
          This combines route optimization, timing, and strategy execution in one seamless flow.
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                Example AI Workflows
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-3">
              <div className="bg-muted/50 p-3 rounded-lg">
                <p className="font-semibold mb-2">Prompt: "Find best USDC yield"</p>
                <ol className="list-decimal list-inside space-y-1 text-xs">
                  <li>AI scans all chains for USDC yield opportunities</li>
                  <li>Identifies Aave on Arbitrum has 8.5% APY</li>
                  <li>Initiates swap: Your ETH on Ethereum → USDC on Arbitrum</li>
                  <li>Automatically deposits USDC into Aave</li>
                  <li>Updates portfolio tracking</li>
                </ol>
              </div>

              <div className="bg-muted/50 p-3 rounded-lg">
                <p className="font-semibold mb-2">Prompt: "Rebalance to 50% stablecoins"</p>
                <ol className="list-decimal list-inside space-y-1 text-xs">
                  <li>AI checks current portfolio (70% ETH, 30% USDC)</li>
                  <li>Calculates need to swap 20% of holdings to stablecoins</li>
                  <li>Swaps portion of ETH → USDC on optimal chain</li>
                  <li>Achieves target 50/50 allocation</li>
                </ol>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>AI Optimization Benefits</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p>
                <strong>Route Intelligence:</strong> AI considers gas costs, slippage, yield differentials, and time value 
                to recommend optimal paths humans might miss.
              </p>
              <p>
                <strong>Hands-free Execution:</strong> Once you approve the strategy, AI handles all steps automatically. 
                No need to manually bridge, swap, and deposit.
              </p>
              <p>
                <strong>Continuous Monitoring:</strong> AI tracks your position and can suggest rebalancing or moving to 
                better opportunities as market conditions change.
              </p>
              <p>
                <strong>Cost Awareness:</strong> AI won't recommend swaps if fees outweigh benefits. It factors in total 
                cost and holding period.
              </p>
            </CardContent>
          </Card>
        </div>

        <Alert className="mt-6">
          <AlertDescription>
            <strong>Try it:</strong> Go to <a href="/chat" className="text-primary hover:underline">/chat</a> and ask: 
            <em> "I have $5,000 in ETH on Ethereum. What's the best cross-chain yield strategy?"</em> The AI will analyze 
            options and can execute swaps + deposits for you.
          </AlertDescription>
        </Alert>
      </DocSection>

      <DocSection
        id="troubleshooting"
        title="Common Issues and Solutions"
        subtitle="Quick fixes for swap problems"
      >
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Swap Failed: "Slippage Exceeded"</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p className="mb-2">
                <strong>Cause:</strong> The price moved more than your slippage tolerance between when you initiated the swap 
                and when it was executed.
              </p>
              <p className="mb-3">
                <strong>Solutions:</strong>
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>Increase slippage tolerance (e.g., from 0.5% to 1-2%)</li>
                <li>Retry during less volatile market periods</li>
                <li>Swap a smaller amount if you're causing price impact</li>
                <li>Check if there's a liquidity issue on the destination DEX</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Swap Taking Longer Than Expected</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p className="mb-2">
                <strong>Cause:</strong> Source chain finality delays (especially Ethereum ~15min) or network congestion.
              </p>
              <p className="mb-3">
                <strong>Solutions:</strong>
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>Be patient - most swaps complete within 20 minutes</li>
                <li>Check source chain block explorer to confirm transaction was included</li>
                <li>If initiated from Ethereum, expect 15-20 min due to finality requirements</li>
                <li>For faster swaps in future, use chains like Solana, Celo, or Polygon as source</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Received Less Than Expected</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p className="mb-2">
                <strong>Cause:</strong> Price impact (your trade size affected the market) or fees higher than anticipated.
              </p>
              <p className="mb-3">
                <strong>Prevention for next time:</strong>
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>Check estimated output and fee breakdown BEFORE confirming</li>
                <li>For large swaps, consider split routing across multiple DEXs</li>
                <li>Use stablecoin pairs (less volatile, predictable output)</li>
                <li>Verify you're not being frontrun by MEV bots (use private RPCs if available)</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tokens Not Showing in Wallet</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p className="mb-2">
                <strong>Cause:</strong> Wallet hasn't auto-detected the token yet. It's still there, just not visible.
              </p>
              <p className="mb-3">
                <strong>Solution:</strong>
              </p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Check the destination chain's block explorer with your address</li>
                <li>Confirm the tokens arrived (they should be there)</li>
                <li>Manually add the token to your wallet:
                  <ul className="list-disc list-inside ml-4 mt-1">
                    <li>Click "Import Token" in MetaMask/wallet</li>
                    <li>Enter token contract address</li>
                    <li>Token should now appear with correct balance</li>
                  </ul>
                </li>
              </ol>
            </CardContent>
          </Card>
        </div>
      </DocSection>

      <DocSection
        id="advanced-strategies"
        title="Advanced Strategies"
        subtitle="Expert-level optimization techniques"
      >
        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Arbitrage Opportunities</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p className="mb-3">
                <strong>Cross-Chain Price Differences:</strong> Sometimes the same token trades at different prices on 
                different chains due to liquidity fragmentation.
              </p>
              <div className="bg-muted/50 p-3 rounded-lg text-xs">
                <p className="mb-2">
                  <strong>Example:</strong> USDC is $1.00 on Ethereum but $1.02 on a low-liquidity chain. You could:
                </p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Swap USDT → USDC on the cheaper chain</li>
                  <li>Bridge USDC to Ethereum</li>
                  <li>Swap USDC → USDT on Ethereum for profit</li>
                </ol>
                <p className="mt-2">
                  <em>Must factor in all fees and slippage to ensure net profit.</em>
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Dollar-Cost Averaging (DCA)</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p className="mb-3">
                <strong>Automated Periodic Swaps:</strong> Instead of one large swap, split into smaller swaps over time 
                to average out price volatility.
              </p>
              <p className="text-xs">
                <strong>Implementation:</strong> Use the AI Assistant to schedule recurring swaps (e.g., "Swap $500 ETH to 
                USDC on Arbitrum every Monday for the next 10 weeks"). This reduces timing risk.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Yield Chasing Automation</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p className="mb-3">
                Set up automated rules: "If USDC yield on Chain A falls below 5% and Chain B offers &gt;6%, automatically 
                swap my position to Chain B."
              </p>
              <p className="text-xs">
                The AI monitors rates continuously and executes swaps when thresholds are met, ensuring you always have 
                capital in the best opportunities.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Portfolio Rebalancing</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p className="mb-3">
                Maintain target allocations across chains and assets. For example: "Keep 40% ETH, 40% USDC, 20% BTC across 
                all chains."
              </p>
              <p className="text-xs">
                As prices move, the AI automatically swaps to rebalance. This enforces disciplined profit-taking and 
                prevents overexposure to volatile assets.
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
          <h3 className="font-semibold text-lg mb-4">Ready to Swap?</h3>
          <ul className="space-y-2">
            <li>
              <a href="/swap" className="text-primary hover:underline font-medium">
                → Start Swapping
              </a>
              <span className="text-muted-foreground ml-2">
                Try your first cross-chain swap (testnet recommended for practice)
              </span>
            </li>
            <li>
              <a href="/chat" className="text-primary hover:underline font-medium">
                → Ask the AI Assistant
              </a>
              <span className="text-muted-foreground ml-2">
                Get personalized swap recommendations based on your portfolio
              </span>
            </li>
            <li>
              <a href="/docs/bridge/getting-started" className="text-primary hover:underline font-medium">
                → Learn About Bridging
              </a>
              <span className="text-muted-foreground ml-2">
                Understand the difference between bridge and swap
              </span>
            </li>
          </ul>
        </div>
      </DocSection>
    </div>
  );
};

export default SwapBestPractices;
