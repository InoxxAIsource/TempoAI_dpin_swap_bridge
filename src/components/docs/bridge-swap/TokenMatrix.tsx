import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CheckCircle2, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface TokenAvailability {
  token: string;
  symbol: string;
  chains: {
    [key: string]: boolean;
  };
}

const tokens: TokenAvailability[] = [
  {
    token: 'USD Coin',
    symbol: 'USDC',
    chains: {
      'Ethereum': true,
      'Solana': true,
      'Polygon': true,
      'Arbitrum': true,
      'Optimism': true,
      'Base': true,
      'Avalanche': true,
      'BNB Chain': true,
      'Fantom': false,
      'Celo': true,
      'Moonbeam': true,
      'Aurora': true
    }
  },
  {
    token: 'Wrapped Ether',
    symbol: 'WETH',
    chains: {
      'Ethereum': true,
      'Solana': true,
      'Polygon': true,
      'Arbitrum': true,
      'Optimism': true,
      'Base': true,
      'Avalanche': true,
      'BNB Chain': true,
      'Fantom': true,
      'Celo': false,
      'Moonbeam': true,
      'Aurora': true
    }
  },
  {
    token: 'Ether',
    symbol: 'ETH',
    chains: {
      'Ethereum': true,
      'Solana': false,
      'Polygon': false,
      'Arbitrum': true,
      'Optimism': true,
      'Base': true,
      'Avalanche': false,
      'BNB Chain': false,
      'Fantom': false,
      'Celo': false,
      'Moonbeam': false,
      'Aurora': true
    }
  },
  {
    token: 'Tether USD',
    symbol: 'USDT',
    chains: {
      'Ethereum': true,
      'Solana': true,
      'Polygon': true,
      'Arbitrum': true,
      'Optimism': true,
      'Base': true,
      'Avalanche': true,
      'BNB Chain': true,
      'Fantom': true,
      'Celo': false,
      'Moonbeam': false,
      'Aurora': true
    }
  },
  {
    token: 'Wrapped BTC',
    symbol: 'WBTC',
    chains: {
      'Ethereum': true,
      'Solana': false,
      'Polygon': true,
      'Arbitrum': true,
      'Optimism': true,
      'Base': false,
      'Avalanche': true,
      'BNB Chain': false,
      'Fantom': true,
      'Celo': false,
      'Moonbeam': false,
      'Aurora': false
    }
  }
];

const chains = [
  'Ethereum',
  'Solana',
  'Polygon',
  'Arbitrum',
  'Optimism',
  'Base',
  'Avalanche',
  'BNB Chain',
  'Fantom',
  'Celo',
  'Moonbeam',
  'Aurora'
];

const TokenMatrix = () => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold mb-2">Token Availability Matrix</h3>
        <p className="text-muted-foreground mb-4">
          This matrix shows which tokens are available on which chains. Green checkmark indicates native or high liquidity support, 
          red X indicates token not available on that chain.
        </p>
      </div>

      <div className="border rounded-lg overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Token</TableHead>
              {chains.map((chain) => (
                <TableHead key={chain} className="text-center min-w-[100px]">
                  <div className="text-xs">{chain}</div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {tokens.map((token) => (
              <TableRow key={token.symbol}>
                <TableCell className="font-medium">
                  <div>
                    <div className="font-semibold">{token.symbol}</div>
                    <div className="text-xs text-muted-foreground">{token.token}</div>
                  </div>
                </TableCell>
                {chains.map((chain) => (
                  <TableCell key={chain} className="text-center">
                    {token.chains[chain] ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500 mx-auto" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500/50 mx-auto" />
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mt-6">
        <div className="bg-muted/50 p-4 rounded-lg">
          <h4 className="font-semibold mb-2 flex items-center gap-2">
            <Badge variant="outline">Native Tokens</Badge>
          </h4>
          <p className="text-sm text-muted-foreground">
            <strong>ETH</strong> and <strong>SOL</strong> can only be bridged to chains where they exist natively 
            or as canonical wrapped versions (e.g., ETH on Arbitrum, WETH on Polygon).
          </p>
        </div>

        <div className="bg-muted/50 p-4 rounded-lg">
          <h4 className="font-semibold mb-2 flex items-center gap-2">
            <Badge variant="outline">Stablecoins</Badge>
          </h4>
          <p className="text-sm text-muted-foreground">
            <strong>USDC</strong> and <strong>USDT</strong> have the widest availability across chains, making them 
            ideal for cross-chain transfers and DeFi strategies.
          </p>
        </div>

        <div className="bg-muted/50 p-4 rounded-lg">
          <h4 className="font-semibold mb-2 flex items-center gap-2">
            <Badge variant="outline">Wrapped Tokens</Badge>
          </h4>
          <p className="text-sm text-muted-foreground">
            When bridging <strong>ETH</strong>, it may be automatically wrapped to <strong>WETH</strong> on certain 
            chains. Use the Token Wrap Helper in Tempo Bridge to convert between ETH and WETH as needed.
          </p>
        </div>

        <div className="bg-muted/50 p-4 rounded-lg">
          <h4 className="font-semibold mb-2 flex items-center gap-2">
            <Badge variant="outline">Liquidity Considerations</Badge>
          </h4>
          <p className="text-sm text-muted-foreground">
            Some chains may have lower liquidity for certain tokens. This affects slippage when swapping. 
            Check the Swap page for real-time liquidity indicators.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TokenMatrix;
