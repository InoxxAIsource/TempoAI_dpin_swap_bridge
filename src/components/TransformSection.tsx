const TransformSection = () => {
  const features = [
    {
      number: '01',
      title: 'AI-powered yield optimization',
      description: 'Our machine learning algorithms scan thousands of yield opportunities across DeFi protocols, automatically allocating capital to maximize returns while managing risk exposure in real-time.',
    },
    {
      number: '02',
      title: 'Auto-compounding & rebalancing',
      description: 'Set it and forget it. Tempo automatically compounds your yields and rebalances your portfolio based on market conditions, saving you gas fees and maximizing long-term growth.',
    },
    {
      number: '03',
      title: 'Multi-chain liquidity aggregation',
      description: 'Access the best yields across Ethereum, Arbitrum, Optimism, Polygon, and more. Our protocol aggregates liquidity from top DEXs and lending platforms for optimal capital efficiency.',
    },
  ];

  return (
    <section className="relative px-4 md:px-6 lg:px-12 py-16 md:py-24 lg:py-32 bg-secondary/30">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-7xl font-bold leading-tight mb-12 md:mb-20">
          Transform how{' '}
          <span className="block">you generate</span>
          <span className="block">passive income</span>
        </h2>

        <div className="space-y-12 md:space-y-20">
          {features.map((feature) => (
            <div key={feature.number} className="border-t border-border pt-8 md:pt-12">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8">
                <div className="md:col-span-3">
                  <span className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground/40">
                    {feature.number}
                  </span>
                  <span className="text-xl md:text-2xl lg:text-3xl font-bold ml-3 md:ml-4">
                    ::
                  </span>
                </div>
                
                <div className="md:col-span-9 space-y-3 md:space-y-4">
                  <h3 className="text-xl md:text-2xl lg:text-3xl font-bold">
                    {feature.title}
                  </h3>
                  <p className="text-base md:text-lg leading-relaxed text-foreground/70 max-w-2xl">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TransformSection;
