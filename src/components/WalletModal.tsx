import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWalletContext } from '@/contexts/WalletContext';

interface WalletModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const WalletModal = ({ open, onOpenChange }: WalletModalProps) => {
  const [activeTab, setActiveTab] = useState('evm');
  const { isEvmConnected, isSolanaConnected } = useWalletContext();

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
            {isSolanaConnected && (
              <p className="text-sm text-center text-green-500">✓ Solana wallet connected</p>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default WalletModal;
