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
import { useState } from 'react';

const Index = () => {
  const [activeTab, setActiveTab] = useState("overview");
  
  console.log('Current active tab:', activeTab);

  return (
    <div className="relative min-h-screen">
      <ScrollingBackground />
      <div className="relative z-10">
        <Header />
        <main>
          <Hero />
          
          <div className="px-6 md:px-12 py-12">
            <Tabs 
              value={activeTab}
              onValueChange={(value) => {
                console.log('Tab clicked! Changing to:', value);
                setActiveTab(value);
              }} 
              className="w-full max-w-7xl mx-auto"
            >
              <div className="sticky top-20 z-[100] bg-background/95 backdrop-blur-sm pb-4 -mx-6 px-6 md:-mx-12 md:px-12 mb-8">
                <TabsList className="grid w-full max-w-7xl mx-auto grid-cols-2 h-auto p-2 bg-muted shadow-lg border border-border">
                  <TabsTrigger 
                    value="overview" 
                    className="py-3 text-base cursor-pointer data-[state=active]:bg-primary data-[state=active]:text-primary-foreground hover:bg-muted/50"
                    onClick={() => console.log('Overview tab clicked')}
                  >
                    Overview
                  </TabsTrigger>
                  <TabsTrigger 
                    value="about" 
                    className="py-3 text-base cursor-pointer data-[state=active]:bg-primary data-[state=active]:text-primary-foreground hover:bg-muted/50"
                    onClick={() => console.log('About tab clicked')}
                  >
                    About Protocol
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="overview" className="m-0">
                <StatsSection />
                <WhySection />
                <HowItWorksSection />
                <YieldStrategiesSection />
                <OptimizedSection />
                <TransformSection />
                <FeaturesGridSection />
                <CTASection />
              </TabsContent>
              
              <TabsContent value="about" className="m-0">
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
