-- Update portfolio_snapshots table with new columns
ALTER TABLE portfolio_snapshots ADD COLUMN IF NOT EXISTS network TEXT DEFAULT 'mainnet';
ALTER TABLE portfolio_snapshots ADD COLUMN IF NOT EXISTS guardian_verified BOOLEAN DEFAULT false;
ALTER TABLE portfolio_snapshots ADD COLUMN IF NOT EXISTS chains_queried TEXT[];

-- Create wormhole_executions table for tracking Wormhole operations
CREATE TABLE IF NOT EXISTS wormhole_executions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  wallet_address TEXT NOT NULL,
  execution_type TEXT NOT NULL CHECK (execution_type IN ('swap', 'yield', 'bridge')),
  from_chain TEXT NOT NULL,
  to_chain TEXT NOT NULL,
  token TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  tx_hash TEXT,
  vaa TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  estimated_completion TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  guardian_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE wormhole_executions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for wormhole_executions
CREATE POLICY "Users can view their own executions"
  ON wormhole_executions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own executions"
  ON wormhole_executions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own executions"
  ON wormhole_executions FOR UPDATE
  USING (auth.uid() = user_id);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_wormhole_executions_user_id ON wormhole_executions(user_id);
CREATE INDEX IF NOT EXISTS idx_wormhole_executions_wallet_address ON wormhole_executions(wallet_address);
CREATE INDEX IF NOT EXISTS idx_wormhole_executions_status ON wormhole_executions(status);