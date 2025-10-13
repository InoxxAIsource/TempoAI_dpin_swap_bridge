import { motion } from 'framer-motion';
import { useState } from 'react';
import { Shield, Activity, MapPin } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface Device {
  id: string;
  device_id: string;
  device_name: string;
  device_type: string;
  status: string;
  is_verified: boolean;
  metadata: any;
  last_seen_at: string;
}

interface WorldMapProps {
  devices: Device[];
  onDeviceClick?: (deviceId: string) => void;
}

const LOCATION_COORDS: Record<string, { x: number; y: number }> = {
  'California': { x: 15, y: 38 },
  'Texas': { x: 25, y: 45 },
  'Florida': { x: 35, y: 48 },
  'Arizona': { x: 18, y: 42 },
  'Nevada': { x: 12, y: 38 }
};

const WorldMap = ({ devices, onDeviceClick }: WorldMapProps) => {
  const [hoveredDevice, setHoveredDevice] = useState<string | null>(null);

  const getIsOnline = (lastSeenAt: string) => {
    return new Date().getTime() - new Date(lastSeenAt).getTime() < 120000; // 2 min
  };

  return (
    <div className="relative w-full h-[500px] bg-gradient-to-br from-primary/5 via-background to-secondary/10 rounded-3xl border border-border overflow-hidden">
      {/* World Map Background - Simplified SVG */}
      <svg 
        viewBox="0 0 100 60" 
        className="w-full h-full"
        style={{ filter: 'opacity(0.15)' }}
      >
        {/* North America */}
        <path 
          d="M 10 15 L 15 10 L 25 12 L 30 8 L 35 10 L 38 15 L 40 25 L 35 35 L 30 40 L 25 45 L 20 48 L 15 45 L 12 35 L 10 25 Z" 
          fill="currentColor" 
          className="text-muted"
        />
        {/* Europe */}
        <path 
          d="M 45 20 L 50 18 L 55 20 L 57 25 L 55 30 L 50 32 L 45 30 L 43 25 Z" 
          fill="currentColor" 
          className="text-muted"
        />
        {/* Asia */}
        <path 
          d="M 58 18 L 65 15 L 75 18 L 82 22 L 85 28 L 82 35 L 75 40 L 70 42 L 65 40 L 60 35 L 58 28 Z" 
          fill="currentColor" 
          className="text-muted"
        />
        {/* South America */}
        <path 
          d="M 28 48 L 32 45 L 35 48 L 36 53 L 33 57 L 30 55 L 28 52 Z" 
          fill="currentColor" 
          className="text-muted"
        />
        {/* Africa */}
        <path 
          d="M 48 35 L 52 32 L 55 35 L 56 42 L 53 48 L 48 50 L 45 47 L 44 40 Z" 
          fill="currentColor" 
          className="text-muted"
        />
        {/* Australia */}
        <path 
          d="M 75 45 L 80 43 L 85 45 L 86 50 L 82 52 L 77 50 L 75 48 Z" 
          fill="currentColor" 
          className="text-muted"
        />
      </svg>

      {/* Grid overlay */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: 'linear-gradient(hsl(var(--border)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)',
        backgroundSize: '20px 20px'
      }} />

      {/* Device Pins with Tooltips */}
      <TooltipProvider delayDuration={200}>
        {devices.map((device, index) => {
          const location = device.metadata?.location;
          const coords = LOCATION_COORDS[location];
          if (!coords) return null;

          const isOnline = getIsOnline(device.last_seen_at);
          const isVerified = device.is_verified;

          return (
            <Tooltip key={device.device_id}>
              <TooltipTrigger asChild>
                <motion.div
                  className={`absolute cursor-pointer`}
                  style={{
                    left: `${coords.x}%`,
                    top: `${coords.y}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ 
                    scale: hoveredDevice === device.device_id ? 1.3 : 1,
                    opacity: 1
                  }}
                  transition={{ 
                    delay: index * 0.15,
                    duration: 0.4,
                    type: "spring",
                    stiffness: 200
                  }}
                  whileHover={{ scale: 1.3 }}
                  onHoverStart={() => setHoveredDevice(device.device_id)}
                  onHoverEnd={() => setHoveredDevice(null)}
                  onClick={() => onDeviceClick?.(device.device_id)}
                >
                  {/* Outer pulsing ring */}
                  <motion.div
                    className={`absolute inset-0 rounded-full ${
                      isVerified ? 'bg-green-500' : 'bg-blue-500'
                    }`}
                    style={{
                      width: isVerified ? '28px' : '24px',
                      height: isVerified ? '28px' : '24px',
                      transform: 'translate(-50%, -50%)',
                      left: '50%',
                      top: '50%'
                    }}
                    animate={{
                      scale: [1, 2.5, 2.5],
                      opacity: [0.6, 0, 0]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeOut"
                    }}
                  />
                  
                  {/* Main pin */}
                  <motion.div
                    className={`relative rounded-full ${
                      isVerified 
                        ? 'bg-green-500 shadow-lg shadow-green-500/50' 
                        : 'bg-blue-500 shadow-lg shadow-blue-500/50'
                    } flex items-center justify-center`}
                    style={{
                      width: isVerified ? '28px' : '24px',
                      height: isVerified ? '28px' : '24px',
                    }}
                    animate={{
                      boxShadow: isOnline 
                        ? isVerified
                          ? ['0 0 20px rgba(34, 197, 94, 0.5)', '0 0 30px rgba(34, 197, 94, 0.8)', '0 0 20px rgba(34, 197, 94, 0.5)']
                          : ['0 0 20px rgba(59, 130, 246, 0.5)', '0 0 30px rgba(59, 130, 246, 0.8)', '0 0 20px rgba(59, 130, 246, 0.5)']
                        : undefined
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    {isVerified ? (
                      <Shield className="w-3.5 h-3.5 text-white" />
                    ) : (
                      <MapPin className="w-3.5 h-3.5 text-white" />
                    )}
                  </motion.div>
                </motion.div>
              </TooltipTrigger>
              
              <TooltipContent 
                side="top" 
                className="w-64 p-4 bg-card/95 backdrop-blur-sm border-border"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {isVerified ? (
                        <Shield className="w-4 h-4 text-green-500" />
                      ) : (
                        <Activity className="w-4 h-4 text-blue-500" />
                      )}
                      <span className="font-semibold">{device.device_name}</span>
                    </div>
                    <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-muted'}`} />
                  </div>
                  
                  <p className="text-xs text-muted-foreground capitalize">
                    {device.device_type.replace('_', ' ')}
                  </p>
                  
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    <span>{location}</span>
                  </div>
                  
                  {device.metadata?.capacity_kw && (
                    <div className="text-xs text-muted-foreground">
                      Capacity: {device.metadata.capacity_kw} kW
                    </div>
                  )}
                  
                  {isVerified ? (
                    <div className="text-xs font-medium text-green-600 dark:text-green-400 bg-green-500/10 px-2 py-1 rounded">
                      ✓ Verified • 2x Rewards
                    </div>
                  ) : (
                    <div className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded">
                      Demo Mode
                    </div>
                  )}
                  
                  <div className="text-xs text-muted-foreground pt-1 border-t border-border">
                    Status: {isOnline ? 'Online' : 'Offline'}
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </TooltipProvider>

      {/* Connection lines between verified devices */}
      <svg className="absolute inset-0 pointer-events-none">
        {devices
          .filter(d => d.is_verified)
          .map((device, index, verifiedDevices) => {
            if (index === verifiedDevices.length - 1) return null;
            
            const nextDevice = verifiedDevices[index + 1];
            const coords1 = LOCATION_COORDS[device.metadata?.location];
            const coords2 = LOCATION_COORDS[nextDevice.metadata?.location];
            
            if (!coords1 || !coords2) return null;
            
            return (
              <motion.line
                key={`${device.device_id}-${nextDevice.device_id}`}
                x1={`${coords1.x}%`}
                y1={`${coords1.y}%`}
                x2={`${coords2.x}%`}
                y2={`${coords2.y}%`}
                stroke="hsl(var(--primary))"
                strokeWidth="1"
                strokeDasharray="4 4"
                opacity="0.3"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, delay: 0.5 }}
              />
            );
          })}
      </svg>
    </div>
  );
};

export default WorldMap;
