import { Card } from '@/components/ui/card';
import CompleteFlowDiagram from '@/components/depin/CompleteFlowDiagram';
import DePINTimeline from '@/components/depin/DePINTimeline';
import { Book, TrendingUp } from 'lucide-react';

const DePINGettingStarted = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-4">DePIN - Getting Started</h1>
        <p className="text-xl text-muted-foreground">
          Decentralized Physical Infrastructure Networks (DePIN) enable you to earn passive income 
          from physical hardware like solar panels, sensors, and IoT devices.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6 bg-primary/5 border-primary/20">
          <Book className="w-8 h-8 text-primary mb-4" />
          <h3 className="text-xl font-bold mb-2">What is DePIN?</h3>
          <p className="text-muted-foreground">
            DePIN stands for Decentralized Physical Infrastructure Networks. It's a new paradigm 
            where individuals own and operate physical infrastructure, earning rewards for 
            contributing to the network.
          </p>
        </Card>
        <Card className="p-6 bg-purple-500/5 border-purple-500/20">
          <TrendingUp className="w-8 h-8 text-purple-400 mb-4" />
          <h3 className="text-xl font-bold mb-2">Why Participate?</h3>
          <p className="text-muted-foreground">
            Turn idle hardware into income streams ($2-10+/month per device), contribute to decentralized 
            infrastructure, and access cross-chain DeFi opportunities.
          </p>
        </Card>
      </div>

      <CompleteFlowDiagram />
      
      <DePINTimeline />

      <Card className="p-8 bg-gradient-to-r from-green-500/10 to-blue-500/10 border-green-500/20">
        <h3 className="text-2xl font-bold mb-4">5-Minute Quick Start</h3>
        <ol className="space-y-4">
          <li className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center font-bold">
              1
            </div>
            <div>
              <div className="font-semibold mb-1">Visit the DePIN Dashboard</div>
              <div className="text-sm text-muted-foreground">Navigate to /depin to see your overview</div>
            </div>
          </li>
          <li className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center font-bold">
              2
            </div>
            <div>
              <div className="font-semibold mb-1">Choose Demo or Real Hardware</div>
              <div className="text-sm text-muted-foreground">Start with demo mode to explore, or connect real devices</div>
            </div>
          </li>
          <li className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center font-bold">
              3
            </div>
            <div>
              <div className="font-semibold mb-1">Watch Metrics Appear</div>
              <div className="text-sm text-muted-foreground">See your devices reporting and earnings accumulating</div>
            </div>
          </li>
          <li className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center font-bold">
              4
            </div>
            <div>
              <div className="font-semibold mb-1">Bridge Your Rewards</div>
              <div className="text-sm text-muted-foreground">Use Wormhole to transfer earnings to any supported chain</div>
            </div>
          </li>
          <li className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center font-bold">
              5
            </div>
            <div>
              <div className="font-semibold mb-1">Integrate with DeFi</div>
              <div className="text-sm text-muted-foreground">Deposit in yield protocols to stack earnings</div>
            </div>
          </li>
        </ol>
      </Card>
    </div>
  );
};

export default DePINGettingStarted;
