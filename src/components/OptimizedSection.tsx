import { Button } from '@/components/ui/button';

const OptimizedSection = () => {
  return (
    <section className="relative px-6 md:px-12 py-32">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-5xl md:text-7xl font-bold leading-tight mb-12">
          Trusted by{' '}
          <span className="block">DeFi innovators</span>
        </h2>

        <div className="max-w-3xl mb-12">
          <p className="text-lg leading-relaxed text-foreground/80 mb-8">
            Tempo was built by leading blockchain engineers and AI researchers, with backing from 
            top-tier crypto VCs including Paradigm, a16z crypto, Sequoia Capital, Coinbase Ventures, 
            Pantera Capital, and institutional investors managing over $50B in digital assets.
          </p>
          
          <p className="text-lg leading-relaxed text-foreground/80 mb-12">
            If you're a protocol, DAO, or institutional investor looking to maximize returns through 
            AI-driven strategies, join our ecosystem.
          </p>

          <Button 
            variant="outline" 
            size="lg"
            className="rounded-full px-8 py-6 text-base hover:bg-primary hover:text-primary-foreground transition-all duration-300"
          >
            Join our protocol
          </Button>
        </div>

        <div className="text-sm text-muted-foreground flex items-center gap-2 mt-16">
          <div className="w-2 h-2 rounded-full bg-primary" />
          <span>Built for maximum yield</span>
        </div>
        
        <p className="text-base leading-relaxed text-foreground/70 mt-4 max-w-2xl">
          An AI-first protocol developed by experts in machine learning, quantitative finance, 
          and decentralized systems to deliver unmatched yield generation.
        </p>
      </div>
    </section>
  );
};

export default OptimizedSection;
