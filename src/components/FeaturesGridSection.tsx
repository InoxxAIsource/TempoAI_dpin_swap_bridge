const FeaturesGridSection = () => {
  const features = [
    {
      title: 'Gas Optimization',
      description: 'AI batches transactions and chooses optimal timing to minimize gas costs by up to 60%.',
    },
    {
      title: 'Portfolio Analytics',
      description: 'Real-time dashboard showing APY, risk metrics, historical performance, and projected earnings.',
    },
    {
      title: 'Tax Reporting',
      description: 'Automatic transaction tracking and tax report generation compatible with major tax software.',
    },
    {
      title: 'Mobile App',
      description: 'Manage your yields on the go with our native iOS and Android apps with biometric security.',
    },
    {
      title: 'Social Trading',
      description: 'Follow top-performing strategies and automatically mirror their allocations.',
    },
    {
      title: 'Referral Rewards',
      description: 'Earn 20% of protocol fees from users you refer, paid directly to your wallet.',
    },
    {
      title: 'No Lock-ups',
      description: 'Withdraw your assets anytime without penalties or waiting periods.',
    },
    {
      title: 'DAO Governance',
      description: 'Token holders vote on protocol upgrades, fee structures, and treasury allocations.',
    },
  ];

  return (
    <section className="relative px-6 md:px-12 py-32">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-7xl font-bold leading-tight mb-8">
            Built for DeFi natives
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Every feature designed to give you complete control and transparency over your yields.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="group">
              <div className="h-full p-6 rounded-xl border border-border hover:border-primary/50 transition-all duration-300">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <div className="w-6 h-6 rounded-full bg-primary" />
                </div>
                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                <p className="text-sm text-foreground/70 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesGridSection;
