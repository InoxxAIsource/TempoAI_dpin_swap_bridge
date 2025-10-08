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
            <Tabs defaultValue="overview" className="w-full max-w-7xl mx-auto" onValueChange={(value) => console.log('Tab changed to:', value)}>
              <div className="sticky top-20 z-50 bg-background/95 backdrop-blur-sm pb-4 -mx-6 px-6 md:-mx-12 md:px-12">
                <TabsList className="grid w-full max-w-7xl mx-auto grid-cols-3 h-auto p-2 bg-muted shadow-lg border border-border">
                  <TabsTrigger 
                    value="overview" 
                    className="py-3 text-base cursor-pointer data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    Overview
                  </TabsTrigger>
                  <TabsTrigger 
                    value="start-earning" 
                    className="py-3 text-base cursor-pointer data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    Start Earning
                  </TabsTrigger>
                  <TabsTrigger 
                    value="about" 
                    className="py-3 text-base cursor-pointer data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    About Protocol
                  </TabsTrigger>
                </TabsList>
              </div>
              
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
