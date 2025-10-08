const WhySection = () => {
  return (
    <section className="relative px-6 md:px-12 py-32">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-start">
          <div>
            <h2 className="text-5xl md:text-7xl font-bold leading-tight mb-8">
              Why AI-powered{' '}
              <span className="block">yield optimization?</span>
            </h2>
          </div>
          
          <div className="space-y-8">
            <div className="text-sm text-muted-foreground flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <span>Intelligent and adaptive</span>
            </div>
            
            <p className="text-lg leading-relaxed text-foreground/80">
              Traditional DeFi protocols require constant manual monitoring and rebalancing. Tempo's 
              AI engine analyzes thousands of yield opportunities per second, automatically deploying 
              capital to the most profitable strategies while managing risk in real-time.
            </p>
            
            <p className="text-lg leading-relaxed text-foreground/80">
              Our neural network learns from market patterns, adapting to volatility and optimizing 
              your returns 24/7 without human intervention.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhySection;
