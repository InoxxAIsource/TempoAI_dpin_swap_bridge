import { Calculator, TrendingUp, Zap } from 'lucide-react';
import { Card } from '@/components/ui/card';
import UseCaseCard from '../docs/UseCaseCard';

const CalculationExamples = () => {
  const examples = [
    {
      title: 'Single Solar Panel (Demo Mode)',
      device: '5kW Solar Panel',
      location: 'California (avg 7 peak sun hours)',
      calculations: [
        'Daily Production: 5kW × 7h = 35 kWh',
        'Base Reward: 35 kWh × $0.05 = $1.75',
        'Multiplier: Demo (1x) = $1.75/day',
        'Monthly: $1.75 × 30 = $52.50',
        'Yearly: $52.50 × 12 = $630'
      ],
      highlight: '$52.50/month',
      color: 'blue'
    },
    {
      title: 'Same Panel (Verified with Raspberry Pi)',
      device: '5kW Solar Panel + RPi',
      location: 'California (avg 7 peak sun hours)',
      calculations: [
        'Daily Production: 35 kWh (same as demo)',
        'Base Reward: 35 kWh × $0.05 = $1.75',
        'Multiplier: Verified (2x) = $3.50/day',
        'Monthly: $3.50 × 30 = $105',
        'Yearly: $105 × 12 = $1,260',
        'ROI on Pi (~$50): 14 days'
      ],
      highlight: '$105/month (2x earnings!)',
      color: 'green'
    },
    {
      title: 'Temperature Sensor Network',
      device: 'DHT22 Temperature Sensor',
      location: 'Indoor climate monitoring',
      calculations: [
        'Readings: 288/day (every 5 minutes)',
        'Base Reward: 288 × $0.01 = $2.88/day',
        'Multiplier: Verified (2x) = $5.76/day',
        'Monthly: $5.76 × 30 = $172.80',
        'Hardware Cost: ~$5 per sensor',
        'ROI: < 1 day'
      ],
      highlight: '$172.80/month per sensor',
      color: 'purple'
    },
    {
      title: 'Mixed Device Portfolio',
      device: 'Multiple Device Types',
      location: 'Full home setup',
      calculations: [
        '2 Solar Panels (verified): 2 × $3.50 = $7/day',
        '5 Temperature Sensors (verified): 5 × $5.76 = $28.80/day',
        '1 Wind Turbine (demo): $2.50/day',
        'Total Daily: $38.30',
        'Total Monthly: $1,149',
        'Total Yearly: $13,788'
      ],
      highlight: '$1,149/month from home devices',
      color: 'orange'
    }
  ];

  const detailedBreakdown = [
    {
      metric: 'Energy Production',
      value: '35 kWh',
      description: '5kW panel × 7 peak sun hours'
    },
    {
      metric: 'Base Rate',
      value: '$0.05/kWh',
      description: 'Current network rate for solar energy'
    },
    {
      metric: 'Base Reward',
      value: '$1.75',
      description: '35 kWh × $0.05'
    },
    {
      metric: 'Demo Multiplier',
      value: '1x',
      description: 'Simulated devices (no verification)'
    },
    {
      metric: 'Verified Multiplier',
      value: '2x',
      description: 'Cryptographically signed metrics'
    },
    {
      metric: 'Uptime Bonus',
      value: '+10%',
      description: 'For devices with >99% uptime'
    },
    {
      metric: 'Final (Verified)',
      value: '$3.50/day',
      description: '$1.75 × 2 = $105/month'
    },
    {
      metric: 'Final (Verified + Bonus)',
      value: '$3.85/day',
      description: '$3.50 × 1.1 = $115.50/month'
    }
  ];

  return (
    <div className="space-y-12">
      {/* Formula Overview */}
      <div>
        <h3 className="text-3xl font-bold mb-6">Reward Calculation Formula</h3>
        <Card className="p-8 bg-gradient-to-br from-primary/5 to-purple-500/5">
          <div className="text-center mb-8">
            <div className="inline-block px-6 py-4 rounded-xl bg-card border border-primary/20">
              <div className="text-2xl font-mono font-bold">
                Reward = (Metric × Base Rate × Multiplier) + Uptime Bonus
              </div>
            </div>
          </div>
          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-sm text-muted-foreground mb-2">Metric</div>
              <div className="text-xl font-bold">35 kWh</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-2">Base Rate</div>
              <div className="text-xl font-bold">$0.05</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-2">Multiplier</div>
              <div className="text-xl font-bold">2x</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-2">Bonus</div>
              <div className="text-xl font-bold">+10%</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Detailed Breakdown */}
      <div>
        <h3 className="text-3xl font-bold mb-6">Step-by-Step Breakdown</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {detailedBreakdown.map((item, index) => (
            <Card key={index} className="p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-muted-foreground">{item.metric}</span>
                <span className="text-2xl font-bold text-primary">{item.value}</span>
              </div>
              <div className="text-sm text-muted-foreground">{item.description}</div>
            </Card>
          ))}
        </div>
      </div>

      {/* Real Examples */}
      <div>
        <h3 className="text-3xl font-bold mb-6">Real-World Examples</h3>
        <div className="space-y-8">
          {examples.map((example, index) => (
            <Card key={index} className="p-8">
              <div className="flex items-start gap-6">
                <div className="p-4 rounded-xl bg-primary/10">
                  <Calculator className="w-8 h-8 text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="text-2xl font-bold mb-3">{example.title}</h4>
                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Device:</div>
                      <div className="font-semibold">{example.device}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Location:</div>
                      <div className="font-semibold">{example.location}</div>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <div className="text-sm font-semibold text-muted-foreground mb-3">Calculations:</div>
                    <div className="space-y-2 font-mono text-sm bg-muted/30 p-4 rounded-lg">
                      {example.calculations.map((calc, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <span className="text-primary">►</span>
                          <span>{calc}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="inline-block px-6 py-3 rounded-xl bg-gradient-to-r from-primary/20 to-purple-500/20 border border-primary/30">
                    <div className="flex items-center gap-3">
                      <TrendingUp className="w-5 h-5 text-primary" />
                      <span className="text-xl font-bold text-primary">{example.highlight}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Comparison Chart */}
      <div>
        <h3 className="text-3xl font-bold mb-6">Demo vs Verified Comparison</h3>
        <Card className="p-8">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-left font-semibold">Device Type</th>
                  <th className="px-4 py-3 text-right font-semibold">Daily (Demo)</th>
                  <th className="px-4 py-3 text-right font-semibold">Daily (Verified)</th>
                  <th className="px-4 py-3 text-right font-semibold">Monthly Difference</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border hover:bg-muted/20">
                  <td className="px-4 py-3">5kW Solar Panel</td>
                  <td className="px-4 py-3 text-right">$1.75</td>
                  <td className="px-4 py-3 text-right text-green-400 font-semibold">$3.50</td>
                  <td className="px-4 py-3 text-right text-green-400">+$52.50</td>
                </tr>
                <tr className="border-b border-border hover:bg-muted/20">
                  <td className="px-4 py-3">Temperature Sensor</td>
                  <td className="px-4 py-3 text-right">$2.88</td>
                  <td className="px-4 py-3 text-right text-green-400 font-semibold">$5.76</td>
                  <td className="px-4 py-3 text-right text-green-400">+$86.40</td>
                </tr>
                <tr className="border-b border-border hover:bg-muted/20">
                  <td className="px-4 py-3">Wind Turbine</td>
                  <td className="px-4 py-3 text-right">$2.50</td>
                  <td className="px-4 py-3 text-right text-green-400 font-semibold">$5.00</td>
                  <td className="px-4 py-3 text-right text-green-400">+$75.00</td>
                </tr>
                <tr className="hover:bg-muted/20">
                  <td className="px-4 py-3 font-bold">Portfolio (2+5+1)</td>
                  <td className="px-4 py-3 text-right font-bold">$19.15</td>
                  <td className="px-4 py-3 text-right text-green-400 font-bold">$38.30</td>
                  <td className="px-4 py-3 text-right text-green-400 font-bold">+$574.50</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Key Takeaways */}
      <Card className="p-8 bg-gradient-to-br from-green-500/5 to-blue-500/5 border-green-500/20">
        <div className="flex items-start gap-4 mb-6">
          <Zap className="w-8 h-8 text-green-400 flex-shrink-0" />
          <div>
            <h3 className="text-2xl font-bold mb-3">Key Takeaways</h3>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-1">✓</span>
                <span>Verified devices earn <span className="text-green-400 font-semibold">exactly 2x</span> more than demo devices</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-1">✓</span>
                <span>Raspberry Pi investment (~$50) pays back in <span className="text-green-400 font-semibold">14 days</span> for solar panels</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-1">✓</span>
                <span>Temperature sensors have the <span className="text-green-400 font-semibold">fastest ROI</span> (less than 1 day)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-1">✓</span>
                <span>Mixed portfolios can generate <span className="text-green-400 font-semibold">$1,000+/month</span> passive income</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-400 mt-1">✓</span>
                <span>Uptime bonus (+10%) rewards consistent device performance</span>
              </li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CalculationExamples;
