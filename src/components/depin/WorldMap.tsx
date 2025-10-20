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
    <div className="relative w-full h-[500px] bg-gradient-to-br from-primary/5 via-background to-primary/10 rounded-3xl border-2 border-primary/20 overflow-hidden">
      {/* Animated corner brackets - HUD style */}
      <div className="absolute top-0 left-0 w-16 h-16 border-l-2 border-t-2 border-primary/50" />
      <div className="absolute top-0 right-0 w-16 h-16 border-r-2 border-t-2 border-primary/50" />
      <div className="absolute bottom-0 left-0 w-16 h-16 border-l-2 border-b-2 border-primary/50" />
      <div className="absolute bottom-0 right-0 w-16 h-16 border-r-2 border-b-2 border-primary/50" />

      {/* Holographic scanline effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, transparent 0%, hsl(var(--primary) / 0.1) 50%, transparent 100%)',
          height: '100px',
        }}
        animate={{
          y: [-100, 600],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      {/* Enhanced World Map Background */}
      <svg 
        viewBox="0 0 100 60" 
        className="w-full h-full absolute inset-0"
        style={{ opacity: 0.25 }}
      >
        <defs>
          <linearGradient id="mapGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        
        {/* North America */}
        <path 
          d="M 10 15 L 15 10 L 25 12 L 30 8 L 35 10 L 38 15 L 40 25 L 35 35 L 30 40 L 25 45 L 20 48 L 15 45 L 12 35 L 10 25 Z" 
          fill="url(#mapGradient)"
          stroke="hsl(var(--primary))"
          strokeWidth="0.2"
        />
        {/* Europe */}
        <path 
          d="M 45 20 L 50 18 L 55 20 L 57 25 L 55 30 L 50 32 L 45 30 L 43 25 Z" 
          fill="url(#mapGradient)"
          stroke="hsl(var(--primary))"
          strokeWidth="0.2"
        />
        {/* Asia */}
        <path 
          d="M 58 18 L 65 15 L 75 18 L 82 22 L 85 28 L 82 35 L 75 40 L 70 42 L 65 40 L 60 35 L 58 28 Z" 
          fill="url(#mapGradient)"
          stroke="hsl(var(--primary))"
          strokeWidth="0.2"
        />
        {/* South America */}
        <path 
          d="M 28 48 L 32 45 L 35 48 L 36 53 L 33 57 L 30 55 L 28 52 Z" 
          fill="url(#mapGradient)"
          stroke="hsl(var(--primary))"
          strokeWidth="0.2"
        />
        {/* Africa */}
        <path 
          d="M 48 35 L 52 32 L 55 35 L 56 42 L 53 48 L 48 50 L 45 47 L 44 40 Z" 
          fill="url(#mapGradient)"
          stroke="hsl(var(--primary))"
          strokeWidth="0.2"
        />
        {/* Australia */}
        <path 
          d="M 75 45 L 80 43 L 85 45 L 86 50 L 82 52 L 77 50 L 75 48 Z" 
          fill="url(#mapGradient)"
          stroke="hsl(var(--primary))"
          strokeWidth="0.2"
        />
      </svg>

      {/* Animated tech grid overlay */}
      <motion.div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
        animate={{
          backgroundPosition: ['0px 0px', '40px 40px']
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      {/* Floating particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute w-1 h-1 bg-primary/30 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.3, 0.8, 0.3],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}

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
                  {/* Multiple pulsing rings */}
                  <motion.div
                    className={`absolute rounded-full ${
                      isVerified ? 'bg-green-500' : 'bg-primary'
                    }`}
                    style={{
                      width: '40px',
                      height: '40px',
                      transform: 'translate(-50%, -50%)',
                      left: '50%',
                      top: '50%'
                    }}
                    animate={{
                      scale: [1, 3, 3],
                      opacity: [0.6, 0, 0]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeOut"
                    }}
                  />
                  
                  <motion.div
                    className={`absolute rounded-full ${
                      isVerified ? 'bg-green-500' : 'bg-primary'
                    }`}
                    style={{
                      width: '40px',
                      height: '40px',
                      transform: 'translate(-50%, -50%)',
                      left: '50%',
                      top: '50%'
                    }}
                    animate={{
                      scale: [1, 2.5, 2.5],
                      opacity: [0.4, 0, 0]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeOut",
                      delay: 0.5
                    }}
                  />

                  {/* Holographic glow */}
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{
                      width: '50px',
                      height: '50px',
                      transform: 'translate(-50%, -50%)',
                      left: '50%',
                      top: '50%',
                      background: `radial-gradient(circle, ${isVerified ? 'rgba(34, 197, 94, 0.3)' : 'hsl(var(--primary) / 0.3)'} 0%, transparent 70%)`,
                      filter: 'blur(8px)',
                    }}
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [0.5, 0.8, 0.5]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  
                  {/* Main pin with energy effect */}
                  <motion.div
                    className={`relative rounded-full ${
                      isVerified 
                        ? 'bg-gradient-to-br from-green-400 to-green-600' 
                        : 'bg-gradient-to-br from-primary/90 to-primary'
                    } flex items-center justify-center border-2 border-white/30`}
                    style={{
                      width: isVerified ? '36px' : '32px',
                      height: isVerified ? '36px' : '32px',
                      boxShadow: `0 0 20px ${isVerified ? 'rgba(34, 197, 94, 0.6)' : 'hsl(var(--primary) / 0.6)'}`,
                    }}
                    animate={{
                      boxShadow: isOnline 
                        ? isVerified
                          ? ['0 0 20px rgba(34, 197, 94, 0.6)', '0 0 40px rgba(34, 197, 94, 1)', '0 0 20px rgba(34, 197, 94, 0.6)']
                          : ['0 0 20px hsl(var(--primary) / 0.6)', '0 0 40px hsl(var(--primary) / 1)', '0 0 20px hsl(var(--primary) / 0.6)']
                        : undefined
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    {/* Inner shimmer effect */}
                    <motion.div
                      className="absolute inset-0 rounded-full overflow-hidden"
                      animate={{
                        rotate: [0, 360]
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent" style={{
                        transform: 'translateX(-100%)',
                      }} />
                    </motion.div>

                    {isVerified ? (
                      <Shield className="w-5 h-5 text-white relative z-10" />
                    ) : (
                      <MapPin className="w-5 h-5 text-white relative z-10" />
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

      {/* Enhanced connection lines with data flow */}
      <svg className="absolute inset-0 pointer-events-none">
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.2" />
            <stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity="0.8" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        
        {devices
          .filter(d => d.is_verified)
          .map((device, index, verifiedDevices) => {
            if (index === verifiedDevices.length - 1) return null;
            
            const nextDevice = verifiedDevices[index + 1];
            const coords1 = LOCATION_COORDS[device.metadata?.location];
            const coords2 = LOCATION_COORDS[nextDevice.metadata?.location];
            
            if (!coords1 || !coords2) return null;
            
            return (
              <g key={`${device.device_id}-${nextDevice.device_id}`}>
                {/* Base connection line */}
                <motion.line
                  x1={`${coords1.x}%`}
                  y1={`${coords1.y}%`}
                  x2={`${coords2.x}%`}
                  y2={`${coords2.y}%`}
                  stroke="url(#lineGradient)"
                  strokeWidth="2"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2, delay: 0.5 }}
                />
                
                {/* Animated data packets */}
                <motion.circle
                  r="2"
                  fill="hsl(var(--primary))"
                  filter="blur(1px)"
                  animate={{
                    cx: [`${coords1.x}%`, `${coords2.x}%`],
                    cy: [`${coords1.y}%`, `${coords2.y}%`],
                    opacity: [0, 1, 1, 0]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: index * 0.3,
                    ease: "easeInOut"
                  }}
                />
              </g>
            );
          })}
      </svg>
    </div>
  );
};

export default WorldMap;
