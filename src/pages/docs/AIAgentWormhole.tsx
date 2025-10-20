import DocHero from "@/components/docs/DocHero";
import DocSection from "@/components/docs/DocSection";
import PageLayout from "@/components/layout/PageLayout";
import CodeBlock from "@/components/docs/CodeBlock";
import Mermaid from "@/components/docs/Mermaid";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Zap, Shield, Clock } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AIAgentWormhole = () => {
  const pythonBridgeCode = `from wormhole import Wormhole, chains
import asyncio

class WormholeAIBridge:
    """Wormhole integration for AI agents"""
    
    def __init__(self, private_key, network="testnet"):
        self.wh = Wormhole(network=network)
        self.private_key = private_key
    
    async def bridge_for_yield(
        self,
        token: str,
        amount: float,
        from_chain: str,
        to_chain: str,
        current_apy: float,
        target_apy: float
    ):
        """
        Bridge assets only if yield improvement justifies costs
        
        Returns: {
            'should_bridge': bool,
            'roi_days': int,  # Days to break even
            'tx_hash': str | None
        }
        """
        # Calculate costs
        bridge_cost = await self._estimate_bridge_cost(token, from_chain, to_chain)
        gas_cost = await self._estimate_gas_cost(to_chain)
        total_cost = bridge_cost + gas_cost
        
        # Calculate time to break even
        apy_improvement = target_apy - current_apy
        if apy_improvement <= 0:
            return {'should_bridge': False, 'reason': 'No APY improvement'}
        
        # Daily earnings improvement
        daily_improvement = (amount * apy_improvement / 100) / 365
        
        # Days to break even on bridge costs
        roi_days = total_cost / daily_improvement if daily_improvement > 0 else float('inf')
        
        # Only bridge if ROI < 30 days
        if roi_days > 30:
            return {
                'should_bridge': False,
                'roi_days': roi_days,
                'reason': f'ROI too long: {roi_days:.1f} days'
            }
        
        # Execute bridge
        print(f"✅ Bridging {amount} {token}: {from_chain} → {to_chain}")
        print(f"   APY: {current_apy}% → {target_apy}% (+{apy_improvement}%)")
        print(f"   Cost: \${total_cost:.2f}, ROI in {roi_days:.1f} days")
        
        tx = await self.wh.bridge(
            token=token,
            amount=amount,
            from_chain=getattr(chains, from_chain.upper()),
            to_chain=getattr(chains, to_chain.upper()),
            recipient=self._get_address()
        )
        
        return {
            'should_bridge': True,
            'roi_days': roi_days,
            'tx_hash': tx.hash,
            'bridge_cost': bridge_cost,
            'gas_cost': gas_cost
        }
    
    async def monitor_and_claim(self, tx_hash: str, target_chain: str):
        """
        Monitor bridge status and auto-claim when ready
        
        Polls every 30s until VAA is available, then claims
        """
        print(f"🔍 Monitoring bridge: {tx_hash[:8]}...")
        
        while True:
            # Check VAA status
            vaa_status = await self.wh.get_vaa_status(tx_hash)
            
            if vaa_status['ready']:
                print(f"✅ VAA ready! Claiming on {target_chain}...")
                
                # Claim bridged assets
                claim_tx = await self.wh.claim_vaa(
                    vaa=vaa_status['vaa'],
                    chain=getattr(chains, target_chain.upper())
                )
                
                print(f"✅ Claim successful: {claim_tx.hash}")
                return claim_tx.hash
            
            elif vaa_status['failed']:
                print(f"❌ Bridge failed: {vaa_status['error']}")
                raise Exception(f"Bridge failed: {vaa_status['error']}")
            
            else:
                print(f"⏳ Waiting for VAA... ({vaa_status['confirmations']}/15)")
                await asyncio.sleep(30)
    
    async def _estimate_bridge_cost(self, token, from_chain, to_chain):
        """Estimate Wormhole bridge cost"""
        # Wormhole typically charges ~$8-15 for bridging
        return 8.0
    
    async def _estimate_gas_cost(self, chain):
        """Estimate gas cost on destination chain"""
        gas_prices = {
            "ETHEREUM": 5.0,
            "ARBITRUM": 0.50,
            "OPTIMISM": 0.30,
            "BASE": 0.20,
            "POLYGON": 0.10
        }
        return gas_prices.get(chain.upper(), 1.0)
    
    def _get_address(self):
        """Get wallet address from private key"""
        # Implementation depends on your web3 library
        from eth_account import Account
        account = Account.from_key(self.private_key)
        return account.address

# Example usage
async def main():
    bridge = WormholeAIBridge(
        private_key="0x...",
        network="testnet"
    )
    
    # AI agent decides to bridge for better yield
    result = await bridge.bridge_for_yield(
        token="USDC",
        amount=1000,
        from_chain="SEPOLIA",
        to_chain="ARBITRUM",
        current_apy=3.1,
        target_apy=5.2
    )
    
    if result['should_bridge']:
        # Monitor and auto-claim
        await bridge.monitor_and_claim(
            tx_hash=result['tx_hash'],
            target_chain="ARBITRUM"
        )

asyncio.run(main())`;

  const jsBridgeCode = `import { Wormhole } from '@wormhole-foundation/sdk';

class WormholeAIBridge {
    constructor(privateKey, network = 'testnet') {
        this.wh = new Wormhole({ network });
        this.privateKey = privateKey;
    }
    
    async bridgeForYield(
        token,
        amount,
        fromChain,
        toChain,
        currentApy,
        targetApy
    ) {
        // Calculate costs
        const bridgeCost = await this.estimateBridgeCost(token, fromChain, toChain);
        const gasCost = await this.estimateGasCost(toChain);
        const totalCost = bridgeCost + gasCost;
        
        // Calculate ROI
        const apyImprovement = targetApy - currentApy;
        if (apyImprovement <= 0) {
            return { shouldBridge: false, reason: 'No APY improvement' };
        }
        
        const dailyImprovement = (amount * apyImprovement / 100) / 365;
        const roiDays = dailyImprovement > 0 ? totalCost / dailyImprovement : Infinity;
        
        // Only bridge if ROI < 30 days
        if (roiDays > 30) {
            return {
                shouldBridge: false,
                roiDays,
                reason: \`ROI too long: \${roiDays.toFixed(1)} days\`
            };
        }
        
        // Execute bridge
        console.log(\`✅ Bridging \${amount} \${token}: \${fromChain} → \${toChain}\`);
        console.log(\`   APY: \${currentApy}% → \${targetApy}% (+\${apyImprovement}%)\`);
        console.log(\`   Cost: \\$\${totalCost.toFixed(2)}, ROI in \${roiDays.toFixed(1)} days\`);
        
        const tx = await this.wh.bridge({
            token,
            amount,
            fromChain,
            toChain,
            recipient: this.getAddress()
        });
        
        return {
            shouldBridge: true,
            roiDays,
            txHash: tx.hash,
            bridgeCost,
            gasCost
        };
    }
    
    async monitorAndClaim(txHash, targetChain) {
        console.log(\`🔍 Monitoring bridge: \${txHash.slice(0, 8)}...\`);
        
        while (true) {
            const vaaStatus = await this.wh.getVaaStatus(txHash);
            
            if (vaaStatus.ready) {
                console.log(\`✅ VAA ready! Claiming on \${targetChain}...\`);
                const claimTx = await this.wh.claimVaa(vaaStatus.vaa, targetChain);
                console.log(\`✅ Claim successful: \${claimTx.hash}\`);
                return claimTx.hash;
            } else if (vaaStatus.failed) {
                throw new Error(\`Bridge failed: \${vaaStatus.error}\`);
            } else {
                console.log(\`⏳ Waiting for VAA... (\${vaaStatus.confirmations}/15)\`);
                await new Promise(resolve => setTimeout(resolve, 30000));
            }
        }
    }
}`;

  const completeAgentCode = `import asyncio
from openai import OpenAI
from wormhole_bridge import WormholeAIBridge
import requests

class CompleteYieldAgent:
    """Complete AI agent with LLM + Wormhole integration"""
    
    def __init__(self, openai_key, wallet_key):
        self.llm = OpenAI(api_key=openai_key)
        self.bridge = WormholeAIBridge(private_key=wallet_key, network="testnet")
        self.tempo_api = "https://fhmyhvrejofybzdgzxdc.supabase.co/functions/v1"
    
    def fetch_portfolio(self, evm_address):
        """Get current portfolio from Tempo"""
        response = requests.post(
            f"{self.tempo_api}/wormhole-portfolio-fetcher",
            json={"evmAddress": evm_address}
        )
        return response.json()
    
    def fetch_yields(self):
        """Get current DeFi yields from Tempo"""
        response = requests.post(f"{self.tempo_api}/fetch-defi-yields")
        return response.json()
    
    async def make_decision(self, portfolio, yields):
        """Use LLM to analyze and decide action"""
        prompt = f"""
You are an expert DeFi AI agent managing a portfolio.

CURRENT PORTFOLIO:
{portfolio}

AVAILABLE YIELDS:
{yields}

RULES:
- Only bridge if APY improvement > 1% AND ROI < 30 days
- Consider bridge cost (~$8) and gas costs
- Prefer established protocols (Aave, Compound)
- Return JSON with: action, token, amount, from_chain, to_chain, 
  target_protocol, reasoning

Decide the optimal action.
        """
        
        response = self.llm.chat.completions.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"},
            temperature=0.3
        )
        
        return json.loads(response.choices[0].message.content)
    
    async def execute_decision(self, decision):
        """Execute the AI's decision via Wormhole"""
        if decision['action'] == 'bridge_and_deposit':
            # Get current and target APYs
            current_apy = decision.get('current_apy', 0)
            target_apy = decision.get('target_apy', 5.0)
            
            # Bridge with ROI calculation
            result = await self.bridge.bridge_for_yield(
                token=decision['token'],
                amount=decision['amount'],
                from_chain=decision['from_chain'],
                to_chain=decision['to_chain'],
                current_apy=current_apy,
                target_apy=target_apy
            )
            
            if not result['should_bridge']:
                print(f"⏸️  Bridge declined: {result['reason']}")
                return result
            
            # Monitor and claim
            claim_tx = await self.bridge.monitor_and_claim(
                tx_hash=result['tx_hash'],
                target_chain=decision['to_chain']
            )
            
            # TODO: Deposit to target protocol (Aave, Compound, etc.)
            print(f"✅ Ready to deposit to {decision['target_protocol']}")
            
            return {
                'success': True,
                'bridge_tx': result['tx_hash'],
                'claim_tx': claim_tx,
                'roi_days': result['roi_days']
            }
        
        elif decision['action'] == 'hold':
            print("⏸️  AI decided to hold current positions")
            return {'success': True, 'action': 'hold'}
    
    async def run_cycle(self, evm_address):
        """Run one complete agent cycle"""
        print("\\n🤖 AI Agent Starting Cycle...")
        
        # 1. Fetch data
        print("📊 Fetching portfolio and yields...")
        portfolio = self.fetch_portfolio(evm_address)
        yields = self.fetch_yields()
        
        # 2. AI makes decision
        print("🧠 AI analyzing opportunities...")
        decision = await self.make_decision(portfolio, yields)
        print(f"💡 Decision: {decision['action']}")
        print(f"📝 Reasoning: {decision['reasoning']}")
        
        # 3. Execute via Wormhole
        result = await self.execute_decision(decision)
        
        print(f"\\n✅ Cycle complete!")
        return result

# Run the agent
async def main():
    agent = CompleteYieldAgent(
        openai_key="sk-...",
        wallet_key="0x..."
    )
    
    # Run once
    result = await agent.run_cycle(evm_address="0x...")
    print(f"\\nResult: {result}")
    
    # Or run on schedule (every 6 hours)
    # while True:
    #     await agent.run_cycle(evm_address="0x...")
    #     await asyncio.sleep(6 * 3600)

asyncio.run(main())`;

  return (
    <PageLayout>
      <div className="space-y-12">
        <div>
          <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm mb-4">
            <span className="text-primary">Critical</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Wormhole Integration for AI Agents</h1>
          <p className="text-xl text-muted-foreground">
            Learn how to integrate Wormhole cross-chain bridging into your AI trading agents
          </p>
        </div>

      <DocSection title="Why Wormhole for AI Agents">
        <p className="text-lg mb-6">
          Wormhole enables AI agents to optimize yields across all major blockchains seamlessly. 
          Without Wormhole, your agent is limited to a single chain. With Wormhole, your agent 
          can automatically move assets to wherever the best yields are.
        </p>

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="border rounded-lg p-4">
            <Zap className="h-8 w-8 text-primary mb-3" />
            <h4 className="font-semibold mb-2">Cross-Chain Flexibility</h4>
            <p className="text-sm text-muted-foreground">
              Access yields on Ethereum, Arbitrum, Optimism, Base, Polygon, Solana, and more 
              from a single agent
            </p>
          </div>
          <div className="border rounded-lg p-4">
            <Shield className="h-8 w-8 text-primary mb-3" />
            <h4 className="font-semibold mb-2">Security</h4>
            <p className="text-sm text-muted-foreground">
              Wormhole's Guardian network validates every transfer, ensuring assets are secure 
              during cross-chain operations
            </p>
          </div>
          <div className="border rounded-lg p-4">
            <Clock className="h-8 w-8 text-primary mb-3" />
            <h4 className="font-semibold mb-2">Fast Finality</h4>
            <p className="text-sm text-muted-foreground">
              Most bridges complete in 15-30 minutes, allowing agents to quickly reposition 
              for better yields
            </p>
          </div>
        </div>
      </DocSection>

      <DocSection title="Cross-Chain Decision Flow">
        <p className="mb-6">
          Here's how AI agents integrate Wormhole into their decision-making process:
        </p>

        <Mermaid
          chart={`
graph TB
    A[AI Agent Analyzes Market] --> B{Better Yield Available?}
    B -->|No| C[Hold Current Position]
    B -->|Yes| D{Same Chain?}
    
    D -->|Yes| E[Direct Deposit]
    D -->|No| F[Calculate Bridge ROI]
    
    F --> G{ROI < 30 days?}
    G -->|No| C
    G -->|Yes| H[Initiate Wormhole Bridge]
    
    H --> I[Monitor VAA Status]
    I --> J{VAA Ready?}
    J -->|No| I
    J -->|Yes| K[Auto-Claim on Destination]
    
    K --> L[Deposit to Target Protocol]
    E --> L
    L --> M[Monitor Position]
    M --> N[Schedule Next Check]
    N --> A
    
    style A fill:#8b5cf6
    style H fill:#3b82f6
    style K fill:#10b981
          `}
        />
      </DocSection>

      <DocSection title="ROI-Based Bridging Logic">
        <p className="mb-4">
          Smart AI agents don't bridge blindly. They calculate Return on Investment (ROI) 
          to ensure bridge costs are justified:
        </p>

        <Alert className="mb-6">
          <Zap className="h-4 w-4" />
          <AlertDescription>
            <strong>Bridge Cost Formula:</strong> <code>ROI Days = (Bridge Cost + Gas Cost) / Daily APY Improvement</code>
            <br />
            <strong>Rule:</strong> Only bridge if ROI {'<'} 30 days (typically means APY improvement {'>'} 1%)
          </AlertDescription>
        </Alert>

        <div className="bg-muted/50 rounded-lg p-6 mb-6">
          <h4 className="font-semibold mb-3">Example Calculation</h4>
          <div className="space-y-2 text-sm font-mono">
            <div><strong>Scenario:</strong> Bridge $1,000 USDC from Ethereum to Arbitrum</div>
            <div className="pl-4">
              <div>• Current Ethereum APY: 3.1%</div>
              <div>• Target Arbitrum APY: 5.2%</div>
              <div>• APY Improvement: 2.1%</div>
              <div>• Bridge Cost: $8</div>
              <div>• Gas Cost: $0.50</div>
              <div>• Total Cost: $8.50</div>
            </div>
            <div className="pt-2"><strong>Calculation:</strong></div>
            <div className="pl-4">
              <div>• Daily improvement: ($1,000 × 2.1%) / 365 = $0.0575/day</div>
              <div>• ROI Days: $8.50 / $0.0575 = <span className="text-green-600 font-bold">14.8 days ✅</span></div>
            </div>
            <div className="pt-2 text-green-600"><strong>Decision: Bridge (ROI {'<'} 30 days)</strong></div>
          </div>
        </div>
      </DocSection>

      <DocSection title="Implementation: Python">
        <h3 className="text-xl font-semibold mb-4">Wormhole Bridge Class with ROI Logic</h3>
        <CodeBlock code={pythonBridgeCode} language="python" />
      </DocSection>

      <DocSection title="Implementation: JavaScript">
        <h3 className="text-xl font-semibold mb-4">JavaScript/TypeScript Version</h3>
        <CodeBlock code={jsBridgeCode} language="javascript" />
      </DocSection>

      <DocSection title="Complete Agent Example">
        <p className="mb-4">
          Here's a complete AI agent that combines LLM decision-making with Wormhole bridging:
        </p>
        <CodeBlock code={completeAgentCode} language="python" />
      </DocSection>

      <DocSection title="VAA Monitoring & Auto-Claiming">
        <h3 className="text-xl font-semibold mb-4">Understanding VAA (Verified Action Approval)</h3>
        <p className="mb-4">
          When you bridge via Wormhole, the transaction goes through this flow:
        </p>

        <Mermaid
          chart={`
sequenceDiagram
    participant Agent as AI Agent
    participant Source as Source Chain
    participant Guardians as Wormhole Guardians
    participant Dest as Destination Chain
    
    Agent->>Source: Lock tokens
    Source->>Guardians: Emit LogMessage event
    Guardians->>Guardians: Validate (15/19 signatures)
    Guardians->>Agent: VAA available
    Agent->>Dest: Submit VAA
    Dest->>Agent: Release bridged tokens
    Agent->>Agent: Continue with deposit
          `}
        />

        <p className="mt-6 mb-4">
          Your AI agent should poll for VAA status every 30 seconds and auto-claim when ready:
        </p>

        <div className="bg-muted/50 rounded-lg p-4 mb-6">
          <h4 className="font-semibold mb-2">Polling Best Practices</h4>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
            <li><strong>Interval:</strong> 30 seconds (balance between responsiveness and API limits)</li>
            <li><strong>Timeout:</strong> 60 minutes (if not ready by then, investigate)</li>
            <li><strong>Auto-retry:</strong> Retry claim up to 3 times if it fails</li>
            <li><strong>Notifications:</strong> Alert on success/failure for monitoring</li>
          </ul>
        </div>
      </DocSection>

      <DocSection title="Gas Optimization Strategies">
        <h3 className="text-xl font-semibold mb-4">Minimize Gas Costs</h3>
        
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="border rounded-lg p-4">
            <h4 className="font-semibold mb-3">Chain Selection</h4>
            <div className="space-y-2 text-sm">
              <div><strong>Ethereum Mainnet:</strong> $5-20 gas (avoid for small amounts)</div>
              <div><strong>Arbitrum:</strong> $0.50-2 gas (good balance)</div>
              <div><strong>Optimism:</strong> $0.30-1 gas (cost-effective)</div>
              <div><strong>Base:</strong> $0.20-0.50 gas (best for frequent ops)</div>
              <div><strong>Polygon:</strong> $0.10-0.30 gas (cheapest)</div>
            </div>
          </div>

          <div className="border rounded-lg p-4">
            <h4 className="font-semibold mb-3">Timing Strategy</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Bridge during low congestion (weekends, off-hours)</li>
              <li>Batch multiple operations when possible</li>
              <li>Use L2s (Arbitrum, Optimism, Base) as primary destinations</li>
              <li>Only use Ethereum mainnet for large amounts ({'>'} $50k)</li>
            </ul>
          </div>
        </div>
      </DocSection>

      <DocSection title="Error Handling & Recovery">
        <h3 className="text-xl font-semibold mb-4">Common Issues & Solutions</h3>
        
        <div className="space-y-4">
          <div className="border-l-4 border-red-500 pl-4">
            <h4 className="font-semibold mb-1">Bridge Transaction Failed</h4>
            <p className="text-sm text-muted-foreground mb-2">
              <strong>Causes:</strong> Insufficient balance, gas price too low, RPC timeout
            </p>
            <p className="text-sm">
              <strong>Solution:</strong> Pre-validate balance, use dynamic gas pricing, retry with higher gas
            </p>
          </div>

          <div className="border-l-4 border-yellow-500 pl-4">
            <h4 className="font-semibold mb-1">VAA Not Available After 30 Minutes</h4>
            <p className="text-sm text-muted-foreground mb-2">
              <strong>Causes:</strong> Source chain reorg, Guardian network delay, invalid transaction
            </p>
            <p className="text-sm">
              <strong>Solution:</strong> Check transaction status on source chain, query WormholeScan API directly
            </p>
          </div>

          <div className="border-l-4 border-orange-500 pl-4">
            <h4 className="font-semibold mb-1">Claim Transaction Reverted</h4>
            <p className="text-sm text-muted-foreground mb-2">
              <strong>Causes:</strong> VAA already claimed, insufficient gas, destination chain congestion
            </p>
            <p className="text-sm">
              <strong>Solution:</strong> Check if already claimed (query balance), increase gas limit, retry after delay
            </p>
          </div>
        </div>
      </DocSection>

      <DocSection title="Testing Your Integration">
        <h3 className="text-xl font-semibold mb-4">Testnet Testing Checklist</h3>
        
        <div className="bg-muted/50 rounded-lg p-6">
          <ol className="list-decimal list-inside space-y-3">
            <li className="font-semibold">
              Get Testnet Funds
              <p className="text-sm font-normal text-muted-foreground ml-6 mt-1">
                Sepolia ETH: <a href="https://sepoliafaucet.com" className="text-primary hover:underline">sepoliafaucet.com</a><br />
                Base Sepolia: <a href="https://docs.base.org/tools/network-faucets" className="text-primary hover:underline">Base faucets</a>
              </p>
            </li>
            <li className="font-semibold">
              Test Simple Bridge
              <p className="text-sm font-normal text-muted-foreground ml-6 mt-1">
                Bridge 1 USDC from Sepolia to Base Sepolia, verify VAA, claim manually
              </p>
            </li>
            <li className="font-semibold">
              Test Auto-Claim
              <p className="text-sm font-normal text-muted-foreground ml-6 mt-1">
                Run your monitoring script, verify it auto-claims within 1 minute of VAA availability
              </p>
            </li>
            <li className="font-semibold">
              Test ROI Logic
              <p className="text-sm font-normal text-muted-foreground ml-6 mt-1">
                Mock different APY scenarios, verify agent only bridges when profitable
              </p>
            </li>
            <li className="font-semibold">
              Test Error Recovery
              <p className="text-sm font-normal text-muted-foreground ml-6 mt-1">
                Simulate failures (insufficient balance, wrong chain), verify graceful handling
              </p>
            </li>
          </ol>
        </div>
      </DocSection>

      <DocSection title="Next Steps">
        <p className="mb-6">
          Now that you understand Wormhole integration, build your complete AI agent:
        </p>
        
        <div className="flex gap-4">
          <a 
            href="/docs/ai-agent/build-your-own" 
            className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Complete Tutorial →
          </a>
          <a 
            href="/docs/ai-agent/training-data" 
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-6 py-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
          >
            Training Data →
          </a>
        </div>
      </DocSection>
      </div>
    </PageLayout>
  );
};

export default AIAgentWormhole;
