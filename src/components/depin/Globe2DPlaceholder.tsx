import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Device {
  id: string;
  device_name: string;
  status: string;
  metadata?: {
    lat?: number;
    lng?: number;
  };
}

interface Globe2DPlaceholderProps {
  devices?: Device[];
  onDeviceClick?: (deviceId: string) => void;
  autoRotate?: boolean;
}

const Globe2DPlaceholder = ({ devices = [], onDeviceClick }: Globe2DPlaceholderProps) => {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation((prev) => (prev + 0.5) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Filter devices with valid coordinates
  const validDevices = devices.filter(
    (device) => device.metadata?.lat !== undefined && device.metadata?.lng !== undefined
  );

  return (
    <div className="w-full h-[500px] md:h-[600px] lg:h-[700px] bg-gradient-to-br from-primary/20 via-background to-secondary/20 rounded-lg relative overflow-hidden">
      {/* Animated background circles */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="absolute w-[400px] h-[400px] rounded-full border-2 border-primary/30"
          style={{ transform: `rotate(${rotation}deg)` }}
        />
        <div
          className="absolute w-[320px] h-[320px] rounded-full border-2 border-primary/20"
          style={{ transform: `rotate(${-rotation}deg)` }}
        />
        <div
          className="absolute w-[240px] h-[240px] rounded-full border-2 border-primary/10"
          style={{ transform: `rotate(${rotation * 1.5}deg)` }}
        />
        
        {/* Center globe representation */}
        <div className="relative w-[200px] h-[200px] rounded-full bg-gradient-to-br from-primary/40 to-secondary/40 shadow-2xl flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-4 border-primary/50 animate-pulse" />
          
          {/* Device markers on globe */}
          {validDevices.slice(0, 8).map((device, index) => {
            const angle = (index * 360) / 8 + rotation;
            const radius = 100;
            const x = Math.cos((angle * Math.PI) / 180) * radius;
            const y = Math.sin((angle * Math.PI) / 180) * radius * 0.5; // Flatten for 2D effect
            
            return (
              <div
                key={device.id}
                className="absolute w-3 h-3 bg-green-500 rounded-full cursor-pointer hover:scale-150 transition-transform shadow-lg"
                style={{
                  left: `calc(50% + ${x}px)`,
                  top: `calc(50% + ${y}px)`,
                  transform: 'translate(-50%, -50%)',
                  animation: `pulse 2s infinite ${index * 0.2}s`,
                }}
                onClick={() => onDeviceClick?.(device.id)}
              />
            );
          })}
          
          {/* Center content */}
          <div className="text-center z-10">
            <p className="text-4xl font-bold text-primary">{devices.length}</p>
            <p className="text-sm text-muted-foreground">Devices</p>
          </div>
        </div>
      </div>

      {/* Device list overlay */}
      {validDevices.length > 0 && (
        <div className="absolute top-4 right-4 max-w-xs space-y-2">
          <Card className="p-3 bg-background/80 backdrop-blur-sm border-primary/20">
            <h3 className="text-sm font-semibold mb-2">Active Devices</h3>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {validDevices.slice(0, 5).map((device) => (
                <div
                  key={device.id}
                  className="flex items-center justify-between text-xs cursor-pointer hover:bg-primary/10 p-1 rounded"
                  onClick={() => onDeviceClick?.(device.id)}
                >
                  <span className="truncate">{device.device_name}</span>
                  <Badge variant={device.status === 'online' ? 'default' : 'secondary'} className="ml-2 text-[10px] px-1">
                    {device.status}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Info note */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
        <p className="text-xs text-muted-foreground bg-background/60 backdrop-blur-sm px-3 py-1 rounded-full">
          🌍 Global Device Network
        </p>
      </div>
    </div>
  );
};

export default Globe2DPlaceholder;
