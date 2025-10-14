import { useEffect, useState } from 'react';
import PageLayout from '../components/layout/PageLayout';
import PageHero from '../components/layout/PageHero';
import PortfolioOverview from '../components/portfolio/PortfolioOverview';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const Portfolio = () => {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      if (!user) {
        navigate('/auth');
      }
    });
  }, [navigate]);

  if (!user) {
    return null;
  }

  return (
    <PageLayout>
      <PageHero 
        title="Portfolio Overview"
        description="Track your DePIN earnings and cross-chain assets in real-time"
      />

      <section className="px-4 md:px-6 lg:px-12 py-6 md:py-8 pb-16 md:pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/depin')}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to DePIN
            </Button>
          </div>

          <PortfolioOverview userId={user.id} />
        </div>
      </section>
    </PageLayout>
  );
};

export default Portfolio;
