import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { DollarSign, TrendingDown, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface FeeEstimate {
  bridgeFee: number;
  sourceGas: number;
  destGas: number;
  swapFee?: number;
  total: number;
  percentOfTransfer: number;
}

const FeesBreakdown = () => {
  const [amount, setAmount] = useState<string>('1000');
  const [sourceChain, setSourceChain] = useState<string>('ethereum');
  const [destChain, setDestChain] = useState<string>('arbitrum');
  const [transactionType, setTransactionType] = useState<'bridge' | 'swap'>('bridge');

  const calculateFees = (): FeeEstimate => {
    const amountNum = parseFloat(amount) || 1000;
    const bridgeFee = amountNum * 0.001; // 0.1%

    // Source gas estimates in USD
    const sourceGasMap: Record<string, number> = {
      ethereum: 15,
      polygon: 0.05,
      arbitrum: 0.3,
      optimism: 0.3,
      base: 0.3,
      solana: 0.00025,
      avalanche: 0.3,
      bnb: 0.15,
    };

    // Dest gas estimates (only for bridge, swap doesn't need it)
    const destGasMap: Record<string, number> = {
      ethereum: 10,
      polygon: 0.03,
      arbitrum: 0.2,
      optimism: 0.2,
      base: 0.2,
      solana: 0.00025,
      avalanche: 0.2,
      bnb: 0.1,
    };

    const sourceGas = sourceGasMap[sourceChain] || 1;
    const destGas = transactionType === 'bridge' ? (destGasMap[destChain] || 0.5) : 0;
    const swapFee = transactionType === 'swap' ? amountNum * 0.003 : undefined; // 0.3% for DEX swap

    const total = bridgeFee + sourceGas + destGas + (swapFee || 0);
    const percentOfTransfer = (total / amountNum) * 100;

    return {
      bridgeFee,
      sourceGas,
      destGas,
      swapFee,
      total,
      percentOfTransfer,
    };
  };

  const fees = calculateFees();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold mb-2">Fee Calculator</h3>
        <p className="text-muted-foreground mb-4">
          Estimate total costs for your bridge or swap transaction
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transaction Parameters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Transaction Type</label>
              <Select value={transactionType} onValueChange={(v) => setTransactionType(v as 'bridge' | 'swap')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bridge">Bridge (same token)</SelectItem>
                  <SelectItem value="swap">Swap (different token)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Amount (USD)</label>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="1000"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Source Chain</label>
              <Select value={sourceChain} onValueChange={setSourceChain}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ethereum">Ethereum</SelectItem>
                  <SelectItem value="polygon">Polygon</SelectItem>
                  <SelectItem value="arbitrum">Arbitrum</SelectItem>
                  <SelectItem value="optimism">Optimism</SelectItem>
                  <SelectItem value="base">Base</SelectItem>
                  <SelectItem value="solana">Solana</SelectItem>
                  <SelectItem value="avalanche">Avalanche</SelectItem>
                  <SelectItem value="bnb">BNB Chain</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Destination Chain</label>
              <Select value={destChain} onValueChange={setDestChain}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ethereum">Ethereum</SelectItem>
                  <SelectItem value="polygon">Polygon</SelectItem>
                  <SelectItem value="arbitrum">Arbitrum</SelectItem>
                  <SelectItem value="optimism">Optimism</SelectItem>
                  <SelectItem value="base">Base</SelectItem>
                  <SelectItem value="solana">Solana</SelectItem>
                  <SelectItem value="avalanche">Avalanche</SelectItem>
                  <SelectItem value="bnb">BNB Chain</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary" />
            Fee Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm text-muted-foreground">Bridge Fee (0.1%)</span>
              <span className="font-semibold">${fees.bridgeFee.toFixed(2)}</span>
            </div>

            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm text-muted-foreground">Source Chain Gas ({sourceChain})</span>
              <span className="font-semibold">${fees.sourceGas.toFixed(2)}</span>
            </div>

            {transactionType === 'bridge' && fees.destGas > 0 && (
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-sm text-muted-foreground">Destination Chain Gas ({destChain})</span>
                <span className="font-semibold">${fees.destGas.toFixed(2)}</span>
              </div>
            )}

            {transactionType === 'swap' && fees.swapFee !== undefined && (
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-sm text-muted-foreground">DEX Swap Fee (~0.3%)</span>
                <span className="font-semibold">${fees.swapFee.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between items-center py-3 bg-primary/10 px-4 rounded-lg">
              <span className="font-semibold">Total Cost</span>
              <div className="text-right">
                <div className="font-bold text-lg">${fees.total.toFixed(2)}</div>
                <div className="text-xs text-muted-foreground">
                  ({fees.percentOfTransfer.toFixed(2)}% of transfer)
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-green-500" />
              Cost Optimization Tips
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            {fees.percentOfTransfer > 2 && (
              <Alert>
                <AlertDescription>
                  <strong>High fee percentage ({fees.percentOfTransfer.toFixed(1)}%)!</strong> Consider:
                  <ul className="mt-2 space-y-1 ml-4">
                    <li>• Transferring a larger amount to reduce percentage cost</li>
                    <li>• Bridging to a cheaper destination chain first (e.g., Arbitrum, Polygon)</li>
                    <li>• Waiting for lower gas prices on source chain</li>
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {sourceChain === 'ethereum' && (
              <p>💡 <strong>Ethereum source:</strong> Consider bridging to a Layer 2 first to save on future transactions</p>
            )}

            {transactionType === 'swap' && (
              <p>💡 <strong>Swap optimization:</strong> Check if bridging then manually swapping on a DEX would be cheaper for very large amounts</p>
            )}

            {parseFloat(amount) < 100 && (
              <p>💡 <strong>Small amount:</strong> Fixed gas costs are high relative to amount. Consider accumulating and transferring larger amounts</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              When These Fees Are Worth It
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            {fees.percentOfTransfer < 1 && (
              <p>✅ <strong>Low fee percentage!</strong> This is a cost-efficient transfer.</p>
            )}

            <p>✅ Accessing higher yield on destination chain (&gt; {(fees.percentOfTransfer * 2).toFixed(1)}% APY difference)</p>
            <p>✅ Consolidating assets for easier management</p>
            <p>✅ Claiming DePIN rewards that would otherwise be stuck on one chain</p>
            <p>✅ Executing time-sensitive arbitrage or yield opportunities</p>

            {transactionType === 'swap' && (
              <p>✅ Converting to stablecoins during market volatility</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FeesBreakdown;
