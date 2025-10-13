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
  return <section className="relative px-4 md:px-6 lg:px-12 py-16 md:py-24 lg:py-32">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-xs md:text-sm text-muted-foreground uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>;
};
export default StatsSection;