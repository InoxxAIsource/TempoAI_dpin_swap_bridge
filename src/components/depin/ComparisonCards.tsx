import { Check, X } from 'lucide-react';
import { Card } from '@/components/ui/card';

const ComparisonCards = () => {
  const demoVsVerified = [
    { feature: 'Setup Time', demo: '2 minutes', verified: '30 minutes' },
    { feature: 'Hardware Required', demo: 'None', verified: 'Raspberry Pi (~$50)' },
    { feature: 'Earnings Multiplier', demo: '1x', verified: '2x' },
    { feature: 'Uptime Bonus', demo: '❌', verified: '✅ +10%' },
    { feature: 'Monthly (35 kWh/day)', demo: '$52.50', verified: '$105' },
    { feature: 'ROI Period', demo: 'Immediate', verified: '~14 days' },
    { feature: 'Cryptographic Proof', demo: '❌', verified: '✅' },
    { feature: 'Network Trust', demo: 'Low', verified: 'High' }
  ];

  const traditionalVsDepin = [
    { feature: 'Data Ownership', traditional: 'Company', depin: 'You' },
    { feature: 'Earnings', traditional: '$0', depin: '$50-500+/month' },
    { feature: 'Privacy', traditional: 'Centralized', depin: 'Decentralized' },
    { feature: 'Transparency', traditional: 'Opaque', depin: 'Open Source' },
    { feature: 'Geographic Limits', traditional: 'Region-locked', depin: 'Global' },
    { feature: 'Censorship Risk', traditional: 'High', depin: 'Low' },
    { feature: 'Setup Complexity', traditional: 'Low', depin: 'Medium' },
    { feature: 'Future Potential', traditional: 'Limited', depin: 'Growing' }
  ];

  const chainComparison = [
    { chain: 'Ethereum', security: '⭐⭐⭐⭐⭐', fees: 'High', speed: 'Medium', defi: '⭐⭐⭐⭐⭐' },
    { chain: 'Polygon', security: '⭐⭐⭐⭐', fees: 'Very Low', speed: 'Fast', defi: '⭐⭐⭐⭐' },
    { chain: 'Avalanche', security: '⭐⭐⭐⭐', fees: 'Low', speed: 'Very Fast', defi: '⭐⭐⭐⭐' },
    { chain: 'Arbitrum', security: '⭐⭐⭐⭐⭐', fees: 'Low', speed: 'Fast', defi: '⭐⭐⭐⭐' },
    { chain: 'Base', security: '⭐⭐⭐⭐', fees: 'Very Low', speed: 'Fast', defi: '⭐⭐⭐' },
    { chain: 'Optimism', security: '⭐⭐⭐⭐⭐', fees: 'Low', speed: 'Fast', defi: '⭐⭐⭐⭐' }
  ];

  return (
    <div className="space-y-12">
      {/* Demo vs Verified */}
      <div>
        <h3 className="text-2xl font-bold mb-6">Demo vs Verified Devices</h3>
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-6 py-4 text-left font-semibold">Feature</th>
                  <th className="px-6 py-4 text-left font-semibold text-blue-400">Demo Mode</th>
                  <th className="px-6 py-4 text-left font-semibold text-green-400">Verified Hardware</th>
                </tr>
              </thead>
              <tbody>
                {demoVsVerified.map((row, index) => (
                  <tr key={index} className="border-b border-border hover:bg-muted/20 transition-colors">
                    <td className="px-6 py-4 font-medium">{row.feature}</td>
                    <td className="px-6 py-4 text-muted-foreground">{row.demo}</td>
                    <td className="px-6 py-4 text-muted-foreground">{row.verified}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Traditional vs DePIN */}
      <div>
        <h3 className="text-2xl font-bold mb-6">Traditional IoT vs DePIN</h3>
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-6 py-4 text-left font-semibold">Feature</th>
                  <th className="px-6 py-4 text-left font-semibold">Traditional IoT</th>
                  <th className="px-6 py-4 text-left font-semibold text-primary">DePIN Network</th>
                </tr>
              </thead>
              <tbody>
                {traditionalVsDepin.map((row, index) => (
                  <tr key={index} className="border-b border-border hover:bg-muted/20 transition-colors">
                    <td className="px-6 py-4 font-medium">{row.feature}</td>
                    <td className="px-6 py-4 text-muted-foreground">{row.traditional}</td>
                    <td className="px-6 py-4 text-primary font-semibold">{row.depin}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Chain Comparison */}
      <div>
        <h3 className="text-2xl font-bold mb-6">Cross-Chain Comparison</h3>
        <p className="text-muted-foreground mb-6">
          Choose the best blockchain for your use case. Each chain offers different tradeoffs.
        </p>
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-6 py-4 text-left font-semibold">Chain</th>
                  <th className="px-6 py-4 text-left font-semibold">Security</th>
                  <th className="px-6 py-4 text-left font-semibold">Fees</th>
                  <th className="px-6 py-4 text-left font-semibold">Speed</th>
                  <th className="px-6 py-4 text-left font-semibold">DeFi Options</th>
                </tr>
              </thead>
              <tbody>
                {chainComparison.map((row, index) => (
                  <tr key={index} className="border-b border-border hover:bg-muted/20 transition-colors">
                    <td className="px-6 py-4 font-semibold">{row.chain}</td>
                    <td className="px-6 py-4">{row.security}</td>
                    <td className="px-6 py-4 text-muted-foreground">{row.fees}</td>
                    <td className="px-6 py-4 text-muted-foreground">{row.speed}</td>
                    <td className="px-6 py-4">{row.defi}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ComparisonCards;
