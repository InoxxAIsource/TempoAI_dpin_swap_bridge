import { useState, useMemo } from 'react';
import { useWalletContext } from '@/contexts/WalletContext';
import Globe3D from '../globe/Globe3D';
import MapControls from '../globe/MapControls';
import DevicePopup from '../globe/DevicePopup';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

interface Device {
  id: string;
  device_id: string;
  device_name: string;
  device_type: string;
  status: string;
  is_verified: boolean;
  last_seen_at: string;
  user_id: string;
  metadata: any;
}

interface TraceDevicesTabProps {
  devices: Array<{
    id: string;
    device_id: string;
    device_name: string;
    device_type: string;
    status: string;
    is_verified: boolean;
    last_seen_at: string;
    user_id: string;
    metadata: any;
  }>;
}

const TraceDevicesTab = ({ devices }: TraceDevicesTabProps) => {
  const { session } = useWalletContext();
  const [showMyDevicesOnly, setShowMyDevicesOnly] = useState(false);
  const [deviceTypeFilter, setDeviceTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [autoRotate, setAutoRotate] = useState(true);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);

  const handleDeviceClick = (device: TraceDevicesTabProps['devices'][0]) => {
    setSelectedDevice(device as Device);
  };

  const filteredDevices = useMemo(() => {
    return devices.filter((device) => {
      if (showMyDevicesOnly && device.user_id !== session?.user?.id) return false;
      if (deviceTypeFilter !== 'all' && device.device_type !== deviceTypeFilter) return false;
      if (statusFilter !== 'all' && device.status !== statusFilter) return false;
      return true;
    });
  }, [devices, showMyDevicesOnly, deviceTypeFilter, statusFilter, session?.user?.id]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Interactive Device Map</h2>
        <p className="text-muted-foreground">
          Explore the global DePIN network. Click on markers to view device details.
        </p>
      </div>

      {!session?.user && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Sign in to filter and view your own devices on the map
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <MapControls
            showMyDevicesOnly={showMyDevicesOnly}
            setShowMyDevicesOnly={setShowMyDevicesOnly}
            deviceTypeFilter={deviceTypeFilter}
            setDeviceTypeFilter={setDeviceTypeFilter}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            autoRotate={autoRotate}
            setAutoRotate={setAutoRotate}
            totalDevices={devices.length}
            filteredCount={filteredDevices.length}
          />
        </div>

        <div className="lg:col-span-3">
          <Globe3D
            devices={filteredDevices}
            onDeviceClick={handleDeviceClick}
            autoRotate={autoRotate}
          />
        </div>
      </div>

      <Dialog open={!!selectedDevice} onOpenChange={() => setSelectedDevice(null)}>
        <DialogContent className="p-0 bg-transparent border-none">
          {selectedDevice && (
            <DevicePopup device={selectedDevice} onClose={() => setSelectedDevice(null)} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TraceDevicesTab;
