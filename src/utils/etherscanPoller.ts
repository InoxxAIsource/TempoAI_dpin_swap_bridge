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
  const apiKey = 'YourApiKeyToken';
  const isTestnet = network === 'Testnet';
  const apiUrl = isTestnet 
    ? 'https://api-sepolia.etherscan.io/api'
    : 'https://api.etherscan.io/api';
  
  const wormholeContracts = WORMHOLE_CONTRACT_ADDRESSES[isTestnet ? 'Sepolia' : 'Mainnet'];
  
  try {
    console.log(`🔍 Querying Etherscan for transactions from ${walletAddress}`);
    const response = await fetch(
      `${apiUrl}?module=account&action=txlist&address=${walletAddress}&startblock=0&endblock=99999999&sort=desc&apikey=${apiKey}`
    );
    
    const data = await response.json();
    
    if (data.status !== '1') {
      console.error('Etherscan API error:', data.message);
      return [];
    }
    
    console.log(`📋 Found ${data.result.length} total transactions`);
    
    // Filter for transactions interacting with ANY Wormhole/CCTP contract
    const recentWormholeTxs = data.result.filter((tx: EtherscanTransaction) => {
      const txTime = parseInt(tx.timeStamp) * 1000;
      const isRecent = txTime > sinceTimestamp;
      const isWormholeContract = wormholeContracts.some(
        (contract) => tx.to?.toLowerCase() === contract
      );
      const isFromUser = tx.from?.toLowerCase() === walletAddress.toLowerCase();
      
      return isRecent && isWormholeContract && isFromUser;
    });
    
    console.log(`✅ Found ${recentWormholeTxs.length} Wormhole/CCTP transactions`);
    return recentWormholeTxs;
  } catch (error) {
    console.error('Error polling Etherscan:', error);
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
