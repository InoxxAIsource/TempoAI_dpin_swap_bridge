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
    <section className="relative px-6 md:px-12 py-32 bg-secondary/30">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-5xl md:text-7xl font-bold leading-tight mb-20">
          Transform how{' '}
          <span className="block">you generate</span>
          <span className="block">passive income</span>
        </h2>

        <div className="space-y-20">
          {features.map((feature) => (
            <div key={feature.number} className="border-t border-border pt-12">
              <div className="grid md:grid-cols-12 gap-8">
                <div className="md:col-span-3">
                  <span className="text-4xl md:text-5xl font-bold text-foreground/40">
                    {feature.number}
                  </span>
                  <span className="text-2xl md:text-3xl font-bold ml-4">
                    ::
                  </span>
                </div>
                
                <div className="md:col-span-9 space-y-4">
                  <h3 className="text-2xl md:text-3xl font-bold">
                    {feature.title}
                  </h3>
                  <p className="text-lg leading-relaxed text-foreground/70 max-w-2xl">
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
