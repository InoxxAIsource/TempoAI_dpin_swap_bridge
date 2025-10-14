import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface BridgeFeeEstimatorProps {
  amount: number;
  fromChain: string;
  toChain: string;
  token: string;
  onEstimateUpdate?: (estimate: any) => void;
}

const BridgeFeeEstimator = ({
  amount,
  fromChain,
  toChain,
  token,
  onEstimateUpdate,
}: BridgeFeeEstimatorProps) => {
  const [estimate, setEstimate] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchEstimate();
  }, [amount, fromChain, toChain, token]);

  const fetchEstimate = async () => {
    if (!amount || amount <= 0) return;

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('estimate-bridge-fees', {
        body: {
          amount,
          fromChain,
          toChain,
          token,
        },
      });

      if (error) throw error;

      setEstimate(data);
      onEstimateUpdate?.(data);
    } catch (error) {
      console.error('Error fetching fee estimate:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Fee Estimate</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-6">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (!estimate) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Fee Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Bridge Protocol Fee</span>
            <span className="font-medium">${estimate.bridgeFeeUSD.toFixed(4)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Estimated Gas ({estimate.gasSymbol})</span>
            <span className="font-medium">${estimate.estimatedGasUSD.toFixed(4)}</span>
          </div>
          <div className="border-t pt-2 flex justify-between">
            <span className="font-semibold">Total Cost</span>
            <span className="font-bold text-lg">${estimate.totalCostUSD.toFixed(4)}</span>
          </div>
        </div>

        {estimate.hasGasOnDestination ? (
          <Alert className="bg-green-500/10 border-green-500/50">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <AlertDescription className="text-green-700 dark:text-green-400">
              You have sufficient gas on {toChain}
            </AlertDescription>
          </Alert>
        ) : (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              You need ~{(estimate.recommendedGasAmount / 1000000).toFixed(4)} {estimate.gasSymbol} on {toChain} to complete the claim
            </AlertDescription>
          </Alert>
        )}

        <div className="text-xs text-muted-foreground space-y-1">
          <p>• Bridge fee: ~0.2% of transfer amount</p>
          <p>• Gas estimates are approximate and may vary</p>
          <p>• Recommended to have 50% extra gas buffer</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default BridgeFeeEstimator;
