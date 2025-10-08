import { Button } from '@/components/ui/button';

const CTASection = () => {
  return (
    <section className="relative px-6 md:px-12 py-32 bg-secondary/30">
      <div className="max-w-6xl mx-auto">
        <div className="relative overflow-hidden rounded-3xl bg-primary text-primary-foreground p-12 md:p-20">
          <div className="relative z-10 text-center">
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-8">
              Start earning{' '}
              <span className="block">passive income today</span>
            </h2>
            <p className="text-lg md:text-xl mb-12 opacity-90 max-w-2xl mx-auto">
              Join 150,000+ users already earning superior yields with AI-powered DeFi strategies.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="secondary"
                className="rounded-full px-10 py-6 text-base font-medium"
              >
                Launch App
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full px-10 py-6 text-base font-medium bg-transparent border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
              >
                View Documentation
              </Button>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-foreground/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-foreground/5 rounded-full blur-3xl" />
        </div>
      </div>
    </section>
  );
};

export default CTASection;
