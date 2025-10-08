const TransformSection = () => {
  const features = [
    {
      number: '01',
      title: 'Purpose-built payments capabilities',
      description: 'Optimize your financial flows with embedded payment features, including memo fields and batch transfers.',
    },
    {
      number: '02',
      title: 'Fast and cost-effective',
      description: 'Process transactions at scale with sub-second finality and fees measured in fractions of a cent.',
    },
    {
      number: '03',
      title: 'Enterprise-grade security',
      description: 'Built with the highest security standards, audited by leading firms, and designed for regulatory compliance.',
    },
  ];

  return (
    <section className="relative px-6 md:px-12 py-32 bg-secondary/30">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-5xl md:text-7xl font-bold leading-tight mb-20">
          Transform how{' '}
          <span className="block">your business</span>
          <span className="block">moves money</span>
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
