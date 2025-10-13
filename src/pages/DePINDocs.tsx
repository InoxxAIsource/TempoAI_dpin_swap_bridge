import PageLayout from '@/components/layout/PageLayout';
import PageHero from '@/components/layout/PageHero';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Globe, Zap, Shield, DollarSign, Terminal, HelpCircle, Activity, Code } from 'lucide-react';

const DePINDocs = () => {
  return (
    <PageLayout>
      <PageHero
        title="DePIN Documentation"
        description="Complete guide to the Tempo Decentralized Physical Infrastructure Network"
      />

      <section className="px-6 md:px-12 py-8 pb-20">
        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue="overview" className="space-y-8">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="setup">Setup</TabsTrigger>
              <TabsTrigger value="rewards">Rewards</TabsTrigger>
              <TabsTrigger value="faq">FAQ</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Globe className="w-8 h-8 text-primary" />
                  <h2 className="text-2xl font-bold">What is DePIN?</h2>
                </div>
                <div className="prose dark:prose-invert max-w-none">
                  <p>
                    DePIN (Decentralized Physical Infrastructure Networks) enables you to earn cryptocurrency rewards by contributing real-world infrastructure like solar panels, sensors, and IoT devices to a distributed network.
                  </p>
                  <p>
                    Tempo's DePIN network connects physical devices across the globe, verifies their performance metrics using cryptographic signatures, and rewards contributors with USDC that can be bridged across multiple blockchain networks.
                  </p>
                </div>
              </Card>

              <div className="grid md:grid-cols-2 gap-6">
                <Card className="p-6">
                  <Activity className="w-8 h-8 text-blue-500 mb-3" />
                  <h3 className="text-xl font-bold mb-2">Supported Device Types</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Solar Panels (energy production)</li>
                    <li>• Temperature Sensors</li>
                    <li>• Wind Turbines</li>
                    <li>• Weather Stations</li>
                    <li>• Custom IoT devices</li>
                  </ul>
                </Card>

                <Card className="p-6">
                  <Shield className="w-8 h-8 text-green-500 mb-3" />
                  <h3 className="text-xl font-bold mb-2">Demo vs Verified</h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="font-semibold text-blue-600 dark:text-blue-400">Demo Mode (1x rewards)</p>
                      <p className="text-muted-foreground">Simulated devices for testing</p>
                    </div>
                    <div>
                      <p className="font-semibold text-green-600 dark:text-green-400">Verified Hardware (2x rewards)</p>
                      <p className="text-muted-foreground">Real devices with cryptographic proof</p>
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>

            {/* Setup Tab */}
            <TabsContent value="setup" className="space-y-6">
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Terminal className="w-8 h-8 text-primary" />
                  <h2 className="text-2xl font-bold">Raspberry Pi Setup Guide</h2>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-3">Requirements</h3>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>• Raspberry Pi (any model with GPIO)</li>
                      <li>• Python 3.8 or higher</li>
                      <li>• Sensors compatible with GPIO</li>
                      <li>• Stable internet connection</li>
                      <li>• SD card with Raspberry Pi OS</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-3">Installation Steps</h3>
                    <div className="space-y-4">
                      <div className="bg-muted rounded-lg p-4">
                        <p className="font-semibold mb-2">1. Install Dependencies</p>
                        <code className="text-sm block">
                          sudo apt-get update<br />
                          sudo apt-get install python3-pip git<br />
                          pip3 install RPi.GPIO requests
                        </code>
                      </div>

                      <div className="bg-muted rounded-lg p-4">
                        <p className="font-semibold mb-2">2. Clone Tempo DePIN Client</p>
                        <code className="text-sm block">
                          git clone https://github.com/tempo-protocol/depin-client.git<br />
                          cd depin-client<br />
                          pip3 install -r requirements.txt
                        </code>
                      </div>

                      <div className="bg-muted rounded-lg p-4">
                        <p className="font-semibold mb-2">3. Configure Device</p>
                        <p className="text-sm text-muted-foreground mb-2">
                          Create config.json with your device credentials from the dashboard
                        </p>
                        <code className="text-sm block">
                          {'{'}<br />
                          &nbsp;&nbsp;"device_id": "your_device_id",<br />
                          &nbsp;&nbsp;"public_key": "your_public_key",<br />
                          &nbsp;&nbsp;"api_endpoint": "https://api.tempo.dev/depin"<br />
                          {'}'}
                        </code>
                      </div>

                      <div className="bg-muted rounded-lg p-4">
                        <p className="font-semibold mb-2">4. Run Client</p>
                        <code className="text-sm block">
                          python3 client.py --config config.json
                        </code>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <Code className="w-8 h-8 text-primary mb-3" />
                <h3 className="text-xl font-bold mb-3">Hardware Wiring</h3>
                <p className="text-muted-foreground mb-4">
                  Connect your sensors to the Raspberry Pi GPIO pins according to your sensor specifications. Common configurations:
                </p>
                <div className="bg-muted rounded-lg p-4 font-mono text-sm">
                  <p>Solar Panel: GPIO 17 (data), 3.3V (power), GND</p>
                  <p>Temperature Sensor: GPIO 4 (data), 5V (power), GND</p>
                  <p>Wind Turbine: GPIO 27 (data), 5V (power), GND</p>
                </div>
              </Card>
            </TabsContent>

            {/* Rewards Tab */}
            <TabsContent value="rewards" className="space-y-6">
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <DollarSign className="w-8 h-8 text-primary" />
                  <h2 className="text-2xl font-bold">Reward Calculation</h2>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-3">Base Rates</h3>
                    <div className="bg-muted rounded-lg p-4 space-y-2">
                      <p>• <strong>Energy Production:</strong> $0.05 per kWh</p>
                      <p>• <strong>Sensor Data:</strong> $0.01 per verified reading</p>
                      <p>• <strong>Uptime Bonus:</strong> +10% for 99%+ uptime</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-3">Multipliers</h3>
                    <div className="grid gap-4">
                      <div className="border-l-4 border-blue-500 pl-4 bg-blue-500/5 p-3 rounded-r-lg">
                        <p className="font-semibold">Demo Mode: 1x</p>
                        <p className="text-sm text-muted-foreground">Simulated devices for testing purposes</p>
                      </div>
                      <div className="border-l-4 border-green-500 pl-4 bg-green-500/5 p-3 rounded-r-lg">
                        <p className="font-semibold">Verified Hardware: 2x</p>
                        <p className="text-sm text-muted-foreground">Real devices with cryptographic signatures</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-3">Example Calculation</h3>
                    <div className="bg-gradient-to-br from-green-500/10 to-blue-500/10 rounded-lg p-6">
                      <p className="text-sm text-muted-foreground mb-4">Solar Panel - 35 kWh/day production</p>
                      <div className="space-y-2 font-mono text-sm">
                        <p>Demo device: 35 kWh × $0.05 × 1 = <strong>$1.75/day</strong></p>
                        <p className="text-green-600 dark:text-green-400">
                          Verified device: 35 kWh × $0.05 × 2 = <strong>$3.50/day</strong>
                        </p>
                        <p className="text-lg font-bold mt-4">
                          Monthly earnings: <span className="text-primary">~$105</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-3">Cross-Chain Bridging</h3>
                    <p className="text-muted-foreground mb-3">
                      Rewards are distributed in USDC (testnet) and can be bridged to:
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="bg-muted p-3 rounded">Ethereum</div>
                      <div className="bg-muted p-3 rounded">Polygon</div>
                      <div className="bg-muted p-3 rounded">Avalanche</div>
                      <div className="bg-muted p-3 rounded">Base</div>
                      <div className="bg-muted p-3 rounded">Arbitrum</div>
                      <div className="bg-muted p-3 rounded">Optimism</div>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* FAQ Tab */}
            <TabsContent value="faq" className="space-y-6">
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <HelpCircle className="w-8 h-8 text-primary" />
                  <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
                </div>

                <div className="space-y-6">
                  {[
                    {
                      q: 'How often are rewards calculated?',
                      a: 'Rewards are calculated every 24 hours based on device metrics from the previous day. You can see pending rewards in real-time on the dashboard.',
                    },
                    {
                      q: 'Can I add more devices later?',
                      a: 'Yes! You can add unlimited devices to your account. Each device earns rewards independently.',
                    },
                    {
                      q: 'What happens if my device goes offline?',
                      a: 'Offline devices do not earn rewards. Your device needs to maintain at least 95% uptime to qualify for the uptime bonus.',
                    },
                    {
                      q: 'How do I verify my device?',
                      a: 'Verification requires a Raspberry Pi with the Tempo DePIN client installed. The client signs metrics cryptographically, proving your device is real.',
                    },
                    {
                      q: 'Are rewards on mainnet or testnet?',
                      a: 'Currently, Tempo DePIN operates on testnet. Mainnet launch is planned for Q2 2025.',
                    },
                    {
                      q: 'Can I use the same Raspberry Pi for multiple devices?',
                      a: 'Yes, a single Raspberry Pi can manage multiple sensors/devices, each registered separately with unique device IDs.',
                    },
                    {
                      q: 'What if I need technical support?',
                      a: 'Join our Discord community or check the troubleshooting section in the docs. Our team responds within 24 hours.',
                    },
                  ].map((faq, index) => (
                    <div key={index} className="border-l-4 border-primary pl-4">
                      <h3 className="font-semibold mb-2">{faq.q}</h3>
                      <p className="text-muted-foreground">{faq.a}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </PageLayout>
  );
};

export default DePINDocs;
