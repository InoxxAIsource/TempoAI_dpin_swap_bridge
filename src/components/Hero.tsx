import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 md:px-12 py-20">
      <div className="max-w-6xl w-full">
        <div className="flex items-center gap-2 mb-8 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary" />
            <span>Powered by Artificial Intelligence</span>
          </div>
        </div>

        <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold leading-tight mb-12 max-w-5xl">
          The unified{' '}
          <span className="block">DeFi platform</span>
          <span className="block">for everyone</span>
        </h1>

        <Button 
          variant="outline" 
          size="lg"
          onClick={() => navigate('/chat')}
          className="rounded-full px-8 py-6 text-base hover:bg-primary hover:text-primary-foreground transition-all duration-300"
        >
          Start earning
        </Button>

        <div className="mt-20 max-w-3xl">
          <p className="text-lg md:text-xl leading-relaxed text-foreground/80">
            Tempo is an AI-powered unified DeFi platform that combines intelligent yield optimization, 
            DePIN infrastructure rewards, seamless cross-chain bridging, and token swaps—all in one place. 
            Earn from multiple sources, move assets across chains instantly with Wormhole, and let AI maximize your returns 24/7.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;
