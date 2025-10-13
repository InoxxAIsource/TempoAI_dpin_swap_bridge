import { Card } from '@/components/ui/card';
import { Activity, Shield, Database, DollarSign, Globe2, ArrowRight } from 'lucide-react';

const ProcessFlowSection = () => {
  const steps = [
    {
      icon: Activity,
      title: 'Device Reports',
      description: 'IoT device collects metrics',
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      icon: Shield,
      title: 'Sign Metrics',
      description: 'Cryptographic signature',
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
    {
      icon: Database,
      title: 'Backend Verifies',
      description: 'Validate authenticity',
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      icon: DollarSign,
      title: 'Calculate Reward',
      description: 'Apply multipliers',
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
    },
    {
      icon: Database,
      title: 'Store in DB',
      description: 'Record transaction',
      color: 'text-red-500',
      bgColor: 'bg-red-500/10',
    },
    {
      icon: Globe2,
      title: 'Bridge Cross-Chain',
      description: 'Wormhole transfer',
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-500/10',
    },
  ];

  return (
    <Card className="p-6 mb-8">
      <h3 className="text-2xl font-bold mb-6">DePIN Data Flow</h3>
      
      <div className="grid md:grid-cols-6 gap-4">
        {steps.map((step, index) => (
          <div key={index} className="relative">
            <div className="flex flex-col items-center text-center">
              <div className={`w-16 h-16 rounded-full ${step.bgColor} flex items-center justify-center mb-3`}>
                <step.icon className={`w-8 h-8 ${step.color}`} />
              </div>
              <h4 className="font-semibold text-sm mb-1">{step.title}</h4>
              <p className="text-xs text-muted-foreground">{step.description}</p>
            </div>
            
            {index < steps.length - 1 && (
              <div className="hidden md:block absolute top-8 -right-2 transform">
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-muted/50 rounded-lg">
        <h4 className="font-semibold mb-2 text-sm">How Rewards are Calculated:</h4>
        <div className="text-sm text-muted-foreground space-y-1">
          <p>• Base rate: <strong className="text-foreground">$0.05 per kWh</strong> of energy produced</p>
          <p>• Verified devices: <strong className="text-green-600 dark:text-green-400">2x multiplier</strong></p>
          <p>• Demo devices: <strong className="text-blue-600 dark:text-blue-400">1x multiplier</strong></p>
          <p>• Uptime bonus: Additional rewards for 99%+ uptime</p>
        </div>
      </div>
    </Card>
  );
};

export default ProcessFlowSection;
