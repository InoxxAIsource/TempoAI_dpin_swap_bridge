-- Add columns to track ETH price and conversion details in depin_reward_claims
ALTER TABLE depin_reward_claims 
ADD COLUMN IF NOT EXISTS eth_price_at_transfer NUMERIC,
ADD COLUMN IF NOT EXISTS conversion_rate NUMERIC,
ADD COLUMN IF NOT EXISTS eth_transfer_tx TEXT,
ADD COLUMN IF NOT EXISTS eth_transfer_block_number BIGINT;

-- Add index on eth_transfer_tx for faster lookups
CREATE INDEX IF NOT EXISTS idx_depin_claims_eth_tx ON depin_reward_claims(eth_transfer_tx);