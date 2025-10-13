-- Device Registry Table
CREATE TABLE IF NOT EXISTS public.device_registry (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  device_id TEXT UNIQUE NOT NULL,
  device_type TEXT NOT NULL,
  device_name TEXT NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'maintenance')),
  is_verified BOOLEAN DEFAULT false,
  public_key TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_seen_at TIMESTAMPTZ DEFAULT NOW()
);

-- Device Events Table (metrics logs)
CREATE TABLE IF NOT EXISTS public.device_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id TEXT REFERENCES public.device_registry(device_id) ON DELETE CASCADE NOT NULL,
  event_type TEXT NOT NULL,
  metrics JSONB NOT NULL,
  signature TEXT,
  verified BOOLEAN DEFAULT false,
  reward_amount NUMERIC(18, 6) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- DePIN Rewards Table
CREATE TABLE IF NOT EXISTS public.depin_rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  device_id TEXT REFERENCES public.device_registry(device_id) ON DELETE CASCADE NOT NULL,
  amount NUMERIC(18, 6) NOT NULL,
  token TEXT DEFAULT 'USDC',
  chain TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'bridging', 'claimed')),
  tx_hash TEXT,
  claimed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_device_registry_user ON public.device_registry(user_id);
CREATE INDEX idx_device_registry_status ON public.device_registry(status);
CREATE INDEX idx_device_events_device ON public.device_events(device_id);
CREATE INDEX idx_device_events_created ON public.device_events(created_at DESC);
CREATE INDEX idx_depin_rewards_user ON public.depin_rewards(user_id);
CREATE INDEX idx_depin_rewards_status ON public.depin_rewards(status);

-- Enable Row Level Security
ALTER TABLE public.device_registry ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.device_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.depin_rewards ENABLE ROW LEVEL SECURITY;

-- RLS Policies for device_registry
CREATE POLICY "Users can view their own devices"
  ON public.device_registry FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own devices"
  ON public.device_registry FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own devices"
  ON public.device_registry FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for device_events
CREATE POLICY "Users can view events for their devices"
  ON public.device_events FOR SELECT
  USING (
    device_id IN (
      SELECT device_id FROM public.device_registry WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can insert device events"
  ON public.device_events FOR INSERT
  WITH CHECK (true);

-- RLS Policies for depin_rewards
CREATE POLICY "Users can view their own rewards"
  ON public.depin_rewards FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own rewards"
  ON public.depin_rewards FOR UPDATE
  USING (auth.uid() = user_id);

-- Enable Realtime for device events
ALTER PUBLICATION supabase_realtime ADD TABLE public.device_events;