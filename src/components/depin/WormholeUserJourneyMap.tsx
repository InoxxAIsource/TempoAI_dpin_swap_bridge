import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { User, Users, Building2, TrendingUp } from 'lucide-react';

const WormholeUserJourneyMap = () => {
  const scenarios = [
    {
      id: 'small',
      name: 'Small Solar Panel Owner',
      icon: User,
      devices: 1,
      monthlyEarning: 3.50,
      bridgeThreshold: 100,
      color: '#3b82f6'
    },
    {
      id: 'multi',
      name: 'Multi-Device Owner',
      icon: Users,
      devices: 3,
      monthlyEarning: 15.75,
      bridgeThreshold: 100,
      color: '#8b5cf6'
    },
    {
      id: 'aggressive',
      name: 'Aggressive Claimer',
      icon: Building2,
      devices: 5,
      monthlyEarning: 42.50,
      bridgeThreshold: 50,
      color: '#10b981'
    }
  ];

  const [selectedScenario, setSelectedScenario] = useState(scenarios[0]);

  const generateJourneyData = (scenario: typeof scenarios[0]) => {
    const data = [];
    const bridgeCost = 0.50;
    const defiAPY = 0.06;
    
    let accumulated = 0;
    let inDefi = 0;
    let totalEarned = 0;
    
    for (let month = 0; month <= 36; month++) {
      accumulated += scenario.monthlyEarning;
      totalEarned += scenario.monthlyEarning;
      
      // Check if threshold reached
      if (accumulated >= scenario.bridgeThreshold) {
        // Bridge to DeFi
        const netAmount = accumulated - bridgeCost;
        inDefi += netAmount;
        accumulated = 0;
      }
      
      // Calculate DeFi growth
      if (inDefi > 0) {
        inDefi = inDefi * (1 + defiAPY / 12);
      }
      
      const totalBalance = accumulated + inDefi;
      
      data.push({
        month,
        accumulated: accumulated.toFixed(2),
        inDefi: inDefi.toFixed(2),
        totalBalance: totalBalance.toFixed(2),
        totalEarned: totalEarned.toFixed(2)
      });
    }
    
    return data;
  };

  const journeyData = generateJourneyData(selectedScenario);

  const getTimeline = (scenario: typeof scenarios[0]) => {
    const monthsToThreshold = Math.ceil(scenario.bridgeThreshold / scenario.monthlyEarning);
    const bridgesPerYear = Math.floor(12 / monthsToThreshold);
    const yearlyEarnings = scenario.monthlyEarning * 12;
    const netBridgeCost = bridgesPerYear * 0.50;
    const netYearly = yearlyEarnings - netBridgeCost;
    
    return {
      monthsToThreshold,
      bridgesPerYear,
      yearlyEarnings,
      netBridgeCost,
      netYearly
    };
  };

  return (
    <div className="space-y-8">
      <Card className="p-8">
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="w-8 h-8 text-primary" />
          <h2 className="text-3xl font-bold">Your Journey with Wormhole</h2>
        </div>

        <p className="text-muted-foreground mb-8">
          Visualize how different DePIN setups accumulate rewards and utilize Wormhole bridging 
          to maximize DeFi yields over time.
        </p>

        {/* Scenario Selector */}
        <Tabs defaultValue="small" className="mb-8">
          <TabsList className="grid w-full grid-cols-3">
            {scenarios.map((scenario) => (
              <TabsTrigger
                key={scenario.id}
                value={scenario.id}
                onClick={() => setSelectedScenario(scenario)}
              >
                <scenario.icon className="w-4 h-4 mr-2" />
                {scenario.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {scenarios.map((scenario) => {
            const timeline = getTimeline(scenario);
            
            return (
              <TabsContent key={scenario.id} value={scenario.id} className="space-y-6">
                {/* Scenario Overview */}
                <div className="grid md:grid-cols-4 gap-4">
                  <Card className="p-4">
                    <div className="text-sm text-muted-foreground mb-1">Devices</div>
                    <div className="text-2xl font-bold">{scenario.devices}</div>
                  </Card>
                  <Card className="p-4">
                    <div className="text-sm text-muted-foreground mb-1">Monthly Earnings</div>
                    <div className="text-2xl font-bold text-primary">${scenario.monthlyEarning}</div>
                  </Card>
                  <Card className="p-4">
                    <div className="text-sm text-muted-foreground mb-1">Bridge Threshold</div>
                    <div className="text-2xl font-bold">${scenario.bridgeThreshold}</div>
                  </Card>
                  <Card className="p-4">
                    <div className="text-sm text-muted-foreground mb-1">Time to Threshold</div>
                    <div className="text-2xl font-bold text-green-400">{timeline.monthsToThreshold}mo</div>
                  </Card>
                </div>

                {/* Timeline Details */}
                <Card className="p-6 bg-muted/30">
                  <h4 className="font-bold mb-4">Journey Timeline</h4>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-20 text-sm text-muted-foreground">Month 1-{timeline.monthsToThreshold}</div>
                      <div className="flex-1">
                        <div className="font-semibold mb-1">Accumulation Phase</div>
                        <div className="text-sm text-muted-foreground">
                          Earning ${scenario.monthlyEarning}/month from {scenario.devices} device{scenario.devices > 1 ? 's' : ''} until reaching ${scenario.bridgeThreshold} threshold
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-20 text-sm text-muted-foreground">Day {timeline.monthsToThreshold * 30}</div>
                      <div className="flex-1">
                        <div className="font-semibold mb-1 text-primary">First Bridge</div>
                        <div className="text-sm text-muted-foreground">
                          Bridge ${scenario.bridgeThreshold} to Polygon ($0.50 fee) → Net ${(scenario.bridgeThreshold - 0.50).toFixed(2)} deposited in Aave (6% APY)
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-20 text-sm text-muted-foreground">Year 1</div>
                      <div className="flex-1">
                        <div className="font-semibold mb-1">Optimization Phase</div>
                        <div className="text-sm text-muted-foreground">
                          Bridge {timeline.bridgesPerYear}x/year • Total earned: ${timeline.yearlyEarnings.toFixed(2)} • 
                          Bridge costs: ${timeline.netBridgeCost.toFixed(2)} • Net: ${timeline.netYearly.toFixed(2)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-20 text-sm text-muted-foreground">Year 3</div>
                      <div className="flex-1">
                        <div className="font-semibold mb-1 text-green-400">Compound Growth</div>
                        <div className="text-sm text-muted-foreground">
                          DeFi yields compounding • Total portfolio value significantly increased through combined DePIN + DeFi strategy
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Chart */}
                <Card className="p-6">
                  <h4 className="font-bold mb-4">3-Year Portfolio Growth</h4>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={journeyData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis 
                        dataKey="month" 
                        label={{ value: 'Months', position: 'insideBottom', offset: -5 }}
                        className="text-xs"
                      />
                      <YAxis 
                        label={{ value: 'USD', angle: -90, position: 'insideLeft' }}
                        className="text-xs"
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="accumulated" 
                        stroke="#f59e0b" 
                        name="Pending (Not Bridged)"
                        strokeWidth={2}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="inDefi" 
                        stroke="#8b5cf6" 
                        name="In DeFi (Growing)"
                        strokeWidth={2}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="totalBalance" 
                        stroke="#10b981" 
                        name="Total Balance"
                        strokeWidth={3}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                  <p className="text-xs text-muted-foreground mt-4">
                    💡 The gap between "Total Balance" and "Total Earned" shows DeFi yield contribution
                  </p>
                </Card>

                {/* Key Insights */}
                <Card className="p-6 bg-primary/5 border-primary/20">
                  <h4 className="font-bold mb-3">Key Insights for {scenario.name}</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>
                        Bridge every <strong>{timeline.monthsToThreshold} months</strong> for optimal balance between fees and DeFi time
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>
                        Bridge costs (<strong>${timeline.netBridgeCost.toFixed(2)}/year</strong>) are only <strong>{((timeline.netBridgeCost / timeline.yearlyEarnings) * 100).toFixed(1)}%</strong> of earnings
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>
                        After 3 years: Total balance of <strong>${journeyData[36].totalBalance}</strong> 
                        (earned ${journeyData[36].totalEarned} + DeFi yield)
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>
                        {scenario.id === 'small' && 'Consider waiting for $100 to minimize bridge cost percentage'}
                        {scenario.id === 'multi' && 'Sweet spot: earn fast enough that DeFi time maximizes yield'}
                        {scenario.id === 'aggressive' && 'Bridge more frequently to maximize compound DeFi returns'}
                      </span>
                    </li>
                  </ul>
                </Card>
              </TabsContent>
            );
          })}
        </Tabs>

        {/* Comparison Summary */}
        <Card className="p-6 bg-gradient-to-r from-primary/10 to-purple-500/10 border-primary/20">
          <h4 className="font-bold mb-4">Scenario Comparison (Year 1)</h4>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-left">Scenario</th>
                  <th className="px-4 py-3 text-right">Devices</th>
                  <th className="px-4 py-3 text-right">Bridges/Year</th>
                  <th className="px-4 py-3 text-right">Gross Earned</th>
                  <th className="px-4 py-3 text-right">Bridge Costs</th>
                  <th className="px-4 py-3 text-right">Net + DeFi</th>
                </tr>
              </thead>
              <tbody>
                {scenarios.map((scenario) => {
                  const timeline = getTimeline(scenario);
                  const defiBoost = (timeline.netYearly * 0.06).toFixed(2); // Simplified
                  
                  return (
                    <tr key={scenario.id} className="border-b border-border">
                      <td className="px-4 py-3 font-semibold">{scenario.name}</td>
                      <td className="px-4 py-3 text-right">{scenario.devices}</td>
                      <td className="px-4 py-3 text-right">{timeline.bridgesPerYear}</td>
                      <td className="px-4 py-3 text-right">${timeline.yearlyEarnings.toFixed(2)}</td>
                      <td className="px-4 py-3 text-right text-red-400">-${timeline.netBridgeCost.toFixed(2)}</td>
                      <td className="px-4 py-3 text-right font-bold text-green-400">
                        ${(timeline.netYearly + parseFloat(defiBoost)).toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </Card>
    </div>
  );
};

export default WormholeUserJourneyMap;
