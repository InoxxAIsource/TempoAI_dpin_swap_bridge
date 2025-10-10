import { ArrowRight, CheckCircle2, Clock, Circle } from 'lucide-react';

const ClaimFlowDiagram = () => {
  return (
    <section className="px-6 md:px-12 py-16">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-2 h-2 rounded-full bg-primary" />
          <h2 className="text-3xl md:text-5xl font-bold">How It Works</h2>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 md:gap-4">
          {/* Step 1: Initiated */}
          <div className="relative">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                <CheckCircle2 className="w-12 h-12 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Step 1: Transfer Initiated</h3>
                <p className="text-muted-foreground">
                  Your tokens are sent from the source chain to Wormhole
                </p>
              </div>
              <div className="px-4 py-2 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-full text-sm font-medium">
                ✓ Completed
              </div>
            </div>
            <div className="hidden md:block absolute top-12 -right-4 z-10">
              <ArrowRight className="w-8 h-8 text-muted-foreground" />
            </div>
          </div>
          
          {/* Step 2: Bridging */}
          <div className="relative">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                <Clock className="w-12 h-12 text-primary animate-pulse" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Step 2: Processing</h3>
                <p className="text-muted-foreground">
                  Wormhole validates and creates a VAA for your transfer
                </p>
              </div>
              <div className="px-4 py-2 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 rounded-full text-sm font-medium">
                ⏳ 15-30 min
              </div>
            </div>
            <div className="hidden md:block absolute top-12 -right-4 z-10">
              <ArrowRight className="w-8 h-8 text-muted-foreground" />
            </div>
          </div>
          
          {/* Step 3: Ready to Claim */}
          <div className="relative">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                <Circle className="w-12 h-12 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Step 3: Claim Tokens</h3>
                <p className="text-muted-foreground">
                  Complete the claim on the destination chain
                </p>
              </div>
              <div className="px-4 py-2 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-full text-sm font-medium">
                ⚪ Action Required
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-12 p-6 bg-secondary/30 rounded-lg">
          <div className="flex items-start gap-4">
            <div className="w-2 h-2 rounded-full bg-primary mt-2" />
            <div>
              <h4 className="font-bold mb-2">Important Notes</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• You'll need gas (native tokens) on the destination chain to complete the claim</li>
                <li>• The claim must be completed manually - it's not automatic</li>
                <li>• Your tokens are safe until you claim them - there's no time limit</li>
                <li>• You can claim directly on WormholeScan using the provided links</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClaimFlowDiagram;
