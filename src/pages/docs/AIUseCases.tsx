import DocSection from '@/components/docs/DocSection';
import UseCaseCard from '@/components/docs/UseCaseCard';

const AIUseCases = () => {
  return (
    <div className="space-y-16">
      <DocSection 
        title="Real-World Use Cases"
        subtitle="See Tempo AI in action"
      >
        <UseCaseCard
          title="Case Study 1: Simple Yield Hunt"
          userQuery="Show me the best USDC yields"
          steps={[
            "Scans 50+ protocols",
            "Filters for USDC stablecoin yields",
            "Validates Wormhole compatibility",
            "Ranks by APY",
            "Shows top 3 with execution cards"
          ]}
          result="User deposits to Aave on Optimism with 5.2% APY in 2 clicks"
        />

        <UseCaseCard
          title="Case Study 2: Complex Multi-Chain Journey"
          userQuery="I have ETH on Ethereum, want to earn with WSOL on Solana"
          steps={[
            "Detects: Source = ETH on Ethereum",
            "Detects: Target = WSOL yield on Solana",
            "Problem: Can't directly bridge ETH to Solana (not supported)",
            "Solution: Multi-step path",
            "  ├─ Step 1: Swap ETH → USDC on Ethereum",
            "  ├─ Step 2: Bridge USDC to Solana (Wormhole)",
            "  ├─ Step 3: Swap USDC → WSOL on Solana",
            "  └─ Step 4: Deposit WSOL to yield protocol",
            "Generates 4 sequential execution cards"
          ]}
          result="Guided step-by-step with zero manual research"
        />

        <UseCaseCard
          title="Case Study 3: Portfolio-Aware Recommendations"
          userQuery="What should I do with my portfolio?"
          steps={[
            "Fetches current holdings across all connected chains",
            "Identifies idle assets not earning yield",
            "Calculates potential yield for each asset",
            "Considers gas costs and transaction complexity",
            "Recommends top 3 opportunities ranked by net APY",
            "Generates execution cards for each recommendation"
          ]}
          result="User discovers they can earn 5.8% APY on idle USDC without bridging"
        />

        <UseCaseCard
          title="Case Study 4: Risk-Adjusted Strategy"
          userQuery="What's the safest way to earn with stablecoins?"
          steps={[
            "Filters for stablecoin-only protocols",
            "Prioritizes battle-tested protocols (Aave, Compound)",
            "Excludes newer/unaudited yield farms",
            "Explains IL (impermanent loss) risks for LP strategies",
            "Recommends single-sided staking with established protocols",
            "Provides historical APY data and protocol TVL"
          ]}
          result="User confidently deposits to Aave with full understanding of risks"
        />

        <UseCaseCard
          title="Case Study 5: Cross-Chain Arbitrage Discovery"
          userQuery="Are there any rate differences for USDC across chains?"
          steps={[
            "Fetches real-time APYs for USDC across all supported chains",
            "Calculates net arbitrage opportunity after gas costs",
            "Identifies Arbitrum offering 2% higher APY than Ethereum",
            "Estimates bridge time and gas costs",
            "Generates execution cards for bridge + deposit flow",
            "Warns about potential slippage and timing risks"
          ]}
          result="User captures 2% additional yield by bridging to Arbitrum"
        />
      </DocSection>

      <DocSection 
        title="Example Prompts to Try"
        subtitle="Get started with these questions"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            "Show me cross-chain opportunities for my portfolio",
            "How do I bridge USDC from Ethereum to Arbitrum?",
            "What's the safest yield strategy for beginners?",
            "Explain how Wormhole swap works",
            "What are the best yields for USDC right now?",
            "I have ETH on Ethereum, want to earn yield on Base",
            "Compare yields for USDC across all chains",
            "What protocols are available through Wormhole?"
          ].map((prompt, idx) => (
            <div
              key={idx}
              className="p-4 rounded-lg border border-border bg-card/50"
            >
              <p className="text-sm text-muted-foreground">"{prompt}"</p>
            </div>
          ))}
        </div>
      </DocSection>
    </div>
  );
};

export default AIUseCases;
