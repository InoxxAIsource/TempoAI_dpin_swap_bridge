import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Activity, MapPin, Zap, Clock, Shield } from 'lucide-react';

interface Device {
  id: string;
  device_id: string;
  device_name: string;
  device_type: string;
  status: string;
  is_verified: boolean;
  last_seen_at: string;
  metadata: {
    location?: string;
    capacity?: string;
    dailyEarnings?: number;
  };
}

interface DevicePopupProps {
  device: Device;
  onClose: () => void;
}

const DevicePopup = ({ device, onClose }: DevicePopupProps) => {
  const isOnline = device.last_seen_at
    ? new Date().getTime() - new Date(device.last_seen_at).getTime() < 5 * 60 * 1000
    : false;

  const uptime = device.metadata?.dailyEarnings ? 95 : 0;

  return (
    <Card className="w-80 shadow-2xl border-primary/20 bg-background/95 backdrop-blur-sm">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-bold text-lg flex items-center gap-2">
              {device.device_name}
              {device.is_verified && (
                <Shield className="w-4 h-4 text-green-500" />
              )}
            </h3>
            <p className="text-sm text-muted-foreground">{device.device_type}</p>
          </div>
          <Badge variant={isOnline ? 'default' : 'secondary'}>
            <Activity className="w-3 h-3 mr-1" />
            {isOnline ? 'Online' : 'Offline'}
          </Badge>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <span>{device.metadata?.location || 'Unknown Location'}</span>
          </div>

          {device.metadata?.capacity && (
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-muted-foreground" />
              <span>{device.metadata.capacity} Capacity</span>
            </div>
          )}

          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span>{uptime}% Uptime</span>
          </div>
        </div>

        {device.metadata?.dailyEarnings && (
          <div className="pt-2 border-t">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Daily Earnings</span>
              <span className="font-bold text-primary">
                ${device.metadata.dailyEarnings.toFixed(2)}
              </span>
            </div>
          </div>
        )}

        <Button variant="outline" className="w-full" size="sm" onClick={onClose}>
          Close
        </Button>
      </CardContent>
    </Card>
  );
};

export default DevicePopup;
