import { AlertCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface PendingClaimsBannerProps {
  count: number;
}

const PendingClaimsBanner = ({ count }: PendingClaimsBannerProps) => {
  const navigate = useNavigate();

  if (count === 0) return null;

  return (
    <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
          <div>
            <div className="font-semibold text-yellow-900 dark:text-yellow-100">
              You have {count} pending {count === 1 ? 'transfer' : 'transfers'} to claim
            </div>
            <div className="text-sm text-yellow-700 dark:text-yellow-300">
              Complete your cross-chain transfers to receive your tokens
            </div>
          </div>
        </div>
        <Button 
          variant="outline" 
          onClick={() => navigate('/claim')}
          className="gap-2 border-yellow-300 dark:border-yellow-700 hover:bg-yellow-100 dark:hover:bg-yellow-900/40"
        >
          View Claim Page
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default PendingClaimsBanner;
