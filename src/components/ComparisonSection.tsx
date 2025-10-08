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
    <section className="relative px-6 md:px-12 py-32 bg-secondary/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-7xl font-bold leading-tight mb-8">
            Why Tempo beats{' '}
            <span className="block">the alternatives</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Compare Tempo's AI-powered approach against traditional banking and manual DeFi strategies.
          </p>
        </div>

        <div className="overflow-x-auto">
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
