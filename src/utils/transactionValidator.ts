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
  
  // Check amount is reasonable
  if (!data.amount || data.amount <= 0) {
    errors.push('Amount must be greater than 0');
  }
  
  // Check for suspiciously large amounts (likely parsing errors)
  if (data.amount > 1000000) {
    errors.push('Amount suspiciously large (likely parsing error)');
  }
  
  // Check required fields
  if (!data.tx_hash || !data.wallet_address) {
    errors.push('Missing required fields (tx_hash or wallet_address)');
  }
  
  // Check token validity
  const validTokens = ['ETH', 'WETH', 'USDC', 'USDT', 'WBTC', 'SOL'];
  if (data.from_token && !validTokens.includes(data.from_token)) {
    console.warn(`Unknown token: ${data.from_token}`);
  }
  
  // Check chains are valid
  if (!data.from_chain || !data.to_chain) {
    errors.push('Missing chain information');
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
