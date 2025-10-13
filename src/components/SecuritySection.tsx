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
  return <section className="relative px-4 md:px-6 lg:px-12 py-16 md:py-24 lg:py-32 bg-secondary/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 md:mb-20">
          <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-7xl font-bold leading-tight mb-6 md:mb-8">
            Security first,{' '}
            <span className="block">always</span>
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
            Built with security at the core. We're implementing industry-leading security measures 
            and preparing for comprehensive audits.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
          {securityFeatures.map((feature, index) => (
            <div key={index} className="text-center p-4">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-3 md:mb-4">
                <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-primary" />
              </div>
              <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3">{feature.title}</h3>
              <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>;
};
export default SecuritySection;