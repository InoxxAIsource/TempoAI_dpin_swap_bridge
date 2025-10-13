const HowItWorksSection = () => {
  const steps = [
    {
      step: '01',
      title: 'Connect Your Wallet',
      description: 'Link your Web3 wallet in seconds. We support MetaMask, WalletConnect, Coinbase Wallet, and all major multi-chain providers.',
      features: ['Non-custodial', 'Secure connection', '30+ chains supported'],
    },
    {
      step: '02',
      title: 'Choose Your Strategy',
      description: 'Deploy assets to DeFi yields, add DePIN devices for infrastructure rewards, or combine both for maximum earnings.',
      features: ['AI-powered DeFi', 'DePIN rewards', 'Hybrid strategies'],
    },
    {
      step: '03',
      title: 'Bridge & Swap Freely',
      description: 'Move assets seamlessly across chains with Wormhole integration. Swap tokens at optimal rates when needed.',
      features: ['Cross-chain bridging', 'Best swap rates', 'Sub-2min transfers'],
    },
    {
      step: '04',
      title: 'Earn & Optimize',
      description: 'AI continuously optimizes your positions while DePIN devices earn in the background. Compound rewards automatically.',
      features: ['Auto-optimization', 'Real-time monitoring', 'Withdraw anytime'],
    },
  ];

  return (
    <section className="relative px-4 md:px-6 lg:px-12 py-16 md:py-24 lg:py-32 bg-secondary/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 md:mb-20">
          <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-7xl font-bold leading-tight mb-6 md:mb-8">
            How it works
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
            Get started in minutes. From DeFi to DePIN to cross-chain, everything works together seamlessly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {steps.map((step) => (
            <div key={step.step} className="relative">
              <div className="flex items-start gap-4 md:gap-6">
                <div className="text-4xl md:text-6xl font-bold text-foreground/10">{step.step}</div>
                <div className="flex-1 pt-1 md:pt-2">
                  <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">{step.title}</h3>
                  <p className="text-foreground/70 mb-6 leading-relaxed">
                    {step.description}
                  </p>
                  <ul className="space-y-2">
                    {step.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
