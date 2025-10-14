-- Create table for tracking DePIN reward claims via Wormhole
CREATE TABLE IF NOT EXISTS public.depin_reward_claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  device_ids TEXT[] NOT NULL,
  total_amount DECIMAL(20, 6) NOT NULL,
  wormhole_tx_id UUID REFERENCES public.wormhole_transactions(id),
  claimed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  destination_chain TEXT NOT NULL,
  status TEXT DEFAULT 'pending'
);

-- Create table for user bridge preferences
CREATE TABLE IF NOT EXISTS public.bridge_preferences (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  auto_claim_enabled BOOLEAN DEFAULT false,
  claim_threshold DECIMAL(10, 2) DEFAULT 100,
  preferred_chain TEXT DEFAULT 'Solana',
  gas_alert_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create table for bridge fee estimates
CREATE TABLE IF NOT EXISTS public.bridge_fee_estimates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  from_chain TEXT NOT NULL,
  to_chain TEXT NOT NULL,
  token TEXT NOT NULL,
  amount DECIMAL(20, 6) NOT NULL,
  bridge_fee DECIMAL(10, 4),
  estimated_gas_usd DECIMAL(10, 4),
  total_cost_usd DECIMAL(10, 4),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add source tracking columns to wormhole_transactions
ALTER TABLE public.wormhole_transactions 
ADD COLUMN IF NOT EXISTS source_type TEXT DEFAULT 'user_transfer',
ADD COLUMN IF NOT EXISTS source_reference_ids TEXT[];

-- Add claim tracking columns to depin_rewards
ALTER TABLE public.depin_rewards
ADD COLUMN IF NOT EXISTS claimed_via_tx UUID REFERENCES public.wormhole_transactions(id),
ADD COLUMN IF NOT EXISTS batch_claim_id UUID;

-- Enable RLS on new tables
ALTER TABLE public.depin_reward_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bridge_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bridge_fee_estimates ENABLE ROW LEVEL SECURITY;

-- RLS policies for depin_reward_claims
CREATE POLICY "Users can view their own claims"
ON public.depin_reward_claims FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own claims"
ON public.depin_reward_claims FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own claims"
ON public.depin_reward_claims FOR UPDATE
USING (auth.uid() = user_id);

-- RLS policies for bridge_preferences
CREATE POLICY "Users can view their own preferences"
ON public.bridge_preferences FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own preferences"
ON public.bridge_preferences FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences"
ON public.bridge_preferences FOR UPDATE
USING (auth.uid() = user_id);

-- RLS policies for bridge_fee_estimates
CREATE POLICY "Users can view their own estimates"
ON public.bridge_fee_estimates FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert estimates"
ON public.bridge_fee_estimates FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create trigger for updating bridge_preferences updated_at
CREATE OR REPLACE FUNCTION public.update_bridge_preferences_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER update_bridge_preferences_updated_at
BEFORE UPDATE ON public.bridge_preferences
FOR EACH ROW
EXECUTE FUNCTION public.update_bridge_preferences_updated_at();