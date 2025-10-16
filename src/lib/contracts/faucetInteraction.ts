import { parseEther } from 'viem';
import { TEMPO_DEPIN_FAUCET_ADDRESS, TEMPO_DEPIN_FAUCET_ABI } from '@/contracts/TempoDePINFaucet';

export interface PrepareClaimParams {
  userAddress: `0x${string}`;
  amountInEth: string;
  claimId: string;
}

export const getFaucetContractConfig = (userAddress: `0x${string}`, amountInEth: string, claimId: string) => {
  return {
    address: TEMPO_DEPIN_FAUCET_ADDRESS,
    abi: TEMPO_DEPIN_FAUCET_ABI,
    functionName: 'setClaimableReward',
    args: [userAddress, parseEther(amountInEth), claimId],
  } as const;
};

export const getClaimStatusConfig = (userAddress: `0x${string}`) => {
  return {
    address: TEMPO_DEPIN_FAUCET_ADDRESS,
    abi: TEMPO_DEPIN_FAUCET_ABI,
    functionName: 'getClaimStatus',
    args: [userAddress],
  } as const;
};

export const getClaimRewardsConfig = () => {
  return {
    address: TEMPO_DEPIN_FAUCET_ADDRESS,
    abi: TEMPO_DEPIN_FAUCET_ABI,
    functionName: 'claimRewards',
  } as const;
};

export const getContractBalanceConfig = () => {
  return {
    address: TEMPO_DEPIN_FAUCET_ADDRESS,
    abi: TEMPO_DEPIN_FAUCET_ABI,
    functionName: 'getContractBalance',
  } as const;
};
