import { createPublicClient, http } from 'viem';
import { mainnet, sepolia } from 'viem/chains';

// Wormhole Token Bridge contract addresses
const WORMHOLE_CONTRACTS = {
  mainnet: '0x3ee18B2214AFF97000D974cf647E7C347E8fa585',
  sepolia: '0x4a8bc80Ed5a4067f1CCf107057b8270E0cC11A78'
};

// Wormhole LogMessagePublished event ABI
const WORMHOLE_EVENT_ABI = [{
  type: 'event',
  name: 'LogMessagePublished',
  inputs: [
    { indexed: true, name: 'sender', type: 'address' },
    { indexed: false, name: 'sequence', type: 'uint64' },
    { indexed: false, name: 'nonce', type: 'uint32' },
    { indexed: false, name: 'payload', type: 'bytes' },
    { indexed: false, name: 'consistencyLevel', type: 'uint8' }
  ]
}] as const;

interface WormholeTransaction {
  hash: string;
  blockNumber: number;
  timestamp: number;
  from: string;
  to: string;
  value: string;
}

export async function monitorWalletTransactions(
  walletAddress: string,
  networkMode: 'Testnet' | 'Mainnet',
  fromTimestamp: number
): Promise<WormholeTransaction[]> {
  try {
    const chain = networkMode === 'Testnet' ? sepolia : mainnet;
    const wormholeContract = networkMode === 'Testnet' 
      ? WORMHOLE_CONTRACTS.sepolia 
      : WORMHOLE_CONTRACTS.mainnet;

    // Create public client with Alchemy RPC if available
    const alchemyKey = import.meta.env.VITE_ALCHEMY_API_KEY;
    const rpcUrl = alchemyKey
      ? `https://${networkMode === 'Testnet' ? 'eth-sepolia' : 'eth-mainnet'}.g.alchemy.com/v2/${alchemyKey}`
      : chain.rpcUrls.default.http[0];

    const client = createPublicClient({
      chain,
      transport: http(rpcUrl)
    });

    // Get current block
    const currentBlock = await client.getBlockNumber();
    
    // Calculate from block (approximately 30 minutes ago, ~150 blocks)
    const fromBlock = currentBlock - 150n;

    console.log(`🔍 Scanning blocks ${fromBlock} to ${currentBlock} for wallet ${walletAddress}`);

    // Get logs from Wormhole contract for LogMessagePublished events
    const logs = await client.getContractEvents({
      address: wormholeContract as `0x${string}`,
      abi: WORMHOLE_EVENT_ABI,
      eventName: 'LogMessagePublished',
      fromBlock,
      toBlock: currentBlock,
    });

    console.log(`📋 Found ${logs.length} total Wormhole logs`);

    // Filter and process logs to find transactions from our wallet
    const transactions: WormholeTransaction[] = [];
    
    for (const log of logs) {
      try {
        // Check if sender matches our wallet
        const sender = log.args.sender as string;
        if (sender.toLowerCase() === walletAddress.toLowerCase()) {
          const tx = await client.getTransaction({ hash: log.transactionHash });
          const block = await client.getBlock({ blockNumber: log.blockNumber });

          // Only include transactions after the fromTimestamp
          if (Number(block.timestamp) * 1000 >= fromTimestamp) {
            transactions.push({
              hash: log.transactionHash,
              blockNumber: Number(log.blockNumber),
              timestamp: Number(block.timestamp),
              from: tx.from,
              to: tx.to || '',
              value: tx.value.toString(),
            });
          }
        }
      } catch (error) {
        console.error(`Failed to get transaction details:`, error);
        continue;
      }
    }

    console.log(`✅ Found ${transactions.length} Wormhole transactions from wallet`);
    return transactions;
  } catch (error) {
    console.error('Web3 monitoring error:', error);
    return [];
  }
}

export async function getLatestBlockTimestamp(networkMode: 'Testnet' | 'Mainnet'): Promise<number> {
  try {
    const chain = networkMode === 'Testnet' ? sepolia : mainnet;
    const alchemyKey = import.meta.env.VITE_ALCHEMY_API_KEY;
    const rpcUrl = alchemyKey
      ? `https://${networkMode === 'Testnet' ? 'eth-sepolia' : 'eth-mainnet'}.g.alchemy.com/v2/${alchemyKey}`
      : chain.rpcUrls.default.http[0];

    const client = createPublicClient({
      chain,
      transport: http(rpcUrl)
    });

    const block = await client.getBlock();
    return Number(block.timestamp) * 1000; // Convert to milliseconds
  } catch (error) {
    console.error('Failed to get block timestamp:', error);
    return Date.now();
  }
}
