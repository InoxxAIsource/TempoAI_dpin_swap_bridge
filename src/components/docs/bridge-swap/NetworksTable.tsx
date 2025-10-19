import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import ChainBadge from '@/components/ui/ChainBadge';

interface NetworkInfo {
  name: string;
  environment: 'testnet' | 'mainnet';
  chainId: string;
  confirmationTime: string;
  avgGasCost: string;
  nativeToken: string;
}

const networks: NetworkInfo[] = [
  // Testnet Networks
  {
    name: 'Sepolia',
    environment: 'testnet',
    chainId: '10002',
    confirmationTime: '~15 min',
    avgGasCost: '$0 (testnet)',
    nativeToken: 'SepoliaETH'
  },
  {
    name: 'Solana Devnet',
    environment: 'testnet',
    chainId: '10003',
    confirmationTime: '~30 sec',
    avgGasCost: '$0 (testnet)',
    nativeToken: 'SOL'
  },
  {
    name: 'Arbitrum Sepolia',
    environment: 'testnet',
    chainId: '10002',
    confirmationTime: '~2-5 min',
    avgGasCost: '$0 (testnet)',
    nativeToken: 'ETH'
  },
  {
    name: 'Base Sepolia',
    environment: 'testnet',
    chainId: '10002',
    confirmationTime: '~2-5 min',
    avgGasCost: '$0 (testnet)',
    nativeToken: 'ETH'
  },
  {
    name: 'Optimism Sepolia',
    environment: 'testnet',
    chainId: '10002',
    confirmationTime: '~2-5 min',
    avgGasCost: '$0 (testnet)',
    nativeToken: 'ETH'
  },
  {
    name: 'Polygon Amoy',
    environment: 'testnet',
    chainId: '10002',
    confirmationTime: '~5-10 min',
    avgGasCost: '$0 (testnet)',
    nativeToken: 'MATIC'
  },
  
  // Mainnet Networks
  {
    name: 'Ethereum',
    environment: 'mainnet',
    chainId: '2',
    confirmationTime: '~15 min',
    avgGasCost: '$5-50',
    nativeToken: 'ETH'
  },
  {
    name: 'Solana',
    environment: 'mainnet',
    chainId: '1',
    confirmationTime: '~30 sec',
    avgGasCost: '$0.00025',
    nativeToken: 'SOL'
  },
  {
    name: 'Polygon',
    environment: 'mainnet',
    chainId: '5',
    confirmationTime: '~5-10 min',
    avgGasCost: '$0.01-0.10',
    nativeToken: 'MATIC'
  },
  {
    name: 'Arbitrum',
    environment: 'mainnet',
    chainId: '23',
    confirmationTime: '~2-5 min',
    avgGasCost: '$0.10-0.50',
    nativeToken: 'ETH'
  },
  {
    name: 'Optimism',
    environment: 'mainnet',
    chainId: '24',
    confirmationTime: '~2-5 min',
    avgGasCost: '$0.10-0.50',
    nativeToken: 'ETH'
  },
  {
    name: 'Base',
    environment: 'mainnet',
    chainId: '30',
    confirmationTime: '~2-5 min',
    avgGasCost: '$0.10-0.50',
    nativeToken: 'ETH'
  },
  {
    name: 'Avalanche',
    environment: 'mainnet',
    chainId: '6',
    confirmationTime: '~2-3 min',
    avgGasCost: '$0.10-0.50',
    nativeToken: 'AVAX'
  },
  {
    name: 'BNB Chain',
    environment: 'mainnet',
    chainId: '4',
    confirmationTime: '~3-5 min',
    avgGasCost: '$0.05-0.20',
    nativeToken: 'BNB'
  },
  {
    name: 'Fantom',
    environment: 'mainnet',
    chainId: '10',
    confirmationTime: '~1-2 min',
    avgGasCost: '$0.01-0.05',
    nativeToken: 'FTM'
  },
  {
    name: 'Celo',
    environment: 'mainnet',
    chainId: '14',
    confirmationTime: '~5 sec',
    avgGasCost: '$0.001-0.01',
    nativeToken: 'CELO'
  },
  {
    name: 'Moonbeam',
    environment: 'mainnet',
    chainId: '16',
    confirmationTime: '~12 sec',
    avgGasCost: '$0.01-0.05',
    nativeToken: 'GLMR'
  },
  {
    name: 'Aurora',
    environment: 'mainnet',
    chainId: '9',
    confirmationTime: '~2 sec',
    avgGasCost: '$0.001-0.01',
    nativeToken: 'ETH'
  }
];

const NetworksTable = () => {
  const testnets = networks.filter(n => n.environment === 'testnet');
  const mainnets = networks.filter(n => n.environment === 'mainnet');

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Badge variant="secondary">Testnet</Badge>
          Testing Networks
        </h3>
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Network</TableHead>
                <TableHead>Wormhole Chain ID</TableHead>
                <TableHead>Confirmation Time</TableHead>
                <TableHead>Avg Gas Cost</TableHead>
                <TableHead>Native Token</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {testnets.map((network) => (
                <TableRow key={network.name}>
                  <TableCell>
                    <ChainBadge chain={network.name.toLowerCase().replace(' ', '-')} />
                  </TableCell>
                  <TableCell className="font-mono text-sm">{network.chainId}</TableCell>
                  <TableCell>{network.confirmationTime}</TableCell>
                  <TableCell>{network.avgGasCost}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{network.nativeToken}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Badge>Mainnet</Badge>
          Production Networks
        </h3>
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Network</TableHead>
                <TableHead>Wormhole Chain ID</TableHead>
                <TableHead>Confirmation Time</TableHead>
                <TableHead>Avg Gas Cost</TableHead>
                <TableHead>Native Token</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mainnets.map((network) => (
                <TableRow key={network.name}>
                  <TableCell>
                    <ChainBadge chain={network.name.toLowerCase()} />
                  </TableCell>
                  <TableCell className="font-mono text-sm">{network.chainId}</TableCell>
                  <TableCell>{network.confirmationTime}</TableCell>
                  <TableCell className="font-semibold">{network.avgGasCost}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{network.nativeToken}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default NetworksTable;
