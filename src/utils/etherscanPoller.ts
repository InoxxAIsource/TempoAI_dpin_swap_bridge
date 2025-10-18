interface EtherscanTransaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  timeStamp: string;
  input: string;
  blockNumber: string;
}

// All Wormhole and CCTP contract addresses that might be involved in cross-chain transfers
const WORMHOLE_CONTRACT_ADDRESSES = {
  Sepolia: [
    '0x4a8bc80Ed5a4067f1CCf107057b8270E0cC11A78'.toLowerCase(), // Wormhole Core Bridge
    '0x8FE6B999Dc680CcFDD5Bf7EB0974218be2542DAA'.toLowerCase(), // CCTP TokenMessenger
    '0xE737e5cEBEEBa77EFE34D4aa090756590b1CE275'.toLowerCase(), // CCTP MessageTransmitter
    '0x9f3B8679c73C2Fef8b59B4f3444d4e156fb70AA5'.toLowerCase(), // CCTP TokenMinter
  ],
  Mainnet: [
    '0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B'.toLowerCase(), // Wormhole Core Bridge
    '0x3ee18B2214AFF97000D974cf647E7C347E8fa585'.toLowerCase(), // Wormhole TokenBridge
    '0x28b5a0e9C621a5BadaA536219b3a228C8168cf5d'.toLowerCase(), // CCTP TokenMessenger
    '0x81D40F21F12A8F0E3252Bccb954D722d4c464B64'.toLowerCase(), // CCTP MessageTransmitter
  ],
};

export async function pollRecentTransactions(
  walletAddress: string,
  network: 'Mainnet' | 'Testnet',
  sinceTimestamp: number
): Promise<EtherscanTransaction[]> {
  const alchemyKey = import.meta.env.VITE_ALCHEMY_API_KEY;
  const isTestnet = network === 'Testnet';
  const alchemyUrl = isTestnet
    ? `https://eth-sepolia.g.alchemy.com/v2/${alchemyKey}`
    : `https://eth-mainnet.g.alchemy.com/v2/${alchemyKey}`;
  
  const wormholeContracts = WORMHOLE_CONTRACT_ADDRESSES[isTestnet ? 'Sepolia' : 'Mainnet'];
  
  try {
    console.log(`🔍 Querying Alchemy for transactions from ${walletAddress}`);
    
    // Use Alchemy's getAssetTransfers to get all transactions
    const response = await fetch(alchemyUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'alchemy_getAssetTransfers',
        params: [{
          fromAddress: walletAddress,
          fromBlock: '0x0',
          toBlock: 'latest',
          category: ['external', 'erc20', 'erc721', 'erc1155'],
          withMetadata: true,
          excludeZeroValue: false,
          maxCount: '0x3e8' // 1000 transactions max
        }]
      })
    });
    
    const data = await response.json();
    
    if (data.error) {
      console.error('Alchemy API error:', data.error.message);
      return [];
    }
    
    const transfers = data.result?.transfers || [];
    console.log(`📋 Found ${transfers.length} total transactions`);
    
    // Filter for transactions interacting with ANY Wormhole/CCTP contract
    const recentWormholeTxs = transfers
      .filter((transfer: any) => {
        if (!transfer.metadata?.blockTimestamp || !transfer.to) return false;
        
        const txTime = new Date(transfer.metadata.blockTimestamp).getTime();
        const isRecent = txTime > sinceTimestamp;
        const isWormholeContract = wormholeContracts.some(
          (contract) => transfer.to?.toLowerCase() === contract
        );
        
        return isRecent && isWormholeContract;
      })
      .map((transfer: any) => ({
        hash: transfer.hash,
        from: transfer.from,
        to: transfer.to,
        value: transfer.value || '0',
        timeStamp: Math.floor(new Date(transfer.metadata.blockTimestamp).getTime() / 1000).toString(),
        input: '0x', // Alchemy doesn't return input data in getAssetTransfers
        blockNumber: parseInt(transfer.blockNum, 16).toString()
      }));
    
    console.log(`✅ Found ${recentWormholeTxs.length} Wormhole/CCTP transactions`);
    return recentWormholeTxs;
  } catch (error) {
    console.error('Error polling Alchemy:', error);
    return [];
  }
}

/**
 * Get all Wormhole/CCTP transactions for a wallet (no time filter)
 */
export async function getAllWormholeTransactions(
  walletAddress: string,
  network: 'Mainnet' | 'Testnet'
): Promise<EtherscanTransaction[]> {
  return pollRecentTransactions(walletAddress, network, 0);
}

export function extractWormholeDataFromTx(tx: EtherscanTransaction) {
  return {
    hash: tx.hash,
    from: tx.from,
    timestamp: parseInt(tx.timeStamp) * 1000,
  };
}
