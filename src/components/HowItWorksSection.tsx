const HowItWorksSection = () => {
  const steps = [
    {
      step: '01',
      title: 'Connect Your Wallet',
      description: 'Link your Web3 wallet in seconds. We support MetaMask, WalletConnect, Coinbase Wallet, and all major providers.',
      features: ['Non-custodial', 'Secure connection', 'Multi-chain support'],
    },
    {
      step: '02',
      title: 'Deposit Assets',
      description: 'Choose from stablecoins, ETH, BTC, or other supported assets. Our AI will analyze the best yield strategies for your portfolio.',
      features: ['Multiple assets', 'Flexible amounts', 'Gas optimization'],
    },
    {
      step: '03',
      title: 'AI Optimizes Yield',
      description: 'Our machine learning engine continuously scans opportunities across lending protocols, liquidity pools, and farming strategies.',
      features: ['Real-time analysis', 'Risk assessment', 'Auto-rebalancing'],
    },
    {
      step: '04',
      title: 'Earn & Compound',
      description: 'Watch your yields grow automatically. Rewards are auto-compounded for maximum returns with minimal gas fees.',
      features: ['Auto-compound', 'Transparent fees', 'Withdraw anytime'],
    },
  ];

  return (
    <section className="relative px-6 md:px-12 py-32 bg-secondary/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-7xl font-bold leading-tight mb-8">
            How it works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get started in minutes. Our AI handles the complexity while you earn passive income.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {steps.map((step) => (
            <div key={step.step} className="relative">
              <div className="flex items-start gap-6">
                <div className="text-6xl font-bold text-foreground/10">{step.step}</div>
                <div className="flex-1 pt-2">
                  <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
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
