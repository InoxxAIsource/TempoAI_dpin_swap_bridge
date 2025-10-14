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
  const { isEvmConnected, isSolanaConnected, isWalletAuthenticated, solanaAddress } = useWalletContext();
  const { authenticateWithSolana, isAuthenticating } = useWeb3Auth();
  const [authFailed, setAuthFailed] = useState(false);
  const [authErrorMessage, setAuthErrorMessage] = useState('');
  const [lastAuthAttempt, setLastAuthAttempt] = useState(0);
  const AUTH_COOLDOWN = 5000; // 5 seconds cooldown between auth attempts

  // Check for stale authentication when modal opens
  useEffect(() => {
    if (open) {
      const checkStaleAuth = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        
        // If there's a wallet session but wallet is not connected, clear it
        if (session?.user?.user_metadata?.wallet_address) {
          if (!isSolanaConnected && !isEvmConnected) {
            await supabase.auth.signOut();
          }
        }
      };
      
      checkStaleAuth();
    }
  }, [open, isSolanaConnected, isEvmConnected]);

  // Auto-authenticate when Solana wallet connects (with cooldown to prevent loops)
  useEffect(() => {
    if (isSolanaConnected && !isWalletAuthenticated && !isAuthenticating) {
      const now = Date.now();
      const timeSinceLastAttempt = now - lastAuthAttempt;
      
      // Only attempt if cooldown period has passed
      if (timeSinceLastAttempt < AUTH_COOLDOWN) {
        console.log('[WalletModal] Authentication cooldown active, skipping...');
        return;
      }
      
      setAuthFailed(false);
      setAuthErrorMessage('');
      setLastAuthAttempt(now);
      
      const timer = setTimeout(async () => {
        try {
          await authenticateWithSolana();
        } catch (error: any) {
          console.error('[WalletModal] Auto-authentication failed:', error);
          setAuthFailed(true);
          setAuthErrorMessage(error.message || 'Authentication failed');
        }
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [isSolanaConnected, isWalletAuthenticated, isAuthenticating, lastAuthAttempt]);

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
            
            {authFailed && isSolanaConnected && !isWalletAuthenticated && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                <div className="flex items-center gap-2 text-red-600 dark:text-red-400 mb-2">
                  <span className="font-semibold">Authentication Failed</span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  {authErrorMessage}
                </p>
                <Button 
                  onClick={() => {
                    setAuthFailed(false);
                    setAuthErrorMessage('');
                    authenticateWithSolana();
                  }} 
                  size="sm" 
                  className="w-full"
                  variant="default"
                >
                  🔄 Retry Authentication
                </Button>
              </div>
            )}
            
            {!authFailed && isSolanaConnected && !isWalletAuthenticated && !isAuthenticating && (
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
