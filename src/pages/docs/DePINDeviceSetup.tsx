import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import CodeBlock from '@/components/docs/CodeBlock';
import DocHero from '@/components/docs/DocHero';
import Callout from '@/components/docs/Callout';
import DocSection from '@/components/docs/DocSection';
import { 
  Download, 
  Terminal, 
  Cpu, 
  CheckCircle2, 
  Shield, 
  Zap,
  Network,
  HardDrive,
  Gauge,
  AlertTriangle,
  Info,
  Rocket,
  Key,
  Settings,
  PlayCircle,
  FileCode,
  Package
} from 'lucide-react';

const DePINDeviceSetup = () => {
  const pythonClientCode = `#!/usr/bin/env python3
"""
Tempo DePIN Device Client
A Python client for reporting device metrics to the Tempo DePIN network.
Supports cryptographic signing for 2x reward multiplier.
"""

import json
import time
import requests
import psutil
import os
import sys
import argparse
from datetime import datetime
from pathlib import Path
from typing import Dict, Optional, List
import logging

# Optional: Ed25519 signing for verified devices (2x rewards)
try:
    import nacl.signing
    import nacl.encoding
    SIGNING_AVAILABLE = True
except ImportError:
    SIGNING_AVAILABLE = False
    print("⚠️  PyNaCl not installed. Running in unverified mode (1x rewards).")
    print("   Install with: pip install PyNaCl")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('tempo_client.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)


class TempoClient:
    """Main client for reporting device metrics to Tempo DePIN network."""
    
    def __init__(self, config_path: str):
        """Initialize the Tempo client with configuration."""
        self.config = self._load_config(config_path)
        self.device_id = self.config['device_id']
        self.api_endpoint = self.config['api_endpoint']
        self.report_interval = self.config.get('report_interval', 30)
        self.max_retries = self.config.get('max_retries', 3)
        self.max_buffer_size = self.config.get('max_buffer_size', 100)
        
        # Initialize signing key if available
        self.signing_key = None
        self.verify_key_hex = None
        if SIGNING_AVAILABLE:
            self._init_signing_key()
        
        # Offline buffer for failed reports
        self.offline_buffer: List[Dict] = []
        
        logger.info(f"✓ Tempo Client initialized for device: {self.device_id}")
        logger.info(f"✓ Reporting interval: {self.report_interval}s")
        logger.info(f"✓ API endpoint: {self.api_endpoint}")
        if self.signing_key:
            logger.info("✓ Cryptographic signing enabled (2x rewards)")
        else:
            logger.info("⚠️  Running in unverified mode (1x rewards)")
    
    def _load_config(self, config_path: str) -> Dict:
        """Load configuration from JSON file."""
        try:
            with open(config_path, 'r') as f:
                config = json.load(f)
            
            # Validate required fields
            required = ['device_id', 'api_endpoint']
            missing = [field for field in required if field not in config]
            if missing:
                raise ValueError(f"Missing required config fields: {missing}")
            
            return config
        except FileNotFoundError:
            logger.error(f"❌ Config file not found: {config_path}")
            sys.exit(1)
        except json.JSONDecodeError as e:
            logger.error(f"❌ Invalid JSON in config file: {e}")
            sys.exit(1)
        except ValueError as e:
            logger.error(f"❌ Configuration error: {e}")
            sys.exit(1)
    
    def _init_signing_key(self):
        """Initialize Ed25519 signing key from file or generate new one."""
        private_key_path = self.config.get('private_key_path', './device_key')
        key_path = Path(private_key_path)
        
        try:
            if key_path.exists():
                # Load existing key
                with open(key_path, 'rb') as f:
                    seed = f.read()
                self.signing_key = nacl.signing.SigningKey(seed)
                logger.info(f"✓ Loaded signing key from: {key_path}")
            else:
                # Generate new key
                self.signing_key = nacl.signing.SigningKey.generate()
                
                # Save key securely
                key_path.parent.mkdir(parents=True, exist_ok=True)
                with open(key_path, 'wb') as f:
                    f.write(self.signing_key.encode())
                
                # Set secure permissions (Unix only)
                if os.name != 'nt':  # Not Windows
                    os.chmod(key_path, 0o600)
                
                logger.info(f"✓ Generated new signing key: {key_path}")
                logger.warning(f"⚠️  IMPORTANT: Backup your key file: {key_path}")
            
            # Get verify key (public key)
            verify_key = self.signing_key.verify_key
            self.verify_key_hex = verify_key.encode(encoder=nacl.encoding.HexEncoder).decode('utf-8')
            logger.info(f"✓ Public key: {self.verify_key_hex[:16]}...")
            
        except Exception as e:
            logger.error(f"❌ Failed to initialize signing key: {e}")
            self.signing_key = None
    
    def collect_metrics(self) -> Dict:
        """Collect system metrics from the device."""
        try:
            # CPU usage
            cpu_percent = psutil.cpu_percent(interval=1)
            
            # Memory usage
            memory = psutil.virtual_memory()
            memory_percent = memory.percent
            
            # Disk usage
            disk = psutil.disk_usage('/')
            disk_percent = disk.percent
            
            # Network stats (basic)
            net_io = psutil.net_io_counters()
            
            # Simulated solar panel metrics (replace with actual sensor readings)
            # For real deployments, integrate with your specific hardware sensors
            energy_kwh = round(cpu_percent / 10, 2)  # Placeholder calculation
            uptime_hours = round(time.time() - psutil.boot_time()) / 3600
            
            metrics = {
                'timestamp': datetime.utcnow().isoformat() + 'Z',
                'energy_kwh': energy_kwh,
                'uptime_hours': round(uptime_hours, 2),
                'cpu_percent': cpu_percent,
                'memory_percent': memory_percent,
                'disk_percent': disk_percent,
                'bytes_sent': net_io.bytes_sent,
                'bytes_recv': net_io.bytes_recv,
                'reward_estimate': round(energy_kwh * 0.05, 4)
            }
            
            return metrics
        except Exception as e:
            logger.error(f"❌ Failed to collect metrics: {e}")
            return {}
    
    def sign_metrics(self, metrics: Dict) -> Optional[str]:
        """Sign metrics with Ed25519 private key."""
        if not self.signing_key:
            return None
        
        try:
            # Create canonical JSON string for signing
            message = json.dumps(metrics, sort_keys=True).encode('utf-8')
            
            # Sign the message
            signed = self.signing_key.sign(message)
            
            # Return signature as hex string
            signature_hex = signed.signature.hex()
            return signature_hex
        except Exception as e:
            logger.error(f"❌ Failed to sign metrics: {e}")
            return None
    
    def report_metrics(self, metrics: Dict) -> bool:
        """Report metrics to the Tempo API."""
        # Sign metrics if available
        signature = self.sign_metrics(metrics) if self.signing_key else None
        
        # Prepare payload
        payload = {
            'device_id': self.device_id,
            'metrics': metrics,
            'signature': signature,
            'public_key': self.verify_key_hex
        }
        
        # Send request
        for attempt in range(self.max_retries):
            try:
                response = requests.post(
                    self.api_endpoint,
                    json=payload,
                    headers={'Content-Type': 'application/json'},
                    timeout=10
                )
                
                if response.status_code == 200:
                    data = response.json()
                    verified = data.get('verified', False)
                    reward = data.get('reward_amount', 0)
                    
                    status = "✓ VERIFIED" if verified else "○ UNVERIFIED"
                    logger.info(f"{status} | Reward: {reward:.4f} ETH | Energy: {metrics['energy_kwh']} kWh")
                    return True
                else:
                    logger.warning(f"⚠️  Report failed (attempt {attempt + 1}/{self.max_retries}): {response.status_code}")
            
            except requests.exceptions.Timeout:
                logger.warning(f"⚠️  Request timeout (attempt {attempt + 1}/{self.max_retries})")
            except requests.exceptions.ConnectionError:
                logger.warning(f"⚠️  Connection error (attempt {attempt + 1}/{self.max_retries})")
            except Exception as e:
                logger.error(f"❌ Unexpected error: {e}")
            
            # Wait before retry (exponential backoff)
            if attempt < self.max_retries - 1:
                wait_time = 2 ** attempt
                time.sleep(wait_time)
        
        # All retries failed - add to offline buffer
        logger.error("❌ All retries failed. Buffering report for later.")
        self._buffer_report(payload)
        return False
    
    def _buffer_report(self, payload: Dict):
        """Buffer failed reports for later retry."""
        if len(self.offline_buffer) < self.max_buffer_size:
            self.offline_buffer.append(payload)
            logger.info(f"📦 Buffered report (buffer size: {len(self.offline_buffer)})")
        else:
            logger.warning(f"⚠️  Buffer full ({self.max_buffer_size}). Dropping oldest report.")
            self.offline_buffer.pop(0)
            self.offline_buffer.append(payload)
    
    def flush_buffer(self):
        """Attempt to send all buffered reports."""
        if not self.offline_buffer:
            return
        
        logger.info(f"📤 Flushing {len(self.offline_buffer)} buffered reports...")
        
        failed = []
        for payload in self.offline_buffer:
            try:
                response = requests.post(
                    self.api_endpoint,
                    json=payload,
                    headers={'Content-Type': 'application/json'},
                    timeout=10
                )
                
                if response.status_code == 200:
                    logger.info("✓ Buffered report sent successfully")
                else:
                    failed.append(payload)
            except:
                failed.append(payload)
        
        self.offline_buffer = failed
        if failed:
            logger.warning(f"⚠️  {len(failed)} reports still buffered")
        else:
            logger.info("✓ All buffered reports sent successfully")
    
    def run(self):
        """Main loop: collect and report metrics at regular intervals."""
        logger.info("🚀 Starting Tempo DePIN client...")
        logger.info(f"   Device ID: {self.device_id}")
        logger.info(f"   Report interval: {self.report_interval}s")
        logger.info("")
        
        try:
            while True:
                # Collect metrics
                metrics = self.collect_metrics()
                
                if metrics:
                    # Report to API
                    success = self.report_metrics(metrics)
                    
                    # Try to flush buffer if we're online
                    if success and self.offline_buffer:
                        self.flush_buffer()
                
                # Wait for next interval
                time.sleep(self.report_interval)
        
        except KeyboardInterrupt:
            logger.info("\\n🛑 Shutting down gracefully...")
            if self.offline_buffer:
                logger.info(f"📦 {len(self.offline_buffer)} reports still buffered")
            logger.info("✓ Client stopped")
            sys.exit(0)


def main():
    """Entry point for the Tempo DePIN client."""
    parser = argparse.ArgumentParser(description='Tempo DePIN Device Client')
    parser.add_argument(
        '--config',
        type=str,
        default='config.json',
        help='Path to configuration file (default: config.json)'
    )
    args = parser.parse_args()
    
    # Create and run client
    client = TempoClient(args.config)
    client.run()


if __name__ == '__main__':
    main()`;

  const requirementsCode = `requests>=2.31.0
psutil>=5.9.0
PyNaCl>=1.5.0`;

  const configCode = `{
  "device_id": "YOUR_DEVICE_ID",
  "api_endpoint": "https://fhmyhvrejofybzdgzxdc.supabase.co/functions/v1/report-device-event",
  "private_key_path": "/home/pi/.tempo/device_key",
  "report_interval": 30,
  "max_retries": 3,
  "max_buffer_size": 100
}`;

  const systemdServiceCode = `[Unit]
Description=Tempo DePIN Device Client
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User=pi
WorkingDirectory=/home/pi/tempo-client
ExecStart=/usr/bin/python3 /home/pi/tempo-client/client.py --config /home/pi/tempo-client/config.json
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target`;

  const downloadFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-12">
      <DocHero
        title="DePIN Device Setup Guide"
        description="Complete guide to setting up and running a Tempo DePIN device. Turn your Raspberry Pi or Linux device into an earning node with cryptographic verification for 2x rewards."
        icon={Terminal}
      />

      <Callout type="info" title="What You'll Build">
        <p>A fully automated DePIN device that collects metrics, signs them cryptographically, and reports to the Tempo network to earn rewards. Verified devices earn 2x rewards!</p>
      </Callout>

      <DocSection title="Prerequisites" subtitle="Hardware and software requirements for running a DePIN device">
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Cpu className="h-5 w-5 text-primary" />
                Hardware Requirements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-success mt-0.5" />
                <div>
                  <p className="font-medium">Raspberry Pi 3/4/5</p>
                  <p className="text-sm text-muted-foreground">Or any Linux-based device</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-success mt-0.5" />
                <div>
                  <p className="font-medium">512MB RAM minimum</p>
                  <p className="text-sm text-muted-foreground">1GB+ recommended</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-success mt-0.5" />
                <div>
                  <p className="font-medium">Stable Internet</p>
                  <p className="text-sm text-muted-foreground">10Mbps or faster</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-success mt-0.5" />
                <div>
                  <p className="font-medium">Power Supply</p>
                  <p className="text-sm text-muted-foreground">5V/2.5A minimum</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Package className="h-5 w-5 text-primary" />
                Software Requirements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-success mt-0.5" />
                <div>
                  <p className="font-medium">Python 3.8+</p>
                  <p className="text-sm text-muted-foreground">Verify: <code className="text-xs">python3 --version</code></p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-success mt-0.5" />
                <div>
                  <p className="font-medium">pip Package Manager</p>
                  <p className="text-sm text-muted-foreground">Verify: <code className="text-xs">pip3 --version</code></p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-success mt-0.5" />
                <div>
                  <p className="font-medium">Git (Optional)</p>
                  <p className="text-sm text-muted-foreground">For cloning repository</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-success mt-0.5" />
                <div>
                  <p className="font-medium">Registered Device</p>
                  <p className="text-sm text-muted-foreground">Get device ID from <a href="/depin" className="text-primary hover:underline">/depin dashboard</a></p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DocSection>

      <DocSection title="Quick Setup" subtitle="Get your device up and running in 5 minutes">
        <Tabs defaultValue="step1" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="step1">1. Dependencies</TabsTrigger>
            <TabsTrigger value="step2">2. Files</TabsTrigger>
            <TabsTrigger value="step3">3. Configure</TabsTrigger>
            <TabsTrigger value="step4">4. Run</TabsTrigger>
            <TabsTrigger value="step5">5. Verify</TabsTrigger>
          </TabsList>

          <TabsContent value="step1" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Step 1: Install Python Dependencies
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Create a <code>requirements.txt</code> file with the following dependencies:
                </p>
                
                <CodeBlock code={requirementsCode} language="text" filename="requirements.txt" />
                
                <Button
                  onClick={() => downloadFile(requirementsCode, 'requirements.txt')}
                  variant="outline"
                  className="gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download requirements.txt
                </Button>

                <Separator />

                <p className="text-muted-foreground">Install the dependencies:</p>
                <CodeBlock code="pip install -r requirements.txt" language="bash" />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="step2" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileCode className="h-5 w-5" />
                  Step 2: Download Client Files
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <Download className="h-4 w-4" />
                  <AlertDescription>
                    Download the Python client script and save it as <code>client.py</code> on your device.
                  </AlertDescription>
                </Alert>

                <div className="flex gap-3">
                  <Button
                    onClick={() => downloadFile(pythonClientCode, 'client.py')}
                    className="gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Download client.py
                  </Button>
                  <Button
                    onClick={() => downloadFile(requirementsCode, 'requirements.txt')}
                    variant="outline"
                    className="gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Download requirements.txt
                  </Button>
                </div>

                <Separator />

                <p className="text-sm text-muted-foreground">Or view the full source code:</p>
                <details className="bg-muted/30 rounded-lg p-4 cursor-pointer">
                  <summary className="font-medium cursor-pointer">Click to expand full Python client (395 lines)</summary>
                  <div className="mt-4">
                    <CodeBlock code={pythonClientCode} language="python" filename="client.py" />
                  </div>
                </details>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="step3" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Step 3: Configure Your Device
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Create a <code>config.json</code> file with your device settings:
                </p>
                
                <CodeBlock code={configCode} language="json" filename="config.json" />
                
                <Button
                  onClick={() => downloadFile(configCode, 'config.json')}
                  variant="outline"
                  className="gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download config.json template
                </Button>

                <Callout type="warning" title="Configuration Fields">
                  <ul className="space-y-1 text-sm">
                    <li><code>device_id</code> - Get this from the <a href="/depin" className="text-primary hover:underline">DePIN dashboard</a> after registering</li>
                    <li><code>api_endpoint</code> - Leave as default unless instructed otherwise</li>
                    <li><code>private_key_path</code> - Where to store your signing key (for 2x rewards)</li>
                    <li><code>report_interval</code> - Seconds between reports (30 recommended)</li>
                  </ul>
                </Callout>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="step4" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PlayCircle className="h-5 w-5" />
                  Step 4: Run the Client
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">Start the client with your configuration:</p>
                
                <CodeBlock 
                  code="python3 client.py --config config.json" 
                  language="bash" 
                />

                <Separator />

                <p className="text-sm font-medium">Expected Output (Verified Device):</p>
                <CodeBlock 
                  code={`2025-01-15 10:30:45 - INFO - ✓ Tempo Client initialized for device: rpi-solar-001
2025-01-15 10:30:45 - INFO - ✓ Cryptographic signing enabled (2x rewards)
2025-01-15 10:30:46 - INFO - ✓ VERIFIED | Reward: 0.0050 ETH | Energy: 2.34 kWh`}
                  language="text" 
                />

                <Separator />

                <p className="text-sm font-medium">Run in Background (Linux):</p>
                <CodeBlock 
                  code="nohup python3 client.py --config config.json &" 
                  language="bash" 
                />

                <p className="text-sm font-medium">Check Logs:</p>
                <CodeBlock 
                  code="tail -f tempo_client.log" 
                  language="bash" 
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="step5" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5" />
                  Step 5: Verify Connection
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-success/10 rounded-lg">
                    <CheckCircle2 className="h-5 w-5 text-success mt-0.5" />
                    <div>
                      <p className="font-medium">Check Dashboard</p>
                      <p className="text-sm text-muted-foreground">Visit <a href="/depin" className="text-primary hover:underline">/depin dashboard</a> - your device should show as "Online"</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-success/10 rounded-lg">
                    <Shield className="h-5 w-5 text-success mt-0.5" />
                    <div>
                      <p className="font-medium">Verify Cryptographic Signing</p>
                      <p className="text-sm text-muted-foreground">Look for "✓ VERIFIED" in logs - this means 2x rewards are active</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-success/10 rounded-lg">
                    <Zap className="h-5 w-5 text-success mt-0.5" />
                    <div>
                      <p className="font-medium">Monitor Rewards</p>
                      <p className="text-sm text-muted-foreground">Check the "Claim" tab in dashboard to see accumulated rewards</p>
                    </div>
                  </div>
                </div>

                <Callout type="tip" title="You're All Set!">
                  <p>Your device is now earning rewards. Keep it online for maximum earnings.</p>
                </Callout>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DocSection>

      <DocSection title="Configuration Reference" subtitle="Detailed explanation of all configuration options">
        <Card>
          <CardHeader>
            <CardTitle>config.json Options</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-3 font-semibold">Field</th>
                    <th className="text-left p-3 font-semibold">Type</th>
                    <th className="text-left p-3 font-semibold">Required</th>
                    <th className="text-left p-3 font-semibold">Default</th>
                    <th className="text-left p-3 font-semibold">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  <tr>
                    <td className="p-3"><code className="text-xs">device_id</code></td>
                    <td className="p-3">string</td>
                    <td className="p-3"><Badge variant="destructive">Required</Badge></td>
                    <td className="p-3">-</td>
                    <td className="p-3">Unique device identifier from Tempo dashboard</td>
                  </tr>
                  <tr>
                    <td className="p-3"><code className="text-xs">api_endpoint</code></td>
                    <td className="p-3">string</td>
                    <td className="p-3"><Badge variant="destructive">Required</Badge></td>
                    <td className="p-3">-</td>
                    <td className="p-3">Backend API URL for metric reporting</td>
                  </tr>
                  <tr>
                    <td className="p-3"><code className="text-xs">private_key_path</code></td>
                    <td className="p-3">string</td>
                    <td className="p-3"><Badge variant="outline">Optional</Badge></td>
                    <td className="p-3">./device_key</td>
                    <td className="p-3">Path to Ed25519 key (enables 2x rewards)</td>
                  </tr>
                  <tr>
                    <td className="p-3"><code className="text-xs">report_interval</code></td>
                    <td className="p-3">number</td>
                    <td className="p-3"><Badge variant="outline">Optional</Badge></td>
                    <td className="p-3">30</td>
                    <td className="p-3">Seconds between metric reports</td>
                  </tr>
                  <tr>
                    <td className="p-3"><code className="text-xs">max_retries</code></td>
                    <td className="p-3">number</td>
                    <td className="p-3"><Badge variant="outline">Optional</Badge></td>
                    <td className="p-3">3</td>
                    <td className="p-3">Number of retry attempts for failed reports</td>
                  </tr>
                  <tr>
                    <td className="p-3"><code className="text-xs">max_buffer_size</code></td>
                    <td className="p-3">number</td>
                    <td className="p-3"><Badge variant="outline">Optional</Badge></td>
                    <td className="p-3">100</td>
                    <td className="p-3">Maximum offline events to buffer</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </DocSection>

      <DocSection title="Advanced: Run as System Service" subtitle="Auto-start your device client on boot using systemd">
        <div className="space-y-4">
          <p className="text-muted-foreground">
            For production deployments, run the client as a systemd service to ensure it starts automatically on boot and restarts on failure.
          </p>

          <Card>
            <CardHeader>
              <CardTitle>Create Systemd Service</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">1. Create service file:</p>
              <CodeBlock 
                code="sudo nano /etc/systemd/system/tempo-depin.service" 
                language="bash" 
              />

              <p className="text-sm text-muted-foreground">2. Add service configuration:</p>
              <CodeBlock code={systemdServiceCode} language="ini" filename="tempo-depin.service" />

              <Button
                onClick={() => downloadFile(systemdServiceCode, 'tempo-depin.service')}
                variant="outline"
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                Download Service File
              </Button>

              <Separator />

              <p className="text-sm text-muted-foreground">3. Enable and start the service:</p>
              <CodeBlock 
                code={`sudo systemctl daemon-reload
sudo systemctl enable tempo-depin
sudo systemctl start tempo-depin`}
                language="bash" 
              />

              <Separator />

              <p className="text-sm text-muted-foreground">4. Check status and logs:</p>
              <CodeBlock 
                code={`# Check service status
sudo systemctl status tempo-depin

# View live logs
sudo journalctl -u tempo-depin -f`}
                language="bash" 
              />
            </CardContent>
          </Card>
        </div>
      </DocSection>

      <DocSection title="Hardware Recommendations" subtitle="Choosing the right device for your DePIN node">
        <Card>
          <CardHeader>
            <CardTitle>Recommended Devices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-3 font-semibold">Model</th>
                    <th className="text-left p-3 font-semibold">Specs</th>
                    <th className="text-left p-3 font-semibold">Power</th>
                    <th className="text-left p-3 font-semibold">Ideal For</th>
                    <th className="text-left p-3 font-semibold">Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  <tr>
                    <td className="p-3 font-medium">Raspberry Pi 5</td>
                    <td className="p-3">4GB/8GB RAM, Quad-core</td>
                    <td className="p-3">5W-10W</td>
                    <td className="p-3">Best performance, multiple devices</td>
                    <td className="p-3">~$80</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium">Raspberry Pi 4</td>
                    <td className="p-3">2GB/4GB/8GB RAM</td>
                    <td className="p-3">3W-7W</td>
                    <td className="p-3">Excellent balance, most popular</td>
                    <td className="p-3">~$55</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium">Raspberry Pi 3B+</td>
                    <td className="p-3">1GB RAM</td>
                    <td className="p-3">2.5W-5W</td>
                    <td className="p-3">Budget option, single device</td>
                    <td className="p-3">~$35</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium">Orange Pi 5</td>
                    <td className="p-3">4GB/8GB/16GB RAM</td>
                    <td className="p-3">5W-8W</td>
                    <td className="p-3">Alternative to Pi 4/5</td>
                    <td className="p-3">~$70</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </DocSection>

      <DocSection title="Troubleshooting" subtitle="Common issues and solutions">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="network">
            <AccordionTrigger>
              <div className="flex items-center gap-2">
                <Network className="h-4 w-4 text-destructive" />
                Network Connection Issues
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-3">
              <p className="text-muted-foreground">Test API endpoint connectivity:</p>
              <CodeBlock 
                code={`curl -X POST https://fhmyhvrejofybzdgzxdc.supabase.co/functions/v1/report-device-event \\
  -H "Content-Type: application/json" \\
  -d '{"device_id":"test","metrics":{}}'`}
                language="bash" 
              />
              <p className="text-sm text-muted-foreground">Should return 200 OK. If it fails, check firewall and DNS settings.</p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="permissions">
            <AccordionTrigger>
              <div className="flex items-center gap-2">
                <Key className="h-4 w-4 text-destructive" />
                Permission Errors
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-3">
              <p className="text-muted-foreground">Fix file permissions:</p>
              <CodeBlock 
                code={`# Fix key file permissions
chmod 600 /home/pi/.tempo/device_key

# Fix script permissions
chmod +x client.py`}
                language="bash" 
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="dependencies">
            <AccordionTrigger>
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-destructive" />
                Python Dependency Issues
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-3">
              <p className="text-muted-foreground">Reinstall dependencies:</p>
              <CodeBlock 
                code={`# Upgrade pip
pip install --upgrade pip

# Reinstall dependencies
pip install --force-reinstall -r requirements.txt`}
                language="bash" 
              />
              <Separator />
              <p className="text-muted-foreground">For PyNaCl issues on Raspberry Pi:</p>
              <CodeBlock 
                code={`sudo apt-get update
sudo apt-get install python3-dev libffi-dev libssl-dev
pip install PyNaCl`}
                language="bash" 
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="signing">
            <AccordionTrigger>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-destructive" />
                Cryptographic Signing Not Working
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-3">
              <p className="text-muted-foreground">Ensure PyNaCl is properly installed:</p>
              <CodeBlock code="pip show PyNaCl" language="bash" />
              <p className="text-sm text-muted-foreground">If not installed, run:</p>
              <CodeBlock code="pip install PyNaCl" language="bash" />
              <p className="text-sm text-muted-foreground">Check logs for key generation messages. Delete and regenerate if corrupted:</p>
              <CodeBlock code="rm /home/pi/.tempo/device_key" language="bash" />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="rewards">
            <AccordionTrigger>
              <div className="flex items-center gap-2">
                <Gauge className="h-4 w-4 text-destructive" />
                Rewards Not Appearing
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-3">
              <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                <li>Verify device is showing as "Online" in <a href="/depin" className="text-primary hover:underline">dashboard</a></li>
                <li>Check logs show successful "✓ VERIFIED" or "○ UNVERIFIED" messages</li>
                <li>Rewards accumulate over time - check the "Claim" tab after 24 hours</li>
                <li>Ensure device has been running continuously (uptime matters)</li>
              </ol>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </DocSection>

      <DocSection title="Security Best Practices" subtitle="Protect your device and maximize earnings">
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Key className="h-5 w-5 text-primary" />
                Key Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-success mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Secure Storage</p>
                  <CodeBlock code="chmod 600 ~/.tempo/device_key" language="bash" />
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-success mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Backup Keys Offline</p>
                  <p className="text-xs text-muted-foreground">Store on USB drive in safe location</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-success mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Never Share Keys</p>
                  <p className="text-xs text-muted-foreground">Losing keys = losing 2x multiplier</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Network className="h-5 w-5 text-primary" />
                Network Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-success mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Enable Firewall</p>
                  <p className="text-xs text-muted-foreground">Restrict to necessary ports only</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-success mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Regular Updates</p>
                  <CodeBlock code="sudo apt-get update && sudo apt-get upgrade" language="bash" />
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-success mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Monitor Logs</p>
                  <p className="text-xs text-muted-foreground">Check for unusual activity regularly</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DocSection>

      <Callout type="info" title="Need Help?">
        <p>Contact us at <a href="mailto:inoxxprotocol@gmail.com" className="text-primary hover:underline">inoxxprotocol@gmail.com</a> with your device logs for support.</p>
      </Callout>
    </div>
  );
};

export default DePINDeviceSetup;