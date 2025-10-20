import { Button } from '@/components/ui/button';
const CTASection = () => {
  return <section className="relative px-4 md:px-6 lg:px-12 py-16 md:py-24 lg:py-32 bg-secondary/30">
      <div className="max-w-6xl mx-auto">
        <div className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-primary text-primary-foreground p-8 md:p-12 lg:p-20">
          <div className="relative z-10 text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold leading-tight mb-6 md:mb-8">
              Start earning{' '}
              <span className="block">passive income today</span>
            </h2>
            <p className="text-base md:text-lg lg:text-xl mb-8 md:mb-12 opacity-90 max-w-2xl mx-auto px-4">Earning superior yields with AI-powered DeFi strategies.</p>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center px-4">
              <Button size="lg" variant="secondary" className="rounded-full px-6 md:px-10 py-4 md:py-6 text-sm md:text-base font-medium">
                Launch App
              </Button>
              <Button size="lg" variant="outline" className="rounded-full px-6 md:px-10 py-4 md:py-6 text-sm md:text-base font-medium bg-transparent border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                View Documentation
              </Button>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-foreground/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-foreground/5 rounded-full blur-3xl" />
        </div>
      </div>
    </section>;
};
export default CTASection;