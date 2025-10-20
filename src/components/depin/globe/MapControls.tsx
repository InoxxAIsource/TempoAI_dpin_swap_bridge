import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Filter, Globe, User } from 'lucide-react';

interface MapControlsProps {
  showMyDevicesOnly: boolean;
  setShowMyDevicesOnly: (value: boolean) => void;
  deviceTypeFilter: string;
  setDeviceTypeFilter: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  autoRotate: boolean;
  setAutoRotate: (value: boolean) => void;
  totalDevices: number;
  filteredCount: number;
}

const MapControls = ({
  showMyDevicesOnly,
  setShowMyDevicesOnly,
  deviceTypeFilter,
  setDeviceTypeFilter,
  statusFilter,
  setStatusFilter,
  autoRotate,
  setAutoRotate,
  totalDevices,
  filteredCount,
}: MapControlsProps) => {
  return (
    <Card className="p-4 space-y-4 bg-background/95 backdrop-blur-sm border-primary/20">
      <div className="flex items-center gap-2 mb-2">
        <Filter className="w-4 h-4 text-primary" />
        <h3 className="font-semibold">Map Controls</h3>
        <Badge variant="outline" className="ml-auto">
          {filteredCount} / {totalDevices}
        </Badge>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label htmlFor="my-devices" className="flex items-center gap-2 cursor-pointer">
            <User className="w-4 h-4" />
            My Devices Only
          </Label>
          <Switch
            id="my-devices"
            checked={showMyDevicesOnly}
            onCheckedChange={setShowMyDevicesOnly}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="auto-rotate" className="flex items-center gap-2 cursor-pointer">
            <Globe className="w-4 h-4" />
            Auto Rotate
          </Label>
          <Switch
            id="auto-rotate"
            checked={autoRotate}
            onCheckedChange={setAutoRotate}
          />
        </div>

        <div className="space-y-2">
          <Label>Device Type</Label>
          <Select value={deviceTypeFilter} onValueChange={setDeviceTypeFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="solar-panel">Solar Panel</SelectItem>
              <SelectItem value="weather-station">Weather Station</SelectItem>
              <SelectItem value="air-quality-monitor">Air Quality Monitor</SelectItem>
              <SelectItem value="seismic-sensor">Seismic Sensor</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Status</Label>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </Card>
  );
};

export default MapControls;
