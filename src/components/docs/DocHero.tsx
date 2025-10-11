import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const DocHero = () => {
  return (
    <section className="relative px-6 md:px-12 py-20 md:py-28 overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background" />
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Wormhole Builder Program</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text text-transparent">
            Tempo AI Assistant
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-4 max-w-3xl mx-auto">
            Your Cross-Chain DeFi Navigator
          </p>
          
          <p className="text-lg text-muted-foreground/80 max-w-2xl mx-auto">
            Intelligent guidance for cross-chain yield optimization powered by Wormhole
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default DocHero;
