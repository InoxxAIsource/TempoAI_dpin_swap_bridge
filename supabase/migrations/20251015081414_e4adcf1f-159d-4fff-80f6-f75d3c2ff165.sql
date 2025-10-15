-- Add contract-related columns to wormhole_transactions
ALTER TABLE wormhole_transactions
ADD COLUMN IF NOT EXISTS contract_address text,
ADD COLUMN IF NOT EXISTS contract_claim_tx text,
ADD COLUMN IF NOT EXISTS contract_claim_status text DEFAULT 'pending';

-- Add Sepolia ETH amount tracking to depin_reward_claims
ALTER TABLE depin_reward_claims
ADD COLUMN IF NOT EXISTS sepolia_eth_amount numeric,
ADD COLUMN IF NOT EXISTS contract_prepared_at timestamp with time zone;

-- Create index for faster contract status lookups
CREATE INDEX IF NOT EXISTS idx_wormhole_transactions_contract_status 
ON wormhole_transactions(contract_claim_status) 
WHERE contract_claim_status IS NOT NULL;

-- Create index for contract prepared claims
CREATE INDEX IF NOT EXISTS idx_depin_reward_claims_contract_prepared 
ON depin_reward_claims(contract_prepared_at) 
WHERE contract_prepared_at IS NOT NULL;