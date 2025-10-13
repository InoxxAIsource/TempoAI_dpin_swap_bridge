import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Globe, Shield, Activity, Zap, ArrowRight } from 'lucide-react';

interface OnboardingModalProps {
  open: boolean;
  onClose: () => void;
  onStartDemo: () => void;
  onConnectReal: () => void;
}

const OnboardingModal = ({ open, onClose, onStartDemo, onConnectReal }: OnboardingModalProps) => {
  const [step, setStep] = useState(1);

  const handleStartDemo = () => {
    onStartDemo();
    onClose();
  };

  const handleConnectReal = () => {
    onConnectReal();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        {step === 1 && (
          <>
            <DialogHeader>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Globe className="w-6 h-6 text-primary" />
                </div>
                <DialogTitle className="text-2xl">Welcome to Tempo DePIN Network!</DialogTitle>
              </div>
              <DialogDescription className="text-base space-y-4">
                <p className="text-foreground">
                  <strong>What is DePIN?</strong>
                  <br />
                  Decentralized Physical Infrastructure Networks let you earn crypto rewards from real hardware like solar panels, sensors, and other IoT devices.
                </p>
                <div className="space-y-3 mt-6">
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                    <Activity className="w-5 h-5 text-blue-500 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-foreground">Demo Mode</h4>
                      <p className="text-sm text-muted-foreground">
                        Simulated devices with realistic data. Perfect for testing and learning. Earn 1x rewards.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                    <Shield className="w-5 h-5 text-green-500 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-foreground">Real Hardware</h4>
                      <p className="text-sm text-muted-foreground">
                        Connect Raspberry Pi + sensors for verified performance. Cryptographically signed metrics. Earn 2x rewards!
                      </p>
                    </div>
                  </div>
                </div>
              </DialogDescription>
            </DialogHeader>
            <div className="flex gap-3 mt-6">
              <Button onClick={handleStartDemo} className="flex-1" variant="outline">
                <Activity className="w-4 h-4 mr-2" />
                Start with 5 Demo Devices
              </Button>
              <Button onClick={() => setStep(2)} className="flex-1">
                <Shield className="w-4 h-4 mr-2" />
                I Have Real Hardware
              </Button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl">Connect Real Hardware</DialogTitle>
              <DialogDescription className="text-base space-y-4">
                <p className="text-foreground">
                  To connect real devices, you'll need:
                </p>
                <ul className="space-y-2 ml-4">
                  <li className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-primary" />
                    <span>Raspberry Pi (any model with GPIO)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-primary" />
                    <span>Sensors (solar panels, temperature, etc.)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-primary" />
                    <span>Python 3.8+ installed</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-primary" />
                    <span>Internet connection</span>
                  </li>
                </ul>
                <div className="bg-muted/50 p-4 rounded-lg mt-4">
                  <p className="text-sm">
                    <strong>Note:</strong> You can start with demo devices now and add real hardware later from the dashboard.
                  </p>
                </div>
              </DialogDescription>
            </DialogHeader>
            <div className="flex gap-3 mt-6">
              <Button onClick={() => setStep(1)} variant="outline" className="flex-1">
                Back
              </Button>
              <Button onClick={handleConnectReal} className="flex-1">
                Continue to Setup <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default OnboardingModal;
