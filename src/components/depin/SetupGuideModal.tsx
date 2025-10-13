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
            <Button variant="outline" size="sm" className="mt-3 gap-2">
              <Download className="w-4 h-4" />
              Download Python Script
            </Button>
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
  "api_endpoint": "https://api.tempo.dev/depin",
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
