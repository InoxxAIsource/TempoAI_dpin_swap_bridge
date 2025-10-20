import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Coins, ArrowRight, CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface ClaimDashboardProps {
  pendingAmount: number;
  onClaimClick: () => void;
}

const ClaimDashboard = ({ pendingAmount, onClaimClick }: ClaimDashboardProps) => {
  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-purple-500/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Coins className="w-6 h-6 text-primary" />
          Available to Claim
        </CardTitle>
        <CardDescription>Your total pending rewards ready for claiming</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-5xl font-bold text-primary animate-pulse">
          ${pendingAmount.toFixed(2)}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            onClick={onClaimClick} 
            size="lg" 
            className="flex-1"
            disabled={pendingAmount === 0}
          >
            Claim All Rewards
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          
          <Button variant="outline" size="lg" className="flex-1" disabled={pendingAmount === 0}>
            Batch Claim
          </Button>
        </div>

        {pendingAmount === 0 && (
          <p className="text-sm text-muted-foreground text-center">
            No rewards available to claim at this time. Keep your devices active to earn more!
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default ClaimDashboard;
