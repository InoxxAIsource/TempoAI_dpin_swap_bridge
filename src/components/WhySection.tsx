const WhySection = () => {
  return (
    <section className="relative px-6 md:px-12 py-32">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-start">
          <div>
            <h2 className="text-5xl md:text-7xl font-bold leading-tight mb-8">
              Why create a{' '}
              <span className="block">new blockchain?</span>
            </h2>
          </div>
          
          <div className="space-y-8">
            <div className="text-sm text-muted-foreground flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <span>Multifaceted and borderless</span>
            </div>
            
            <p className="text-lg leading-relaxed text-foreground/80">
              Stablecoins enable instant, borderless, programmable transactions, but current blockchain 
              infrastructure isn't designed for them: existing systems are either fully general or 
              trading-focused. Tempo is a blockchain designed and built for real-world payments.
            </p>
            
            <p className="text-lg leading-relaxed text-foreground/80">
              Designed to meet the needs of modern payment processing, enhancing speed, efficiency, 
              and reliability.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhySection;
