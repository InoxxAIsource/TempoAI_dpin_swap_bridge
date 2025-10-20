import { useState } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from '@/components/ui/alert-dialog';
import { Activity, Shield, Clock, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface DeviceCardProps {
  device: {
    id: string;
    device_id: string;
    device_name: string;
    device_type: string;
    status: string;
    is_verified: boolean;
    metadata: any;
    last_seen_at: string;
  };
  onDelete?: (deviceId: string) => Promise<void>;
}

const DeviceCard = ({ device, onDelete }: DeviceCardProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const isOnline = new Date().getTime() - new Date(device.last_seen_at).getTime() < 120000; // 2 min

  const handleDelete = async () => {
    if (onDelete) {
      setDeleting(true);
      await onDelete(device.id);
      setDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  return (
    <>
      <motion.div 
        className={`group relative border-2 rounded-xl md:rounded-2xl p-4 md:p-6 bg-card overflow-hidden ${
          device.is_verified 
            ? 'border-green-500/30' 
            : 'border-primary/30'
        }`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ 
          scale: 1.02,
          boxShadow: device.is_verified 
            ? '0 0 30px rgba(34, 197, 94, 0.3)' 
            : '0 0 30px hsl(var(--primary) / 0.3)',
        }}
        transition={{ duration: 0.3 }}
      >
        {/* Holographic border effect */}
        <motion.div
          className="absolute inset-0 rounded-xl md:rounded-2xl pointer-events-none"
          style={{
            background: `linear-gradient(90deg, transparent, ${device.is_verified ? 'rgba(34, 197, 94, 0.1)' : 'hsl(var(--primary) / 0.1)'}, transparent)`,
          }}
          animate={{
            x: ['-100%', '200%'],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear"
          }}
        />

        {/* Scanning line animation */}
        <motion.div
          className="absolute left-0 right-0 h-[2px] pointer-events-none"
          style={{
            background: `linear-gradient(90deg, transparent, ${device.is_verified ? 'rgba(34, 197, 94, 0.6)' : 'hsl(var(--primary) / 0.6)'}, transparent)`,
            filter: 'blur(2px)',
          }}
          animate={{
            y: [-10, 300],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Corner accents */}
        <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-primary/40" />
        <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-primary/40" />
        <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-primary/40" />
        <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-primary/40" />
        {onDelete && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="w-4 h-4 text-destructive" />
          </Button>
        )}

        <div className="flex items-start justify-between mb-3 md:mb-4 relative z-10">
          <div className="flex items-center gap-2 md:gap-3">
          <motion.div 
            className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center relative ${
              device.is_verified ? 'bg-green-500/10' : 'bg-primary/10'
            }`}
            animate={{
              boxShadow: isOnline 
                ? device.is_verified
                  ? ['0 0 10px rgba(34, 197, 94, 0.3)', '0 0 20px rgba(34, 197, 94, 0.6)', '0 0 10px rgba(34, 197, 94, 0.3)']
                  : ['0 0 10px hsl(var(--primary) / 0.3)', '0 0 20px hsl(var(--primary) / 0.6)', '0 0 10px hsl(var(--primary) / 0.3)']
                : undefined
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {/* Energy pulse background */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                background: `radial-gradient(circle, ${device.is_verified ? 'rgba(34, 197, 94, 0.3)' : 'hsl(var(--primary) / 0.3)'} 0%, transparent 70%)`,
              }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 0, 0.5]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            <motion.div
              animate={{
                rotate: device.is_verified ? 0 : 360
              }}
              transition={{
                duration: device.is_verified ? 0 : 3,
                repeat: device.is_verified ? 0 : Infinity,
                ease: "linear"
              }}
            >
              {device.is_verified ? (
                <Shield className="w-5 h-5 md:w-6 md:h-6 text-green-500 relative z-10" />
              ) : (
                <Activity className="w-5 h-5 md:w-6 md:h-6 text-primary relative z-10" />
              )}
            </motion.div>
            
            {isOnline && (
              <motion.span 
                className="absolute -top-0.5 -right-0.5 md:-top-1 md:-right-1 w-2.5 h-2.5 md:w-3 md:h-3 bg-green-500 rounded-full"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [1, 0.5, 1]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            )}
          </motion.div>
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

      <div className="space-y-3 relative z-10">
        {device.is_verified ? (
          <div className="flex items-center gap-2 text-sm font-medium text-green-600 dark:text-green-400 bg-green-500/10 px-3 py-2 rounded-lg">
            <Shield className="w-4 h-4" />
            <span>Verified Hardware • 2x Rewards</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-3 py-2 rounded-lg">
            <Activity className="w-4 h-4" />
            <span>Demo Mode • Signed Payloads</span>
          </div>
        )}
        
        {device.metadata?.private_key && (
          <div className="text-xs text-muted-foreground bg-muted/30 px-3 py-1.5 rounded-md flex items-center gap-1.5">
            🔐 Ed25519 signatures enabled
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
      </motion.div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Device?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{device.device_name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default DeviceCard;
