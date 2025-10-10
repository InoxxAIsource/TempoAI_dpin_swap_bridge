import { Search, Wallet, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const ClaimGuideSection = () => {
  const steps = [
    {
      icon: Search,
      title: "Check Status",
      description: "Wait for transfer to be ready",
      color: "from-blue-500/20 to-blue-500/5",
      borderColor: "border-blue-500/20",
      iconColor: "text-blue-500"
    },
    {
      icon: Wallet,
      title: "Have Gas",
      description: "Ensure destination chain has gas",
      color: "from-purple-500/20 to-purple-500/5",
      borderColor: "border-purple-500/20",
      iconColor: "text-purple-500"
    },
    {
      icon: Sparkles,
      title: "Claim Tokens",
      description: "Click claim on WormholeScan",
      color: "from-primary/20 to-primary/5",
      borderColor: "border-primary/20",
      iconColor: "text-primary"
    }
  ];

  return (
    <section className="px-6 md:px-12 py-20 bg-gradient-to-b from-secondary/20 to-transparent">
      <div className="max-w-5xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Simple 3-Step Process</h2>
          <p className="text-lg text-muted-foreground">Everything you need to claim your tokens</p>
        </motion.div>
        
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="group"
            >
              <div className={`h-full p-8 rounded-2xl bg-gradient-to-br ${step.color} backdrop-blur-sm border ${step.borderColor} shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2`}>
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${step.color} border ${step.borderColor} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <step.icon className={`w-10 h-10 ${step.iconColor}`} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Visual Timeline */}
        <motion.div 
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5 }}
          className="flex items-center justify-center gap-4 mb-8"
        >
          <div className="flex-1 h-1 bg-gradient-to-r from-blue-500/50 to-purple-500/50 rounded-full" />
          <div className="flex-1 h-1 bg-gradient-to-r from-purple-500/50 to-primary/50 rounded-full" />
        </motion.div>
        
        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center text-muted-foreground text-sm"
        >
          Wait for ready → Fund wallet → Click claim
        </motion.p>
      </div>
    </section>
  );
};

export default ClaimGuideSection;
