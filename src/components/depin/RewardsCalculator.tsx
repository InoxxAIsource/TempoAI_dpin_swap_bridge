import { Card } from '@/components/ui/card';
import { Calculator, TrendingUp } from 'lucide-react';

interface RewardsCalculatorProps {
  deviceCount: number;
  avgKwhPerDay: number;
  verifiedDeviceCount: number;
}

const RewardsCalculator = ({ deviceCount, avgKwhPerDay, verifiedDeviceCount }: RewardsCalculatorProps) => {
  const BASE_RATE = 0.05; // $0.05 per kWh
  const VERIFIED_MULTIPLIER = 2;

  const demoDeviceCount = deviceCount - verifiedDeviceCount;
  const demoEarnings = demoDeviceCount * avgKwhPerDay * BASE_RATE;
  const verifiedEarnings = verifiedDeviceCount * avgKwhPerDay * BASE_RATE * VERIFIED_MULTIPLIER;
  const totalDailyEarnings = demoEarnings + verifiedEarnings;
  const monthlyEarnings = totalDailyEarnings * 30;

  return (
    <Card className="p-6 bg-gradient-to-br from-green-500/5 to-blue-500/5 border-2 border-primary/20">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <Calculator className="w-5 h-5 text-primary" />
        </div>
        <h3 className="text-xl font-bold">Rewards Calculator</h3>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Total Devices</p>
            <p className="text-2xl font-bold">{deviceCount}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Avg. Production</p>
            <p className="text-2xl font-bold">{avgKwhPerDay} kWh/day</p>
          </div>
        </div>

        <div className="border-t border-border pt-4 space-y-2">
          {demoDeviceCount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                Demo devices ({demoDeviceCount}):
              </span>
              <span className="font-medium">
                {demoDeviceCount} × {avgKwhPerDay} × ${BASE_RATE} = ${demoEarnings.toFixed(2)}/day
              </span>
            </div>
          )}
          
          {verifiedDeviceCount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                Verified devices ({verifiedDeviceCount}):
              </span>
              <span className="font-medium text-green-600 dark:text-green-400">
                {verifiedDeviceCount} × {avgKwhPerDay} × ${BASE_RATE} × {VERIFIED_MULTIPLIER} = ${verifiedEarnings.toFixed(2)}/day
              </span>
            </div>
          )}
        </div>

        <div className="border-t-2 border-primary/20 pt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold">Daily Earnings:</span>
            <span className="text-2xl font-bold text-primary">${totalDailyEarnings.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Potential Monthly:</span>
            <span className="text-lg font-semibold text-green-600 dark:text-green-400">
              ~${monthlyEarnings.toFixed(2)}
            </span>
          </div>
        </div>

        {verifiedDeviceCount < deviceCount && (
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 mt-4">
            <div className="flex items-start gap-2">
              <TrendingUp className="w-4 h-4 text-green-500 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-green-700 dark:text-green-300">
                  Increase your earnings by 2x!
                </p>
                <p className="text-muted-foreground">
                  Verify your devices with real hardware to double your rewards
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default RewardsCalculator;
