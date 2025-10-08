import { Button } from '@/components/ui/button';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 md:px-12 py-20">
      <div className="max-w-6xl w-full">
        <div className="flex items-center gap-2 mb-8 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary" />
            <span>Incubated by Leading Innovators</span>
          </div>
        </div>

        <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold leading-tight mb-12 max-w-5xl">
          The blockchain{' '}
          <span className="block">designed for</span>
          <span className="block">payments</span>
        </h1>

        <Button 
          variant="outline" 
          size="lg"
          className="rounded-full px-8 py-6 text-base hover:bg-primary hover:text-primary-foreground transition-all duration-300"
        >
          Request access
        </Button>

        <div className="mt-20 max-w-3xl">
          <p className="text-lg md:text-xl leading-relaxed text-foreground/80">
            Tempo is a purpose-built, layer 1 blockchain for payments, developed in partnership with 
            leading fintechs and Fortune 500s. With support for all major stablecoins, Tempo enables 
            high-throughput, low-cost global transactions for any business use case.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;
