// IMPORTANT: After deploying TempoDePINFaucet_V2.sol, update this address!
// Old (V1 - has bug): 0xb90bb7616bc138a177bec31a4571f4fd8fe113a1
// New (V2 - fixed): UPDATE THIS AFTER DEPLOYMENT
export const TEMPO_DEPIN_FAUCET_ADDRESS = '0xb90bb7616bc138a177bec31a4571f4fd8fe113a1' as const;

// Updated ABI for V2 contract (no hasClaimed, added claimIdUsed)
export const TEMPO_DEPIN_FAUCET_ABI = [
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'user', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' },
      { indexed: false, internalType: 'string', name: 'claimId', type: 'string' }
    ],
    name: 'RewardsAllocated',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'user', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' }
    ],
    name: 'RewardsClaimed',
    type: 'event'
  },
  {
    inputs: [
      { internalType: 'address', name: 'user', type: 'address' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
      { internalType: 'string', name: 'claimId', type: 'string' }
    ],
    name: 'setClaimableReward',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'address', name: 'user', type: 'address' }],
    name: 'getClaimStatus',
    outputs: [
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
      { internalType: 'bool', name: 'claimed', type: 'bool' }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'claimRewards',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'getContractBalance',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'deposit',
    outputs: [],
    stateMutability: 'payable',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'address[]', name: 'users', type: 'address[]' },
      { internalType: 'uint256[]', name: 'amounts', type: 'uint256[]' },
      { internalType: 'string[]', name: 'claimIds', type: 'string[]' }
    ],
    name: 'batchSetClaimableRewards',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  }
] as const;
