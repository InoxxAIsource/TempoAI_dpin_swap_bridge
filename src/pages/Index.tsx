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
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const Index = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [pendingClaimsCount, setPendingClaimsCount] = useState(0);
  const navigate = useNavigate();
  
  console.log('Current active tab:', activeTab);

  useEffect(() => {
    fetchPendingClaimsCount();
  }, []);

  const fetchPendingClaimsCount = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { count, error } = await supabase
        .from('wormhole_transactions')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .or('status.eq.pending,needs_redemption.eq.true');

      if (!error && count) {
        setPendingClaimsCount(count);
      }
    } catch (error) {
      console.error('Error fetching pending claims:', error);
    }
  };

  return (
    <div className="relative min-h-screen">
      <ScrollingBackground />
      <div className="relative z-10">
        <Header />
        <main>
          <Hero />
          
          <div className="px-4 md:px-6 lg:px-12 py-8 md:py-12">
            <Tabs 
              value={activeTab}
              onValueChange={(value) => {
                console.log('Tab clicked! Changing to:', value);
                setActiveTab(value);
              }} 
              className="w-full max-w-7xl mx-auto"
            >
              <div className="sticky top-16 md:top-20 z-[100] bg-background/95 backdrop-blur-sm pb-3 md:pb-4 -mx-4 px-4 md:-mx-6 md:px-6 lg:-mx-12 lg:px-12 mb-6 md:mb-8">
                <TabsList className="grid w-full max-w-7xl mx-auto grid-cols-1 sm:grid-cols-3 h-auto p-1.5 md:p-2 bg-muted shadow-lg border border-border gap-1 sm:gap-0">
                  <TabsTrigger 
                    value="overview" 
                    className="py-2.5 md:py-3 text-sm md:text-base cursor-pointer data-[state=active]:bg-primary data-[state=active]:text-primary-foreground hover:bg-muted/50"
                    onClick={() => console.log('Overview tab clicked')}
                  >
                    Overview
                  </TabsTrigger>
                  <TabsTrigger 
                    value="about" 
                    className="py-2.5 md:py-3 text-sm md:text-base cursor-pointer data-[state=active]:bg-primary data-[state=active]:text-primary-foreground hover:bg-muted/50"
                    onClick={() => console.log('About tab clicked')}
                  >
                    About Protocol
                  </TabsTrigger>
                  <TabsTrigger 
                    value="redemption" 
                    className="py-2.5 md:py-3 text-sm md:text-base cursor-pointer data-[state=active]:bg-primary data-[state=active]:text-primary-foreground hover:bg-muted/50 relative"
                    onClick={() => {
                      console.log('Redemption tab clicked');
                      navigate('/claim');
                    }}
                  >
                    Redemption
                    {pendingClaimsCount > 0 && (
                      <span className="ml-2 px-2 py-0.5 text-xs bg-red-500 text-white rounded-full">
                        {pendingClaimsCount}
                      </span>
                    )}
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
