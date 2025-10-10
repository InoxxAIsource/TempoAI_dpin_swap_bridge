-- Make user_id nullable since wallet_address is the primary identifier
ALTER TABLE public.wormhole_transactions 
ALTER COLUMN user_id DROP NOT NULL;

-- Update RLS policies to allow wallet-based access without requiring authentication
DROP POLICY IF EXISTS "Users can view their own transactions" ON public.wormhole_transactions;
DROP POLICY IF EXISTS "Users can insert their own transactions" ON public.wormhole_transactions;
DROP POLICY IF EXISTS "Users can update their own transactions" ON public.wormhole_transactions;

-- Allow anyone to insert transactions (wallet-based, no auth required)
CREATE POLICY "Anyone can insert transactions"
ON public.wormhole_transactions
FOR INSERT
WITH CHECK (true);

-- Allow viewing transactions by wallet address (no auth required)
CREATE POLICY "View transactions by wallet address"
ON public.wormhole_transactions
FOR SELECT
USING (true);

-- Allow updating transactions by wallet address (no auth required)
CREATE POLICY "Update transactions by wallet address"
ON public.wormhole_transactions
FOR UPDATE
USING (true);