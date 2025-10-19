import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { DollarSign, TrendingUp, Award } from 'lucide-react';

const WormholeCostComparison = () => {
  const [claimAmount, setClaimAmount] = useState(100);

  const chains = [
    {
      name: 'Ethereum',
      bridgeFee: 0,
      gasCost: 0,
      time: 'Instant',
      defiFee: 15,
      defiApy: 4,
      color: 'text-blue-400',
      borderColor: 'border-blue-500/20',
      bgColor: 'bg-blue-500/10'
    },
    {
      name: 'Polygon',
      bridgeFee: 0.30,
      gasCost: 0.20,
      time: '~2 min',
      defiFee: 0.50,
      defiApy: 6,
      color: 'text-purple-400',
      borderColor: 'border-purple-500/20',
      bgColor: 'bg-purple-500/10'
    },
    {
      name: 'Base',
      bridgeFee: 0.25,
      gasCost: 0.15,
      time: '~1.5 min',
      defiFee: 0.40,
      defiApy: 5,
      color: 'text-blue-400',
      borderColor: 'border-blue-500/20',
      bgColor: 'bg-blue-500/10'
    },
    {
      name: 'Arbitrum',
      bridgeFee: 0.40,
      gasCost: 0.30,
      time: '~2 min',
      defiFee: 0.60,
      defiApy: 5.5,
      color: 'text-blue-400',
      borderColor: 'border-blue-500/20',
      bgColor: 'bg-blue-500/10'
    },
    {
      name: 'Optimism',
      bridgeFee: 0.40,
      gasCost: 0.30,
      time: '~2 min',
      defiFee: 0.60,
      defiApy: 5.2,
      color: 'text-red-400',
      borderColor: 'border-red-500/20',
      bgColor: 'bg-red-500/10'
    },
    {
      name: 'Avalanche',
      bridgeFee: 0.50,
      gasCost: 0.40,
      time: '~2.5 min',
      defiFee: 0.80,
      defiApy: 12,
      color: 'text-red-400',
      borderColor: 'border-red-500/20',
      bgColor: 'bg-red-500/10'
    },
    {
      name: 'BNB Chain',
      bridgeFee: 0.45,
      gasCost: 0.35,
      time: '~2 min',
      defiFee: 0.70,
      defiApy: 8,
      color: 'text-yellow-400',
      borderColor: 'border-yellow-500/20',
      bgColor: 'bg-yellow-500/10'
    }
  ];

  const calculateResults = (chain: typeof chains[0]) => {
    const totalCost = chain.bridgeFee + chain.gasCost;
    const netReceived = claimAmount - totalCost;
    const defiNet = netReceived - chain.defiFee;
    const yearlyEarnings = defiNet * (1 + chain.defiApy / 100);
    const profit = yearlyEarnings - claimAmount;
    const effectiveAPY = ((yearlyEarnings / claimAmount) - 1) * 100;
    
    return {
      totalCost,
      netReceived,
      defiNet,
      yearlyEarnings,
      profit,
      effectiveAPY
    };
  };

  const getBestChain = () => {
    let best = chains[0];
    let bestProfit = calculateResults(chains[0]).profit;
    
    chains.forEach(chain => {
      const result = calculateResults(chain);
      if (result.profit > bestProfit) {
        bestProfit = result.profit;
        best = chain;
      }
    });
    
    return best;
  };

  const bestChain = getBestChain();

  return (
    <div className="space-y-8">
      <Card className="p-8">
        <div className="flex items-center gap-3 mb-6">
          <DollarSign className="w-8 h-8 text-green-400" />
          <h2 className="text-3xl font-bold">Bridge Cost Comparison</h2>
        </div>

        <p className="text-muted-foreground mb-6">
          Compare total costs and DeFi earnings potential across different chains. Enter your claim amount to see personalized projections.
        </p>

        <div className="mb-8">
          <label className="text-sm font-semibold mb-2 block">Claim Amount (USD)</label>
          <Input
            type="number"
            value={claimAmount}
            onChange={(e) => setClaimAmount(Number(e.target.value))}
            min={10}
            max={10000}
            step={10}
            className="max-w-xs text-lg"
          />
          <p className="text-xs text-muted-foreground mt-2">
            Adjust to see how costs scale with different claim amounts
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left font-semibold">Chain</th>
                <th className="px-4 py-3 text-right font-semibold">Bridge Fee</th>
                <th className="px-4 py-3 text-right font-semibold">Gas Cost</th>
                <th className="px-4 py-3 text-right font-semibold">Time</th>
                <th className="px-4 py-3 text-right font-semibold">Net Received</th>
                <th className="px-4 py-3 text-right font-semibold">DeFi APY</th>
                <th className="px-4 py-3 text-right font-semibold">1-Year Value</th>
              </tr>
            </thead>
            <tbody>
              {chains.map((chain, index) => {
                const results = calculateResults(chain);
                const isBest = chain.name === bestChain.name;
                
                return (
                  <tr 
                    key={index} 
                    className={`border-b border-border hover:bg-muted/20 transition-colors ${isBest ? 'bg-green-500/5' : ''}`}
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{chain.name}</span>
                        {isBest && (
                          <Award className="w-4 h-4 text-green-400" />
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-right">
                      ${chain.bridgeFee.toFixed(2)}
                    </td>
                    <td className="px-4 py-4 text-right">
                      ${chain.gasCost.toFixed(2)}
                    </td>
                    <td className="px-4 py-4 text-right text-sm text-muted-foreground">
                      {chain.time}
                    </td>
                    <td className="px-4 py-4 text-right font-semibold">
                      ${results.netReceived.toFixed(2)}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <span className={chain.color}>{chain.defiApy}%</span>
                    </td>
                    <td className="px-4 py-4 text-right font-bold">
                      <span className={results.profit > 0 ? 'text-green-400' : 'text-red-400'}>
                        ${results.yearlyEarnings.toFixed(2)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Detailed Breakdown for Best Chain */}
      <Card className="p-8 bg-gradient-to-br from-green-500/10 to-blue-500/10 border-green-500/20">
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="w-8 h-8 text-green-400" />
          <h3 className="text-2xl font-bold">Recommended: {bestChain.name}</h3>
        </div>

        {(() => {
          const results = calculateResults(bestChain);
          
          return (
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="p-6">
                  <div className="text-sm text-muted-foreground mb-1">Claiming ${claimAmount} USDC</div>
                  <div className="space-y-3 mt-4 text-sm">
                    <div className="flex justify-between">
                      <span>Bridge Fee:</span>
                      <span className="text-red-400">-${bestChain.bridgeFee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Gas Cost:</span>
                      <span className="text-red-400">-${bestChain.gasCost.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-border font-semibold">
                      <span>Net Received:</span>
                      <span className="text-green-400">${results.netReceived.toFixed(2)}</span>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="text-sm text-muted-foreground mb-1">Deposit in DeFi ({bestChain.defiApy}% APY)</div>
                  <div className="space-y-3 mt-4 text-sm">
                    <div className="flex justify-between">
                      <span>DeFi Deposit Fee:</span>
                      <span className="text-red-400">-${bestChain.defiFee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Net in DeFi:</span>
                      <span>${results.defiNet.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-border font-semibold">
                      <span>After 1 Year:</span>
                      <span className="text-green-400">${results.yearlyEarnings.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-border font-bold text-lg">
                      <span>Total Profit:</span>
                      <span className="text-primary">${results.profit.toFixed(2)}</span>
                    </div>
                  </div>
                </Card>
              </div>

              <Card className="p-6 bg-primary/5 border-primary/20">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Effective Annual Return</div>
                    <div className="text-3xl font-bold text-primary">
                      {results.effectiveAPY.toFixed(2)}%
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground mb-1">Bridge Savings vs Ethereum</div>
                    <div className="text-2xl font-bold text-green-400">
                      ${(15 - results.totalCost).toFixed(2)}
                    </div>
                  </div>
                </div>
              </Card>

              <div className="text-sm text-muted-foreground">
                💡 <strong>Why {bestChain.name}?</strong> {bestChain.name === 'Polygon' && 'Lowest total costs combined with solid DeFi yields make Polygon ideal for most users.'}
                {bestChain.name === 'Avalanche' && 'Highest DeFi yields (12%) more than compensate for slightly higher bridge costs.'}
                {bestChain.name === 'Ethereum' && 'No bridge fees, but higher gas costs for DeFi interactions. Best for large amounts or long-term holding.'}
              </div>
            </div>
          );
        })()}
      </Card>
    </div>
  );
};

export default WormholeCostComparison;
