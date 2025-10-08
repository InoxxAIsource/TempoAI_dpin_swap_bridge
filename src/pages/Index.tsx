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
import ComparisonSection from '@/components/ComparisonSection';
import SecuritySection from '@/components/SecuritySection';
import FAQSection from '@/components/FAQSection';
import CTASection from '@/components/CTASection';
import Footer from '@/components/Footer';
import StartEarningChat from '@/components/StartEarningChat';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Index = () => {
  return (
    <div className="relative min-h-screen">
      <ScrollingBackground />
      <div className="relative z-10">
        <Header />
        <main>
          <Hero />
          
          <div className="px-6 md:px-12 py-12">
            <Tabs defaultValue="overview" className="w-full max-w-7xl mx-auto">
              <TabsList className="grid w-full grid-cols-3 mb-12">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="start-earning">Start Earning</TabsTrigger>
                <TabsTrigger value="about">About Protocol</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview">
                <StatsSection />
                <WhySection />
                <HowItWorksSection />
                <YieldStrategiesSection />
              </TabsContent>
              
              <TabsContent value="start-earning">
                <StartEarningChat />
                <OptimizedSection />
                <TransformSection />
                <FeaturesGridSection />
                <CTASection />
              </TabsContent>
              
              <TabsContent value="about">
                <ComparisonSection />
                <SecuritySection />
                <FAQSection />
              </TabsContent>
            </Tabs>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Index;
