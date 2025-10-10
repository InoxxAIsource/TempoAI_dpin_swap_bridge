-- Add wallet_address column to wormhole_transactions table
ALTER TABLE public.wormhole_transactions 
ADD COLUMN wallet_address TEXT NOT NULL DEFAULT '';

-- Add index for efficient querying by wallet address
CREATE INDEX idx_wallet_transactions ON public.wormhole_transactions(wallet_address);

-- Add composite index for user_id and wallet_address lookups
CREATE INDEX idx_user_wallet_transactions ON public.wormhole_transactions(user_id, wallet_address);