import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { TrendingUp, Calculator } from 'lucide-react';

const ROICalculator = () => {
  const [deviceCount, setDeviceCount] = useState(3);
  const [avgKwhPerDay, setAvgKwhPerDay] = useState(35);
  const [isVerified, setIsVerified] = useState(true);
  const [hardwareCost, setHardwareCost] = useState(50);

  const baseRate = 0.05; // $0.05 per kWh
  const multiplier = isVerified ? 2 : 1;
  const uptimeBonus = isVerified ? 1.1 : 1;

  const dailyEarnings = deviceCount * avgKwhPerDay * baseRate * multiplier * uptimeBonus;
  const monthlyEarnings = dailyEarnings * 30;
  const yearlyEarnings = dailyEarnings * 365;
  
  const totalHardwareCost = isVerified ? deviceCount * hardwareCost : 0;
  const roiDays = totalHardwareCost > 0 ? Math.ceil(totalHardwareCost / dailyEarnings) : 0;
  const breakEvenDate = new Date();
  breakEvenDate.setDate(breakEvenDate.getDate() + roiDays);

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-3xl font-bold mb-3">Interactive ROI Calculator</h3>
        <p className="text-muted-foreground">
          Adjust the parameters to estimate your potential earnings and return on investment.
        </p>
      </div>

      <Card className="p-8">
        {/* Controls */}
        <div className="space-y-8 mb-8">
          {/* Device Count */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-semibold">Number of Devices</label>
              <span className="text-2xl font-bold text-primary">{deviceCount}</span>
            </div>
            <Slider
              value={[deviceCount]}
              onValueChange={(value) => setDeviceCount(value[0])}
              min={1}
              max={20}
              step={1}
              className="w-full"
            />
          </div>

          {/* Average kWh per Day */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-semibold">Avg kWh per Device per Day</label>
              <span className="text-2xl font-bold text-primary">{avgKwhPerDay}</span>
            </div>
            <Slider
              value={[avgKwhPerDay]}
              onValueChange={(value) => setAvgKwhPerDay(value[0])}
              min={10}
              max={100}
              step={5}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>Small sensor (10 kWh)</span>
              <span>Large solar panel (100 kWh)</span>
            </div>
          </div>

          {/* Verification Toggle */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-semibold">Device Verification</label>
              <button
                onClick={() => setIsVerified(!isVerified)}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  isVerified
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                    : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                }`}
              >
                {isVerified ? 'Verified (2x)' : 'Demo (1x)'}
              </button>
            </div>
            <p className="text-xs text-muted-foreground">
              {isVerified
                ? 'Verified devices earn 2x rewards + 10% uptime bonus'
                : 'Demo devices earn base rewards only'}
            </p>
          </div>

          {/* Hardware Cost */}
          {isVerified && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-semibold">Hardware Cost per Device</label>
                <span className="text-2xl font-bold text-primary">${hardwareCost}</span>
              </div>
              <Slider
                value={[hardwareCost]}
                onValueChange={(value) => setHardwareCost(value[0])}
                min={5}
                max={200}
                step={5}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>Sensor ($5)</span>
                <span>Full Pi Setup ($200)</span>
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Earnings */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h4 className="text-lg font-bold">Projected Earnings</h4>
            </div>
            
            <Card className="p-4 bg-primary/5 border-primary/20">
              <div className="text-sm text-muted-foreground mb-1">Daily Earnings</div>
              <div className="text-3xl font-bold text-primary">
                ${dailyEarnings.toFixed(2)}
              </div>
            </Card>

            <Card className="p-4 bg-muted/30">
              <div className="text-sm text-muted-foreground mb-1">Monthly Earnings</div>
              <div className="text-2xl font-bold">
                ${monthlyEarnings.toFixed(2)}
              </div>
            </Card>

            <Card className="p-4 bg-muted/30">
              <div className="text-sm text-muted-foreground mb-1">Yearly Earnings</div>
              <div className="text-2xl font-bold">
                ${yearlyEarnings.toFixed(2)}
              </div>
            </Card>
          </div>

          {/* ROI */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Calculator className="w-5 h-5 text-primary" />
              <h4 className="text-lg font-bold">Return on Investment</h4>
            </div>

            {isVerified ? (
              <>
                <Card className="p-4 bg-muted/30">
                  <div className="text-sm text-muted-foreground mb-1">Total Hardware Cost</div>
                  <div className="text-2xl font-bold">
                    ${totalHardwareCost.toFixed(2)}
                  </div>
                </Card>

                <Card className="p-4 bg-green-500/10 border-green-500/20">
                  <div className="text-sm text-muted-foreground mb-1">Break-Even Period</div>
                  <div className="text-3xl font-bold text-green-400">
                    {roiDays} days
                  </div>
                </Card>

                <Card className="p-4 bg-muted/30">
                  <div className="text-sm text-muted-foreground mb-1">Break-Even Date</div>
                  <div className="text-xl font-bold">
                    {breakEvenDate.toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </div>
                </Card>

                <Card className="p-4 bg-primary/5 border-primary/20">
                  <div className="text-sm text-muted-foreground mb-1">First Year Profit</div>
                  <div className="text-2xl font-bold text-primary">
                    ${(yearlyEarnings - totalHardwareCost).toFixed(2)}
                  </div>
                </Card>
              </>
            ) : (
              <Card className="p-6 bg-blue-500/10 border-blue-500/20">
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-400 mb-2">Demo Mode</div>
                  <div className="text-sm text-muted-foreground">
                    No hardware investment required! Start earning immediately with simulated devices.
                  </div>
                  <div className="mt-4 p-3 rounded-lg bg-card">
                    <div className="text-xs text-muted-foreground mb-1">Instant ROI</div>
                    <div className="text-2xl font-bold text-blue-400">$0 invested</div>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>

        {/* Summary */}
        <Card className="p-6 mt-6 bg-gradient-to-r from-primary/10 to-purple-500/10 border-primary/20">
          <h4 className="font-bold mb-3">Summary</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Configuration:</span>
              <span className="font-semibold">
                {deviceCount} {isVerified ? 'Verified' : 'Demo'} Device{deviceCount > 1 ? 's' : ''}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Production:</span>
              <span className="font-semibold">{avgKwhPerDay * deviceCount} kWh/day total</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Multiplier:</span>
              <span className="font-semibold">{isVerified ? '2x + 10% bonus' : '1x'}</span>
            </div>
            <div className="flex justify-between border-t border-border pt-2 mt-2">
              <span className="text-muted-foreground">Monthly Income:</span>
              <span className="text-xl font-bold text-primary">${monthlyEarnings.toFixed(2)}</span>
            </div>
          </div>
        </Card>
      </Card>
    </div>
  );
};

export default ROICalculator;
