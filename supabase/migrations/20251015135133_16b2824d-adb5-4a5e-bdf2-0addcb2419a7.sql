-- Add columns to track user's claim transaction from smart contract
ALTER TABLE depin_reward_claims
ADD COLUMN user_claim_tx text,
ADD COLUMN user_claim_confirmed_at timestamp with time zone;

COMMENT ON COLUMN depin_reward_claims.user_claim_tx IS 'Transaction hash of user claiming from the smart contract';
COMMENT ON COLUMN depin_reward_claims.user_claim_confirmed_at IS 'Timestamp when user successfully claimed from smart contract';