import { Button } from '@/components/ui/button';
import { Package, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const EmptyClaimState = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center py-20 px-6">
      <div className="w-32 h-32 rounded-full bg-secondary/50 flex items-center justify-center mb-8">
        <Package className="w-16 h-16 text-muted-foreground" />
      </div>
      
      <h3 className="text-2xl md:text-3xl font-bold mb-4">No Pending Claims</h3>
      
      <p className="text-lg text-muted-foreground text-center max-w-md mb-8">
        You don't have any transfers waiting to be claimed. Start a new bridge transfer to see claimable transactions here.
      </p>
      
      <Button 
        size="lg" 
        onClick={() => navigate('/bridge')}
        className="gap-2"
      >
        Start Bridging
        <ArrowRight className="w-5 h-5" />
      </Button>
      
      <div className="mt-12 p-6 bg-secondary/30 rounded-lg max-w-2xl">
        <div className="flex items-start gap-4">
          <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
          <div>
            <h4 className="font-bold mb-2">What appears here?</h4>
            <p className="text-sm text-muted-foreground">
              After you initiate a cross-chain transfer using our Bridge feature, your pending 
              transfers will appear here once they're ready to be claimed. The claiming process 
              typically takes 15-30 minutes after initiating the transfer.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmptyClaimState;
