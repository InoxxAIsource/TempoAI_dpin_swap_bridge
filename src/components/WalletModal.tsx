import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWalletContext } from '@/contexts/WalletContext';
import { useWeb3Auth } from '@/hooks/useWeb3Auth';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface WalletModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const WalletModal = ({ open, onOpenChange }: WalletModalProps) => {
  const [activeTab, setActiveTab] = useState('evm');
  const { isEvmConnected, isSolanaConnected, isWalletAuthenticated } = useWalletContext();
  const { authenticateWithSolana, isAuthenticating, authError } = useWeb3Auth();

  const handleManualAuth = async () => {
    try {
      await authenticateWithSolana();
    } catch (error) {
      console.error('[WalletModal] Manual authentication failed:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl font-bold">Connect Wallet</DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 h-12 sm:h-10">
            <TabsTrigger value="evm" className="text-sm sm:text-base">EVM Chains</TabsTrigger>
            <TabsTrigger value="solana" className="text-sm sm:text-base">Solana</TabsTrigger>
          </TabsList>
          
          <TabsContent value="evm" className="space-y-4 py-4 px-2 sm:px-0">
            <p className="text-sm sm:text-base text-muted-foreground">
              Connect to Ethereum, Polygon, Arbitrum, Avalanche, BSC, and more.
            </p>
            <div className="flex justify-center max-w-full overflow-x-hidden">
              <div className="mx-auto">
                <ConnectButton />
              </div>
            </div>
            {isEvmConnected && (
              <p className="text-sm text-center text-green-500">✓ EVM wallet connected</p>
            )}
          </TabsContent>
          
          <TabsContent value="solana" className="space-y-4 py-4 px-2 sm:px-0">
            <p className="text-sm sm:text-base text-muted-foreground">
              Connect to Solana network using Phantom, Solflare, or other wallets.
            </p>
            <div className="flex justify-center max-w-full overflow-x-hidden [&_button]:!bg-primary [&_button]:!text-primary-foreground [&_button]:!rounded-full">
              <div className="mx-auto">
                <WalletMultiButton />
              </div>
            </div>
            
            {isAuthenticating && (
              <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-muted-foreground bg-primary/5 border border-primary/20 rounded-lg p-3 sm:p-4">
                <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" />
                <span>Please sign the message in your wallet...</span>
              </div>
            )}
            
            {isSolanaConnected && isWalletAuthenticated && (
              <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-green-500 bg-green-500/10 border border-green-500/20 rounded-lg p-3 sm:p-4">
                <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>Wallet connected & authenticated</span>
              </div>
            )}
            
            {authError && isSolanaConnected && !isWalletAuthenticated && !isAuthenticating && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 sm:p-4 space-y-3">
                <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                  <span className="font-semibold text-xs sm:text-sm">Authentication Failed</span>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {authError}
                </p>
                <Button 
                  onClick={handleManualAuth}
                  size="sm" 
                  className="w-full text-sm sm:text-base h-11 sm:h-10"
                  variant="default"
                >
                  Try Again
                </Button>
              </div>
            )}
            
            {!authError && isSolanaConnected && !isWalletAuthenticated && !isAuthenticating && (
              <div className="space-y-3 bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 sm:p-4">
                <p className="text-xs sm:text-sm text-center text-amber-600 dark:text-amber-400">
                  Wallet connected - Please authenticate to continue
                </p>
                <Button 
                  onClick={handleManualAuth}
                  size="sm" 
                  className="w-full text-sm sm:text-base h-11 sm:h-10"
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
