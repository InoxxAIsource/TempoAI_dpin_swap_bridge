-- Clean up in correct order, handling foreign key constraints properly

-- Step 1: Clean up unclaimed individual rewards (no foreign keys)
DELETE FROM depin_rewards 
WHERE status = 'pending' AND claimed_at IS NULL;

-- Step 2: Update claims to remove wormhole_tx references before deleting transactions
UPDATE depin_reward_claims 
SET wormhole_tx_id = NULL
WHERE wormhole_tx_id IN (
  SELECT id FROM wormhole_transactions 
  WHERE status IN ('pending', 'failed') AND completed_at IS NULL
);

-- Step 3: Delete stuck/pending claims
DELETE FROM depin_reward_claims 
WHERE status IN ('pending_approval', 'ready_to_claim', 'prepared_unverified', 'claiming');

-- Step 4: Now safe to delete wormhole transactions
DELETE FROM wormhole_transactions 
WHERE status IN ('pending', 'failed') AND completed_at IS NULL;

-- Log the cleanup
DO $$
BEGIN
  RAISE NOTICE '✅ Database cleanup completed successfully';
  RAISE NOTICE 'Deleted: pending claims, unclaimed rewards, incomplete wormhole transactions';
  RAISE NOTICE 'Preserved: device registry, completed claims, user profiles';
END $$;