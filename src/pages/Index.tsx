import ScrollingBackground from '@/components/ScrollingBackground';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import StatsSection from '@/components/StatsSection';
import WhySection from '@/components/WhySection';
import HowItWorksSection from '@/components/HowItWorksSection';
import YieldStrategiesSection from '@/components/YieldStrategiesSection';
import OptimizedSection from '@/components/OptimizedSection';
import TransformSection from '@/components/TransformSection';
import FeaturesGridSection from '@/components/FeaturesGridSection';
import CTASection from '@/components/CTASection';
import Footer from '@/components/Footer';
import StartEarningChat from '@/components/StartEarningChat';
import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

const Index = () => {
  const [contentReady, setContentReady] = useState(false);

  useEffect(() => {
    // Show content immediately without delay
    setContentReady(true);
  }, []);

  if (!contentReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
          <p className="text-lg text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      <ScrollingBackground />
      <div className="relative z-10">
        <Header />
        <main>
          <Hero />
          
          <div className="px-4 md:px-6 lg:px-12 py-8 md:py-12 max-w-7xl mx-auto">
            <StatsSection />
            <WhySection />
            <HowItWorksSection />
            <YieldStrategiesSection />
            <OptimizedSection />
            <TransformSection />
            <FeaturesGridSection />
            <CTASection />
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Index;
