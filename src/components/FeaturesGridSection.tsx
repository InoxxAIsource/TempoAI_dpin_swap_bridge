import { Link } from 'react-router-dom';
import { MessageSquare, TrendingUp, Repeat, RefreshCw, Activity } from 'lucide-react';

const FeaturesGridSection = () => {
  const features = [
    {
      title: 'DePIN Network',
      description: 'Earn rewards from physical infrastructure devices. Monitor solar panels, sensors, and IoT devices cross-chain.',
      icon: Activity,
      link: '/depin',
      highlight: true,
    },
    {
      title: 'AI DeFi Assistant',
      description: 'Chat with AI to optimize yields across Aave, Compound, and Curve. Get personalized strategies and execute deposits instantly.',
      icon: MessageSquare,
      link: '/chat',
    },
    {
      title: 'Yield Optimization',
      description: 'Automated allocation and rebalancing across top DeFi protocols for maximum APY with minimal gas costs.',
      icon: TrendingUp,
      link: '/portfolio',
    },
    {
      title: 'Wormhole Bridge',
      description: 'Move assets across 30+ chains in under 2 minutes. Bridge DePIN rewards or DeFi yields to any network.',
      icon: Repeat,
      link: '/bridge',
    },
    {
      title: 'Token Swap',
      description: 'Swap tokens at the best rates aggregated from multiple DEXs with MEV protection and optimal routing.',
      icon: RefreshCw,
      link: '/swap',
    },
  ];

  return (
    <section className="relative px-6 md:px-12 py-32">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-7xl font-bold leading-tight mb-8">
            All-in-one platform
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            DeFi yields, physical infrastructure rewards, cross-chain bridging, and token swaps unified in one powerful platform.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Link key={index} to={feature.link} className="group">
                <div className={`h-full p-8 rounded-2xl border-2 transition-all duration-300 ${
                  feature.highlight 
                    ? 'border-primary/50 bg-gradient-to-br from-primary/10 to-secondary/10 hover:border-primary hover:shadow-lg hover:shadow-primary/20' 
                    : 'border-border hover:border-primary/50'
                }`}>
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 transition-colors ${
                    feature.highlight 
                      ? 'bg-primary/20 group-hover:bg-primary/30' 
                      : 'bg-primary/10 group-hover:bg-primary/20'
                  }`}>
                    <Icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                  {feature.highlight && (
                    <div className="mt-4 text-xs font-semibold text-primary">
                      New Feature ✨
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              title: 'Gas Optimization',
              description: 'AI batches transactions and chooses optimal timing to minimize gas costs by up to 60%.',
            },
            {
              title: 'Portfolio Analytics',
              description: 'Real-time dashboard showing APY, risk metrics, historical performance, and projected earnings.',
            },
            {
              title: 'Tax Reporting',
              description: 'Automatic transaction tracking and tax report generation compatible with major tax software.',
            },
            {
              title: 'No Lock-ups',
              description: 'Withdraw your assets anytime without penalties or waiting periods.',
            },
          ].map((feature, index) => (
            <div key={index} className="group">
              <div className="h-full p-6 rounded-xl border border-border hover:border-primary/50 transition-all duration-300">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <div className="w-6 h-6 rounded-full bg-primary" />
                </div>
                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                <p className="text-sm text-foreground/70 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesGridSection;
