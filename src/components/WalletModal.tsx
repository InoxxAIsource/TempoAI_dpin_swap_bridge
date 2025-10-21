import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWalletContext } from '@/contexts/WalletContext';
import { useWeb3Auth } from '@/hooks/useWeb3Auth';
import { Loader2, CheckCircle2, Smartphone } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface WalletModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const WalletModal = ({ open, onOpenChange }: WalletModalProps) => {
  const [activeTab, setActiveTab] = useState('evm');
  const { isEvmConnected, isSolanaConnected, isWalletAuthenticated, solanaAddress } = useWalletContext();
  const { authenticateWithSolana, isAuthenticating, authError } = useWeb3Auth();
  const isMobile = useIsMobile();
  const [hasTriedAutoAuth, setHasTriedAutoAuth] = useState(false);

  // Auto-authentication when Solana wallet connects
  useEffect(() => {
    if (isSolanaConnected && !isWalletAuthenticated && !isAuthenticating && !authError && !hasTriedAutoAuth && open) {
      console.log('[WalletModal] Auto-triggering Solana authentication on mobile');
      setHasTriedAutoAuth(true);
      
      // Small delay to ensure wallet is fully connected
      const timer = setTimeout(() => {
        authenticateWithSolana();
      }, 800);
      
      return () => clearTimeout(timer);
    }
  }, [isSolanaConnected, isWalletAuthenticated, isAuthenticating, authError, hasTriedAutoAuth, open]);

  // Reset auto-auth flag when modal closes or wallet disconnects
  useEffect(() => {
    if (!open || !isSolanaConnected) {
      setHasTriedAutoAuth(false);
    }
  }, [open, isSolanaConnected]);

  const handleManualAuth = async () => {
    try {
      await authenticateWithSolana();
    } catch (error) {
      // Error is already handled by useWeb3Auth hook
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
              <div className="flex flex-col items-center justify-center gap-3 text-xs sm:text-sm text-muted-foreground bg-primary/5 border border-primary/20 rounded-lg p-4 sm:p-5">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                  <span className="font-semibold">Authenticating...</span>
                </div>
                {isMobile && (
                  <div className="flex items-start gap-2 text-amber-600 dark:text-amber-400 bg-amber-500/10 rounded-lg p-3 w-full">
                    <Smartphone className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <div className="text-xs">
                      <p className="font-medium mb-1">Mobile Tip:</p>
                      <p>After signing in your wallet app, return to this tab. The connection will complete automatically.</p>
                    </div>
                  </div>
                )}
                {!isMobile && (
                  <p className="text-center">Please sign the message in your wallet popup...</p>
                )}
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
