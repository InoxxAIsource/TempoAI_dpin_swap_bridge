const WhySection = () => {
  return <section className="relative px-4 md:px-6 lg:px-12 py-16 md:py-24 lg:py-32">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-start">
          <div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-7xl font-bold leading-tight mb-6 md:mb-8">
              Why choose{' '}
              <span className="block">Tempo?</span>
            </h2>
          </div>
          
          <div className="space-y-6 md:space-y-8">
            <div className="text-xs md:text-sm text-muted-foreground flex items-center gap-2">
              <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-primary" />
              <span>Comprehensive & Connected</span>
            </div>
            
            <p className="text-base md:text-lg leading-relaxed text-foreground/80">Tempo unifies DeFi's most powerful capabilities into a seamless experience. Earn rewards from physical DePIN devices like solar panels and sensors, optimize yields with AI across Aave, Compound, and Curve, bridge assets across 30+ chains with Wormhole, and swap tokens at the best rates all without leaving the platform.</p>
            
            <p className="text-base md:text-lg leading-relaxed text-foreground/80">
              Our AI assistant guides you through complex strategies, while automated optimization ensures your 
              assets work harder 24/7. From infrastructure to DeFi to cross-chain mobility, Tempo is your complete 
              unified earning platform.
            </p>
          </div>
        </div>
      </div>
    </section>;
};
export default WhySection;