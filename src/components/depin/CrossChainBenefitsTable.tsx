import { Card } from '@/components/ui/card';
import { X, Check, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const CrossChainBenefitsTable = () => {
  const comparisonData = [
    {
      feature: 'Reward Claiming',
      without: 'Only on Ethereum (high gas)',
      with: '7+ chains (low gas)',
      advantage: 'with'
    },
    {
      feature: 'DeFi Access',
      without: 'Ethereum protocols only',
      with: '30+ chain ecosystems',
      advantage: 'with'
    },
    {
      feature: 'Gas Costs',
      without: '$5-50 per transaction',
      with: '$0.15-0.50 per bridge',
      advantage: 'with'
    },
    {
      feature: 'Flexibility',
      without: 'Locked to one chain',
      with: 'Move freely between chains',
      advantage: 'with'
    },
    {
      feature: 'Yield Options',
      without: 'Limited (4-6% APY)',
      with: 'Diverse (6-15%+ APY)',
      advantage: 'with'
    },
    {
      feature: 'Fiat Off-Ramp',
      without: 'Complex multi-step',
      with: 'Easy via Coinbase (Base chain)',
      advantage: 'with'
    },
    {
      feature: 'Scalability',
      without: 'Limited by Ethereum',
      with: 'Multi-chain load balancing',
      advantage: 'with'
    },
    {
      feature: 'Future-Proof',
      without: 'Single point of failure',
      with: 'Diversified across chains',
      advantage: 'with'
    }
  ];

  const costData = [
    {
      scenario: 'Claim $100',
      without: 115,
      with: 100.70,
      label: 'Total Cost'
    },
    {
      scenario: 'To DeFi',
      without: 130,
      with: 101.40,
      label: 'Including DeFi Deposit'
    }
  ];

  const savingsData = [
    {
      amount: '$50',
      withoutWormhole: 57.50,
      withWormhole: 50.50,
      savings: 7.00
    },
    {
      amount: '$100',
      withoutWormhole: 115.00,
      withWormhole: 100.70,
      savings: 14.30
    },
    {
      amount: '$250',
      withoutWormhole: 287.50,
      withWormhole: 250.90,
      savings: 36.60
    },
    {
      amount: '$500',
      withoutWormhole: 575.00,
      withWormhole: 501.20,
      savings: 73.80
    }
  ];

  return (
    <div className="space-y-8">
      {/* Comparison Table */}
      <Card className="p-8">
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="w-8 h-8 text-primary" />
          <h2 className="text-3xl font-bold">With vs Without Wormhole</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-border">
                <th className="px-4 py-4 text-left font-bold">Feature</th>
                <th className="px-4 py-4 text-center font-bold">
                  <div className="flex items-center justify-center gap-2">
                    <X className="w-5 h-5 text-red-400" />
                    Without Wormhole
                  </div>
                </th>
                <th className="px-4 py-4 text-center font-bold">
                  <div className="flex items-center justify-center gap-2">
                    <Check className="w-5 h-5 text-green-400" />
                    With Wormhole
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {comparisonData.map((row, index) => (
                <tr key={index} className="border-b border-border hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-4 font-semibold">{row.feature}</td>
                  <td className="px-4 py-4 text-center">
                    <div className="inline-block px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20">
                      <span className="text-sm text-red-400">{row.without}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <div className="inline-block px-3 py-2 rounded-lg bg-green-500/10 border border-green-500/20">
                      <span className="text-sm text-green-400">{row.with}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Cost Comparison Chart */}
      <Card className="p-8">
        <h3 className="text-2xl font-bold mb-6">Total Cost to Claim $100 and Use in DeFi</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={costData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="scenario" />
            <YAxis label={{ value: 'Total Cost (USD)', angle: -90, position: 'insideLeft' }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
            />
            <Legend />
            <Bar dataKey="without" fill="#ef4444" name="Without Wormhole" />
            <Bar dataKey="with" fill="#10b981" name="With Wormhole" />
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-4 grid md:grid-cols-2 gap-4">
          <Card className="p-4 bg-red-500/5 border-red-500/20">
            <div className="text-sm text-muted-foreground mb-1">Without Wormhole</div>
            <div className="text-2xl font-bold text-red-400">$130.00</div>
            <div className="text-xs text-muted-foreground mt-2">
              $100 claim + $15 Ethereum gas + $15 DeFi gas
            </div>
          </Card>
          <Card className="p-4 bg-green-500/5 border-green-500/20">
            <div className="text-sm text-muted-foreground mb-1">With Wormhole</div>
            <div className="text-2xl font-bold text-green-400">$101.40</div>
            <div className="text-xs text-muted-foreground mt-2">
              $100 claim + $0.50 bridge + $0.40 Polygon gas + $0.50 DeFi
            </div>
          </Card>
        </div>
        <Card className="p-6 mt-4 bg-primary/5 border-primary/20">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground mb-1">Total Savings</div>
              <div className="text-3xl font-bold text-primary">$28.60</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground mb-1">Savings Percentage</div>
              <div className="text-3xl font-bold text-green-400">22%</div>
            </div>
          </div>
        </Card>
      </Card>

      {/* Savings Table */}
      <Card className="p-8">
        <h3 className="text-2xl font-bold mb-6">Savings at Different Claim Amounts</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left font-semibold">Claim Amount</th>
                <th className="px-4 py-3 text-right font-semibold">Without Wormhole</th>
                <th className="px-4 py-3 text-right font-semibold">With Wormhole</th>
                <th className="px-4 py-3 text-right font-semibold">Savings</th>
                <th className="px-4 py-3 text-right font-semibold">% Saved</th>
              </tr>
            </thead>
            <tbody>
              {savingsData.map((row, index) => {
                const percentSaved = ((row.savings / row.withoutWormhole) * 100).toFixed(1);
                
                return (
                  <tr key={index} className="border-b border-border hover:bg-muted/20">
                    <td className="px-4 py-4 font-semibold">{row.amount}</td>
                    <td className="px-4 py-4 text-right text-red-400">${row.withoutWormhole.toFixed(2)}</td>
                    <td className="px-4 py-4 text-right text-green-400">${row.withWormhole.toFixed(2)}</td>
                    <td className="px-4 py-4 text-right font-bold text-primary">${row.savings.toFixed(2)}</td>
                    <td className="px-4 py-4 text-right font-bold text-green-400">{percentSaved}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="text-sm text-muted-foreground mt-4">
          💡 Higher claim amounts = even greater savings! Wormhole bridge fee stays low while Ethereum gas fees remain high.
        </p>
      </Card>

      {/* Key Benefits Summary */}
      <Card className="p-8 bg-gradient-to-br from-green-500/10 to-blue-500/10 border-green-500/20">
        <h3 className="text-2xl font-bold mb-6">Why Wormhole is Essential</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-bold mb-3 flex items-center gap-2">
              <Check className="w-5 h-5 text-green-400" />
              Cost Savings
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Save 95% on gas fees ($0.50 vs $15+)</li>
              <li>• Bridge costs fixed, not percentage-based</li>
              <li>• Larger claims = even better value</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-3 flex items-center gap-2">
              <Check className="w-5 h-5 text-green-400" />
              Access & Flexibility
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• 30+ chains vs 1 (Ethereum)</li>
              <li>• 10x more DeFi opportunities</li>
              <li>• Easy fiat off-ramps (Base → Coinbase)</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-3 flex items-center gap-2">
              <Check className="w-5 h-5 text-green-400" />
              Higher Yields
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Ethereum: 4-6% APY max</li>
              <li>• Polygon/Base: 6-8% APY</li>
              <li>• Avalanche: 12%+ APY pools</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-3 flex items-center gap-2">
              <Check className="w-5 h-5 text-green-400" />
              Future-Proof
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Not locked into one ecosystem</li>
              <li>• Adapt as chains evolve</li>
              <li>• Diversify across networks</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CrossChainBenefitsTable;
