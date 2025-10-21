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

  const copyToClipboard = (text: string, setCopied: (val: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadPythonScript = () => {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const scriptContent = `#!/usr/bin/env python3
"""
Tempo DePIN Client - Enhanced Version
Collects device metrics and reports them to the Tempo network
"""
import json
import time
import requests
import psutil
import platform
import os
import sys
import logging
from datetime import datetime
from pathlib import Path
from nacl.signing import SigningKey
from nacl.encoding import Base64Encoder
from typing import Dict, Optional, Any

# Set up enhanced logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - [%(filename)s:%(lineno)d] - %(message)s',
    handlers=[
        logging.FileHandler('tempo_depin_client.log'),
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)


class TempoDePINClient:
    def __init__(self, config_path: str):
        self.config = self._load_config(config_path)
        self._validate_config()
        
        self.device_id = self.config['device_id']
        self.api_endpoint = self.config['api_endpoint']
        self.report_interval = self.config.get('report_interval', 30)
        self.max_retries = self.config.get('max_retries', 3)
        self.request_timeout = self.config.get('request_timeout', 10)
        
        # Enhanced key management
        self.signing_key = self._load_signing_key()
        self.public_key = self.signing_key.verify_key.encode(Base64Encoder).decode()
        
        # Metrics buffer for offline operation
        self.metrics_buffer = []
        self.max_buffer_size = self.config.get('max_buffer_size', 100)
        
        # Performance tracking
        self.metrics_collected = 0
        self.metrics_reported = 0
        self.last_successful_report = None
        
        logger.info(f"Initialized client for device: {self.device_id}")
        logger.info(f"Public key: {self.public_key[:20]}...")
    
    def _load_config(self, config_path: str) -> Dict[str, Any]:
        """Load and validate configuration file"""
        if not os.path.exists(config_path):
            raise FileNotFoundError(f"Config file not found: {config_path}")
        
        try:
            with open(config_path, 'r') as f:
                config = json.load(f)
            
            config.setdefault('report_interval', 30)
            config.setdefault('max_retries', 3)
            config.setdefault('request_timeout', 10)
            config.setdefault('max_buffer_size', 100)
            
            return config
        except json.JSONDecodeError as e:
            raise ValueError(f"Invalid JSON in config file: {e}")
    
    def _validate_config(self):
        """Validate required configuration fields"""
        required_fields = ['device_id', 'api_endpoint']
        for field in required_fields:
            if field not in self.config:
                raise ValueError(f"Missing required config field: {field}")
        
        if self.config['report_interval'] < 10:
            logger.warning("Report interval very low (<10s), may impact system performance")
    
    def _load_signing_key(self) -> SigningKey:
        """Load existing signing key or generate new one"""
        private_key_path = self.config.get('private_key_path')
        
        if private_key_path and os.path.exists(private_key_path):
            try:
                with open(private_key_path, 'rb') as f:
                    key_data = f.read()
                return SigningKey(key_data)
            except Exception as e:
                logger.error(f"Failed to load existing key: {e}")
        
        # Generate new key
        key = SigningKey.generate()
        
        # Save key if path provided
        if private_key_path:
            try:
                os.makedirs(os.path.dirname(private_key_path), exist_ok=True)
                with open(private_key_path, 'wb') as f:
                    f.write(key.encode())
                
                # Set secure permissions (Unix-like systems)
                if os.name != 'nt':
                    os.chmod(private_key_path, 0o600)
                
                logger.info(f"Generated and saved new signing key to: {private_key_path}")
            except Exception as e:
                logger.warning(f"Failed to save signing key: {e}. Key will be lost on restart.")
        else:
            logger.warning("No private_key_path configured - key will not persist across restarts")
        
        return key
    
    def collect_metrics(self) -> Optional[Dict[str, Any]]:
        """Collect comprehensive system metrics with individual error handling"""
        metrics = {
            'device_id': self.device_id,
            'timestamp': datetime.utcnow().isoformat() + 'Z',
            'platform': platform.system(),
            'platform_version': platform.version(),
        }
        
        try:
            metrics['cpu_percent'] = round(psutil.cpu_percent(interval=0.5), 2)
            metrics['cpu_cores'] = psutil.cpu_count()
            metrics['cpu_freq'] = psutil.cpu_freq().current if psutil.cpu_freq() else None
        except Exception as e:
            logger.warning(f"Failed to collect CPU metrics: {e}")
            metrics['cpu_percent'] = None
        
        try:
            memory = psutil.virtual_memory()
            metrics['memory_percent'] = round(memory.percent, 2)
            metrics['memory_total_gb'] = round(memory.total / (1024**3), 2)
            metrics['memory_available_gb'] = round(memory.available / (1024**3), 2)
        except Exception as e:
            logger.warning(f"Failed to collect memory metrics: {e}")
            metrics['memory_percent'] = None
        
        try:
            disk = psutil.disk_usage('/')
            metrics['disk_percent'] = round(disk.percent, 2)
            metrics['disk_total_gb'] = round(disk.total / (1024**3), 2)
            metrics['disk_free_gb'] = round(disk.free / (1024**3), 2)
        except Exception as e:
            logger.warning(f"Failed to collect disk metrics: {e}")
            metrics['disk_percent'] = None
        
        try:
            net_io = psutil.net_io_counters()
            metrics['bytes_sent'] = net_io.bytes_sent
            metrics['bytes_recv'] = net_io.bytes_recv
            metrics['packets_sent'] = net_io.packets_sent
            metrics['packets_recv'] = net_io.packets_recv
        except Exception as e:
            logger.warning(f"Failed to collect network metrics: {e}")
        
        try:
            metrics['uptime_seconds'] = int(time.time() - psutil.boot_time())
        except Exception as e:
            logger.warning(f"Failed to collect uptime: {e}")
        
        try:
            metrics['hostname'] = platform.node()
            metrics['python_version'] = platform.python_version()
        except Exception as e:
            logger.warning(f"Failed to collect system info: {e}")
        
        self.metrics_collected += 1
        logger.debug(f"Collected metrics: CPU {metrics.get('cpu_percent')}%, Memory {metrics.get('memory_percent')}%")
        
        return metrics
    
    def sign_data(self, data: Dict[str, Any]) -> Optional[str]:
        """Sign data with device's private key"""
        try:
            message = json.dumps(data, sort_keys=True, separators=(',', ':')).encode()
            signed = self.signing_key.sign(message)
            signature = Base64Encoder.encode(signed.signature).decode()
            return signature
        except Exception as e:
            logger.error(f"Error signing data: {e}")
            return None
    
    def _add_to_buffer(self, metrics: Dict[str, Any], signature: Optional[str]):
        """Add metrics to buffer for offline operation"""
        if len(self.metrics_buffer) >= self.max_buffer_size:
            self.metrics_buffer.pop(0)
        self.metrics_buffer.append({
            'metrics': metrics,
            'timestamp': datetime.utcnow().isoformat(),
            'signature': signature
        })
        logger.info(f"Added metrics to buffer. Buffer size: {len(self.metrics_buffer)}")
    
    def _flush_buffer(self):
        """Attempt to send buffered metrics"""
        if not self.metrics_buffer:
            return
        
        logger.info(f"Attempting to flush {len(self.metrics_buffer)} buffered metrics")
        successful_sends = []
        
        for buffered_item in self.metrics_buffer[:]:
            if self._send_metrics_payload(buffered_item['metrics'], buffered_item['signature']):
                successful_sends.append(buffered_item)
        
        for item in successful_sends:
            self.metrics_buffer.remove(item)
        
        if successful_sends:
            logger.info(f"Successfully sent {len(successful_sends)} buffered metrics")
    
    def _send_metrics_payload(self, metrics: Dict[str, Any], signature: Optional[str]) -> bool:
        """Send metrics payload with retry logic"""
        payload = {
            'device_id': self.device_id,
            'public_key': self.public_key,
            'metrics': metrics,
            'signature': signature,
            'version': '2.0.0'
        }
        
        for attempt in range(self.max_retries):
            try:
                response = requests.post(
                    self.api_endpoint,
                    json=payload,
                    headers={'Content-Type': 'application/json'},
                    timeout=self.request_timeout
                )
                
                if response.status_code == 200:
                    result = response.json()
                    reward = result.get('reward_amount', 0)
                    verified = result.get('verified', False)
                    logger.info(f"✓ Metrics reported. Verified: {verified}, Reward: {reward} TEMPO")
                    self.last_successful_report = datetime.utcnow()
                    return True
                else:
                    logger.warning(f"Attempt {attempt + 1} failed: {response.status_code} - {response.text}")
                    
            except requests.exceptions.RequestException as e:
                logger.warning(f"Attempt {attempt + 1} failed with network error: {e}")
            
            if attempt < self.max_retries - 1:
                wait_time = (2 ** attempt)
                logger.info(f"Retrying in {wait_time} seconds...")
                time.sleep(wait_time)
        
        logger.error(f"All {self.max_retries} attempts failed")
        return False
    
    def report_metrics(self, metrics: Dict[str, Any]) -> bool:
        """Send metrics to the Tempo network with buffering fallback"""
        signature = self.sign_data(metrics)
        if not signature:
            logger.error("Failed to sign metrics, adding to buffer unsigned")
            self._add_to_buffer(metrics, None)
            return False
        
        success = self._send_metrics_payload(metrics, signature)
        
        if success:
            self.metrics_reported += 1
            self._flush_buffer()
        else:
            logger.warning("Failed to report metrics, adding to buffer")
            self._add_to_buffer(metrics, signature)
        
        return success
    
    def get_status(self) -> Dict[str, Any]:
        """Get client status information"""
        return {
            'device_id': self.device_id,
            'metrics_collected': self.metrics_collected,
            'metrics_reported': self.metrics_reported,
            'success_rate': round(self.metrics_reported / max(self.metrics_collected, 1) * 100, 2),
            'buffer_size': len(self.metrics_buffer),
            'last_successful_report': self.last_successful_report.isoformat() if self.last_successful_report else None,
            'uptime_seconds': int(time.time() - self.start_time),
        }
    
    def run(self):
        """Main loop - collect and report metrics"""
        self.start_time = time.time()
        
        logger.info(f"Starting Tempo DePIN client (reporting every {self.report_interval}s)")
        logger.info(f"Device ID: {self.device_id}")
        logger.info(f"API Endpoint: {self.api_endpoint}")
        logger.info(f"Press Ctrl+C to stop")
        
        self._flush_buffer()
        
        try:
            report_count = 0
            while True:
                report_count += 1
                logger.info(f"=== Collection Cycle #{report_count} ===")
                
                metrics = self.collect_metrics()
                if metrics:
                    self.report_metrics(metrics)
                    
                    if report_count % 10 == 0:
                        status = self.get_status()
                        logger.info(f"Status: {status['metrics_reported']}/{status['metrics_collected']} "
                                  f"({status['success_rate']}% success rate)")
                else:
                    logger.error("Failed to collect metrics, skipping report")
                
                logger.info(f"Waiting {self.report_interval} seconds until next report...")
                time.sleep(self.report_interval)
                
        except KeyboardInterrupt:
            logger.info("\\nShutdown requested...")
            logger.info(f"Final status: {self.get_status()}")
            logger.info("Shutting down client gracefully")
            sys.exit(0)
        except Exception as e:
            logger.error(f"Unexpected error in main loop: {e}")
            sys.exit(1)


def main():
    """Main entry point"""
    if len(sys.argv) < 2:
        print("Usage: python client.py --config <config.json>")
        print("       python client.py --help")
        sys.exit(1)
    
    if sys.argv[1] in ['-h', '--help']:
        print("Tempo DePIN Client")
        print("Usage: python client.py --config <config.json>")
        print("\\nConfiguration file should contain:")
        print("  - device_id: Unique identifier for this device")
        print("  - api_endpoint: Tempo network API endpoint")
        print("  - private_key_path: Path to store private key (recommended)")
        print("  - report_interval: Seconds between reports (default: 30)")
        print("  - max_retries: Maximum retry attempts (default: 3)")
        sys.exit(0)
    
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
    except ValueError as e:
        logger.error(f"Configuration error: {e}")
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
                <p className="text-xs text-muted-foreground mt-1">
                  Your unique device identifier
                </p>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                <p className="text-sm">
                  🔑 <strong>Key Management:</strong> The client automatically generates and securely stores a cryptographic key pair. The public key is sent with each report for signature verification to earn 2x rewards.
                </p>
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
  "api_endpoint": "${import.meta.env.VITE_SUPABASE_URL}/functions/v1/report-device-event",
  "private_key_path": "/etc/tempo/tempo_private.key",
  "report_interval": 30,
  "max_retries": 3,
  "request_timeout": 10,
  "max_buffer_size": 100
}`}</pre>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              💡 The client will generate and persist a private key automatically. Public key is derived from it and sent with each report for 2x reward verification.
            </p>
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
