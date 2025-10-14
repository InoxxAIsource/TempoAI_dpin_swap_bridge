import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Activity, Shield, ArrowRight, CheckCircle2, Key } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useWalletContext } from '@/contexts/WalletContext';
import nacl from 'tweetnacl';

interface AddDeviceModalProps {
  open: boolean;
  onClose: () => void;
  onDeviceAdded: () => void;
  onOpenSetupGuide: (deviceId: string) => void;
}

const AddDeviceModal = ({ open, onClose, onDeviceAdded, onOpenSetupGuide }: AddDeviceModalProps) => {
  const [deviceType, setDeviceType] = useState('solar_panel');
  const [deviceName, setDeviceName] = useState('');
  const [location, setLocation] = useState('');
  const [capacity, setCapacity] = useState('');
  const [setupMode, setSetupMode] = useState<'demo' | 'real'>('demo');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { isAuthenticated, authMethod, walletAuthenticatedAddress } = useWalletContext();

  const handleSubmit = async () => {
    if (!deviceName || !location) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const deviceId = `${deviceType}_${Date.now()}`;
      
      // Generate Ed25519 keypair for device signature verification
      const keypair = nacl.sign.keyPair();
      const publicKeyBase64 = Buffer.from(keypair.publicKey).toString('base64');
      const privateKeyBase64 = Buffer.from(keypair.secretKey).toString('base64');
      
      const { error } = await supabase.from('device_registry').insert({
        user_id: user.id,
        device_id: deviceId,
        device_type: deviceType,
        device_name: deviceName,
        is_verified: setupMode === 'real', // Real hardware starts as verified
        public_key: publicKeyBase64,
        metadata: {
          location,
          capacity_kw: capacity ? parseFloat(capacity) : undefined,
          setup_mode: setupMode,
          private_key: setupMode === 'demo' ? privateKeyBase64 : undefined // Store for demo mode only
        }
      });

      if (error) throw error;

      toast({
        title: 'Device Added',
        description: setupMode === 'real' 
          ? `${deviceName} added with cryptographic verification enabled`
          : `${deviceName} added in demo mode`,
        duration: 5000,
      });

      if (setupMode === 'real') {
        onOpenSetupGuide(deviceId);
      }

      onDeviceAdded();
      onClose();
      resetForm();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setDeviceType('solar_panel');
    setDeviceName('');
    setLocation('');
    setCapacity('');
    setSetupMode('demo');
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Add Your Device</DialogTitle>
          <DialogDescription>
            Configure your new DePIN device for the network
          </DialogDescription>
          {isAuthenticated && (
            <div className="flex items-center gap-2 pt-2 text-sm text-green-500">
              <CheckCircle2 className="w-4 h-4" />
              <span>
                Authenticated via {authMethod === 'wallet' ? `Wallet (${walletAuthenticatedAddress?.slice(0, 6)}...${walletAuthenticatedAddress?.slice(-4)})` : 'Email'}
              </span>
            </div>
          )}
        </DialogHeader>

        <div className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label>Device Type</Label>
            <Select value={deviceType} onValueChange={setDeviceType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="solar_panel">Solar Panel</SelectItem>
                <SelectItem value="temperature_sensor">Temperature Sensor</SelectItem>
                <SelectItem value="wind_turbine">Wind Turbine</SelectItem>
                <SelectItem value="weather_station">Weather Station</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Device Name *</Label>
            <Input
              placeholder="e.g., Rooftop Solar #1"
              value={deviceName}
              onChange={(e) => setDeviceName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Location *</Label>
            <Input
              placeholder="e.g., California, USA"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Capacity (kW) - Optional</Label>
            <Input
              type="number"
              placeholder="e.g., 25"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
            />
          </div>

          <div className="space-y-3">
            <Label>Setup Options</Label>
            <RadioGroup value={setupMode} onValueChange={(v) => setSetupMode(v as 'demo' | 'real')}>
              <div className="flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer hover:border-primary/50 transition-colors"
                   onClick={() => setSetupMode('demo')}>
                <RadioGroupItem value="demo" id="demo" />
                <label htmlFor="demo" className="flex-1 cursor-pointer">
                  <div className="flex items-center gap-2 mb-1">
                    <Activity className="w-4 h-4 text-blue-500" />
                    <span className="font-semibold">Demo Mode</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Start testing immediately with simulated data
                  </p>
                </label>
              </div>
              
              <div className="flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer hover:border-primary/50 transition-colors"
                   onClick={() => setSetupMode('real')}>
                <RadioGroupItem value="real" id="real" />
                <label htmlFor="real" className="flex-1 cursor-pointer">
                  <div className="flex items-center gap-2 mb-1">
                    <Shield className="w-4 h-4 text-green-500" />
                    <span className="font-semibold">Real Hardware</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Connect Raspberry Pi with Ed25519 signatures for 2x rewards
                  </p>
                  <div className="flex items-center gap-1 mt-2 text-xs text-green-600 dark:text-green-400">
                    <Key className="w-3 h-3" />
                    <span>Cryptographic verification enabled</span>
                  </div>
                </label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading} className="flex-1">
            {setupMode === 'real' ? 'Next: Setup Instructions' : 'Add Device'}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddDeviceModal;
