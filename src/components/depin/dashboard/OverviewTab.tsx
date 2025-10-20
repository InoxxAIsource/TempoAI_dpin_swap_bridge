import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Map, TrendingUp, Shield, Zap, Globe } from 'lucide-react';
import ProcessFlowSection from '../ProcessFlowSection';
import ExplainerPanel from '../ExplainerPanel';

interface OverviewTabProps {
  onNavigateToTab: (tab: string) => void;
}

const OverviewTab = ({ onNavigateToTab }: OverviewTabProps) => {
  const quickActions = [
    {
      icon: Plus,
      title: 'Add Your First Device',
      description: 'Connect your DePIN hardware and start earning',
      action: 'add-device',
      color: 'text-green-500',
    },
    {
      icon: Map,
      title: 'View Network Map',
      description: 'See your devices on the interactive 3D globe',
      action: 'trace',
      color: 'text-blue-500',
    },
    {
      icon: TrendingUp,
      title: 'Check Earnings',
      description: 'View your portfolio and earning metrics',
      action: 'portfolio',
      color: 'text-purple-500',
    },
  ];

  const features = [
    {
      icon: Shield,
      title: 'Cryptographic Verification',
      description: 'All device data is cryptographically signed and verified',
    },
    {
      icon: Zap,
      title: 'Real-time Rewards',
      description: 'Earn rewards instantly as your devices contribute data',
    },
    {
      icon: Globe,
      title: 'Cross-chain Support',
      description: 'Bridge your rewards to any supported blockchain',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-purple-500 to-primary bg-clip-text text-transparent">
          Decentralized Physical Infrastructure Network
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Connect your physical devices to the decentralized network and earn rewards for contributing valuable data and services.
        </p>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action) => (
            <Card
              key={action.action}
              className="cursor-pointer hover:shadow-lg transition-all hover:scale-105 border-primary/20"
              onClick={() => onNavigateToTab(action.action)}
            >
              <CardHeader>
                <action.icon className={`w-12 h-12 ${action.color} mb-2`} />
                <CardTitle>{action.title}</CardTitle>
                <CardDescription>{action.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="ghost" className="w-full">
                  Get Started →
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Key Features */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Why Tempo DePIN?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature) => (
            <Card key={feature.title} className="border-primary/20">
              <CardHeader>
                <feature.icon className="w-10 h-10 text-primary mb-2" />
                <CardTitle className="text-lg">{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>

      {/* Process Flow */}
      <div>
        <h2 className="text-2xl font-bold mb-4">How It Works</h2>
        <ProcessFlowSection />
      </div>

      {/* Explainer */}
      <ExplainerPanel />
    </div>
  );
};

export default OverviewTab;
