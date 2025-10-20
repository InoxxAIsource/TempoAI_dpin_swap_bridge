import { useWalletContext } from '@/contexts/WalletContext';
import AuthPrompt from '../AuthPrompt';
import PortfolioOverview from '@/components/portfolio/PortfolioOverview';
import RewardsCalculator from '../RewardsCalculator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';

interface PortfolioTabProps {
  earnings: number;
  dailyRate: number;
  activeDevices: number;
  uptime: number;
}

const PortfolioTab = ({ earnings, dailyRate, activeDevices, uptime }: PortfolioTabProps) => {
  const { isAuthenticated } = useWalletContext();

  if (!isAuthenticated) {
    return <AuthPrompt />;
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold mb-2">Portfolio & Earnings</h2>
        <p className="text-muted-foreground">
          Track your device performance, earnings, and potential returns
        </p>
      </div>

      {/* Portfolio Overview */}
      {/* <PortfolioOverview userId={session?.user?.id || ''} /> */}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Earned
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${earnings.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card className="border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Daily Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${dailyRate.toFixed(2)}/day</div>
          </CardContent>
        </Card>

        <Card className="border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Devices
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeDevices}</div>
          </CardContent>
        </Card>

        <Card className="border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg Uptime
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uptime.toFixed(1)}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Earning Estimator */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Earning Potential Calculator
          </CardTitle>
          <CardDescription>
            Estimate your potential earnings based on device configuration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RewardsCalculator deviceCount={activeDevices} avgKwhPerDay={20} verifiedDeviceCount={activeDevices} />
        </CardContent>
      </Card>
    </div>
  );
};

export default PortfolioTab;
