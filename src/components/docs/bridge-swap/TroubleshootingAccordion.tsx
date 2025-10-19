import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ExternalLink } from 'lucide-react';

const TroubleshootingAccordion = () => {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="stuck-pending">
        <AccordionTrigger>
          My transaction is stuck in "Pending" status
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-3">
            <p className="text-muted-foreground">
              This usually means the source chain hasn't reached finality yet. Different chains have different confirmation requirements:
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Ethereum: ~15 minutes (64 blocks)</li>
              <li>Polygon: ~5-10 minutes</li>
              <li>Arbitrum/Optimism: ~2-5 minutes</li>
              <li>Solana: ~30 seconds</li>
            </ul>
            <Alert>
              <AlertDescription>
                <strong>Action:</strong> Wait for the estimated confirmation time for your source chain. If it's been 
                significantly longer, check the transaction hash on the source chain's block explorer to ensure it was confirmed.
              </AlertDescription>
            </Alert>
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="vaa-not-found">
        <AccordionTrigger>
          "VAA not found" error or transaction not appearing
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-3">
            <p className="text-muted-foreground">
              This can happen if:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
              <li>The transaction was very recent (wait 5-10 minutes)</li>
              <li>The transaction hash is incorrect or from the wrong chain</li>
              <li>The bridge contract wasn't properly interacted with</li>
            </ol>
            <Alert>
              <AlertDescription>
                <strong>Solution:</strong> Use the <strong>Manual Transaction Import</strong> feature on the Bridge page. 
                Enter your transaction hash and source chain, and Tempo will attempt to locate and track the VAA manually.
              </AlertDescription>
            </Alert>
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="claim-fails">
        <AccordionTrigger>
          Claim transaction fails or reverts
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-3">
            <p className="text-muted-foreground">
              Common reasons for claim failures:
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
              <li><strong>Insufficient gas:</strong> You need native tokens on the destination chain (e.g., MATIC on Polygon)</li>
              <li><strong>Already claimed:</strong> VAA has already been redeemed (check destination wallet balance)</li>
              <li><strong>Wrong chain:</strong> Ensure your wallet is connected to the destination chain</li>
              <li><strong>Slippage:</strong> If claiming through a relayer, set higher slippage tolerance</li>
            </ul>
            <Alert className="mt-3">
              <AlertDescription>
                <strong>Action:</strong> Check the Gas Alert widget. If you need destination gas tokens, get some from 
                a faucet (testnet) or an exchange/bridge (mainnet). Then retry the claim.
              </AlertDescription>
            </Alert>
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="high-fees">
        <AccordionTrigger>
          Gas fees are too high
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-3">
            <p className="text-muted-foreground">
              Strategies to reduce bridge costs:
            </p>
            <div className="space-y-2 text-sm">
              <div className="border-l-2 border-primary pl-3">
                <strong>Bridge to Layer 2 first:</strong>
                <p className="text-muted-foreground">
                  If bridging from Ethereum, bridge to Arbitrum, Optimism, or Base first. Then bridge to your final 
                  destination. This saves on Ethereum gas for subsequent transactions.
                </p>
              </div>
              <div className="border-l-2 border-primary pl-3">
                <strong>Batch multiple transfers:</strong>
                <p className="text-muted-foreground">
                  Instead of bridging small amounts frequently, accumulate and bridge larger amounts less often to 
                  amortize fixed costs.
                </p>
              </div>
              <div className="border-l-2 border-primary pl-3">
                <strong>Use off-peak times:</strong>
                <p className="text-muted-foreground">
                  Ethereum gas is typically cheaper on weekends and late nights (UTC). Check{' '}
                  <a href="https://etherscan.io/gastracker" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    Etherscan Gas Tracker
                  </a>{' '}
                  before bridging.
                </p>
              </div>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="wrong-chain">
        <AccordionTrigger>
          I sent tokens to the wrong chain or address
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-3">
            <Alert variant="destructive">
              <AlertDescription>
                <strong>Important:</strong> If you entered an incorrect recipient address or selected the wrong 
                destination chain, <strong>your funds may be permanently lost</strong>. Blockchain transactions 
                cannot be reversed.
              </AlertDescription>
            </Alert>
            <p className="text-muted-foreground text-sm">
              <strong>If the transaction hasn't been claimed yet:</strong> Contact Wormhole support immediately at{' '}
              <a href="https://discord.gg/wormholecrypto" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                Wormhole Discord <ExternalLink className="inline h-3 w-3" />
              </a>
              . They may be able to help if the VAA hasn't been redeemed.
            </p>
            <p className="text-muted-foreground text-sm">
              <strong>If the transaction was already claimed:</strong> Unfortunately, the tokens are now in the 
              recipient address you specified. If you control both addresses (e.g., you own the private key), you 
              can manually transfer them back.
            </p>
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="token-not-appearing">
        <AccordionTrigger>
          Tokens claimed successfully but not showing in wallet
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-3">
            <p className="text-muted-foreground">
              The tokens are in your wallet, but you need to manually add the token address to make them visible:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
              <li>Open your wallet (MetaMask, Phantom, etc.)</li>
              <li>Click "Import Token" or "Add Custom Token"</li>
              <li>Enter the token contract address for the destination chain</li>
              <li>The token should now appear in your wallet</li>
            </ol>
            <Alert className="mt-3">
              <AlertDescription>
                <strong>Finding Token Addresses:</strong> Check{' '}
                <a href="https://wormhole.com/token-addresses" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  Wormhole Token List <ExternalLink className="inline h-3 w-3" />
                </a>{' '}
                for official token addresses on each chain.
              </AlertDescription>
            </Alert>
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="network-congestion">
        <AccordionTrigger>
          Transaction taking longer than expected
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-3">
            <p className="text-muted-foreground">
              During periods of high network congestion, transactions can take longer:
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Source chain finality may be delayed (more blocks needed for safety)</li>
              <li>Guardian consensus might take longer if multiple chains are congested</li>
              <li>Claim transactions may require higher gas to get included in a block</li>
            </ul>
            <Alert className="mt-3">
              <AlertDescription>
                <strong>Action:</strong> Be patient. As long as your transaction was confirmed on the source chain 
                (check block explorer), it WILL complete. Wormhole has never lost funds due to congestion delays. 
                Check the Monitoring Panel for real-time status updates.
              </AlertDescription>
            </Alert>
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="wrapped-vs-native">
        <AccordionTrigger>
          Received wrapped tokens instead of native tokens
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-3">
            <p className="text-muted-foreground">
              When bridging, you may receive wrapped versions of tokens (e.g., WETH instead of ETH). This is expected behavior:
            </p>
            <div className="bg-muted/50 p-3 rounded-lg text-sm">
              <p className="mb-2">
                <strong>Why wrapped tokens?</strong> Many chains don't support native versions of all tokens. 
                For example, native ETH only exists on Ethereum and EVM Layer 2s. On Solana or Polygon, you'll receive 
                Wormhole-wrapped ETH (wETH).
              </p>
              <p>
                <strong>Solution:</strong> Use the <strong>Token Wrap Helper</strong> on the Bridge page to convert 
                between wrapped and native versions (e.g., WETH → ETH) where supported. Or use a DEX like Uniswap to swap.
              </p>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="security-concerns">
        <AccordionTrigger>
          Is my transaction secure? How do I verify?
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-3">
            <p className="text-muted-foreground">
              Every Wormhole transaction can be independently verified:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
              <li>
                <strong>Source Transaction:</strong> Check on the source chain's block explorer (e.g., Etherscan for Ethereum). 
                Verify the tokens were sent to the correct Wormhole bridge contract.
              </li>
              <li>
                <strong>VAA Signatures:</strong> Visit{' '}
                <a href="https://wormholescan.io" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  WormholeScan <ExternalLink className="inline h-3 w-3" />
                </a>{' '}
                and search your transaction hash. You can see all 19 guardian signatures on the VAA.
              </li>
              <li>
                <strong>Claim Transaction:</strong> After claiming, check the destination chain's block explorer to 
                confirm tokens were minted/unlocked to your address.
              </li>
            </ol>
            <Alert className="mt-3">
              <AlertDescription>
                Wormhole is secured by 13/19 threshold signature scheme. Your transaction is as secure as the combined 
                reputation of Jump Crypto, Certus One, Staked, Figment, and other top-tier validator companies.
              </AlertDescription>
            </Alert>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default TroubleshootingAccordion;
