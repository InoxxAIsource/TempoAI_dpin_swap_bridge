import { Button } from '@/components/ui/button';

const OptimizedSection = () => {
  return (
    <section className="relative px-6 md:px-12 py-32">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-5xl md:text-7xl font-bold leading-tight mb-12">
          Optimized for{' '}
          <span className="block">real-world flows</span>
        </h2>

        <div className="max-w-3xl mb-12">
          <p className="text-lg leading-relaxed text-foreground/80 mb-8">
            Tempo was started by Stripe and Paradigm, with design input from Anthropic, Coupang, 
            Deutsche Bank, DoorDash, Lead Bank, Mercury, Nubank, OpenAI, Revolut, Shopify, 
            Standard Chartered, Visa, and more.
          </p>
          
          <p className="text-lg leading-relaxed text-foreground/80 mb-12">
            If you're a company with large, real-world economic flows and would like to help shape 
            the future of Tempo, get in touch.
          </p>

          <Button 
            variant="outline" 
            size="lg"
            className="rounded-full px-8 py-6 text-base hover:bg-primary hover:text-primary-foreground transition-all duration-300"
          >
            Partner with us
          </Button>
        </div>

        <div className="text-sm text-muted-foreground flex items-center gap-2 mt-16">
          <div className="w-2 h-2 rounded-full bg-primary" />
          <span>Purpose-built for payments</span>
        </div>
        
        <p className="text-base leading-relaxed text-foreground/70 mt-4 max-w-2xl">
          An initiative guided by leading businesses in financial services, commerce, and AI to 
          build scalable infrastructure for high-volume use cases.
        </p>
      </div>
    </section>
  );
};

export default OptimizedSection;
