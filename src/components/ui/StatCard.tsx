import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
}

const StatCard = ({ icon: Icon, label, value, change, changeType = 'neutral' }: StatCardProps) => {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    setDisplayValue(value);
  }, [value]);

  return (
    <motion.div 
      className="relative border-2 border-primary/20 rounded-xl md:rounded-2xl p-4 md:p-6 lg:p-8 bg-card overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ 
        scale: 1.03,
        borderColor: 'hsl(var(--primary) / 0.5)',
        boxShadow: '0 0 30px hsl(var(--primary) / 0.2)',
      }}
      transition={{ duration: 0.3 }}
    >
      {/* Holographic background effect */}
      <motion.div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 0%, hsl(var(--primary) / 0.2) 0%, transparent 60%)',
        }}
        animate={{
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Animated corner brackets */}
      <div className="absolute top-2 left-2 w-3 h-3 border-l-2 border-t-2 border-primary/50" />
      <div className="absolute top-2 right-2 w-3 h-3 border-r-2 border-t-2 border-primary/50" />
      <div className="absolute bottom-2 left-2 w-3 h-3 border-l-2 border-b-2 border-primary/50" />
      <div className="absolute bottom-2 right-2 w-3 h-3 border-r-2 border-b-2 border-primary/50" />

      {/* Scanning line */}
      <motion.div
        className="absolute left-0 right-0 h-[1px]"
        style={{
          background: 'linear-gradient(90deg, transparent, hsl(var(--primary) / 0.5), transparent)',
          filter: 'blur(1px)',
        }}
        animate={{
          y: [-10, 200],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      <div className="relative z-10">
        <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
          <motion.div 
            className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary/10 flex items-center justify-center relative"
            animate={{
              boxShadow: ['0 0 10px hsl(var(--primary) / 0.3)', '0 0 20px hsl(var(--primary) / 0.6)', '0 0 10px hsl(var(--primary) / 0.3)'],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            {/* Rotating glow */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                background: 'conic-gradient(from 0deg, transparent 0%, hsl(var(--primary) / 0.3) 50%, transparent 100%)',
              }}
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear"
              }}
            />
            
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Icon className="w-4 h-4 md:w-5 md:h-5 text-primary relative z-10" />
            </motion.div>
          </motion.div>
          <span className="text-xs md:text-sm text-muted-foreground font-medium">{label}</span>
        </div>
        
        <motion.div 
          className="text-2xl md:text-3xl lg:text-4xl font-bold mb-1 md:mb-2"
          key={displayValue}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {displayValue}
        </motion.div>
        
        {change && (
          <motion.div 
            className={`text-sm font-medium ${
              changeType === 'positive' ? 'text-green-600 dark:text-green-400' :
              changeType === 'negative' ? 'text-red-600 dark:text-red-400' :
              'text-muted-foreground'
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {change}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default StatCard;
