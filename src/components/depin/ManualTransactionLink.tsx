import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, CheckCircle, AlertCircle, Link as LinkIcon } from 'lucide-react';

interface ManualTransactionLinkProps {
  claimId: string;
  walletAddress: string;
  onSuccess: () => void;
}

export const ManualTransactionLink = ({ claimId, walletAddress, onSuccess }: ManualTransactionLinkProps) => {
  const [txHash, setTxHash] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const validateAndLinkTransaction = async () => {
    if (!txHash || !txHash.startsWith('0x') || txHash.length !== 66) {
      setError('Invalid transaction hash format. Must start with 0x and be 66 characters long.');
      return;
    }

    setIsValidating(true);
    setError(null);

    try {
      // Verify transaction exists on Etherscan
      const network = txHash.includes('sepolia') ? 'sepolia' : 'mainnet';
      const etherscanApiUrl = network === 'sepolia' 
        ? 'https://api-sepolia.etherscan.io/api'
        : 'https://api.etherscan.io/api';
      
      const etherscanKey = import.meta.env.VITE_ETHERSCAN_API_KEY || '';
      
      const response = await fetch(
        `${etherscanApiUrl}?module=proxy&action=eth_getTransactionByHash&txhash=${txHash}&apikey=${etherscanKey}`
      );
      
      const data = await response.json();
      
      if (!data.result || data.result === null) {
        setError('Transaction not found on blockchain. Please verify the hash is correct.');
        setIsValidating(false);
        return;
      }

      // Verify transaction is from the user's wallet
      if (data.result.from?.toLowerCase() !== walletAddress.toLowerCase()) {
        setError('This transaction does not belong to your wallet.');
        setIsValidating(false);
        return;
      }

      // Update the wormhole_transactions record
      const { error: updateError } = await supabase
        .from('wormhole_transactions')
        .update({ 
          tx_hash: txHash,
          status: 'pending'
        })
        .contains('source_reference_ids', [claimId])
        .eq('wallet_address', walletAddress.toLowerCase())
        .is('tx_hash', null);

      if (updateError) {
        console.error('Database update error:', updateError);
        setError('Failed to link transaction. Please try again.');
        setIsValidating(false);
        return;
      }

      toast({
        title: "✅ Transaction Linked Successfully!",
        description: `Your transaction ${txHash.slice(0, 16)}... has been linked. VAA polling will now begin.`,
      });

      onSuccess();
    } catch (err) {
      console.error('Validation error:', err);
      setError('Failed to validate transaction. Please check your network connection and try again.');
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <Card className="border-yellow-500/50 bg-yellow-500/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-yellow-700 dark:text-yellow-400">
          <LinkIcon className="w-5 h-5" />
          Manual Transaction Link
        </CardTitle>
        <CardDescription>
          If your transaction was not automatically detected, you can manually link it here
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="tx-hash">Transaction Hash</Label>
          <Input
            id="tx-hash"
            placeholder="0x..."
            value={txHash}
            onChange={(e) => {
              setTxHash(e.target.value);
              setError(null);
            }}
            disabled={isValidating}
          />
          <p className="text-xs text-muted-foreground">
            Find your transaction hash in your wallet history or on{' '}
            <a 
              href="https://etherscan.io" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Etherscan
            </a>
          </p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Button 
          onClick={validateAndLinkTransaction} 
          disabled={!txHash || isValidating}
          className="w-full"
        >
          {isValidating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Validating Transaction...
            </>
          ) : (
            <>
              <CheckCircle className="mr-2 h-4 w-4" />
              Link Transaction
            </>
          )}
        </Button>

        <Alert>
          <AlertDescription className="text-xs">
            ℹ️ Your transaction will be validated against the blockchain to ensure it belongs to your wallet before linking.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};
