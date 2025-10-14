import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const SUPPORTED_CHAINS = [
  'Ethereum',
  'Polygon',
  'Arbitrum',
  'Optimism',
  'Base',
  'Avalanche',
  'Solana',
  'BNB',
];

interface ClaimSettingsModalProps {
  open: boolean;
  onClose: () => void;
  userId: string;
  onUpdate?: () => void;
}

const ClaimSettingsModal = ({ open, onClose, userId, onUpdate }: ClaimSettingsModalProps) => {
  const [autoClaimEnabled, setAutoClaimEnabled] = useState(false);
  const [claimThreshold, setClaimThreshold] = useState(100);
  const [preferredChain, setPreferredChain] = useState('Solana');
  const [gasAlertEnabled, setGasAlertEnabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      fetchPreferences();
    }
  }, [open]);

  const fetchPreferences = async () => {
    try {
      const { data, error } = await supabase
        .from('bridge_preferences')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setAutoClaimEnabled(data.auto_claim_enabled);
        setClaimThreshold(Number(data.claim_threshold));
        setPreferredChain(data.preferred_chain);
        setGasAlertEnabled(data.gas_alert_enabled);
      }
    } catch (error) {
      console.error('Error fetching preferences:', error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('bridge_preferences')
        .upsert({
          user_id: userId,
          auto_claim_enabled: autoClaimEnabled,
          claim_threshold: claimThreshold,
          preferred_chain: preferredChain,
          gas_alert_enabled: gasAlertEnabled,
        });

      if (error) throw error;

      toast({
        title: "Settings Saved",
        description: "Your claim preferences have been updated.",
      });

      onUpdate?.();
      onClose();
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Claim Settings</DialogTitle>
          <DialogDescription>
            Configure your automatic reward claiming preferences
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Auto-Claim Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Get notified when rewards reach threshold
              </p>
            </div>
            <Switch
              checked={autoClaimEnabled}
              onCheckedChange={setAutoClaimEnabled}
            />
          </div>

          <div className="space-y-2">
            <Label>Claim Threshold: ${claimThreshold}</Label>
            <Slider
              value={[claimThreshold]}
              onValueChange={(values) => setClaimThreshold(values[0])}
              min={10}
              max={500}
              step={10}
            />
            <p className="text-xs text-muted-foreground">
              Notify me when pending rewards reach this amount
            </p>
          </div>

          <div className="space-y-2">
            <Label>Preferred Destination Chain</Label>
            <Select value={preferredChain} onValueChange={setPreferredChain}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SUPPORTED_CHAINS.map((chain) => (
                  <SelectItem key={chain} value={chain}>
                    {chain}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Gas Alerts</Label>
              <p className="text-sm text-muted-foreground">
                Warn about insufficient gas before claiming
              </p>
            </div>
            <Switch
              checked={gasAlertEnabled}
              onCheckedChange={setGasAlertEnabled}
            />
          </div>
        </div>

        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ClaimSettingsModal;
