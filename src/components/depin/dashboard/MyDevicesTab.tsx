import { useState, useMemo } from 'react';
import { Search, Filter, Monitor } from 'lucide-react';
import DeviceCard from '@/components/depin/DeviceCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AuthPrompt from '@/components/depin/AuthPrompt';
import { useWalletContext } from '@/contexts/WalletContext';

interface Device {
  id: string;
  device_id: string;
  device_name: string;
  device_type: string;
  status: string;
  is_verified: boolean;
  metadata: any;
  last_seen_at: string;
  user_id: string;
}

interface MyDevicesTabProps {
  devices: Device[];
  onDeleteDevice: (deviceId: string) => Promise<void>;
  onDeviceClick?: (deviceId: string) => void;
  isLoading?: boolean;
}

const MyDevicesTab = ({ devices, onDeleteDevice, onDeviceClick, isLoading }: MyDevicesTabProps) => {
  const { isAuthenticated } = useWalletContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  // Get unique device types
  const deviceTypes = useMemo(() => {
    const types = new Set(devices.map(d => d.device_type));
    return Array.from(types);
  }, [devices]);

  // Filter devices
  const filteredDevices = useMemo(() => {
    return devices.filter(device => {
      const matchesSearch = device.device_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          device.device_id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || device.status === statusFilter;
      const matchesType = typeFilter === 'all' || device.device_type === typeFilter;
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [devices, searchQuery, statusFilter, typeFilter]);

  // Calculate stats
  const onlineDevices = useMemo(() => {
    const now = new Date().getTime();
    return devices.filter(d => {
      return d.last_seen_at && now - new Date(d.last_seen_at).getTime() < 120000; // 2 min
    }).length;
  }, [devices]);

  if (!isAuthenticated) {
    return <AuthPrompt />;
  }

  if (devices.length === 0) {
    return (
      <Card className="border-dashed">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Monitor className="w-6 h-6 text-primary" />
          </div>
          <CardTitle>No Devices Yet</CardTitle>
          <CardDescription>
            Get started by adding your first device to the network
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Button onClick={() => {
            const url = new URL(window.location.href);
            url.searchParams.set('tab', 'add-device');
            window.history.pushState({}, '', url);
            window.dispatchEvent(new PopStateEvent('popstate'));
          }}>
            Add Your First Device
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Devices</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{devices.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Online Now</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-500">{onlineDevices}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Active</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {devices.filter(d => d.status === 'active').length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Verified</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-500">
              {devices.filter(d => d.is_verified).length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by device name or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {deviceTypes.map(type => (
                  <SelectItem key={type} value={type}>
                    {type.replace('_', ' ').charAt(0).toUpperCase() + type.slice(1).replace('_', ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      {filteredDevices.length !== devices.length && (
        <div className="text-sm text-muted-foreground">
          Showing {filteredDevices.length} of {devices.length} devices
          {searchQuery && ` matching "${searchQuery}"`}
        </div>
      )}

      {/* Devices Grid */}
      {filteredDevices.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center">
            <Monitor className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No devices found matching your filters</p>
            <Button
              variant="ghost"
              className="mt-4"
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
                setTypeFilter('all');
              }}
            >
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filteredDevices.map((device) => (
            <div
              key={device.id}
              onClick={() => onDeviceClick?.(device.id)}
              className="cursor-pointer"
            >
              <DeviceCard device={device} onDelete={onDeleteDevice} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyDevicesTab;
