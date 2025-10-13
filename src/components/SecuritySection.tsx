const SecuritySection = () => {
  const auditors = ['Trail of Bits', 'OpenZeppelin', 'Quantstamp', 'ConsenSys Diligence', 'Certora', 'Halborn'];
  const securityFeatures = [{
    title: 'Multi-signature Controls',
    description: 'All protocol upgrades and treasury operations require multiple signatures from trusted parties.'
  }, {
    title: 'Time-locked Upgrades',
    description: '72-hour timelock on all smart contract upgrades, giving users time to review changes.'
  }, {
    title: 'Emergency Pause',
    description: 'Decentralized emergency shutdown mechanism to protect funds in case of critical vulnerabilities.'
  }, {
    title: 'Insurance Coverage',
    description: 'Protocol is covered by leading DeFi insurance providers with $50M+ in coverage.'
  }, {
    title: 'Real-time Monitoring',
    description: 'AI-powered anomaly detection system monitors all transactions 24/7 for suspicious activity.'
  }, {
    title: 'Bug Bounty Program',
    description: 'Industry-leading bug bounty program with rewards up to $1M for critical vulnerabilities.'
  }];
  return <section className="relative px-6 md:px-12 py-32 bg-secondary/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-7xl font-bold leading-tight mb-8">
            Security first,{' '}
            <span className="block">always</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Your funds are protected by industry-leading security measures and audited by 
            the most trusted firms in Web3.
          </p>
        </div>

        <div className="mb-20">
          
          <div className="flex flex-wrap justify-center gap-8">
            {auditors.map((auditor, index) => {})}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {securityFeatures.map((feature, index) => <div key={index} className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 rounded-full bg-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-sm text-foreground/70 leading-relaxed">
                {feature.description}
              </p>
            </div>)}
        </div>

        
      </div>
    </section>;
};
export default SecuritySection;