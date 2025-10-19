import DocSection from '@/components/docs/DocSection';
import NetworksTable from '@/components/docs/bridge-swap/NetworksTable';
import TokenMatrix from '@/components/docs/bridge-swap/TokenMatrix';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink, Fuel, Clock, DollarSign } from 'lucide-react';

const BridgeNetworks = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Bridge: Networks & Tokens</h1>
        <p className="text-xl text-muted-foreground">
          Complete reference for supported blockchains, tokens, gas requirements, and network-specific details
        </p>
      </div>

      <DocSection
        id="supported-networks"
        title="Supported Networks"
        subtitle="All blockchains accessible through Tempo Bridge"
      >
        <Alert className="mb-6">
          <AlertDescription>
            <strong>Testnet vs Mainnet:</strong> Always test bridging on testnet networks first before using real funds on mainnet. 
            Testnet tokens have no value and can be obtained for free from faucets.
          </AlertDescription>
        </Alert>

        <NetworksTable />
      </DocSection>

      <DocSection
        id="supported-tokens"
        title="Supported Tokens"
        subtitle="Token availability across chains"
      >
        <TokenMatrix />
      </DocSection>

      <DocSection
        id="gas-requirements"
        title="Gas Requirements"
        subtitle="Native token needs for bridging"
      >
        <p className="text-lg mb-6">
          Every blockchain requires its native token to pay for transaction fees ("gas"). When bridging, you need gas 
          on <strong>both</strong> the source chain (to initiate) and the destination chain (to claim).
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Fuel className="h-5 w-5 text-primary" />
                Source Chain Gas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Required to approve the token and initiate the bridge transaction. Amount varies by network:
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex justify-between">
                  <span>Ethereum:</span>
                  <span className="font-semibold">$5-50 (0.002-0.015 ETH)</span>
                </li>
                <li className="flex justify-between">
                  <span>Arbitrum/Optimism/Base:</span>
                  <span className="font-semibold">$0.10-0.50</span>
                </li>
                <li className="flex justify-between">
                  <span>Polygon:</span>
                  <span className="font-semibold">$0.01-0.10 (0.01-0.1 MATIC)</span>
                </li>
                <li className="flex justify-between">
                  <span>Solana:</span>
                  <span className="font-semibold">$0.00025 (0.000005 SOL)</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Fuel className="h-5 w-5 text-primary" />
                Destination Chain Gas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Required to claim (redeem) your bridged tokens. If you don't have any, Tempo's Gas Alert feature will notify you.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex justify-between">
                  <span>Ethereum:</span>
                  <span className="font-semibold">$3-30 (claim tx)</span>
                </li>
                <li className="flex justify-between">
                  <span>Arbitrum/Optimism/Base:</span>
                  <span className="font-semibold">$0.10-0.50</span>
                </li>
                <li className="flex justify-between">
                  <span>Polygon:</span>
                  <span className="font-semibold">$0.01-0.05</span>
                </li>
                <li className="flex justify-between">
                  <span>Solana:</span>
                  <span className="font-semibold">$0.00025</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <Alert className="mt-6">
          <AlertDescription>
            <strong>Pro Tip:</strong> Use the <strong>Fee Estimator</strong> in Tempo Bridge to see exact gas costs 
            before starting your transaction. You can also enable the Gas Alert to get notified if your destination 
            wallet doesn't have enough native tokens.
          </AlertDescription>
        </Alert>
      </DocSection>

      <DocSection
        id="confirmation-times"
        title="Confirmation Times"
        subtitle="How long do bridge transactions take?"
      >
        <p className="text-lg mb-6">
          Bridge transaction times depend primarily on the <strong>source chain's finality</strong> (how long it takes 
          for a block to be considered irreversible). Guardian validation adds minimal overhead (~30 seconds).
        </p>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Typical Transaction Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <span className="font-semibold min-w-[120px]">0-2 minutes:</span>
                  <span className="text-muted-foreground">
                    Source chain transaction confirms and is picked up by guardians
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="font-semibold min-w-[120px]">2-15 minutes:</span>
                  <span className="text-muted-foreground">
                    Source chain reaches finality; guardians sign VAA (varies by network)
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="font-semibold min-w-[120px]">15+ minutes:</span>
                  <span className="text-muted-foreground">
                    VAA available; you can now claim on destination chain (user action required)
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="font-semibold min-w-[120px]">Total:</span>
                  <span className="text-muted-foreground font-semibold">
                    2-20 minutes depending on source chain finality + user claim time
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">🚀 Fast (Under 5 min)</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <ul className="space-y-1">
                  <li>• Solana: ~30 seconds</li>
                  <li>• Aurora: ~2 minutes</li>
                  <li>• Celo: ~5 seconds (finality)</li>
                  <li>• Fantom: ~1-2 minutes</li>
                  <li>• Arbitrum/Optimism/Base: ~2-5 min</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">⏱️ Medium (5-10 min)</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <ul className="space-y-1">
                  <li>• Polygon: ~5-10 minutes</li>
                  <li>• Avalanche: ~2-3 minutes (finality)</li>
                  <li>• BNB Chain: ~3-5 minutes</li>
                  <li>• Moonbeam: ~12 seconds (finality)</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">🐢 Slow (10-15 min)</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <ul className="space-y-1">
                  <li>• Ethereum: ~15 minutes (finality)</li>
                  <li>• Note: Ethereum's long finality ensures maximum security</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </DocSection>

      <DocSection
        id="fee-structures"
        title="Fee Structures"
        subtitle="Understanding bridge costs per network"
      >
        <p className="text-lg mb-6">
          Bridge fees consist of three components:
        </p>

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <DollarSign className="h-5 w-5 text-primary" />
                Bridge Fee
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p className="mb-2">
                <strong>~0.1%</strong> of transfer amount, capped at reasonable maximums
              </p>
              <p>
                Paid to Wormhole guardians and relayers for securing the transaction
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <DollarSign className="h-5 w-5 text-primary" />
                Source Gas
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p className="mb-2">
                <strong>Variable</strong> based on network congestion
              </p>
              <p>
                Paid in source chain's native token (e.g., ETH on Ethereum)
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <DollarSign className="h-5 w-5 text-primary" />
                Destination Gas
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p className="mb-2">
                <strong>Variable</strong> based on network
              </p>
              <p>
                Paid when claiming; must have destination native token in wallet
              </p>
            </CardContent>
          </Card>
        </div>

        <Alert>
          <AlertDescription>
            <strong>Example Total Cost:</strong> Bridging 1,000 USDC from Ethereum to Arbitrum would cost approximately:
            <ul className="mt-2 space-y-1 ml-4">
              <li>• Bridge fee: $1 (0.1% of $1,000)</li>
              <li>• Ethereum gas: ~$10-30 (to initiate)</li>
              <li>• Arbitrum gas: ~$0.20 (to claim)</li>
              <li>• <strong>Total: ~$11-31</strong> (1.1-3.1% of transfer)</li>
            </ul>
            <p className="mt-2 text-xs">
              For smaller amounts, consider bridging to Layer 2s first to minimize total costs.
            </p>
          </AlertDescription>
        </Alert>
      </DocSection>

      <DocSection
        id="testnet-faucets"
        title="Testnet Faucets"
        subtitle="Get free testnet tokens"
      >
        <p className="text-lg mb-6">
          Before using mainnet, test bridging with free testnet tokens. Here are faucet links for all supported testnets:
        </p>

        <div className="grid md:grid-cols-2 gap-3">
          {[
            { name: 'Sepolia ETH', url: 'https://sepoliafaucet.com' },
            { name: 'Solana Devnet SOL', url: 'https://faucet.solana.com' },
            { name: 'Arbitrum Sepolia ETH', url: 'https://faucet.quicknode.com/arbitrum/sepolia' },
            { name: 'Base Sepolia ETH', url: 'https://www.coinbase.com/faucets/base-ethereum-goerli-faucet' },
            { name: 'Optimism Sepolia ETH', url: 'https://faucet.quicknode.com/optimism/sepolia' },
            { name: 'Polygon Amoy MATIC', url: 'https://faucet.polygon.technology' }
          ].map((faucet) => (
            <a
              key={faucet.name}
              href={faucet.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors group"
            >
              <span className="font-medium">{faucet.name}</span>
              <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
            </a>
          ))}
        </div>
      </DocSection>

      <DocSection
        id="next-steps"
        title="Next Steps"
      >
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-6 rounded-lg">
          <h3 className="font-semibold text-lg mb-4">Continue Learning:</h3>
          <ul className="space-y-2">
            <li>
              <a href="/docs/bridge/advanced" className="text-primary hover:underline font-medium">
                → Advanced Bridge Features
              </a>
              <span className="text-muted-foreground ml-2">
                Fee estimation, troubleshooting, and optimization
              </span>
            </li>
            <li>
              <a href="/bridge" className="text-primary hover:underline font-medium">
                → Try Bridging on Testnet
              </a>
              <span className="text-muted-foreground ml-2">
                Practice with free testnet tokens
              </span>
            </li>
          </ul>
        </div>
      </DocSection>
    </div>
  );
};

export default BridgeNetworks;
