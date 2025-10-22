-- Phase 1: Core User Profile & Authentication API
-- Enhance profiles table with tracking and preferences columns
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS total_bridges INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_swaps INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_depin_earnings NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS preferred_chain TEXT DEFAULT 'Solana',
ADD COLUMN IF NOT EXISTS auto_claim_threshold NUMERIC DEFAULT 100,
ADD COLUMN IF NOT EXISTS gas_alerts_enabled BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS notification_preferences JSONB DEFAULT '{"email": true, "push": false, "telegram": false}'::jsonb;

-- Create user_activity table for tracking all user actions
CREATE TABLE IF NOT EXISTS user_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  activity_type TEXT NOT NULL CHECK (activity_type IN ('bridge', 'swap', 'claim', 'deposit', 'depin_device', 'wallet_connect', 'settings_update')),
  details JSONB NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_user_activity_user_id ON user_activity(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_type ON user_activity(activity_type);
CREATE INDEX IF NOT EXISTS idx_user_activity_created_at ON user_activity(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_activity_status ON user_activity(status);

-- Enable RLS on user_activity table
ALTER TABLE user_activity ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_activity
CREATE POLICY "Users can view their own activity"
  ON user_activity FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own activity"
  ON user_activity FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own activity"
  ON user_activity FOR UPDATE
  USING (auth.uid() = user_id);

-- Create function to automatically update profile stats
CREATE OR REPLACE FUNCTION update_profile_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.activity_type = 'bridge' AND NEW.status = 'completed' THEN
    UPDATE profiles 
    SET total_bridges = total_bridges + 1
    WHERE id = NEW.user_id;
  ELSIF NEW.activity_type = 'swap' AND NEW.status = 'completed' THEN
    UPDATE profiles 
    SET total_swaps = total_swaps + 1
    WHERE id = NEW.user_id;
  ELSIF NEW.activity_type = 'claim' AND NEW.status = 'completed' THEN
    UPDATE profiles 
    SET total_depin_earnings = total_depin_earnings + COALESCE((NEW.details->>'amount')::numeric, 0)
    WHERE id = NEW.user_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger to update profile stats when activity is completed
CREATE TRIGGER trigger_update_profile_stats
  AFTER INSERT OR UPDATE OF status ON user_activity
  FOR EACH ROW
  WHEN (NEW.status = 'completed')
  EXECUTE FUNCTION update_profile_stats();