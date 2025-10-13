const WhySection = () => {
  return (
    <section className="relative px-6 md:px-12 py-32">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-start">
          <div>
            <h2 className="text-5xl md:text-7xl font-bold leading-tight mb-8">
              Why choose{' '}
              <span className="block">Tempo?</span>
            </h2>
          </div>
          
          <div className="space-y-8">
            <div className="text-sm text-muted-foreground flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <span>Comprehensive & Connected</span>
            </div>
            
            <p className="text-lg leading-relaxed text-foreground/80">
              Tempo unifies DeFi's most powerful capabilities into a seamless experience. Earn rewards from 
              physical DePIN devices like solar panels and sensors, optimize yields with AI across Aave, Compound, 
              and Curve, bridge assets across 30+ chains with Wormhole, and swap tokens at the best rates—all 
              without leaving the platform.
            </p>
            
            <p className="text-lg leading-relaxed text-foreground/80">
              Our AI assistant guides you through complex strategies, while automated optimization ensures your 
              assets work harder 24/7. From infrastructure to DeFi to cross-chain mobility, Tempo is your complete 
              omnichain earning platform.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhySection;
