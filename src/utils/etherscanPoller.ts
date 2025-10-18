interface EtherscanTransaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  timeStamp: string;
  input: string;
}

const WORMHOLE_CONTRACT_ADDRESSES = {
  Sepolia: '0x4a8bc80Ed5a4067f1CCf107057b8270E0cC11A78'.toLowerCase(),
  Mainnet: '0x3ee18B2214AFF97000D974cf647E7C347E8fa585'.toLowerCase(),
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
  
  const wormholeContract = WORMHOLE_CONTRACT_ADDRESSES[isTestnet ? 'Sepolia' : 'Mainnet'];
  
  try {
    const response = await fetch(
      `${apiUrl}?module=account&action=txlist&address=${walletAddress}&startblock=0&endblock=99999999&sort=desc&apikey=${apiKey}`
    );
    
    const data = await response.json();
    
    if (data.status !== '1') {
      console.error('Etherscan API error:', data.message);
      return [];
    }
    
    const recentWormholeTxs = data.result.filter((tx: EtherscanTransaction) => {
      const txTime = parseInt(tx.timeStamp) * 1000;
      const isRecent = txTime > sinceTimestamp;
      const isWormhole = tx.to?.toLowerCase() === wormholeContract;
      const isFromUser = tx.from?.toLowerCase() === walletAddress.toLowerCase();
      
      return isRecent && isWormhole && isFromUser;
    });
    
    return recentWormholeTxs;
  } catch (error) {
    console.error('Error polling Etherscan:', error);
    return [];
  }
}

export function extractWormholeDataFromTx(tx: EtherscanTransaction) {
  return {
    hash: tx.hash,
    from: tx.from,
    timestamp: parseInt(tx.timeStamp) * 1000,
  };
}
