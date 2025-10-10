import { ArrowRight, CheckCircle2, Clock, Circle, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import ethereumLogo from '@/assets/chains/ethereum.png';
import solanaLogo from '@/assets/chains/solana.png';

const ClaimFlowDiagram = () => {
  return (
    <section className="px-6 md:px-12 py-16 relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-3 mb-16 justify-center"
        >
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <h2 className="text-3xl md:text-5xl font-bold text-center">How It Works</h2>
        </motion.div>
        
        {/* Chain Flow Visualization */}
        <div className="mb-16">
          <div className="flex items-center justify-center gap-8 md:gap-16 mb-12">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center"
            >
              <div className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-3 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 p-4 backdrop-blur-sm border border-primary/20 shadow-lg">
                <img src={ethereumLogo} alt="Source Chain" className="w-full h-full object-contain" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">Source Chain</p>
            </motion.div>
            
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="hidden md:block"
            >
              <ArrowRight className="w-8 h-8 text-primary" />
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-center"
            >
              <div className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-3 rounded-full bg-gradient-to-br from-accent/20 to-accent/5 p-4 backdrop-blur-sm border border-accent/20 shadow-lg flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-primary/20 animate-pulse" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">Wormhole Bridge</p>
            </motion.div>
            
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="hidden md:block"
            >
              <ArrowRight className="w-8 h-8 text-primary" />
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="text-center"
            >
              <div className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-3 rounded-full bg-gradient-to-br from-accent/20 to-accent/5 p-4 backdrop-blur-sm border border-accent/20 shadow-lg">
                <img src={solanaLogo} alt="Destination Chain" className="w-full h-full object-contain" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">Destination Chain</p>
            </motion.div>
          </div>
          
          {/* Progress Line */}
          <motion.div 
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.2, delay: 0.3 }}
            className="h-1 bg-gradient-to-r from-green-500 via-yellow-500 to-blue-500 rounded-full max-w-3xl mx-auto mb-16"
            style={{ transformOrigin: 'left' }}
          />
        </div>
        
        {/* Steps Timeline */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {/* Step 1: Initiated */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="relative group"
          >
            <div className="h-full p-6 rounded-2xl bg-gradient-to-br from-background/80 to-background/40 backdrop-blur-md border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500/20 to-green-500/5 flex items-center justify-center border border-green-500/20 shadow-lg">
                  <CheckCircle2 className="w-10 h-10 text-green-500" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Step 1: Transfer Initiated</h3>
                  <p className="text-sm text-muted-foreground">
                    Your tokens are sent from the source chain to Wormhole
                  </p>
                </div>
                <div className="px-4 py-2 bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 rounded-full text-sm font-medium">
                  ✓ Completed
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Step 2: Bridging */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="relative group"
          >
            <div className="h-full p-6 rounded-2xl bg-gradient-to-br from-background/80 to-background/40 backdrop-blur-md border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-500/20 to-yellow-500/5 flex items-center justify-center border border-yellow-500/20 shadow-lg">
                  <Clock className="w-10 h-10 text-yellow-500 animate-pulse" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Step 2: Processing</h3>
                  <p className="text-sm text-muted-foreground">
                    Wormhole validates and creates a VAA for your transfer
                  </p>
                </div>
                <div className="px-4 py-2 bg-yellow-500/10 border border-yellow-500/20 text-yellow-600 dark:text-yellow-400 rounded-full text-sm font-medium">
                  ⏳ 15-30 min
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Step 3: Ready to Claim */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="relative group"
          >
            <div className="h-full p-6 rounded-2xl bg-gradient-to-br from-background/80 to-background/40 backdrop-blur-md border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500/20 to-blue-500/5 flex items-center justify-center border border-blue-500/20 shadow-lg">
                  <Circle className="w-10 h-10 text-blue-500" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Step 3: Claim Tokens</h3>
                  <p className="text-sm text-muted-foreground">
                    Complete the claim on the destination chain
                  </p>
                </div>
                <div className="px-4 py-2 bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 rounded-full text-sm font-medium">
                  ⚪ Action Required
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Important Notes Card */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="p-6 rounded-2xl bg-gradient-to-br from-secondary/50 to-secondary/20 backdrop-blur-md border border-border/50 shadow-lg"
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Info className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h4 className="font-bold mb-3 text-lg">Important Notes</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>You'll need gas (native tokens) on the destination chain to complete the claim</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>The claim must be completed manually - it's not automatic</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>Your tokens are safe until you claim them - there's no time limit</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>You can claim directly on WormholeScan using the provided links</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ClaimFlowDiagram;
