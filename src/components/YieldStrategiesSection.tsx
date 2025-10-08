const YieldStrategiesSection = () => {
  const strategies = [
    {
      name: 'Stablecoin Vaults',
      apy: '12-15%',
      risk: 'Low',
      description: 'Conservative strategy focused on stablecoin lending and liquidity provision across Aave, Compound, and Curve.',
      protocols: ['Aave', 'Compound', 'Curve'],
    },
    {
      name: 'ETH Liquid Staking',
      apy: '8-11%',
      risk: 'Low',
      description: 'Stake ETH while maintaining liquidity through LSDs. Earn staking rewards plus additional DeFi yields.',
      protocols: ['Lido', 'Rocket Pool', 'Frax'],
    },
    {
      name: 'Blue Chip Farming',
      apy: '18-25%',
      risk: 'Medium',
      description: 'Automated yield farming on established protocols with large liquidity. AI rebalances based on market conditions.',
      protocols: ['Uniswap', 'Balancer', 'Convex'],
    },
    {
      name: 'Advanced Delta Neutral',
      apy: '25-40%',
      risk: 'Medium-High',
      description: 'Sophisticated strategies using perpetual futures and options to capture funding rates while hedging directional risk.',
      protocols: ['dYdX', 'GMX', 'Gains Network'],
    },
    {
      name: 'Multi-Chain Arbitrage',
      apy: '30-50%',
      risk: 'High',
      description: 'AI identifies and executes cross-chain arbitrage opportunities with optimized bridge routing and MEV protection.',
      protocols: ['Stargate', 'Synapse', 'Across'],
    },
    {
      name: 'AI Momentum Trading',
      apy: '40-80%',
      risk: 'High',
      description: 'Machine learning models predict short-term price movements and execute high-frequency strategies on DEXs.',
      protocols: ['1inch', 'Paraswap', 'CowSwap'],
    },
  ];

  const getRiskColor = (risk: string) => {
    if (risk === 'Low') return 'text-green-600 bg-green-600/10';
    if (risk === 'Medium') return 'text-yellow-600 bg-yellow-600/10';
    if (risk === 'Medium-High') return 'text-orange-600 bg-orange-600/10';
    return 'text-red-600 bg-red-600/10';
  };

  return (
    <section className="relative px-6 md:px-12 py-32">
      <div className="max-w-6xl mx-auto">
        <div className="mb-20">
          <h2 className="text-5xl md:text-7xl font-bold leading-tight mb-8">
            Yield strategies{' '}
            <span className="block">for every risk profile</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl">
            From conservative stablecoin lending to aggressive multi-chain arbitrage, 
            our AI manages diverse strategies to match your risk tolerance.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {strategies.map((strategy, index) => (
            <div
              key={index}
              className="border border-border rounded-2xl p-8 hover:border-primary/50 transition-all duration-300 bg-card"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-2xl font-bold">{strategy.name}</h3>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">{strategy.apy}</div>
                  <div className="text-xs text-muted-foreground">APY</div>
                </div>
              </div>

              <div className="mb-4">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getRiskColor(strategy.risk)}`}>
                  {strategy.risk} Risk
                </span>
              </div>

              <p className="text-foreground/70 mb-6 leading-relaxed">
                {strategy.description}
              </p>

              <div className="flex flex-wrap gap-2">
                {strategy.protocols.map((protocol, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-full text-xs bg-secondary text-secondary-foreground"
                  >
                    {protocol}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default YieldStrategiesSection;
