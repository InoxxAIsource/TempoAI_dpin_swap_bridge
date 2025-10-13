import { Check } from 'lucide-react';

const DePINTimeline = () => {
  const timelineSteps = [
    {
      day: 'Day 1',
      title: 'Get Started',
      description: 'Sign up, add your first device, and see initial metrics appear on your dashboard.',
      amount: '$0',
      color: 'blue'
    },
    {
      day: 'Day 2',
      title: 'Verify Device',
      description: 'Complete Raspberry Pi setup and verification to unlock 2x earnings multiplier.',
      amount: '2x Multiplier',
      color: 'purple'
    },
    {
      day: 'Day 7',
      title: 'First Earnings',
      description: 'Reach $25 in accumulated rewards and bridge to your preferred blockchain.',
      amount: '$25',
      color: 'green'
    },
    {
      day: 'Day 30',
      title: 'DeFi Integration',
      description: 'Cross $100 earnings milestone and invest in yield farming protocols.',
      amount: '$100+',
      color: 'orange'
    },
    {
      day: 'Day 90',
      title: 'Scale Operations',
      description: 'Add 5+ devices to your network and scale your passive income stream.',
      amount: '$500+',
      color: 'red'
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-bold mb-3">Your DePIN Journey</h3>
        <p className="text-muted-foreground">
          Track your progress from beginner to advanced DePIN network contributor.
        </p>
      </div>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-purple-500 to-green-500" />

        {/* Timeline steps */}
        <div className="space-y-8">
          {timelineSteps.map((step, index) => (
            <div key={index} className="relative flex gap-6 items-start">
              {/* Circle */}
              <div className="relative z-10 flex items-center justify-center w-16 h-16 rounded-full bg-card border-2 border-primary shadow-lg shadow-primary/20">
                <Check className="w-6 h-6 text-primary" />
              </div>

              {/* Content */}
              <div className="flex-1 pb-8">
                <div className="p-6 rounded-xl border border-border bg-card/50 hover:bg-card/80 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold">
                        {step.day}
                      </span>
                      <h4 className="text-xl font-bold">{step.title}</h4>
                    </div>
                    <span className="text-2xl font-bold text-primary">{step.amount}</span>
                  </div>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DePINTimeline;
