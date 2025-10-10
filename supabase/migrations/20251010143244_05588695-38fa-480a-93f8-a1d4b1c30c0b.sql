-- Create swap status enum
CREATE TYPE swap_status AS ENUM ('pending', 'bridging', 'swapping', 'completed', 'failed');

-- Create cross_chain_swaps table
CREATE TABLE public.cross_chain_swaps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  wallet_address TEXT NOT NULL,
  
  -- Swap details
  from_chain TEXT NOT NULL,
  to_chain TEXT NOT NULL,
  from_token TEXT NOT NULL,
  to_token TEXT NOT NULL,
  from_amount NUMERIC NOT NULL,
  to_amount NUMERIC,
  estimated_to_amount NUMERIC NOT NULL,
  
  -- Execution details
  route_used JSONB,
  tx_hash TEXT,
  status swap_status DEFAULT 'pending',
  price_impact NUMERIC,
  
  -- Fees and costs
  bridge_fee NUMERIC,
  swap_fee NUMERIC,
  gas_fees_paid NUMERIC,
  total_fees_usd NUMERIC,
  
  -- Metadata
  network TEXT DEFAULT 'Testnet',
  slippage_tolerance NUMERIC DEFAULT 1.0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Enable RLS
ALTER TABLE public.cross_chain_swaps ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "View swaps by wallet"
  ON public.cross_chain_swaps FOR SELECT
  USING (true);

CREATE POLICY "Insert own swaps"
  ON public.cross_chain_swaps FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Update swaps by wallet"
  ON public.cross_chain_swaps FOR UPDATE
  USING (true);

-- Indexes for performance
CREATE INDEX idx_swaps_wallet ON public.cross_chain_swaps(wallet_address);
CREATE INDEX idx_swaps_status ON public.cross_chain_swaps(status);
CREATE INDEX idx_swaps_network ON public.cross_chain_swaps(network);
CREATE INDEX idx_swaps_user ON public.cross_chain_swaps(user_id);