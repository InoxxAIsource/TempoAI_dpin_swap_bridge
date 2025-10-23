import PageLayout from "@/components/layout/PageLayout";
import PageHero from "@/components/layout/PageHero";
import { WormholeSwapWidget } from "@/components/swap/WormholeSwapWidget";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { TestTube, ExternalLink, ArrowLeftRight, Zap, TrendingUp, AlertCircle, Info, Link2, Code, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useWalletContext } from "@/contexts/WalletContext";

const Swap = () => {
  const [searchParams] = useSearchParams();
  const [manualTxHash, setManualTxHash] = useState('');
  const { toast } = useToast();
  const { evmAddress } = useWalletContext();
  
  // Extract URL params for pre-filling widget
  const sourceChain = searchParams.get('sourceChain');
  const targetChain = searchParams.get('targetChain');
  const sourceToken = searchParams.get('sourceToken');
  const amount = searchParams.get('amount');
  const claimId = searchParams.get('claimId');

  const handleManualLinkTransaction = async () => {
    if (!manualTxHash || !claimId) {
      toast({
        title: "Missing Information",
        description: "Please enter a transaction hash and ensure you came from a claim flow.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('wormhole_transactions')
        .update({ 
          tx_hash: manualTxHash, 
          status: 'pending' 
        })
        .eq('source_type', 'depin_rewards')
        .is('tx_hash', null)
        .limit(1);

      if (error) throw error;

      toast({
        title: "Transaction Linked! ✅",
        description: "Your transaction has been manually linked to your claim.",
      });
      setManualTxHash('');
    } catch (error: any) {
      console.error('Error linking transaction:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to link transaction",
        variant: "destructive",
      });
    }
  };
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
      
      <div className="container mx-auto px-4 md:px-6 py-6 md:py-8 max-w-6xl">
        {/* Testnet Warning Banner - Enhanced */}
        <Alert className="mb-6 md:mb-8 border-2 border-warning/30 bg-gradient-to-r from-warning/10 via-warning/5 to-warning/10 shadow-lg">
          <TestTube className="h-4 w-4 md:h-5 md:w-5 text-warning animate-pulse" />
          <AlertDescription className="ml-2">
            <div className="flex flex-col gap-2 md:gap-3">
              <p className="font-bold text-sm md:text-base">🧪 TESTNET MODE: Use testnet ETH and tokens only</p>
              <div className="flex flex-wrap items-center gap-1.5 md:gap-2">
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
        <div className="relative bg-gradient-to-br from-card/95 to-card/80 backdrop-blur-xl rounded-2xl border-2 border-border/50 shadow-2xl p-4 md:p-6 lg:p-8 mb-6 md:mb-8 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
          <div className="relative z-10">
            {sourceChain && (
              <Alert className="mb-4 border-primary/30 bg-primary/10">
                <AlertDescription>
                  Pre-filled from AI: {sourceToken} on {sourceChain} → {targetChain} ({amount})
                </AlertDescription>
              </Alert>
            )}
            <WormholeSwapWidget 
              defaultSourceChain={sourceChain || undefined}
              defaultTargetChain={targetChain || undefined}
              defaultSourceToken={sourceToken || undefined}
              defaultAmount={amount || undefined}
              claimId={claimId || undefined}
            />
          </div>
        </div>

        {/* Enhanced Manual Transaction Linking UI */}
        {claimId && (
          <Card className="mt-6 border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-primary" />
                Transaction Not Showing Up?
              </CardTitle>
              <CardDescription>
                If your bridge completed but isn't tracked, paste the transaction hash from WormholeScan below.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input 
                  placeholder="0x... (from WormholeScan Testnet)"
                  value={manualTxHash}
                  onChange={(e) => setManualTxHash(e.target.value)}
                  className="flex-1 font-mono"
                />
                <Button 
                  onClick={handleManualLinkTransaction}
                  disabled={!manualTxHash || manualTxHash.length < 66}
                  size="lg"
                >
                  <Link2 className="w-4 h-4 mr-2" />
                  Link Transaction
                </Button>
              </div>
              
              <Alert>
                <Info className="w-4 h-4" />
                <AlertDescription>
                  <strong>How to find your transaction hash:</strong>
                  <ol className="list-decimal ml-4 mt-2 space-y-1">
                    <li>Complete your bridge in the widget above</li>
                    <li>Visit <a href="https://wormholescan.io?network=TESTNET" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">WormholeScan Testnet</a></li>
                    <li>Search for your wallet address: <code className="bg-muted px-1 rounded">{evmAddress?.slice(0, 10)}...</code></li>
                    <li>Copy the transaction hash (0x...) and paste it above</li>
                  </ol>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        )}

        {/* Debug Panel */}
        <Collapsible className="mt-4 border rounded-lg">
          <CollapsibleTrigger className="flex items-center justify-between w-full p-4 hover:bg-accent transition-colors">
            <span className="font-semibold flex items-center gap-2">
              <Code className="w-4 h-4" />
              Debug Information
            </span>
            <ChevronDown className="w-4 h-4" />
          </CollapsibleTrigger>
          <CollapsibleContent className="p-4 bg-muted/50 font-mono text-xs space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div>Wallet:</div>
              <div className="text-primary">{evmAddress || 'Not connected'}</div>
              
              <div>Claim ID:</div>
              <div className="text-primary">{claimId || 'None'}</div>
              
              <div>Network:</div>
              <div className="text-primary">Testnet</div>
            </div>
            
            <Separator />
            
            <div>
              <strong>Expected Behavior:</strong>
              <ul className="list-disc ml-4 mt-1 space-y-1 text-muted-foreground">
                <li>Polling checks every 3 seconds for new transactions</li>
                <li>Blockchain monitoring watches for wallet activity</li>
                <li>Manual linking available if automated tracking fails</li>
                <li>Check browser console for detailed logs (🎯 prefix)</li>
              </ul>
            </div>
          </CollapsibleContent>
        </Collapsible>

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
