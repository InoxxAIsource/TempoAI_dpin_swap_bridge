import { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Coins, Settings, ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import ClaimSettingsModal from './ClaimSettingsModal';
import BatchClaimModal from './BatchClaimModal';

interface RewardClaimBannerProps {
  userId: string;
  onRefresh?: () => void;
}

const RewardClaimBanner = ({ userId, onRefresh }: RewardClaimBannerProps) => {
  const [pendingRewards, setPendingRewards] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const { toast } = useToast();

  const fetchPendingRewards = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('check-pending-rewards');
      
      if (error) throw error;
      setPendingRewards(data);
    } catch (error) {
      console.error('Error fetching pending rewards:', error);
    }
  };

  useEffect(() => {
    fetchPendingRewards();

    // Subscribe to reward updates
    const channel = supabase
      .channel('reward-updates')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'depin_rewards',
        filter: `user_id=eq.${userId}`
      }, () => {
        fetchPendingRewards();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  if (!pendingRewards || !pendingRewards.claimable) {
    return null;
  }

  const handleClaim = () => {
    setShowClaimModal(true);
  };

  return (
    <>
      <Alert className="mb-6 border-primary/50 bg-primary/5 animate-pulse">
        <Coins className="h-5 w-5 text-primary" />
        <AlertDescription className="flex items-center justify-between">
          <div className="flex-1">
            <p className="font-semibold text-lg">
              💰 ${pendingRewards.totalAmount.toFixed(2)} Ready to Claim!
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {pendingRewards.rewardCount} pending rewards from {pendingRewards.deviceBreakdown.length} device(s)
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSettings(true)}
            >
              <Settings className="h-4 w-4" />
            </Button>
            <Button
              onClick={handleClaim}
              size="sm"
              className="gap-2"
            >
              Claim to {pendingRewards.preferredChain}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </AlertDescription>
      </Alert>

      <ClaimSettingsModal
        open={showSettings}
        onClose={() => setShowSettings(false)}
        userId={userId}
        onUpdate={fetchPendingRewards}
      />

      <BatchClaimModal
        open={showClaimModal}
        onClose={() => setShowClaimModal(false)}
        deviceBreakdown={pendingRewards.deviceBreakdown}
        totalAmount={pendingRewards.totalAmount}
        preferredChain={pendingRewards.preferredChain}
        onSuccess={() => {
          fetchPendingRewards();
          onRefresh?.();
          toast({
            title: "Claim Initiated",
            description: "Your rewards are being bridged to " + pendingRewards.preferredChain,
          });
        }}
      />
    </>
  );
};

export default RewardClaimBanner;
