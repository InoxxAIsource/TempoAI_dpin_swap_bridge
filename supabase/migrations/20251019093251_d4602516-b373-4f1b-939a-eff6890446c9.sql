-- Add indexes for better query performance on wormhole_transactions
-- Note: We're adding indexes only - validation will be done at application level

CREATE INDEX IF NOT EXISTS idx_wormhole_tx_hash 
ON wormhole_transactions(tx_hash);

CREATE INDEX IF NOT EXISTS idx_wormhole_pending_vaa 
ON wormhole_transactions(wallet_address, status, wormhole_vaa)
WHERE status = 'pending' AND wormhole_vaa IS NULL;

CREATE INDEX IF NOT EXISTS idx_wormhole_wallet 
ON wormhole_transactions(wallet_address, status);

-- Add comment explaining validation strategy
COMMENT ON COLUMN wormhole_transactions.amount IS 
'Amount validation is enforced at application level. Zero amounts indicate approval transactions that should not have been saved.';