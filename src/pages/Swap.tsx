import PageLayout from "@/components/layout/PageLayout";
import PageHero from "@/components/layout/PageHero";
import { WormholeSwapWidget } from "@/components/swap/WormholeSwapWidget";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { TestTube, ExternalLink } from "lucide-react";
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
        {/* Testnet Warning Banner */}
        <Alert className="mb-6 border-warning bg-warning/10">
          <TestTube className="h-4 w-4 text-warning" />
          <AlertDescription className="ml-2">
            <div className="flex flex-col gap-2">
              <p className="font-semibold">🧪 TESTNET MODE: Use testnet ETH and tokens only</p>
              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-muted-foreground">Get testnet tokens:</span>
                {testnetFaucets.map((faucet) => (
                  <Button
                    key={faucet.name}
                    variant="outline"
                    size="sm"
                    asChild
                    className="h-7"
                  >
                    <a
                      href={faucet.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1"
                    >
                      {faucet.name}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </Button>
                ))}
              </div>
            </div>
          </AlertDescription>
        </Alert>

        {/* Swap Widget */}
        <div className="bg-card rounded-lg border shadow-sm p-6">
          <WormholeSwapWidget />
        </div>

        {/* Info Section */}
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="bg-card rounded-lg border p-4">
            <h3 className="font-semibold mb-2">Single Transaction</h3>
            <p className="text-sm text-muted-foreground">
              Bridge and swap in one transaction. No need to manually claim on the destination chain.
            </p>
          </div>
          <div className="bg-card rounded-lg border p-4">
            <h3 className="font-semibold mb-2">Native Tokens</h3>
            <p className="text-sm text-muted-foreground">
              Receive actual native tokens, not wrapped versions. Direct to your wallet.
            </p>
          </div>
          <div className="bg-card rounded-lg border p-4">
            <h3 className="font-semibold mb-2">Best Routes</h3>
            <p className="text-sm text-muted-foreground">
              Automatically finds the best rates across multiple DEXs and liquidity sources.
            </p>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Swap;
