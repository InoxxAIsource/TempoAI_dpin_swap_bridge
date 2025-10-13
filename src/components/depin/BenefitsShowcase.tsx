import { DollarSign, Globe, TrendingUp, Lock, Users, Zap, Leaf, BarChart3, Shield } from 'lucide-react';
import { Card } from '@/components/ui/card';

const BenefitsShowcase = () => {
  const individualBenefits = [
    {
      icon: DollarSign,
      title: 'Passive Income',
      description: 'Earn $50-500+ per month from existing hardware like solar panels, sensors, or IoT devices.',
      highlight: '$50-500+/month'
    },
    {
      icon: Globe,
      title: 'Multi-Chain Access',
      description: 'Bridge your earnings to 7+ blockchain networks and access DeFi opportunities globally.',
      highlight: '7+ Chains'
    },
    {
      icon: TrendingUp,
      title: 'Scalable Earnings',
      description: 'Start with one device and scale to dozens. Your earnings grow linearly with each addition.',
      highlight: 'Linear Growth'
    },
    {
      icon: Lock,
      title: 'Full Ownership',
      description: 'You own your data, devices, and earnings. No middlemen, no data harvesting.',
      highlight: 'Your Data'
    }
  ];

  const networkBenefits = [
    {
      icon: Users,
      title: 'Decentralized Infrastructure',
      description: 'Build resilient networks that can\'t be shut down by any single entity.',
      highlight: 'Censorship-Resistant'
    },
    {
      icon: Shield,
      title: 'Cryptographic Proof',
      description: 'Every metric is signed and verifiable on-chain, ensuring data integrity.',
      highlight: 'Tamper-Proof'
    },
    {
      icon: BarChart3,
      title: 'Global Distribution',
      description: 'Devices span continents, creating diverse and comprehensive data networks.',
      highlight: '34+ Countries'
    },
    {
      icon: Zap,
      title: 'Real-Time Verification',
      description: 'Instant validation of metrics using decentralized consensus mechanisms.',
      highlight: 'Instant'
    }
  ];

  const environmentalBenefits = [
    {
      icon: Leaf,
      title: 'Renewable Energy Incentives',
      description: 'Financial rewards for solar panel owners accelerate clean energy adoption.',
      highlight: '21.8 tons CO₂ offset'
    },
    {
      icon: TrendingUp,
      title: 'Transparent Impact',
      description: 'All energy production data is publicly verifiable and tracked on-chain.',
      highlight: 'Public Ledger'
    },
    {
      icon: Globe,
      title: 'Global Sustainability',
      description: 'Create economic incentives aligned with environmental responsibility.',
      highlight: 'Green Economy'
    },
    {
      icon: BarChart3,
      title: 'Data-Driven Decisions',
      description: 'Real-world renewable energy data helps optimize grid infrastructure.',
      highlight: '43,750 kWh Tracked'
    }
  ];

  const BenefitCard = ({ icon: Icon, title, description, highlight }: any) => (
    <Card className="p-6 hover:shadow-lg hover:shadow-primary/5 transition-all">
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-xl bg-primary/10">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        <div className="flex-1">
          <h4 className="text-lg font-semibold mb-2">{title}</h4>
          <p className="text-sm text-muted-foreground mb-3">{description}</p>
          <div className="inline-block px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-semibold">
            {highlight}
          </div>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="space-y-16">
      {/* For Individuals */}
      <div>
        <div className="mb-8">
          <h3 className="text-3xl font-bold mb-3">For You (Individual)</h3>
          <p className="text-lg text-muted-foreground">
            Turn your existing hardware into a passive income stream while contributing to decentralized infrastructure.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {individualBenefits.map((benefit, index) => (
            <BenefitCard key={index} {...benefit} />
          ))}
        </div>
      </div>

      {/* For Network */}
      <div>
        <div className="mb-8">
          <h3 className="text-3xl font-bold mb-3">For the Network (Ecosystem)</h3>
          <p className="text-lg text-muted-foreground">
            Build resilient, transparent, and globally distributed physical infrastructure networks.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {networkBenefits.map((benefit, index) => (
            <BenefitCard key={index} {...benefit} />
          ))}
        </div>
      </div>

      {/* For Environment */}
      <div>
        <div className="mb-8">
          <h3 className="text-3xl font-bold mb-3">For the Environment (Global Impact)</h3>
          <p className="text-lg text-muted-foreground">
            Create economic incentives for renewable energy adoption and transparent environmental data.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {environmentalBenefits.map((benefit, index) => (
            <BenefitCard key={index} {...benefit} />
          ))}
        </div>
      </div>

      {/* Summary Stats */}
      <Card className="p-8 bg-gradient-to-br from-primary/5 via-purple-500/5 to-green-500/5 border-primary/20">
        <h3 className="text-2xl font-bold mb-6 text-center">Current Network Impact</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">1,245</div>
            <div className="text-sm text-muted-foreground">Active Devices</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">43,750</div>
            <div className="text-sm text-muted-foreground">kWh Produced</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">$2,187</div>
            <div className="text-sm text-muted-foreground">Rewards Distributed</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">34</div>
            <div className="text-sm text-muted-foreground">Countries</div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default BenefitsShowcase;
