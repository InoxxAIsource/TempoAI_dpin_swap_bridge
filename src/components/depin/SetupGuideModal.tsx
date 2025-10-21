import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Copy, Download, ExternalLink, Terminal, Check } from 'lucide-react';
import { useState } from 'react';

interface SetupGuideModalProps {
  open: boolean;
  onClose: () => void;
  deviceId: string;
}

const SetupGuideModal = ({ open, onClose, deviceId }: SetupGuideModalProps) => {
  const [copiedDeviceId, setCopiedDeviceId] = useState(false);
  const [copiedPublicKey, setCopiedPublicKey] = useState(false);
  
  const publicKey = `tempo_${deviceId}_pk_${Math.random().toString(36).substring(7)}`;

  const copyToClipboard = (text: string, setCopied: (val: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadPythonScript = () => {
    const scriptContent = `#!/usr/bin/env python3
"""
Tempo DePIN Client
Collects device metrics and reports them to the Tempo network
"""
import json
import time
import requests
import psutil
import platform
from datetime import datetime
from nacl.signing import SigningKey
from nacl.encoding import Base64Encoder
import sys
import logging

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


class TempoDePINClient:
    def __init__(self, config_path):
        with open(config_path, 'r') as f:
            self.config = json.load(f)
        
        self.device_id = self.config['device_id']
        self.public_key = self.config['public_key']
        self.api_endpoint = self.config['api_endpoint']
        self.report_interval = self.config.get('report_interval', 30)
        
        # Generate signing key (in production, load from secure storage)
        self.signing_key = SigningKey.generate()
        logger.info(f"Initialized client for device: {self.device_id}")
    
    def collect_metrics(self):
        """Collect system metrics"""
        try:
            metrics = {
                'cpu_percent': psutil.cpu_percent(interval=1),
                'memory_percent': psutil.virtual_memory().percent,
                'disk_percent': psutil.disk_usage('/').percent,
                'uptime_seconds': int(time.time() - psutil.boot_time()),
                'platform': platform.system(),
                'timestamp': datetime.utcnow().isoformat()
            }
            
            # Network stats
            net_io = psutil.net_io_counters()
            metrics['bytes_sent'] = net_io.bytes_sent
            metrics['bytes_recv'] = net_io.bytes_recv
            
            logger.info(f"Collected metrics: CPU {metrics['cpu_percent']}%, Memory {metrics['memory_percent']}%")
            return metrics
        except Exception as e:
            logger.error(f"Error collecting metrics: {e}")
            return None
    
    def sign_data(self, data):
        """Sign data with device's private key"""
        try:
            message = json.dumps(data, sort_keys=True).encode()
            signed = self.signing_key.sign(message)
            signature = signed.signature
            return Base64Encoder.encode(signature).decode()
        except Exception as e:
            logger.error(f"Error signing data: {e}")
            return None
    
    def report_metrics(self, metrics):
        """Send metrics to the Tempo network"""
        try:
            signature = self.sign_data(metrics)
            
            payload = {
                'device_id': self.device_id,
                'metrics': metrics,
                'signature': signature
            }
            
            response = requests.post(
                self.api_endpoint,
                json=payload,
                headers={'Content-Type': 'application/json'},
                timeout=10
            )
            
            if response.status_code == 200:
                result = response.json()
                logger.info(f"✓ Metrics reported successfully. Reward: {result.get('reward_amount', 0)} TEMPO")
                return True
            else:
                logger.error(f"Failed to report metrics: {response.status_code} - {response.text}")
                return False
                
        except requests.exceptions.RequestException as e:
            logger.error(f"Network error reporting metrics: {e}")
            return False
        except Exception as e:
            logger.error(f"Error reporting metrics: {e}")
            return False
    
    def run(self):
        """Main loop - collect and report metrics"""
        logger.info(f"Starting Tempo DePIN client (reporting every {self.report_interval}s)")
        logger.info(f"Press Ctrl+C to stop")
        
        try:
            while True:
                metrics = self.collect_metrics()
                if metrics:
                    self.report_metrics(metrics)
                else:
                    logger.warning("Skipping report due to metric collection failure")
                
                time.sleep(self.report_interval)
                
        except KeyboardInterrupt:
            logger.info("\\nShutting down client...")
            sys.exit(0)


def main():
    if len(sys.argv) < 2:
        print("Usage: python client.py --config <config.json>")
        sys.exit(1)
    
    if sys.argv[1] != '--config' or len(sys.argv) < 3:
        print("Usage: python client.py --config <config.json>")
        sys.exit(1)
    
    config_path = sys.argv[2]
    
    try:
        client = TempoDePINClient(config_path)
        client.run()
    except FileNotFoundError:
        logger.error(f"Config file not found: {config_path}")
        sys.exit(1)
    except json.JSONDecodeError:
        logger.error(f"Invalid JSON in config file: {config_path}")
        sys.exit(1)
    except Exception as e:
        logger.error(f"Failed to start client: {e}")
        sys.exit(1)


if __name__ == '__main__':
    main()
`;

    const blob = new Blob([scriptContent], { type: 'text/x-python' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'client.py';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const downloadRequirements = () => {
    const requirements = `# Tempo DePIN Client Requirements
requests>=2.31.0
psutil>=5.9.0
PyNaCl>=1.5.0
`;

    const blob = new Blob([requirements], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'requirements.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Connect Your Raspberry Pi</DialogTitle>
          <DialogDescription>
            Follow these steps to connect your real hardware and start earning 2x rewards
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Step 1 */}
          <div className="border-l-4 border-primary pl-4">
            <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm">
                1
              </span>
              Install Python Client
            </h3>
            <p className="text-sm text-muted-foreground mb-3">
              Download and install the Tempo DePIN client on your Raspberry Pi
            </p>
            <div className="bg-muted rounded-lg p-4 font-mono text-sm space-y-2">
              <div>$ git clone https://github.com/tempo-protocol/depin-client.git</div>
              <div>$ cd depin-client</div>
              <div>$ pip install -r requirements.txt</div>
            </div>
            <div className="flex gap-2 mt-3">
              <Button variant="outline" size="sm" className="gap-2" onClick={downloadPythonScript}>
                <Download className="w-4 h-4" />
                Download client.py
              </Button>
              <Button variant="outline" size="sm" className="gap-2" onClick={downloadRequirements}>
                <Download className="w-4 h-4" />
                Download requirements.txt
              </Button>
            </div>
          </div>

          {/* Step 2 */}
          <div className="border-l-4 border-primary pl-4">
            <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm">
                2
              </span>
              Configure Device
            </h3>
            <p className="text-sm text-muted-foreground mb-3">
              Copy your device credentials below
            </p>
            
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium block mb-1">Device ID</label>
                <div className="flex gap-2">
                  <div className="bg-muted rounded-lg p-3 font-mono text-sm flex-1 break-all">
                    {deviceId}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(deviceId, setCopiedDeviceId)}
                  >
                    {copiedDeviceId ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium block mb-1">Public Key</label>
                <div className="flex gap-2">
                  <div className="bg-muted rounded-lg p-3 font-mono text-sm flex-1 break-all">
                    {publicKey}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(publicKey, setCopiedPublicKey)}
                  >
                    {copiedPublicKey ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="border-l-4 border-primary pl-4">
            <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm">
                3
              </span>
              Create Config File
            </h3>
            <p className="text-sm text-muted-foreground mb-3">
              Create a config.json file with your device credentials
            </p>
            <div className="bg-muted rounded-lg p-4 font-mono text-sm">
              <pre>{`{
  "device_id": "${deviceId}",
  "public_key": "${publicKey}",
  "api_endpoint": "https://fhmyhvrejofybzdgzxdc.supabase.co/functions/v1/report-device-event",
  "report_interval": 30
}`}</pre>
            </div>
          </div>

          {/* Step 4 */}
          <div className="border-l-4 border-primary pl-4">
            <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm">
                4
              </span>
              Run Client
            </h3>
            <p className="text-sm text-muted-foreground mb-3">
              Start the client to begin reporting metrics
            </p>
            <div className="bg-muted rounded-lg p-4 font-mono text-sm">
              $ python client.py --config config.json
            </div>
          </div>

          {/* Help Section */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-blue-500" />
              Need Help?
            </h4>
            <p className="text-sm text-muted-foreground mb-3">
              Check out our comprehensive documentation or join our Discord community for support.
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-2" asChild>
                <a href="/depin-docs" target="_blank">
                  <ExternalLink className="w-4 h-4" />
                  Full Documentation
                </a>
              </Button>
              <Button variant="outline" size="sm" className="gap-2" asChild>
                <a href="https://discord.gg/tempo" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4" />
                  Join Discord
                </a>
              </Button>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <Button onClick={onClose}>
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SetupGuideModal;
