import { createPublicClient, http } from 'viem';
import { mainnet, sepolia } from 'viem/chains';

// Wormhole Token Bridge contract addresses
const WORMHOLE_CONTRACTS = {
  mainnet: '0x3ee18B2214AFF97000D974cf647E7C347E8fa585' as `0x${string}`,
  sepolia: '0x4a8bc80Ed5a4067f1CCf107057b8270E0cC11A78' as `0x${string}`
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
    console.log(`🔍 Scanning blocks for wallet ${walletAddress}`);
    
    const client = createPublicClient({
      chain: networkMode === 'Testnet' ? sepolia : mainnet,
      transport: http(networkMode === 'Testnet' ? sepolia.rpcUrls.default.http[0] : mainnet.rpcUrls.default.http[0]),
    });
    
    const contractAddress = networkMode === 'Testnet' 
      ? WORMHOLE_CONTRACTS.sepolia 
      : WORMHOLE_CONTRACTS.mainnet;

    const latestBlock = await client.getBlockNumber();
    const fromBlock = latestBlock - BigInt(500);
    
    console.log(`🔍 Scanning blocks ${fromBlock} to ${latestBlock} for wallet ${walletAddress}`);
    
    // Get ALL LogMessagePublished events (no sender filter)
    const logs = await client.getContractEvents({
      address: contractAddress,
      abi: WORMHOLE_EVENT_ABI,
      eventName: 'LogMessagePublished',
      fromBlock,
      toBlock: latestBlock,
    });
    
    console.log(`📋 Found ${logs.length} total Wormhole logs`);
    
    // Now filter by checking if transaction sender is our wallet
    const wormholeTxs: WormholeTransaction[] = [];
    
    for (const log of logs) {
      try {
        // Get the full transaction details
        const tx = await client.getTransaction({
          hash: log.transactionHash!,
        });
        
        // Check if the transaction is FROM our wallet
        if (tx.from.toLowerCase() === walletAddress.toLowerCase()) {
          const block = await client.getBlock({ blockNumber: log.blockNumber! });
          
          wormholeTxs.push({
            hash: log.transactionHash!,
            blockNumber: Number(log.blockNumber),
            timestamp: Number(block.timestamp) * 1000,
            from: tx.from,
            to: tx.to || '0x0',
            value: tx.value.toString(),
          });
        }
      } catch (error) {
        console.error(`Error processing log:`, error);
      }
    }
    
    console.log(`✅ Found ${wormholeTxs.length} Wormhole transactions from wallet`);
    
    // Filter by timestamp
    const filteredTxs = wormholeTxs.filter(tx => tx.timestamp > fromTimestamp);
    
    return filteredTxs;
  } catch (error) {
    console.error('❌ Error monitoring wallet transactions:', error);
    return [];
  }
}

export async function getLatestBlockTimestamp(networkMode: 'Testnet' | 'Mainnet'): Promise<number> {
  try {
    const chain = networkMode === 'Testnet' ? sepolia : mainnet;
    
    // Use free public RPC
    const client = createPublicClient({
      chain,
      transport: http(chain.rpcUrls.default.http[0])
    });

    const block = await client.getBlock();
    return Number(block.timestamp) * 1000; // Convert to milliseconds
  } catch (error) {
    console.error('Failed to get block timestamp:', error);
    return Date.now();
  }
}
