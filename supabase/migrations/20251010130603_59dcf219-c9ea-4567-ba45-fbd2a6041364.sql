-- Add redemption tracking fields to wormhole_transactions table
ALTER TABLE wormhole_transactions 
ADD COLUMN IF NOT EXISTS needs_redemption BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS redemption_tx_hash TEXT,
ADD COLUMN IF NOT EXISTS redemption_completed_at TIMESTAMP WITH TIME ZONE;

-- Create index for efficient querying of claimable transfers
CREATE INDEX IF NOT EXISTS idx_pending_redemptions 
ON wormhole_transactions(user_id, needs_redemption, status) 
WHERE needs_redemption = true OR status = 'pending';