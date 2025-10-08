import ScrollingBackground from '@/components/ScrollingBackground';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import WhySection from '@/components/WhySection';
import OptimizedSection from '@/components/OptimizedSection';
import TransformSection from '@/components/TransformSection';

const Index = () => {
  return (
    <div className="relative min-h-screen">
      <ScrollingBackground />
      <div className="relative z-10">
        <Header />
        <main>
          <Hero />
          <WhySection />
          <OptimizedSection />
          <TransformSection />
        </main>
      </div>
    </div>
  );
};

export default Index;
