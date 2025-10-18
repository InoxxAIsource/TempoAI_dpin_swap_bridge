interface WormholeScanTransaction {
  id: string;
  emitterChain: number;
  emitterAddress: string;
  sequence: string;
  vaa?: string;
  txHash: string;
  timestamp: string;
  standardizedProperties?: {
    appIds?: string[];
    fromChain?: number;
    toChain?: number;
    tokenAmount?: string;
    tokenChain?: number;
  };
  globalTx?: {
    destinationTx?: {
      txHash?: string;
      timestamp?: string;
      status?: string;
    };
  };
}

interface WormholeTransactionStatus {
  exists: boolean;
  vaa: string | null;
  sourceChainConfirmed: boolean;
  destinationChainConfirmed: boolean;
  needsRedemption: boolean;
  destinationTxHash: string | null;
  redeemUrl: string | null;
  status: 'pending' | 'vaa_generated' | 'redemption_needed' | 'completed' | 'not_found';
}

/**
 * Check the status of a Wormhole transaction using WormholeScan API
 */
export async function checkWormholeTxStatus(
  txHash: string,
  networkMode: 'Testnet' | 'Mainnet' = 'Testnet'
): Promise<WormholeTransactionStatus> {
  try {
    const baseUrl = networkMode === 'Testnet'
      ? 'https://api.testnet.wormholescan.io'
      : 'https://api.wormholescan.io';

    console.log(`🔍 Checking WormholeScan for tx: ${txHash}`);

    // Query WormholeScan API for transaction details
    const response = await fetch(
      `${baseUrl}/api/v1/operations?txHash=${txHash}`,
      {
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      console.warn(`WormholeScan API returned ${response.status} for ${txHash}`);
      return {
        exists: false,
        vaa: null,
        sourceChainConfirmed: false,
        destinationChainConfirmed: false,
        needsRedemption: false,
        destinationTxHash: null,
        redeemUrl: null,
        status: 'not_found',
      };
    }

    const data = await response.json();
    
    if (!data.operations || data.operations.length === 0) {
      console.log(`📭 No operations found for ${txHash}`);
      return {
        exists: false,
        vaa: null,
        sourceChainConfirmed: false,
        destinationChainConfirmed: false,
        needsRedemption: false,
        destinationTxHash: null,
        redeemUrl: null,
        status: 'not_found',
      };
    }

    const operation = data.operations[0];
    const tx = operation.sourceChain?.transaction as WormholeScanTransaction;
    const destTx = operation.targetChain?.transaction;

    const hasVAA = !!tx?.vaa;
    const sourceConfirmed = tx?.txHash === txHash;
    const destinationConfirmed = !!destTx?.txHash;
    const needsRedemption = hasVAA && !destinationConfirmed;

    // Build redeem URL if redemption is needed
    let redeemUrl = null;
    if (needsRedemption && tx) {
      const scanUrl = networkMode === 'Testnet'
        ? 'https://wormholescan.io/#/tx'
        : 'https://wormholescan.io/#/tx';
      redeemUrl = `${scanUrl}/${txHash}?network=${networkMode}`;
    }

    // Determine overall status
    let status: WormholeTransactionStatus['status'] = 'pending';
    if (destinationConfirmed) {
      status = 'completed';
    } else if (needsRedemption) {
      status = 'redemption_needed';
    } else if (hasVAA) {
      status = 'vaa_generated';
    }

    console.log(`✅ WormholeScan status for ${txHash}:`, {
      status,
      hasVAA,
      needsRedemption,
      destinationTxHash: destTx?.txHash,
    });

    return {
      exists: true,
      vaa: tx?.vaa || null,
      sourceChainConfirmed: sourceConfirmed,
      destinationChainConfirmed: destinationConfirmed,
      needsRedemption,
      destinationTxHash: destTx?.txHash || null,
      redeemUrl,
      status,
    };
  } catch (error) {
    console.error('WormholeScan API error:', error);
    return {
      exists: false,
      vaa: null,
      sourceChainConfirmed: false,
      destinationChainConfirmed: false,
      needsRedemption: false,
      destinationTxHash: null,
      redeemUrl: null,
      status: 'not_found',
    };
  }
}

/**
 * Poll WormholeScan for transaction status updates
 */
export async function pollWormholeTxStatus(
  txHash: string,
  networkMode: 'Testnet' | 'Mainnet' = 'Testnet',
  maxAttempts: number = 12,
  intervalMs: number = 5000
): Promise<WormholeTransactionStatus> {
  let attempts = 0;

  while (attempts < maxAttempts) {
    const status = await checkWormholeTxStatus(txHash, networkMode);

    // If transaction is found and has final status, return it
    if (status.exists && (status.status === 'completed' || status.status === 'redemption_needed')) {
      return status;
    }

    // If not found yet, wait and try again
    attempts++;
    if (attempts < maxAttempts) {
      console.log(`⏳ Polling attempt ${attempts}/${maxAttempts} for ${txHash}...`);
      await new Promise(resolve => setTimeout(resolve, intervalMs));
    }
  }

  // Return last known status after max attempts
  return await checkWormholeTxStatus(txHash, networkMode);
}
