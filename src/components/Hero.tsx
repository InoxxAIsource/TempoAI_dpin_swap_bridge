import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
const Hero = () => {
  const navigate = useNavigate();
  return <section className="relative min-h-screen flex items-center justify-center px-4 md:px-6 lg:px-12 py-12 md:py-16 lg:py-20">
      <div className="max-w-6xl w-full">
        <div className="flex items-center gap-2 mb-6 md:mb-8 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            
            <span className="font-archivo tracking-wider text-foreground">
              TEMPO
            </span>
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold leading-tight md:leading-tight lg:leading-tight mb-6 md:mb-12 max-w-5xl">
          The Unified AI{' '}
          <span className="block">DeFi/DePin Platform</span>
          <span className="block">for everyone</span>
        </h1>

        <Button variant="outline" size="lg" onClick={() => navigate('/chat')} className="rounded-full px-6 md:px-8 py-3.5 md:py-6 text-sm md:text-base min-h-[44px] hover:bg-primary hover:text-primary-foreground transition-all duration-300">
          Get started
        </Button>

        <div className="mt-8 md:mt-20 max-w-3xl">
          <p className="text-base md:text-lg lg:text-xl leading-relaxed md:leading-relaxed text-foreground/80">
            Tempo is an AI-native DeFi ecosystem that powers yield farming, DePIN rewards, cross-chain bridges, and token swaps all in one unified hub. Earn from multiple sources, move assets across chains instantly.
          </p>
        </div>
      </div>
    </section>;
};
export default Hero;
