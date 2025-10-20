import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, Wallet, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import WalletModal from '@/components/WalletModal';

const AuthPrompt = () => {
  const navigate = useNavigate();
  const [showWalletModal, setShowWalletModal] = useState(false);

  return (
    <>
      <div className="flex items-center justify-center min-h-[500px]">
        <Card className="max-w-md w-full border-primary/20">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Authentication Required</CardTitle>
            <CardDescription>
              Connect your wallet or sign in with email to access this feature and manage your DePIN devices.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              onClick={() => setShowWalletModal(true)}
              className="w-full"
              size="lg"
            >
              <Wallet className="mr-2 h-5 w-5" />
              Connect Wallet
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/auth')}
              className="w-full"
              size="lg"
            >
              <Mail className="mr-2 h-5 w-5" />
              Sign In with Email
            </Button>
          </CardContent>
        </Card>
      </div>

      <WalletModal open={showWalletModal} onOpenChange={setShowWalletModal} />
    </>
  );
};

export default AuthPrompt;
