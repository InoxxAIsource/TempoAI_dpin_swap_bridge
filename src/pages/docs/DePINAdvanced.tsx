import { Card } from '@/components/ui/card';
import { Shield } from 'lucide-react';

const DePINAdvanced = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-4">Advanced Topics</h1>
        <p className="text-xl text-muted-foreground">
          Deep dive into the technical implementation of DePIN devices and cryptographic security.
        </p>
      </div>

      <Card className="p-8">
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
  "reward_rate": 0.002,
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
    </div>
  );
};

export default DePINAdvanced;
