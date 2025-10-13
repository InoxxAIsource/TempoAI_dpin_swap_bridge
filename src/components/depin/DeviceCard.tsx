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
    <div className={`border-2 rounded-xl md:rounded-2xl p-4 md:p-6 bg-card hover:shadow-lg transition-all duration-300 ${
      device.is_verified 
        ? 'border-green-500/30 hover:border-green-500/50' 
        : 'border-blue-500/30 hover:border-blue-500/50'
    }`}>
      <div className="flex items-start justify-between mb-3 md:mb-4">
        <div className="flex items-center gap-2 md:gap-3">
          <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center relative ${
            device.is_verified ? 'bg-green-500/10' : 'bg-blue-500/10'
          }`}>
            {device.is_verified ? (
              <Shield className="w-5 h-5 md:w-6 md:h-6 text-green-500" />
            ) : (
              <Activity className="w-5 h-5 md:w-6 md:h-6 text-blue-500" />
            )}
            {isOnline && (
              <span className="absolute -top-0.5 -right-0.5 md:-top-1 md:-right-1 w-2.5 h-2.5 md:w-3 md:h-3 bg-green-500 rounded-full animate-pulse" />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-base md:text-lg">{device.device_name}</h3>
            <p className="text-[10px] md:text-xs text-muted-foreground capitalize">
              {device.device_type.replace('_', ' ')}
            </p>
          </div>
        </div>
        <Badge 
          variant={isOnline ? 'default' : 'secondary'}
          className={isOnline ? 'bg-green-500 hover:bg-green-600' : ''}
        >
          {isOnline ? 'Online' : 'Offline'}
        </Badge>
      </div>

      <div className="space-y-3">
        {device.is_verified ? (
          <div className="flex items-center gap-2 text-sm font-medium text-green-600 dark:text-green-400 bg-green-500/10 px-3 py-2 rounded-lg">
            <Shield className="w-4 h-4" />
            <span>Verified Hardware • 2x Rewards</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-3 py-2 rounded-lg">
            <Activity className="w-4 h-4" />
            <span>Demo Mode</span>
          </div>
        )}

        {device.metadata?.capacity_kw && (
          <div className="text-sm text-muted-foreground">
            ⚡ Capacity: {device.metadata.capacity_kw} kW
          </div>
        )}

        {device.metadata?.location && (
          <div className="text-sm text-muted-foreground">
            📍 {device.metadata.location}
          </div>
        )}

        <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t border-border">
          <Clock className="w-3.5 h-3.5" />
          <span>Last seen {formatDistanceToNow(new Date(device.last_seen_at), { addSuffix: true })}</span>
        </div>
      </div>
    </div>
  );
};

export default DeviceCard;
