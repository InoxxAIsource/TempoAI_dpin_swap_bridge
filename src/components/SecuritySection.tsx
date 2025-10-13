const SecuritySection = () => {
  const securityFeatures = [{
    title: 'Multi-signature Controls',
    description: 'Protocol upgrades and treasury operations require multiple signatures from trusted parties.'
  }, {
    title: 'Time-locked Upgrades',
    description: 'Timelock mechanisms on smart contract upgrades, giving users time to review changes.'
  }, {
    title: 'Emergency Pause',
    description: 'Emergency shutdown mechanism designed to protect funds in case of critical vulnerabilities.'
  }, {
    title: 'Smart Contract Security',
    description: 'Built on battle-tested protocols and following industry best practices for DeFi security.'
  }, {
    title: 'Real-time Monitoring',
    description: 'AI-powered monitoring system tracks transactions and detects suspicious activity patterns.'
  }, {
    title: 'Open Source',
    description: 'Transparent, open-source codebase enabling community review and contributions.'
  }];
  return <section className="relative px-6 md:px-12 py-32 bg-secondary/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-7xl font-bold leading-tight mb-8">
            Security first,{' '}
            <span className="block">always</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Built with security at the core. We're implementing industry-leading security measures 
            and preparing for comprehensive audits.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {securityFeatures.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 rounded-full bg-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>;
};
export default SecuritySection;