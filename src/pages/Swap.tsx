import PageLayout from "@/components/layout/PageLayout";
import PageHero from "@/components/layout/PageHero";
import { WormholeSwapWidget } from "@/components/swap/WormholeSwapWidget";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { TestTube, ExternalLink, ArrowLeftRight, Zap, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

const Swap = () => {
  console.log('✅ Swap page loaded successfully');
  const testnetFaucets = [
    { name: "Sepolia ETH", url: "https://sepoliafaucet.com" },
    { name: "Solana Devnet", url: "https://solfaucet.com" },
    { name: "Arbitrum Sepolia", url: "https://faucet.quicknode.com/arbitrum/sepolia" },
    { name: "Base Sepolia", url: "https://docs.base.org/docs/tools/network-faucets" },
  ];

  return (
    <PageLayout>
      <PageHero
        title="Cross-Chain Swap"
        description="Exchange tokens across blockchains in a single transaction. No manual claiming required."
      />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Testnet Warning Banner - Enhanced */}
        <Alert className="mb-8 border-2 border-warning/30 bg-gradient-to-r from-warning/10 via-warning/5 to-warning/10 shadow-lg">
          <TestTube className="h-5 w-5 text-warning animate-pulse" />
          <AlertDescription className="ml-2">
            <div className="flex flex-col gap-3">
              <p className="font-bold text-base">🧪 TESTNET MODE: Use testnet ETH and tokens only</p>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium text-foreground/80">Get testnet tokens:</span>
                {testnetFaucets.map((faucet) => (
                  <Button
                    key={faucet.name}
                    variant="outline"
                    size="sm"
                    asChild
                    className="h-8 border-warning/30 hover:bg-warning/10 hover:border-warning transition-all"
                  >
                    <a
                      href={faucet.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5"
                    >
                      {faucet.name}
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </Button>
                ))}
              </div>
            </div>
          </AlertDescription>
        </Alert>

        {/* Swap Widget - Enhanced with glassmorphism */}
        <div className="relative bg-gradient-to-br from-card/95 to-card/80 backdrop-blur-xl rounded-2xl border-2 border-border/50 shadow-2xl p-8 mb-8 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
          <div className="relative z-10">
            <WormholeSwapWidget />
          </div>
        </div>

        {/* Info Cards - Enhanced with gradients and animations */}
        <div className="grid gap-6 md:grid-cols-3">
          {/* Card 1 - Blue gradient */}
          <div className="group relative bg-gradient-to-br from-blue-500/10 via-cyan-500/5 to-transparent rounded-2xl border border-blue-500/20 p-6 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:border-blue-500/40 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-cyan-500/0 group-hover:from-blue-500/10 group-hover:to-cyan-500/10 transition-all duration-300" />
            <div className="relative z-10 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center transform transition-transform group-hover:scale-110 group-hover:rotate-3">
                <ArrowLeftRight className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-lg">Single Transaction</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Bridge and swap in one transaction. No need to manually claim on the destination chain.
              </p>
            </div>
          </div>

          {/* Card 2 - Purple gradient */}
          <div className="group relative bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-transparent rounded-2xl border border-purple-500/20 p-6 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:border-purple-500/40 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-pink-500/0 group-hover:from-purple-500/10 group-hover:to-pink-500/10 transition-all duration-300" />
            <div className="relative z-10 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center transform transition-transform group-hover:scale-110 group-hover:rotate-3">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-lg">Native Tokens</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Receive actual native tokens, not wrapped versions. Direct to your wallet.
              </p>
            </div>
          </div>

          {/* Card 3 - Green gradient */}
          <div className="group relative bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent rounded-2xl border border-emerald-500/20 p-6 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:border-emerald-500/40 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 to-teal-500/0 group-hover:from-emerald-500/10 group-hover:to-teal-500/10 transition-all duration-300" />
            <div className="relative z-10 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center transform transition-transform group-hover:scale-110 group-hover:rotate-3">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-lg">Best Routes</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Automatically finds the best rates across multiple DEXs and liquidity sources.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Swap;
