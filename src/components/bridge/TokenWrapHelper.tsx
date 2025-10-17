import { useState } from 'react';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useWalletContext } from '@/contexts/WalletContext';
import { toast } from 'sonner';

const WETH_CONTRACT_ADDRESS = '0xfff9976782d46cc05630d1f6ebab18b2324d6b14'; // Sepolia WETH

const WETH_ABI = [
  {
    constant: false,
    inputs: [],
    name: 'deposit',
    outputs: [],
    payable: true,
    stateMutability: 'payable',
    type: 'function',
  },
] as const;

export const TokenWrapHelper = () => {
  const { evmBalance, wethBalance } = useWalletContext();
  const [amount, setAmount] = useState('');
  
  const { writeContract, data: hash, isPending } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const handleWrap = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (parseFloat(amount) > parseFloat(evmBalance || '0')) {
      toast.error('Insufficient ETH balance');
      return;
    }

    try {
      writeContract({
        address: WETH_CONTRACT_ADDRESS,
        abi: WETH_ABI,
        functionName: 'deposit',
        value: parseEther(amount),
      } as any);

      toast.info('Wrapping ETH to WETH...', {
        description: 'Please confirm the transaction in your wallet',
      });
    } catch (error) {
      console.error('Wrap error:', error);
      toast.error('Failed to wrap ETH');
    }
  };

  if (isSuccess) {
    return (
      <Card className="border-green-500/50 bg-green-500/10">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 text-green-400">
            <CheckCircle2 className="w-5 h-5" />
            <span className="font-medium">Successfully wrapped {amount} ETH to WETH!</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Wrap ETH to WETH</CardTitle>
        <CardDescription>
          Convert your ETH to WETH for bridging to Solana
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <div>
            <div className="text-muted-foreground">ETH Balance</div>
            <div className="font-medium">{evmBalance || '0.0000'} ETH</div>
          </div>
          <ArrowRight className="w-4 h-4 text-muted-foreground" />
          <div>
            <div className="text-muted-foreground">WETH Balance</div>
            <div className="font-medium">{wethBalance || '0.0000'} WETH</div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Amount to Wrap</label>
          <div className="flex gap-2">
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="flex-1"
              step="0.0001"
              min="0"
            />
            <Button
              variant="outline"
              onClick={() => setAmount(evmBalance || '0')}
              disabled={!evmBalance || parseFloat(evmBalance) === 0}
            >
              Max
            </Button>
          </div>
        </div>

        <Alert className="bg-muted/30">
          <AlertDescription className="text-xs">
            Wrapping ETH to WETH is a 1:1 conversion. Gas fees will apply.
          </AlertDescription>
        </Alert>

        <Button 
          onClick={handleWrap}
          className="w-full"
          disabled={isPending || isConfirming || !amount || parseFloat(amount) <= 0}
        >
          {isPending || isConfirming ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {isPending ? 'Confirm in Wallet...' : 'Wrapping...'}
            </>
          ) : (
            'Wrap ETH to WETH'
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
