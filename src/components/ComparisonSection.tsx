const ComparisonSection = () => {
  const comparisons = [
    {
      feature: 'Average APY',
      traditional: '0.5%',
      manual: '8-12%',
      tempo: '18.5%',
    },
    {
      feature: 'Time Required',
      traditional: '0 min/week',
      manual: '10+ hrs/week',
      tempo: '0 min/week',
    },
    {
      feature: 'Risk Management',
      traditional: 'None',
      manual: 'Manual',
      tempo: 'AI-Powered',
    },
    {
      feature: 'Gas Optimization',
      traditional: 'N/A',
      manual: 'Manual',
      tempo: 'Automated',
    },
    {
      feature: 'Multi-chain',
      traditional: 'No',
      manual: 'Complex',
      tempo: 'Seamless',
    },
    {
      feature: 'Rebalancing',
      traditional: 'None',
      manual: 'Manual',
      tempo: 'Real-time AI',
    },
  ];

  return (
    <section className="relative px-4 md:px-6 lg:px-12 py-16 md:py-24 lg:py-32 bg-secondary/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 md:mb-20">
          <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-7xl font-bold leading-tight mb-6 md:mb-8">
            Why Tempo beats{' '}
            <span className="block">the alternatives</span>
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
            Compare Tempo's AI-powered approach against traditional banking and manual DeFi strategies.
          </p>
        </div>

        <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
          <div className="min-w-[600px]">
            {/* Header */}
            <div className="grid grid-cols-4 gap-4 mb-4">
              <div className="font-bold text-sm uppercase tracking-wider text-muted-foreground">
                Feature
              </div>
              <div className="text-center font-bold text-sm uppercase tracking-wider text-muted-foreground">
                Traditional Banks
              </div>
              <div className="text-center font-bold text-sm uppercase tracking-wider text-muted-foreground">
                Manual DeFi
              </div>
              <div className="text-center font-bold text-sm uppercase tracking-wider bg-primary/10 rounded-lg py-2">
                Tempo AI
              </div>
            </div>

            {/* Rows */}
            {comparisons.map((row, index) => (
              <div
                key={index}
                className="grid grid-cols-4 gap-4 py-4 border-t border-border items-center"
              >
                <div className="font-medium">{row.feature}</div>
                <div className="text-center text-muted-foreground">{row.traditional}</div>
                <div className="text-center text-muted-foreground">{row.manual}</div>
                <div className="text-center font-bold bg-primary/5 rounded-lg py-2">
                  {row.tempo}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ComparisonSection;
