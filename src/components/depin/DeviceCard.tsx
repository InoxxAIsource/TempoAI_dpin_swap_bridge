import { Badge } from '@/components/ui/badge';
import { Activity, Shield, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface DeviceCardProps {
  device: {
    device_id: string;
    device_name: string;
    device_type: string;
    status: string;
    is_verified: boolean;
    metadata: any;
    last_seen_at: string;
  };
}

const DeviceCard = ({ device }: DeviceCardProps) => {
  const isOnline = new Date().getTime() - new Date(device.last_seen_at).getTime() < 120000; // 2 min

  return (
    <div className="border border-border rounded-2xl p-6 bg-card hover:border-primary/50 transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            device.is_verified ? 'bg-green-500/10' : 'bg-primary/10'
          }`}>
            {device.is_verified ? (
              <Shield className="w-5 h-5 text-green-500" />
            ) : (
              <Activity className="w-5 h-5 text-primary" />
            )}
          </div>
          <div>
            <h3 className="font-semibold">{device.device_name}</h3>
            <p className="text-xs text-muted-foreground">{device.device_type}</p>
          </div>
        </div>
        <Badge variant={isOnline ? 'default' : 'secondary'}>
          {isOnline ? 'Online' : 'Offline'}
        </Badge>
      </div>

      <div className="space-y-3">
        {device.is_verified && (
          <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
            <Shield className="w-4 h-4" />
            <span>Verified Hardware (2x Rewards)</span>
          </div>
        )}
        {!device.is_verified && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Activity className="w-4 h-4" />
            <span>Demo Mode</span>
          </div>
        )}

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span>Last seen {formatDistanceToNow(new Date(device.last_seen_at), { addSuffix: true })}</span>
        </div>

        {device.metadata?.location && (
          <div className="text-sm text-muted-foreground">
            📍 {device.metadata.location}
          </div>
        )}
      </div>
    </div>
  );
};

export default DeviceCard;
