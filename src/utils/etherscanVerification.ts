/**
 * Utility to verify Wormhole transactions on Etherscan
 */

const ETHERSCAN_API_URLS = {
  sepolia: 'https://api-sepolia.etherscan.io/api',
  mainnet: 'https://api.etherscan.io/api'
};

const WORMHOLE_TOKEN_BRIDGE = {
  sepolia: '0x0CBE91CF822c73C2315FB05100C2F714765d5c20',
  mainnet: '0x3ee18B2214AFF97000D974cf647E7C347E8fa585'
};

const TOKEN_DECIMALS: Record<string, number> = {
  'ETH': 18,
  'WETH': 18,
  'USDC': 6,
  'USDT': 6,
};

const TOKEN_ADDRESSES = {
  sepolia: {
    'WETH': '0x7b79995e5f793a07bc00c21412e50ecae098e7f9',
    'USDC': '0x1c7d4b196cb0c7b01d743fbc6116a902379c7238',
  },
  mainnet: {
    'WETH': '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    'USDC': '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
  }
};

export interface TransactionVerification {
  isValid: boolean;
  isWormholeTransfer: boolean;
  amount: string | null;
  token: string | null;
  status: 'success' | 'failed' | 'pending' | 'not_found';
  methodName?: string;
}

/**
 * Verify a transaction on Etherscan and check if it's a valid Wormhole bridge transfer
 */
export async function verifyWormholeTransaction(
  txHash: string,
  network: 'sepolia' | 'mainnet' = 'sepolia'
): Promise<TransactionVerification> {
  try {
    console.log(`🔍 Verifying transaction ${txHash} on ${network}`);
    
    const apiUrl = ETHERSCAN_API_URLS[network];
    const alchemyKey = import.meta.env.VITE_ALCHEMY_API_KEY;
    
    // Get transaction receipt
    const response = await fetch(
      `${apiUrl}?module=proxy&action=eth_getTransactionReceipt&txhash=${txHash}${alchemyKey ? `&apikey=${alchemyKey}` : ''}`
    );
    const data = await response.json();
    
    if (!data.result) {
      console.log('❌ Transaction not found on Etherscan');
      return {
        isValid: false,
        isWormholeTransfer: false,
        amount: null,
        token: null,
        status: 'not_found'
      };
    }
    
    const receipt = data.result;
    const isSuccess = receipt.status === '0x1';
    
    console.log(`📊 Transaction status: ${isSuccess ? 'Success' : 'Failed'}`);
    
    if (!isSuccess) {
      return {
        isValid: false,
        isWormholeTransfer: false,
        amount: null,
        token: null,
        status: 'failed'
      };
    }
    
    // Check if transaction interacted with Wormhole Token Bridge
    const wormholeBridge = WORMHOLE_TOKEN_BRIDGE[network].toLowerCase();
    const logs = receipt.logs || [];
    
    const hasWormholeInteraction = logs.some((log: any) => 
      log.address.toLowerCase() === wormholeBridge
    );
    
    console.log(`🌉 Wormhole interaction detected: ${hasWormholeInteraction}`);
    
    // Try to parse amount from Transfer events
    // Transfer event signature: Transfer(address,address,uint256)
    const transferEventSig = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef';
    const transferLogs = logs.filter((log: any) => 
      log.topics && log.topics[0] === transferEventSig
    );
    
    let amount: string | null = null;
    let token: string | null = null;
    
    if (transferLogs.length > 0) {
      // Parse the last transfer (usually the bridge transfer)
      const lastTransfer = transferLogs[transferLogs.length - 1];
      const tokenAddress = lastTransfer.address.toLowerCase();
      
      // Identify token
      const tokens = TOKEN_ADDRESSES[network];
      for (const [symbol, address] of Object.entries(tokens)) {
        if (address.toLowerCase() === tokenAddress) {
          token = symbol;
          break;
        }
      }
      
      if (lastTransfer.data && lastTransfer.data !== '0x') {
        try {
          const rawAmount = parseInt(lastTransfer.data, 16);
          const decimals = token ? TOKEN_DECIMALS[token] : 18;
          
          // Convert to human-readable format
          const humanAmount = rawAmount / Math.pow(10, decimals);
          amount = humanAmount.toString();
          
          console.log(`💰 Raw amount: ${rawAmount}, Decimals: ${decimals}, Human: ${humanAmount}, Token: ${token}`);
        } catch (e) {
          console.warn('⚠️ Could not parse amount from logs');
        }
      }
    }
    
    return {
      isValid: true,
      isWormholeTransfer: hasWormholeInteraction,
      amount,
      token,
      status: 'success'
    };
  } catch (error) {
    console.error('❌ Error verifying transaction:', error);
    return {
      isValid: false,
      isWormholeTransfer: false,
      amount: null,
      token: null,
      status: 'not_found'
    };
  }
}

/**
 * Wait for transaction to be mined and then verify
 */
export async function waitAndVerifyTransaction(
  txHash: string,
  network: 'sepolia' | 'mainnet' = 'sepolia',
  maxWaitTime: number = 120000 // 2 minutes
): Promise<TransactionVerification> {
  const startTime = Date.now();
  
  while (Date.now() - startTime < maxWaitTime) {
    const result = await verifyWormholeTransaction(txHash, network);
    
    if (result.status !== 'not_found') {
      return result;
    }
    
    // Wait 10 seconds before checking again
    await new Promise(resolve => setTimeout(resolve, 10000));
  }
  
  return {
    isValid: false,
    isWormholeTransfer: false,
    amount: null,
    token: null,
    status: 'pending'
  };
}
