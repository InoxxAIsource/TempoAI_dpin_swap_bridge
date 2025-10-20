import { Card } from '@/components/ui/card';
import { Activity, Shield, Database, DollarSign, Globe2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const ProcessFlowSection = () => {
  const steps = [
    {
      icon: Activity,
      title: 'Device Reports',
      description: 'IoT device collects metrics',
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      icon: Shield,
      title: 'Sign Metrics',
      description: 'Cryptographic signature',
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
    {
      icon: Database,
      title: 'Backend Verifies',
      description: 'Validate authenticity',
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      icon: DollarSign,
      title: 'Calculate Reward',
      description: 'Apply multipliers',
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
    },
    {
      icon: Database,
      title: 'Store in DB',
      description: 'Record transaction',
      color: 'text-red-500',
      bgColor: 'bg-red-500/10',
    },
    {
      icon: Globe2,
      title: 'Bridge Cross-Chain',
      description: 'Wormhole transfer',
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-500/10',
    },
  ];

  return (
    <Card className="p-6 mb-8">
      <h3 className="text-2xl font-bold mb-6">DePIN Data Flow</h3>
      
      <div className="grid md:grid-cols-6 gap-4">
        {steps.map((step, index) => (
          <motion.div 
            key={index} 
            className="relative group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.5, 
              delay: index * 0.1,
              ease: "easeOut"
            }}
          >
            <div className="flex flex-col items-center text-center">
              <motion.div 
                className={`w-16 h-16 rounded-full ${step.bgColor} flex items-center justify-center mb-3 relative overflow-hidden`}
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
              >
                {/* Animated glow effect */}
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: `radial-gradient(circle, ${step.color.replace('text-', 'hsl(var(--')}20) 0%, transparent 70%)`,
                  }}
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0.8, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                
                {/* Icon with pulse animation */}
                <motion.div
                  animate={{
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: index * 0.2
                  }}
                >
                  <step.icon className={`w-8 h-8 ${step.color} relative z-10 drop-shadow-lg`} />
                </motion.div>

                {/* Shimmer effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  initial={{ x: '-100%' }}
                  animate={{ x: '200%' }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 3,
                    ease: "easeInOut"
                  }}
                />
              </motion.div>
              
              <motion.h4 
                className="font-semibold text-sm mb-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 + 0.2 }}
              >
                {step.title}
              </motion.h4>
              
              <motion.p 
                className="text-xs text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 + 0.3 }}
              >
                {step.description}
              </motion.p>
            </div>
            
            {index < steps.length - 1 && (
              <motion.div 
                className="hidden md:block absolute top-8 -right-2 transform"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 + 0.4 }}
              >
                <motion.div
                  animate={{
                    x: [0, 3, 0],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <ArrowRight className={`w-4 h-4 ${step.color}`} />
                </motion.div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-muted/50 rounded-lg">
        <h4 className="font-semibold mb-2 text-sm">How Rewards are Calculated:</h4>
        <div className="text-sm text-muted-foreground space-y-1">
          <p>• Base rate: <strong className="text-foreground">$0.05 per kWh</strong> of energy produced</p>
          <p>• Verified devices: <strong className="text-green-600 dark:text-green-400">2x multiplier</strong></p>
          <p>• Demo devices: <strong className="text-blue-600 dark:text-blue-400">1x multiplier</strong></p>
          <p>• Uptime bonus: Additional rewards for 99%+ uptime</p>
        </div>
      </div>
    </Card>
  );
};

export default ProcessFlowSection;
