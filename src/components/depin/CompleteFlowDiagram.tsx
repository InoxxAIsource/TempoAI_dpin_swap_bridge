import { useState } from 'react';
import deviceAdditionFlowImage from '@/assets/device-addition-flow.png';
import earningCalculationFlowImage from '@/assets/earning-calculation-flow.png';
import wormholeFlowImage from '@/assets/wormhole-flow.png';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { ZoomIn } from 'lucide-react';

const CompleteFlowDiagram = () => {

  return (
    <div className="space-y-12">
      <div>
        <h3 className="text-2xl font-bold mb-6">Device Addition Flow</h3>
        <p className="text-muted-foreground mb-6">
          Complete journey from signing up to seeing your first device metrics on the dashboard. Click to zoom.
        </p>
        <Dialog>
          <DialogTrigger asChild>
            <div className="my-8 p-6 rounded-xl border border-border bg-card/50 cursor-pointer hover:border-primary/50 transition-colors relative group max-w-2xl mx-auto">
              <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <ZoomIn className="w-5 h-5" />
              </div>
              <img 
                src={deviceAdditionFlowImage} 
                alt="Device Addition Flow Diagram" 
                className="w-full h-auto"
              />
            </div>
          </DialogTrigger>
          <DialogContent className="max-w-[95vw] max-h-[95vh] overflow-auto">
            <img 
              src={deviceAdditionFlowImage} 
              alt="Device Addition Flow Diagram - Zoomed" 
              className="w-full h-auto"
            />
          </DialogContent>
        </Dialog>
      </div>

      <div>
        <h3 className="text-2xl font-bold mb-6">Earning Calculation Flow</h3>
        <p className="text-muted-foreground mb-6">
          How your device metrics are verified, calculated, and converted into rewards. Click to zoom.
        </p>
        <Dialog>
          <DialogTrigger asChild>
            <div className="my-8 p-6 rounded-xl border border-border bg-card/50 overflow-x-auto cursor-pointer hover:border-primary/50 transition-colors relative group">
              <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <ZoomIn className="w-5 h-5" />
              </div>
              <img 
                src={earningCalculationFlowImage} 
                alt="Earning Calculation Flow Diagram" 
                className="w-full h-auto min-w-[800px]"
              />
            </div>
          </DialogTrigger>
          <DialogContent className="max-w-[95vw] max-h-[95vh] overflow-auto">
            <img 
              src={earningCalculationFlowImage} 
              alt="Earning Calculation Flow Diagram - Zoomed" 
              className="w-full h-auto"
            />
          </DialogContent>
        </Dialog>
      </div>

      <div>
        <h3 className="text-2xl font-bold mb-6">Wormhole Cross-Chain Bridge Flow</h3>
        <p className="text-muted-foreground mb-6">
          Step-by-step process of bridging your DePIN rewards across blockchain networks using Wormhole. Click to zoom.
        </p>
        <Dialog>
          <DialogTrigger asChild>
            <div className="my-8 p-6 rounded-xl border border-border bg-card/50 overflow-x-auto cursor-pointer hover:border-primary/50 transition-colors relative group">
              <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <ZoomIn className="w-5 h-5" />
              </div>
              <img 
                src={wormholeFlowImage} 
                alt="Wormhole Cross-Chain Bridge Flow Diagram" 
                className="w-full h-auto min-w-[800px]"
              />
            </div>
          </DialogTrigger>
          <DialogContent className="max-w-[95vw] max-h-[95vh] overflow-auto">
            <img 
              src={wormholeFlowImage} 
              alt="Wormhole Cross-Chain Bridge Flow Diagram - Zoomed" 
              className="w-full h-auto"
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default CompleteFlowDiagram;
