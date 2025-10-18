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

  const fetchEtherscanData = async (hash: string, isTestnet: boolean) => {
    const apiUrl = isTestnet 
      ? 'https://api-sepolia.etherscan.io/api'
      : 'https://api.etherscan.io/api';
    
    const apiKey = 'YourApiKeyToken';
    
    const response = await fetch(
      `${apiUrl}?module=proxy&action=eth_getTransactionByHash&txhash=${hash}&apikey=${apiKey}`
    );
    
    const data = await response.json();
    
    if (!data.result) {
      throw new Error('Transaction not found on Etherscan');
    }
    
    return data.result;
  };

  const checkIsWormholeTransaction = (ethData: any, isTestnet: boolean): boolean => {
    // Check if transaction interacts with any known Wormhole/CCTP contract
    const wormholeContracts = isTestnet
      ? [
          '0x4a8bc80Ed5a4067f1CCf107057b8270E0cC11A78'.toLowerCase(), // Wormhole Core
          '0x8FE6B999Dc680CcFDD5Bf7EB0974218be2542DAA'.toLowerCase(), // CCTP TokenMessenger
          '0xE737e5cEBEEBa77EFE34D4aa090756590b1CE275'.toLowerCase(), // CCTP MessageTransmitter
        ]
      : [
          '0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B'.toLowerCase(), // Wormhole Core
          '0x3ee18B2214AFF97000D974cf647E7C347E8fa585'.toLowerCase(), // TokenBridge
          '0x28b5a0e9C621a5BadaA536219b3a228C8168cf5d'.toLowerCase(), // CCTP TokenMessenger
          '0x81D40F21F12A8F0E3252Bccb954D722d4c464B64'.toLowerCase(), // CCTP MessageTransmitter
        ];
    
    return wormholeContracts.includes(ethData.to?.toLowerCase());
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
        .single();

      if (existing) {
        setResult({ 
          success: false, 
          message: 'This transaction has already been imported' 
        });
        setLoading(false);
        return;
      }

      const ethData = await fetchEtherscanData(cleanHash, isTestnet);
      
      // Verify this is a Wormhole/CCTP transaction
      if (!checkIsWormholeTransaction(ethData, isTestnet)) {
        setResult({
          success: false,
          message: 'This transaction does not interact with Wormhole or CCTP contracts',
        });
        setLoading(false);
        return;
      }
      
      // Query WormholeScan API for cross-chain transfer status
      const wormholeStatus = await checkWormholeTxStatus(cleanHash, network);
      
      const fromChain = isTestnet ? 'Sepolia' : 'Ethereum';
      const toChain = 'Solana'; // Default, WormholeScan will update if different
      const token = 'USDC';
      const amount = 0;

      const { error: insertError } = await supabase
        .from('wormhole_transactions')
        .insert({
          wallet_address: walletAddress.toLowerCase(),
          tx_hash: cleanHash,
          from_chain: fromChain,
          to_chain: toChain,
          from_token: token,
          to_token: token,
          amount: amount,
          status: wormholeStatus.status || 'pending',
          wormhole_vaa: wormholeStatus.vaa || null,
          needs_redemption: wormholeStatus.needsRedemption || false,
        } as any);

      if (insertError) throw insertError;

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
            <strong>💡 Tip:</strong> You can find your transaction hash on Etherscan. 
            The system automatically detects Wormhole Core Bridge, TokenBridge, and CCTP (Circle) transactions.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
