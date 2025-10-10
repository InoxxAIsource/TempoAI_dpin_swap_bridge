import { CheckCircle2, Wallet, Sparkles } from 'lucide-react';

const ClaimGuideSection = () => {
  return (
    <section className="px-6 md:px-12 py-16 bg-secondary/30">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-16">
          <div className="w-2 h-2 rounded-full bg-primary" />
          <h2 className="text-3xl md:text-5xl font-bold">How to Claim</h2>
        </div>
        
        <div className="space-y-20">
          {/* Step 01 */}
          <div className="relative">
            <div className="absolute -left-4 top-0 text-9xl font-bold text-muted-foreground/10 select-none">
              01
            </div>
            <div className="relative pl-8 md:pl-16">
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl md:text-4xl font-bold mb-4">Check Transfer Status</h3>
                  <p className="text-lg text-muted-foreground mb-6">
                    Verify your transfer has been processed by Wormhole and is ready to claim on the destination chain
                  </p>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="p-4 bg-background rounded-lg">
                      <div className="font-semibold mb-1">Auto-detection</div>
                      <div className="text-sm text-muted-foreground">
                        System checks status automatically
                      </div>
                    </div>
                    <div className="p-4 bg-background rounded-lg">
                      <div className="font-semibold mb-1">Real-time status</div>
                      <div className="text-sm text-muted-foreground">
                        Live updates via WormholeScan API
                      </div>
                    </div>
                    <div className="p-4 bg-background rounded-lg">
                      <div className="font-semibold mb-1">Multi-chain support</div>
                      <div className="text-sm text-muted-foreground">
                        Works across all supported chains
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Step 02 */}
          <div className="relative">
            <div className="absolute -left-4 top-0 text-9xl font-bold text-muted-foreground/10 select-none">
              02
            </div>
            <div className="relative pl-8 md:pl-16">
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Wallet className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl md:text-4xl font-bold mb-4">Review Gas Requirements</h3>
                  <p className="text-lg text-muted-foreground mb-6">
                    Ensure you have sufficient gas on the destination chain to complete the claim transaction
                  </p>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="p-4 bg-background rounded-lg">
                      <div className="font-semibold mb-1">Gas estimates</div>
                      <div className="text-sm text-muted-foreground">
                        See approximate costs before claiming
                      </div>
                    </div>
                    <div className="p-4 bg-background rounded-lg">
                      <div className="font-semibold mb-1">Multiple wallets</div>
                      <div className="text-sm text-muted-foreground">
                        Connect different wallets per chain
                      </div>
                    </div>
                    <div className="p-4 bg-background rounded-lg">
                      <div className="font-semibold mb-1">Cost breakdown</div>
                      <div className="text-sm text-muted-foreground">
                        Clear fee transparency
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Step 03 */}
          <div className="relative">
            <div className="absolute -left-4 top-0 text-9xl font-bold text-muted-foreground/10 select-none">
              03
            </div>
            <div className="relative pl-8 md:pl-16">
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl md:text-4xl font-bold mb-4">Complete Redemption</h3>
                  <p className="text-lg text-muted-foreground mb-6">
                    Claim your tokens on WormholeScan with a single click and receive them on the destination chain
                  </p>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="p-4 bg-background rounded-lg">
                      <div className="font-semibold mb-1">Secure claiming</div>
                      <div className="text-sm text-muted-foreground">
                        Direct integration with WormholeScan
                      </div>
                    </div>
                    <div className="p-4 bg-background rounded-lg">
                      <div className="font-semibold mb-1">Instant confirmation</div>
                      <div className="text-sm text-muted-foreground">
                        See your tokens arrive immediately
                      </div>
                    </div>
                    <div className="p-4 bg-background rounded-lg">
                      <div className="font-semibold mb-1">Transaction tracking</div>
                      <div className="text-sm text-muted-foreground">
                        Monitor progress in real-time
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClaimGuideSection;
