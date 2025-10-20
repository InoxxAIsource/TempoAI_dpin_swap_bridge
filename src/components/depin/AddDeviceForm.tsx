import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2, CheckCircle } from 'lucide-react';
import nacl from 'tweetnacl';

interface AddDeviceFormProps {
  userId: string;
  onDeviceAdded: () => void;
  onOpenSetupGuide?: () => void;
}

const AddDeviceForm = ({ userId, onDeviceAdded, onOpenSetupGuide }: AddDeviceFormProps) => {
  const [deviceType, setDeviceType] = useState('solar-panel');
  const [deviceName, setDeviceName] = useState('');
  const [location, setLocation] = useState('');
  const [capacity, setCapacity] = useState('');
  const [setupMode, setSetupMode] = useState<'demo' | 'real'>('demo');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const deviceId = `${deviceType}-${Date.now()}`;
      let metadata: any = { location, capacity };
      let publicKey = null;

      if (setupMode === 'real') {
        const keyPair = nacl.sign.keyPair();
        publicKey = Buffer.from(keyPair.publicKey).toString('base64');
        const privateKey = Buffer.from(keyPair.secretKey).toString('base64');
        metadata = { ...metadata, privateKey };
      }

      const { error } = await supabase.from('device_registry').insert({
        user_id: userId,
        device_id: deviceId,
        device_name: deviceName,
        device_type: deviceType,
        public_key: publicKey,
        metadata,
        status: 'active',
      });

      if (error) throw error;

      setSuccess(true);
      toast.success('Device added successfully!');
      
      setTimeout(() => {
        onDeviceAdded();
        resetForm();
      }, 1500);

      if (setupMode === 'real' && onOpenSetupGuide) {
        setTimeout(() => onOpenSetupGuide(), 2000);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to add device');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setDeviceType('solar-panel');
    setDeviceName('');
    setLocation('');
    setCapacity('');
    setSetupMode('demo');
    setSuccess(false);
  };

  if (success) {
    return (
      <Card className="p-12 text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-2xl font-bold mb-2">Device Added Successfully!</h3>
        <p className="text-muted-foreground">
          Redirecting to trace devices map...
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h3 className="text-2xl font-bold mb-2">Add New Device</h3>
          <p className="text-muted-foreground">
            Register a new DePIN device to start earning rewards
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="device-type">Device Type</Label>
            <Select value={deviceType} onValueChange={setDeviceType}>
              <SelectTrigger id="device-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="solar-panel">Solar Panel</SelectItem>
                <SelectItem value="weather-station">Weather Station</SelectItem>
                <SelectItem value="air-quality-monitor">Air Quality Monitor</SelectItem>
                <SelectItem value="seismic-sensor">Seismic Sensor</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="device-name">Device Name</Label>
            <Input
              id="device-name"
              value={deviceName}
              onChange={(e) => setDeviceName(e.target.value)}
              placeholder="e.g., Rooftop Panel A1"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger id="location">
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="California, USA">California, USA</SelectItem>
                <SelectItem value="Texas, USA">Texas, USA</SelectItem>
                <SelectItem value="New York, USA">New York, USA</SelectItem>
                <SelectItem value="London, UK">London, UK</SelectItem>
                <SelectItem value="Tokyo, Japan">Tokyo, Japan</SelectItem>
                <SelectItem value="Berlin, Germany">Berlin, Germany</SelectItem>
                <SelectItem value="Sydney, Australia">Sydney, Australia</SelectItem>
                <SelectItem value="Mumbai, India">Mumbai, India</SelectItem>
                <SelectItem value="São Paulo, Brazil">São Paulo, Brazil</SelectItem>
                <SelectItem value="Dubai, UAE">Dubai, UAE</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="capacity">Capacity</Label>
            <Input
              id="capacity"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              placeholder="e.g., 10kW"
              required
            />
          </div>

          <div className="space-y-3">
            <Label>Setup Mode</Label>
            <RadioGroup value={setupMode} onValueChange={(v) => setSetupMode(v as 'demo' | 'real')}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="demo" id="demo" />
                <Label htmlFor="demo" className="cursor-pointer">
                  Demo Mode (Simulated data)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="real" id="real" />
                <Label htmlFor="real" className="cursor-pointer">
                  Real Hardware (Generates cryptographic keys)
                </Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <Button type="submit" className="w-full" size="lg" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Adding Device...
            </>
          ) : (
            'Add Device'
          )}
        </Button>
      </form>
    </Card>
  );
};

export default AddDeviceForm;
