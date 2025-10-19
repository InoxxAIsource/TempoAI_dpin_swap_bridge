/**
 * Transaction data validation utility
 * Prevents corrupted or invalid transaction data from being stored
 */

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export function validateTransactionData(data: any): ValidationResult {
  const errors: string[] = [];
  
  // Check tx_hash exists and is valid format
  if (!data.tx_hash || !data.tx_hash.match(/^0x[a-fA-F0-9]{64}$/)) {
    errors.push('Invalid or missing transaction hash');
  }
  
  // Check amount is reasonable
  if (!data.amount || data.amount <= 0) {
    errors.push('Amount must be greater than 0');
  }
  
  if (data.amount > 1000) {
    errors.push('Amount suspiciously large (>1000 tokens)');
  }
  
  // Decimal validation - no more than 8 decimal places
  const amountStr = data.amount.toString();
  if (amountStr.includes('.') && amountStr.split('.')[1]?.length > 8) {
    errors.push('Amount has too many decimal places');
  }
  
  // Check required fields
  if (!data.wallet_address || !data.from_chain || !data.to_chain) {
    errors.push('Missing required fields');
  }
  
  // Check token validity
  const validTokens = ['ETH', 'WETH', 'USDC', 'USDT', 'WBTC', 'SOL'];
  if (!data.from_token || !validTokens.includes(data.from_token)) {
    errors.push(`Invalid or unsupported token: ${data.from_token}`);
  }
  
  // Check chains are valid
  const validChains = ['Sepolia', 'Ethereum', 'Solana', 'Arbitrum', 'Optimism', 'Polygon', 'Base'];
  if (!validChains.includes(data.from_chain) || !validChains.includes(data.to_chain)) {
    errors.push('Invalid chain selection');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Sanitize transaction data before insertion
 */
export function sanitizeTransactionData(data: any) {
  return {
    ...data,
    amount: Number(data.amount) || 0,
    wallet_address: data.wallet_address?.toLowerCase() || '',
    tx_hash: data.tx_hash || null,
    from_token: data.from_token || 'Unknown',
    to_token: data.to_token || 'Unknown',
  };
}
