import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
const Hero = () => {
  const navigate = useNavigate();
  return <section className="relative min-h-screen flex items-center justify-center px-4 md:px-6 lg:px-12 py-12 md:py-16 lg:py-20">
      <div className="max-w-6xl w-full">
        <div className="flex items-center gap-2 mb-6 md:mb-8 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-primary" />
            <span>
          </span>
          </div>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl font-bold leading-tight mb-8 md:mb-12 max-w-5xl">
          The unified{' '}
          <span className="block">DeFi platform</span>
          <span className="block">for everyone</span>
        </h1>

        <Button variant="outline" size="lg" onClick={() => navigate('/chat')} className="rounded-full px-6 md:px-8 py-4 md:py-6 text-sm md:text-base hover:bg-primary hover:text-primary-foreground transition-all duration-300">
          Get started
        </Button>

        <div className="mt-12 md:mt-20 max-w-3xl">
          <p className="text-base md:text-lg lg:text-xl leading-relaxed text-foreground/80">
            Tempo is an AI-native DeFi ecosystem that powers yield farming, DePIN rewards, cross-chain bridges, and token swaps all in one unified hub. Earn from multiple sources, move assets across chains instantly.
          </p>
        </div>
      </div>
    </section>;
};
export default Hero;