import PageLayout from '@/components/layout/PageLayout';
import PageHero from '@/components/layout/PageHero';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Book, TrendingUp, Shield } from 'lucide-react';
import CompleteFlowDiagram from '@/components/depin/CompleteFlowDiagram';
import DePINTimeline from '@/components/depin/DePINTimeline';
import ComparisonCards from '@/components/depin/ComparisonCards';
import BenefitsShowcase from '@/components/depin/BenefitsShowcase';
import WormholeExplainer from '@/components/depin/WormholeExplainer';
import CalculationExamples from '@/components/depin/CalculationExamples';
import ROICalculator from '@/components/depin/ROICalculator';
import LearningPath from '@/components/depin/LearningPath';

const DePINDocs = () => {
  return (
    <PageLayout>
      <PageHero
        title="DePIN Documentation"
        description="Complete guide to the Tempo Decentralized Physical Infrastructure Network"
      />

      <section className="px-6 md:px-12 py-8 pb-20">
        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue="getting-started" className="space-y-8">
            <TabsList className="grid w-full grid-cols-7">
              <TabsTrigger value="getting-started">Getting Started</TabsTrigger>
              <TabsTrigger value="benefits">Benefits</TabsTrigger>
              <TabsTrigger value="wormhole">Wormhole</TabsTrigger>
              <TabsTrigger value="economics">Economics</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
              <TabsTrigger value="faq">FAQ</TabsTrigger>
              <TabsTrigger value="learning">Learning</TabsTrigger>
            </TabsList>

            
        {/* Getting Started Tab */}
        <TabsContent value="getting-started" className="space-y-8">
          <Card className="p-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-4">Welcome to DePIN</h2>
              <p className="text-lg text-muted-foreground">
                Decentralized Physical Infrastructure Networks (DePIN) enable you to earn passive income 
                from physical hardware like solar panels, sensors, and IoT devices. Your devices contribute 
                to a global, decentralized network while you earn cryptocurrency rewards.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <Card className="p-6 bg-primary/5 border-primary/20">
                <Book className="w-8 h-8 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-2">What is DePIN?</h3>
                <p className="text-muted-foreground">
                  DePIN stands for Decentralized Physical Infrastructure Networks. It's a new paradigm 
                  where individuals own and operate physical infrastructure, earning rewards for 
                  contributing to the network.
                </p>
              </Card>
              <Card className="p-6 bg-purple-500/5 border-purple-500/20">
                <TrendingUp className="w-8 h-8 text-purple-400 mb-4" />
                <h3 className="text-xl font-bold mb-2">Why Participate?</h3>
                <p className="text-muted-foreground">
                  Turn idle hardware into income streams ($50-500+/month), contribute to decentralized 
                  infrastructure, and access cross-chain DeFi opportunities.
                </p>
              </Card>
            </div>
          </Card>

          <CompleteFlowDiagram />
          
          <DePINTimeline />

          <Card className="p-8 bg-gradient-to-r from-green-500/10 to-blue-500/10 border-green-500/20">
            <h3 className="text-2xl font-bold mb-4">5-Minute Quick Start</h3>
            <ol className="space-y-4">
              <li className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <div className="font-semibold mb-1">Visit the DePIN Dashboard</div>
                  <div className="text-sm text-muted-foreground">Navigate to /depin to see your overview</div>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <div className="font-semibold mb-1">Choose Demo or Real Hardware</div>
                  <div className="text-sm text-muted-foreground">Start with demo mode to explore, or connect real devices</div>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <div className="font-semibold mb-1">Watch Metrics Appear</div>
                  <div className="text-sm text-muted-foreground">See your devices reporting and earnings accumulating</div>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center font-bold">
                  4
                </div>
                <div>
                  <div className="font-semibold mb-1">Bridge Your Rewards</div>
                  <div className="text-sm text-muted-foreground">Use Wormhole to transfer earnings to any supported chain</div>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center font-bold">
                  5
                </div>
                <div>
                  <div className="font-semibold mb-1">Integrate with DeFi</div>
                  <div className="text-sm text-muted-foreground">Deposit in yield protocols to stack earnings</div>
                </div>
              </li>
            </ol>
          </Card>
        </TabsContent>

        {/* Benefits Tab */}
        <TabsContent value="benefits" className="space-y-8">
          <BenefitsShowcase />
          <ComparisonCards />
        </TabsContent>

        {/* Wormhole Tab */}
        <TabsContent value="wormhole" className="space-y-8">
          <WormholeExplainer />
        </TabsContent>

        {/* Economics Tab */}
        <TabsContent value="economics" className="space-y-8">
          <CalculationExamples />
          <ROICalculator />
        </TabsContent>

        {/* Advanced Tab */}
        <TabsContent value="advanced" className="space-y-8">
          <Card className="p-8">
            <h2 className="text-3xl font-bold mb-6">Advanced Topics</h2>
            
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold mb-4">Cryptographic Signatures (Ed25519)</h3>
                <p className="text-muted-foreground mb-4">
                  Every metric reported by verified devices is signed using Ed25519 cryptography. This 
                  ensures data integrity and prevents tampering.
                </p>
                <Card className="p-4 bg-muted/30">
                  <pre className="text-sm overflow-x-auto">
{`// Device signs metric with private key
const signature = ed25519.sign(
  message: metricData,
  privateKey: devicePrivateKey
);

// Backend verifies with public key
const isValid = ed25519.verify(
  signature,
  message: metricData,
  publicKey: devicePublicKey
);`}
                  </pre>
                </Card>
              </div>

              <div>
                <h3 className="text-2xl font-bold mb-4">Device Registry Schema</h3>
                <p className="text-muted-foreground mb-4">
                  Devices are stored in a Supabase table with the following structure:
                </p>
                <Card className="p-4 bg-muted/30">
                  <pre className="text-sm overflow-x-auto">
{`Table: device_registry
├─ id: UUID (primary key)
├─ user_id: UUID (references auth.users)
├─ name: TEXT (device name)
├─ device_id: TEXT (unique identifier)
├─ type: TEXT (solar_panel, temperature_sensor, etc.)
├─ status: TEXT (online, offline)
├─ verified: BOOLEAN (true = 2x multiplier)
├─ public_key: TEXT (Ed25519 public key)
├─ metadata: JSONB (location, capacity, etc.)
├─ created_at: TIMESTAMP
└─ last_seen: TIMESTAMP`}
                  </pre>
                </Card>
              </div>

              <div>
                <h3 className="text-2xl font-bold mb-4">API Endpoints Reference</h3>
                <div className="space-y-4">
                  <Card className="p-4">
                    <div className="font-mono text-sm mb-2">POST /report-device-event</div>
                    <p className="text-sm text-muted-foreground">
                      Submit device metrics with cryptographic signature
                    </p>
                  </Card>
                  <Card className="p-4">
                    <div className="font-mono text-sm mb-2">GET /fetch-wallet-balances</div>
                    <p className="text-sm text-muted-foreground">
                      Retrieve cross-chain token balances
                    </p>
                  </Card>
                  <Card className="p-4">
                    <div className="font-mono text-sm mb-2">POST /wormhole-portfolio-fetcher</div>
                    <p className="text-sm text-muted-foreground">
                      Fetch portfolio data across Wormhole-connected chains
                    </p>
                  </Card>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-bold mb-4">Custom Device Types</h3>
                <p className="text-muted-foreground mb-4">
                  You can add custom device types by modifying the device metadata:
                </p>
                <Card className="p-4 bg-muted/30">
                  <pre className="text-sm overflow-x-auto">
{`{
  "type": "custom_iot_sensor",
  "reward_rate": 0.02,
  "metric_type": "air_quality_index",
  "reporting_interval": 300,
  "location": {
    "latitude": 37.7749,
    "longitude": -122.4194
  }
}`}
                  </pre>
                </Card>
              </div>

              <div>
                <h3 className="text-2xl font-bold mb-4">Security Best Practices</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex gap-2">
                    <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Store private keys securely on device (never share or transmit)</span>
                  </li>
                  <li className="flex gap-2">
                    <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Use hardware security modules (HSM) for high-value devices</span>
                  </li>
                  <li className="flex gap-2">
                    <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Rotate keys periodically (every 90 days recommended)</span>
                  </li>
                  <li className="flex gap-2">
                    <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Monitor for unusual device behavior or metrics</span>
                  </li>
                  <li className="flex gap-2">
                    <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Use separate wallets for device earnings vs personal holdings</span>
                  </li>
                </ul>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* FAQ Tab */}
        <TabsContent value="faq" className="space-y-6">
          <Card className="p-8">
            <h2 className="text-3xl font-bold mb-6">Frequently Asked Questions</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold mb-2">How do I get started?</h3>
                <p className="text-muted-foreground">
                  Visit the DePIN dashboard and choose between demo mode (instant setup) or real 
                  hardware (requires device configuration). Demo mode is perfect for learning the platform.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-2">What's the difference between demo and verified devices?</h3>
                <p className="text-muted-foreground">
                  Demo devices are simulated and earn 1x base rewards. Verified devices use real hardware 
                  with cryptographic signatures and earn 2x rewards plus a 10% uptime bonus.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-2">How are rewards calculated?</h3>
                <p className="text-muted-foreground">
                  Rewards = (Metric × Base Rate × Multiplier) + Uptime Bonus. For solar panels: 
                  35 kWh × $0.05 × 2 (verified) = $3.50/day or $105/month.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-2">What chains are supported via Wormhole?</h3>
                <p className="text-muted-foreground">
                  Ethereum, Polygon, Avalanche, Arbitrum, Optimism, Base, and BNB Chain. You can 
                  bridge your rewards to any of these chains.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-2">How long does it take to break even on hardware?</h3>
                <p className="text-muted-foreground">
                  For a Raspberry Pi (~$50) with a verified solar panel earning $3.50/day, you'll 
                  break even in approximately 14 days. Temperature sensors (~$5) break even in less than 1 day.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-2">Is this testnet or mainnet?</h3>
                <p className="text-muted-foreground">
                  Currently testnet. Rewards are for demonstration purposes. Mainnet launch is planned 
                  for Q2 2026 with real token economics.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-2">Can I combine DePIN rewards with DeFi yields?</h3>
                <p className="text-muted-foreground">
                  Yes! Bridge your DePIN earnings to chains like Polygon or Avalanche and deposit in 
                  yield protocols like Aave (6% APY) or provide liquidity (12%+ APY).
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-2">What happens if my device goes offline?</h3>
                <p className="text-muted-foreground">
                  You won't earn rewards during downtime. Devices with uptime {'>'} 99% receive a 10% 
                  bonus. Uptime is calculated over rolling 30-day periods.
                </p>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Learning Tab */}
        <TabsContent value="learning" className="space-y-8">
          <LearningPath />
        </TabsContent>
          </Tabs>
        </div>
      </section>
    </PageLayout>
  );
};

export default DePINDocs;
