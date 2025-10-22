import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface UserProfile {
  id: string;
  username: string | null;
  avatar_url: string | null;
  total_bridges: number;
  total_swaps: number;
  total_depin_earnings: number;
  preferred_chain: string;
  auto_claim_threshold: number;
  gas_alerts_enabled: boolean;
  notification_preferences: {
    email: boolean;
    push: boolean;
    telegram: boolean;
  };
  created_at: string;
  updated_at: string;
}

export interface WalletConnection {
  id: string;
  user_id: string;
  wallet_address: string;
  chain_type: string;
  chain_name: string;
  connected_at: string;
  is_primary: boolean;
}

export interface UserActivity {
  id: string;
  user_id: string;
  activity_type: string;
  details: Record<string, any>;
  status: string;
  created_at: string;
  completed_at: string | null;
}

export interface UserProfileData {
  profile: UserProfile | null;
  wallets: WalletConnection[];
  recent_activity: UserActivity[];
  stats: {
    total_activities: number;
    completed_activities: number;
    pending_activities: number;
    failed_activities: number;
  };
}

export const useUserProfile = () => {
  const [data, setData] = useState<UserProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Not authenticated');
      }

      const { data: profileData, error: profileError } = await supabase.functions.invoke(
        'user-profile',
        {
          method: 'GET',
        }
      );

      if (profileError) throw profileError;

      setData(profileData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch profile';
      setError(errorMessage);
      console.error('Profile fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    try {
      setError(null);

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Not authenticated');
      }

      const { data: result, error: updateError } = await supabase.functions.invoke(
        'user-profile',
        {
          method: 'PUT',
          body: updates,
        }
      );

      if (updateError) throw updateError;

      // Update local state
      if (data && result.profile) {
        setData({
          ...data,
          profile: result.profile,
        });
      }

      toast({
        title: 'Profile updated',
        description: 'Your profile settings have been saved successfully.',
      });

      return result.profile;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update profile';
      setError(errorMessage);
      toast({
        title: 'Update failed',
        description: errorMessage,
        variant: 'destructive',
      });
      throw err;
    }
  };

  const refetch = () => {
    fetchProfile();
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return {
    data,
    isLoading,
    error,
    updateProfile,
    refetch,
  };
};
