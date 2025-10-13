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
            Tempo is built by passionate blockchain engineers and AI researchers committed to making 
            DeFi accessible to everyone. Our platform leverages cutting-edge AI technology and seamless 
            cross-chain infrastructure powered by Wormhole to deliver a unified DeFi experience.
          </p>
          
          <p className="text-lg leading-relaxed text-foreground/80 mb-12">
            Whether you're new to DeFi or an experienced trader, Tempo provides the tools you need 
            to maximize your yields, bridge assets across chains, and earn from DePIN networks.
          </p>

          <Button 
            variant="outline" 
            size="lg"
            className="rounded-full px-8 py-6 text-base hover:bg-primary hover:text-primary-foreground transition-all duration-300"
          >
            Join our ecosystem
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
