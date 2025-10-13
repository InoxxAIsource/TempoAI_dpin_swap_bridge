const StatsSection = () => {
  const stats = [{
    value: '$2.4B+',
    label: 'Total Value Locked'
  }, {
    value: '18.5%',
    label: 'Average APY'
  }, {
    value: '150K+',
    label: 'Active Users'
  }, {
    value: '99.9%',
    label: 'Uptime'
  }];
  return <section className="relative px-6 md:px-12 py-32">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl md:text-6xl font-bold mb-2">{stat.value}</div>
              <div className="text-sm text-muted-foreground uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>;
};
export default StatsSection;