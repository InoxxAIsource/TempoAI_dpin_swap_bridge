import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Activity, Clock, TrendingUp, Zap } from 'lucide-react';

interface DeviceDetailsModalProps {
  deviceId: string | null;
  open: boolean;
  onClose: () => void;
}

interface DeviceDetails {
  device_name: string;
  status: string;
  device_type: string;
  last_seen_at: string;
  is_verified: boolean;
  totalEarnings: number;
  eventsCount: number;
  avgEarningsPerEvent: number;
  uptime: number;
}

const DeviceDetailsModal = ({ deviceId, open, onClose }: DeviceDetailsModalProps) => {
  const [details, setDetails] = useState<DeviceDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (deviceId && open) {
      fetchDeviceDetails();
    }
  }, [deviceId, open]);

  const fetchDeviceDetails = async () => {
    if (!deviceId) return;

    setLoading(true);
    try {
      // Fetch device info
      const { data: device, error: deviceError } = await supabase
        .from('device_registry')
        .select('*')
        .eq('id', deviceId)
        .single();

      if (deviceError) throw deviceError;

      // Fetch device events for earnings
      const { data: events, error: eventsError } = await supabase
        .from('device_events')
        .select('reward_amount')
        .eq('device_id', device.device_id);

      if (eventsError) throw eventsError;

      const totalEarnings = events?.reduce((acc, event) => acc + (event.reward_amount || 0), 0) || 0;
      const eventsCount = events?.length || 0;
      const avgEarningsPerEvent = eventsCount > 0 ? totalEarnings / eventsCount : 0;

      // Calculate uptime (simplified)
      const uptime = device.status === 'active' ? 98.5 : 0;

      setDetails({
        device_name: device.device_name,
        status: device.status,
        device_type: device.device_type,
        last_seen_at: device.last_seen_at,
        is_verified: device.is_verified,
        totalEarnings,
        eventsCount,
        avgEarningsPerEvent,
        uptime,
      });
    } catch (error) {
      console.error('Error fetching device details:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {loading ? (
              <Skeleton className="h-6 w-48" />
            ) : (
              <>
                {details?.device_name}
                <Badge variant={details?.is_verified ? 'default' : 'secondary'}>
                  {details?.is_verified ? 'Verified' : 'Unverified'}
                </Badge>
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {loading ? (
              <Skeleton className="h-4 w-32" />
            ) : (
              `Type: ${details?.device_type}`
            )}
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : (
          <div className="space-y-4">
            {/* Earnings Stats */}
            <Card className="p-4 bg-gradient-to-br from-primary/10 to-secondary/10">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-primary/20 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Earnings</p>
                  <p className="text-2xl font-bold">{details?.totalEarnings.toFixed(6)} ETH</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Events</p>
                  <p className="font-semibold">{details?.eventsCount}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Avg/Event</p>
                  <p className="font-semibold">{details?.avgEarningsPerEvent.toFixed(6)} ETH</p>
                </div>
              </div>
            </Card>

            {/* Status & Uptime */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm font-medium">Status</p>
                </div>
                <Badge
                  variant={details?.status === 'active' ? 'default' : 'secondary'}
                  className="text-lg px-3 py-1"
                >
                  {details?.status}
                </Badge>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm font-medium">Uptime</p>
                </div>
                <p className="text-2xl font-bold text-green-500">{details?.uptime}%</p>
              </Card>
            </div>

            {/* Last Seen */}
            <Card className="p-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Last Seen</p>
                  <p className="text-sm text-muted-foreground">
                    {details?.last_seen_at
                      ? new Date(details.last_seen_at).toLocaleString()
                      : 'Never'}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DeviceDetailsModal;
