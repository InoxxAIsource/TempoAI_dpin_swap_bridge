import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useWalletContext } from '@/contexts/WalletContext';
import { checkWormholeTxStatus } from '@/utils/wormholeScanAPI';
import { verifyWormholeTransaction } from '@/utils/etherscanVerification';

interface ManualTransactionImportProps {
  onImportSuccess?: () => void;
}

export default function ManualTransactionImport({ onImportSuccess }: ManualTransactionImportProps) {
  const [txHash, setTxHash] = useState('');
  const [network, setNetwork] = useState<'Mainnet' | 'Testnet'>('Testnet');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const { toast } = useToast();
  const { evmAddress, solanaAddress } = useWalletContext();
  const walletAddress = evmAddress || solanaAddress;

  const validateTxHash = (hash: string): boolean => {
    const ethRegex = /^0x[a-fA-F0-9]{64}$/;
    return ethRegex.test(hash);
  };

  const handleImport = async () => {
    if (!txHash.trim()) {
      setResult({ success: false, message: 'Please enter a transaction hash' });
      return;
    }

    if (!validateTxHash(txHash.trim())) {
      setResult({ success: false, message: 'Invalid transaction hash format' });
      return;
    }

    if (!walletAddress) {
      setResult({ success: false, message: 'Please connect your wallet first' });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const cleanHash = txHash.trim();
      const isTestnet = network === 'Testnet';

      const { data: existing } = await supabase
        .from('wormhole_transactions')
        .select('id')
        .eq('tx_hash', cleanHash)
        .maybeSingle();

      if (existing) {
        setResult({ 
          success: false, 
          message: 'This transaction has already been imported' 
        });
        setLoading(false);
        return;
      }

      // Verify transaction on-chain using blockchain verification
      const verification = await verifyWormholeTransaction(
        cleanHash, 
        isTestnet ? 'sepolia' : 'mainnet'
      );
      
      if (!verification.isValid) {
        setResult({
          success: false,
          message: 'Transaction not found or failed on blockchain',
        });
        setLoading(false);
        return;
      }
      
      if (!verification.isWormholeTransfer) {
        setResult({
          success: false,
          message: 'This transaction does not interact with Wormhole or CCTP contracts',
        });
        setLoading(false);
        return;
      }
      
      // Query WormholeScan API for cross-chain transfer status
      const wormholeStatus = await checkWormholeTxStatus(cleanHash, network);
      
      // Map WormholeScan status to database enum
      const mapStatusToDbEnum = (scanStatus: string): 'pending' | 'completed' | 'failed' => {
        switch (scanStatus) {
          case 'completed':
            return 'completed';
          case 'not_found':
          case 'vaa_generated':
          case 'redemption_needed':
          case 'pending':
          default:
            return 'pending';
        }
      };
      
      const dbStatus = mapStatusToDbEnum(wormholeStatus.status || 'pending');
      
      const fromChain = isTestnet ? 'Sepolia' : 'Ethereum';
      const toChain = 'Solana'; // Default, WormholeScan will update if different
      const token = verification.token || 'USDC';
      const amount = verification.amount ? parseFloat(verification.amount) : 0;

      const { data: { user } } = await supabase.auth.getUser();
      
      const insertData = {
        wallet_address: walletAddress.toLowerCase(),
        tx_hash: cleanHash,
        from_chain: fromChain,
        to_chain: toChain,
        from_token: token,
        to_token: token,
        amount: amount,
        status: dbStatus,
        wormhole_vaa: wormholeStatus.vaa || null,
        needs_redemption: wormholeStatus.needsRedemption || false,
        user_id: user?.id || null,
      };
      
      const { data: insertedData, error: insertError } = await supabase
        .from('wormhole_transactions')
        .insert(insertData)
        .select();
      
      if (insertError) {
        setResult({
          success: false, 
          message: `Database error: ${insertError.message}. The transaction was not saved.` 
        });
        setLoading(false);
        return;
      }

      setResult({
        success: true, 
        message: 'Transaction imported successfully!' 
      });
      
      toast({
        title: "✅ Import Successful",
        description: `Transaction ${cleanHash.slice(0, 10)}... has been added to your claims`,
      });

      setTxHash('');
      
      if (onImportSuccess) {
        setTimeout(onImportSuccess, 1000);
      }

    } catch (error: any) {
      console.error('Import error:', error);
      setResult({ 
        success: false, 
        message: error.message || 'Failed to import transaction' 
      });
      
      toast({
        title: "❌ Import Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Import Missing Transaction</CardTitle>
        <CardDescription>
          Paste your Ethereum transaction hash to manually import a Wormhole or CCTP bridge transaction
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="txHash">Transaction Hash</Label>
          <Input
            id="txHash"
            placeholder="0x..."
            value={txHash}
            onChange={(e) => setTxHash(e.target.value)}
            className="font-mono text-sm"
          />
          <p className="text-xs text-muted-foreground">
            Example: 0x7307e6ca06bf1bd98f24163bfa11164639e6dd3db8e29e8c5a8b942f9a412b97
          </p>
        </div>

        <div className="space-y-2">
          <Label>Network</Label>
          <RadioGroup value={network} onValueChange={(val) => setNetwork(val as any)}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Testnet" id="testnet" />
              <Label htmlFor="testnet" className="font-normal cursor-pointer">
                Testnet (Sepolia)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Mainnet" id="mainnet" />
              <Label htmlFor="mainnet" className="font-normal cursor-pointer">
                Mainnet
              </Label>
            </div>
          </RadioGroup>
        </div>

        {result && (
          <div className={`flex items-start gap-2 p-3 rounded-lg border ${
            result.success 
              ? 'bg-green-50 border-green-200 text-green-900 dark:bg-green-900/20 dark:border-green-800 dark:text-green-100' 
              : 'bg-red-50 border-red-200 text-red-900 dark:bg-red-900/20 dark:border-red-800 dark:text-red-100'
          }`}>
            {result.success ? (
              <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            )}
            <p className="text-sm">{result.message}</p>
          </div>
        )}

        <Button 
          onClick={handleImport} 
          disabled={loading || !txHash.trim()}
          className="w-full"
        >
          {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {loading ? 'Importing...' : 'Import Transaction'}
        </Button>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-xs text-blue-900 dark:text-blue-100">
            <strong>💡 Tip:</strong> You can find your transaction hash on block explorers like Etherscan. 
            The system automatically detects Wormhole Core Bridge, TokenBridge, and CCTP (Circle) transactions.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
