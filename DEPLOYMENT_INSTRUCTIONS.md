# TempoDePINFaucet V2 - Deployment Instructions

## Critical Bug Fixed
The original contract prevented users from making multiple claims due to the `hasClaimed` mapping. V2 removes this restriction while maintaining all safety mechanisms.

## Step-by-Step Deployment

### 1. Prepare Deployment Wallet
- Ensure your deployer wallet (with TEMPO_DEPLOYER_PRIVATE_KEY) has at least **0.3 ETH on Sepolia**:
  - ~0.01 ETH for deployment gas
  - 0.2 ETH to fund the contract
  - 0.09 ETH buffer

### 2. Deploy Contract via Remix IDE

1. **Open Remix**: Go to [remix.ethereum.org](https://remix.ethereum.org)

2. **Create New File**:
   - Click "+" in File Explorer
   - Name: `TempoDePINFaucet_V2.sol`
   - Paste contents from `src/contracts/TempoDePINFaucet_V2.sol`

3. **Compile**:
   - Go to "Solidity Compiler" tab
   - Select compiler version: `0.8.20`
   - Click "Compile TempoDePINFaucet_V2.sol"
   - Verify no errors

4. **Deploy**:
   - Go to "Deploy & Run Transactions" tab
   - Environment: **Injected Provider - MetaMask**
   - Ensure MetaMask is connected to **Sepolia Testnet**
   - Contract: Select `TempoDePINFaucet`
   - Click **"Deploy"**
   - Confirm transaction in MetaMask
   - **COPY THE NEW CONTRACT ADDRESS** (e.g., `0x1234...`)

5. **Fund Contract**:
   - After deployment, in Remix under "Deployed Contracts"
   - Find the `deposit` function
   - Enter value: `200000000000000000` (0.2 ETH in wei)
   - Click "transact"
   - Confirm in MetaMask

6. **Verify on Etherscan**:
   - Go to [sepolia.etherscan.io](https://sepolia.etherscan.io)
   - Search for your new contract address
   - Click "Contract" tab → "Verify and Publish"
   - Compiler: `0.8.20`
   - Optimization: No
   - Paste contract code
   - Verify

### 3. Update Codebase

**Update `src/contracts/TempoDePINFaucet.ts`:**

Replace line 1:
```typescript
export const TEMPO_DEPIN_FAUCET_ADDRESS = '0xYOUR_NEW_CONTRACT_ADDRESS' as const;
```

The ABI has already been updated to match V2.

### 4. Reset Database Claims

Run this SQL in Supabase:

```sql
-- Reset all failed claims for testing
UPDATE depin_reward_claims 
SET 
  status = 'pending',
  contract_prepared_at = NULL,
  eth_transfer_tx = NULL,
  user_claim_tx = NULL,
  user_claim_confirmed_at = NULL,
  sepolia_eth_amount = NULL
WHERE user_id = 'e5f63fd1-f979-4a2e-bce2-60b42cba6556'
AND status IN ('claimed', 'ready_to_claim', 'contract_prepared');

-- Also reset the rewards back to pending
UPDATE depin_rewards
SET 
  status = 'pending',
  claimed_at = NULL,
  claimed_via_tx = NULL,
  tx_hash = NULL
WHERE user_id = 'e5f63fd1-f979-4a2e-bce2-60b42cba6556'
AND status = 'claiming';
```

### 5. Test the Fix

1. **Navigate to Portfolio page** as the test user
2. **Create a new claim** for 30 USDC
3. **Connect EVM wallet** (the one you've been using)
4. **Click "Prepare Contract"** - should succeed
5. **Wait for verification** - should show claimable ETH > 0
6. **Click "Claim from Contract"** - ETH should arrive in wallet
7. **Verify on Etherscan** - should see ETH transfer
8. **Create another claim** - should work this time!

### 6. Monitor

Check these after deployment:
- Contract balance: Should be 0.2 ETH
- User's claimable amount: Should match USDC → ETH conversion
- Transaction logs: Should show `RewardsAllocated` and `RewardsClaimed` events

## Rollback Plan

If deployment fails:
1. Keep using old contract at `0xb90bb7616bc138a177bec31a4571f4fd8fe113a1`
2. Update users they can only claim once (temporary limitation)
3. Debug and redeploy with fixes

## Post-Deployment Checklist

- [ ] Contract deployed to Sepolia
- [ ] Contract funded with 0.2 ETH
- [ ] Contract verified on Etherscan
- [ ] New address updated in `src/contracts/TempoDePINFaucet.ts`
- [ ] Database claims reset
- [ ] Test claim successful
- [ ] User received ETH
- [ ] Second claim works
- [ ] Edge function logs look good

## Expected Behavior After Fix

✅ **Before**: User could only claim once, then all future claims showed 0 ETH  
✅ **After**: User can claim multiple times, each claim gets its own allocation

✅ **Before**: `setClaimableReward()` failed with "User has already claimed"  
✅ **After**: `setClaimableReward()` succeeds, overwrites previous amount

✅ **Before**: Contract balance 0.103 ETH but user couldn't claim  
✅ **After**: Contract properly allocates and transfers ETH to user
