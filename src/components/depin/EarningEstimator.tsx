import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { TrendingUp } from 'lucide-react';

const EarningEstimator = () => {
  const [numDevices, setNumDevices] = useState(5);
  const [avgKwh, setAvgKwh] = useState(20);
  const [uptime, setUptime] = useState(95);

  const BASE_RATE = 0.05;
  const VERIFIED_MULTIPLIER = 2;
  const UPTIME_BONUS = uptime >= 99 ? 1.1 : 1;

  const dailyEarnings = numDevices * avgKwh * BASE_RATE * VERIFIED_MULTIPLIER * UPTIME_BONUS;
  const monthlyEarnings = dailyEarnings * 30;
  const yearlyEarnings = dailyEarnings * 365;

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Number of Devices: {numDevices}</Label>
          <Slider
            value={[numDevices]}
            onValueChange={(v) => setNumDevices(v[0])}
            min={1}
            max={50}
            step={1}
          />
        </div>

        <div className="space-y-2">
          <Label>Average kWh per Device: {avgKwh}</Label>
          <Slider
            value={[avgKwh]}
            onValueChange={(v) => setAvgKwh(v[0])}
            min={5}
            max={100}
            step={5}
          />
        </div>

        <div className="space-y-2">
          <Label>Uptime %: {uptime}%</Label>
          <Slider
            value={[uptime]}
            onValueChange={(v) => setUptime(v[0])}
            min={50}
            max={100}
            step={1}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <div className="text-sm text-muted-foreground">Daily</div>
              <div className="text-2xl font-bold text-primary">
                ${dailyEarnings.toFixed(2)}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-primary/10 border-primary/30">
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <div className="text-sm text-muted-foreground">Monthly</div>
              <div className="text-2xl font-bold text-primary">
                ${monthlyEarnings.toFixed(2)}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-primary/15 border-primary/40">
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                <TrendingUp className="w-4 h-4" />
                Yearly
              </div>
              <div className="text-2xl font-bold text-primary">
                ${yearlyEarnings.toFixed(2)}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <p className="text-xs text-muted-foreground text-center">
        * Estimates based on verified devices with {uptime >= 99 ? '+10%' : 'standard'} uptime bonus
      </p>
    </div>
  );
};

export default EarningEstimator;
