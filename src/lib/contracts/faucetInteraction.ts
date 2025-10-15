import { parseEther } from 'viem';
import { TEMPO_DEPIN_FAUCET_ADDRESS, TEMPO_DEPIN_FAUCET_ABI } from '@/contracts/TempoDePINFaucet';

export interface PrepareClaimParams {
  userAddress: `0x${string}`;
  amountInEth: string;
}

export const getFaucetContractConfig = (userAddress: `0x${string}`, amountInEth: string) => {
  return {
    address: TEMPO_DEPIN_FAUCET_ADDRESS,
    abi: TEMPO_DEPIN_FAUCET_ABI,
    functionName: 'setClaimableReward',
    args: [userAddress, parseEther(amountInEth)],
  } as const;
};

export const getClaimableAmountConfig = (userAddress: `0x${string}`) => {
  return {
    address: TEMPO_DEPIN_FAUCET_ADDRESS,
    abi: TEMPO_DEPIN_FAUCET_ABI,
    functionName: 'getClaimableAmount',
    args: [userAddress],
  } as const;
};

export const getClaimRewardConfig = () => {
  return {
    address: TEMPO_DEPIN_FAUCET_ADDRESS,
    abi: TEMPO_DEPIN_FAUCET_ABI,
    functionName: 'claimReward',
  } as const;
};
