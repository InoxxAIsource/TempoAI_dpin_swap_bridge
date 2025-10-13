import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
const Hero = () => {
  const navigate = useNavigate();
  return <section className="relative min-h-screen flex items-center justify-center px-6 md:px-12 py-20">
      <div className="max-w-6xl w-full">
        <div className="flex items-center gap-2 mb-8 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary" />
            <span>
          </span>
          </div>
        </div>

        <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold leading-tight mb-12 max-w-5xl">
          The unified{' '}
          <span className="block">DeFi platform</span>
          <span className="block">for everyone</span>
        </h1>

        <Button variant="outline" size="lg" onClick={() => navigate('/chat')} className="rounded-full px-8 py-6 text-base hover:bg-primary hover:text-primary-foreground transition-all duration-300">
          Get started
        </Button>

        <div className="mt-20 max-w-3xl">
          <p className="text-lg md:text-xl leading-relaxed text-foreground/80">
            Tempo is an AI-native DeFi ecosystem that powers yield farming, DePIN rewards, cross-chain bridges, and token swaps all in one unified hub. Earn from multiple sources, move assets across chains instantly.
          </p>
        </div>
      </div>
    </section>;
};
export default Hero;