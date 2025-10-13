import { useState } from 'react';
import { HelpCircle, X, ExternalLink, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const FloatingHelpButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  const quickTips = [
    {
      title: 'Demo vs Verified',
      description: 'Demo devices earn 1x rewards, verified hardware earns 2x!',
    },
    {
      title: 'Real-time Updates',
      description: 'Device metrics update automatically every 30 seconds',
    },
    {
      title: 'Bridge Rewards',
      description: 'Use Portfolio or Bridge page to move rewards cross-chain',
    },
    {
      title: 'Verification Process',
      description: 'Connect Raspberry Pi with cryptographic keys for verification',
    },
  ];

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          size="lg"
          className="rounded-full w-14 h-14 shadow-lg hover:scale-110 transition-transform"
        >
          {isOpen ? <X className="w-6 h-6" /> : <HelpCircle className="w-6 h-6" />}
        </Button>
      </div>

      {/* Help Panel */}
      {isOpen && (
        <Card className="fixed bottom-24 right-6 z-50 w-80 shadow-xl border-2 border-primary/20">
          <div className="p-4">
            <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-primary" />
              Quick Help
            </h3>
            
            <div className="space-y-3 mb-4">
              {quickTips.map((tip, index) => (
                <div key={index} className="p-3 bg-muted/50 rounded-lg">
                  <h4 className="font-semibold text-sm mb-1">{tip.title}</h4>
                  <p className="text-xs text-muted-foreground">{tip.description}</p>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <Button variant="outline" className="w-full gap-2 justify-start" size="sm" asChild>
                <a href="/depin-docs" target="_blank">
                  <ExternalLink className="w-4 h-4" />
                  Full Documentation
                </a>
              </Button>
              <Button variant="outline" className="w-full gap-2 justify-start" size="sm" asChild>
                <a href="https://discord.gg/tempo" target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="w-4 h-4" />
                  Join Discord Community
                </a>
              </Button>
            </div>
          </div>
        </Card>
      )}
    </>
  );
};

export default FloatingHelpButton;
