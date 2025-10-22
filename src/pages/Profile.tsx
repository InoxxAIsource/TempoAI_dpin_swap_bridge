import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useUserWallets } from '@/hooks/useUserWallets';
import { useState } from 'react';
import { User, Wallet, Activity, Settings, TrendingUp, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AuthPrompt from '@/components/depin/AuthPrompt';
import { supabase } from '@/integrations/supabase/client';
import { useEffect } from 'react';

const Profile = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const { data, isLoading, updateProfile } = useUserProfile();
  const { wallets } = useUserWallets();

  const [formData, setFormData] = useState({
    username: '',
    preferred_chain: 'Solana',
    auto_claim_threshold: 100,
    gas_alerts_enabled: true,
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (data?.profile) {
      setFormData({
        username: data.profile.username || '',
        preferred_chain: data.profile.preferred_chain,
        auto_claim_threshold: data.profile.auto_claim_threshold,
        gas_alerts_enabled: data.profile.gas_alerts_enabled,
      });
    }
  }, [data]);

  if (isAuthenticated === null) {
    return (
      <div className="container mx-auto p-6">
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthPrompt />;
  }

  const handleSave = async () => {
    await updateProfile(formData);
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Profile Settings</h1>
        <p className="text-muted-foreground">
          Manage your account preferences and connected wallets
        </p>
      </div>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-96" />
          <Skeleton className="h-96" />
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {/* Stats Overview */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Your Stats
              </CardTitle>
              <CardDescription>Your activity across Tempo platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Total Bridges</p>
                  <p className="text-2xl font-bold">{data?.profile?.total_bridges || 0}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Total Swaps</p>
                  <p className="text-2xl font-bold">{data?.profile?.total_swaps || 0}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">DePIN Earnings</p>
                  <p className="text-2xl font-bold">
                    ${data?.profile?.total_depin_earnings?.toFixed(2) || '0.00'}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Completed Activities</p>
                  <p className="text-2xl font-bold">{data?.stats?.completed_activities || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profile Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Profile Information
              </CardTitle>
              <CardDescription>Update your personal information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder="Enter your username"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="preferred_chain">Preferred Chain</Label>
                <Select
                  value={formData.preferred_chain}
                  onValueChange={(value) => setFormData({ ...formData, preferred_chain: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Solana">Solana</SelectItem>
                    <SelectItem value="Ethereum">Ethereum</SelectItem>
                    <SelectItem value="Polygon">Polygon</SelectItem>
                    <SelectItem value="Arbitrum">Arbitrum</SelectItem>
                    <SelectItem value="Base">Base</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handleSave} className="w-full">
                Save Changes
              </Button>
            </CardContent>
          </Card>

          {/* Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Preferences
              </CardTitle>
              <CardDescription>Customize your experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="threshold">Auto-Claim Threshold (USD)</Label>
                <Input
                  id="threshold"
                  type="number"
                  value={formData.auto_claim_threshold}
                  onChange={(e) =>
                    setFormData({ ...formData, auto_claim_threshold: parseFloat(e.target.value) })
                  }
                  min="0"
                />
                <p className="text-xs text-muted-foreground">
                  Automatically claim rewards when they exceed this amount
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Gas Price Alerts</Label>
                  <p className="text-xs text-muted-foreground">
                    Get notified when gas prices are optimal
                  </p>
                </div>
                <Switch
                  checked={formData.gas_alerts_enabled}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, gas_alerts_enabled: checked })
                  }
                />
              </div>

              <Button onClick={handleSave} className="w-full">
                Save Preferences
              </Button>
            </CardContent>
          </Card>

          {/* Connected Wallets */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="w-5 h-5" />
                Connected Wallets
              </CardTitle>
              <CardDescription>Manage your connected blockchain wallets</CardDescription>
            </CardHeader>
            <CardContent>
              {wallets.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No wallets connected yet
                </p>
              ) : (
                <div className="space-y-3">
                  {wallets.map((wallet) => (
                    <div
                      key={wallet.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <Wallet className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{formatAddress(wallet.wallet_address)}</p>
                          <p className="text-sm text-muted-foreground">
                            {wallet.chain_name} ({wallet.chain_type.toUpperCase()})
                          </p>
                        </div>
                      </div>
                      {wallet.is_primary && (
                        <Badge variant="default">Primary</Badge>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Recent Activity
              </CardTitle>
              <CardDescription>Your latest transactions and actions</CardDescription>
            </CardHeader>
            <CardContent>
              {!data?.recent_activity || data.recent_activity.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No recent activity
                </p>
              ) : (
                <div className="space-y-3">
                  {data.recent_activity.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <Activity className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium capitalize">
                            {activity.activity_type.replace('_', ' ')}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(activity.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant={
                          activity.status === 'completed'
                            ? 'default'
                            : activity.status === 'pending'
                            ? 'secondary'
                            : 'destructive'
                        }
                      >
                        {activity.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Profile;
