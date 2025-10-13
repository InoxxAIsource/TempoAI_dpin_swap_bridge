import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWalletContext } from '@/contexts/WalletContext';
import { useWeb3Auth } from '@/hooks/useWeb3Auth';
import { Loader2, CheckCircle2 } from 'lucide-react';

interface WalletModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const WalletModal = ({ open, onOpenChange }: WalletModalProps) => {
  const [activeTab, setActiveTab] = useState('evm');
  const { isEvmConnected, isSolanaConnected, isWalletAuthenticated, solanaAddress } = useWalletContext();
  const { authenticateWithSolana, isAuthenticating } = useWeb3Auth();

  // Auto-authenticate when Solana wallet connects
  useEffect(() => {
    if (isSolanaConnected && !isWalletAuthenticated && !isAuthenticating) {
      // Delay to ensure wallet is fully connected
      const timer = setTimeout(() => {
        authenticateWithSolana();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isSolanaConnected, isWalletAuthenticated, isAuthenticating]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Connect Wallet</DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="evm">EVM Chains</TabsTrigger>
            <TabsTrigger value="solana">Solana</TabsTrigger>
          </TabsList>
          
          <TabsContent value="evm" className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">
              Connect to Ethereum, Polygon, Arbitrum, Avalanche, BSC, and more.
            </p>
            <div className="flex justify-center">
              <ConnectButton />
            </div>
            {isEvmConnected && (
              <p className="text-sm text-center text-green-500">✓ EVM wallet connected</p>
            )}
          </TabsContent>
          
          <TabsContent value="solana" className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">
              Connect to Solana network using Phantom, Solflare, or other wallets.
            </p>
            <div className="flex justify-center [&_button]:!bg-primary [&_button]:!text-primary-foreground [&_button]:!rounded-full">
              <WalletMultiButton />
            </div>
            
            {isAuthenticating && (
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Authenticating... Please sign the message in your wallet</span>
              </div>
            )}
            
            {isSolanaConnected && isWalletAuthenticated && (
              <div className="flex items-center justify-center gap-2 text-sm text-green-500">
                <CheckCircle2 className="w-4 h-4" />
                <span>✓ Wallet connected & authenticated</span>
              </div>
            )}
            
            {isSolanaConnected && !isWalletAuthenticated && !isAuthenticating && (
              <div className="space-y-2">
                <p className="text-sm text-center text-amber-500">
                  ⚠️ Wallet connected but not authenticated
                </p>
                <Button 
                  onClick={authenticateWithSolana} 
                  size="sm" 
                  className="w-full"
                >
                  Sign Message to Authenticate
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default WalletModal;
