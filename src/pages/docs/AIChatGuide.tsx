import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, Sparkles, FileText, Image } from 'lucide-react';
import { Link } from 'react-router-dom';

const AIChatGuide = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-4">Chat Interface Guide</h1>
        <p className="text-xl text-muted-foreground">
          Master the AI chat interface to get the most out of your DeFi assistant.
        </p>
      </div>

      <Card className="p-8 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20">
        <div className="flex items-center gap-3 mb-4">
          <MessageSquare className="w-8 h-8 text-blue-400" />
          <h2 className="text-2xl font-bold">Chat Features</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-bold mb-2">✨ Rich Formatting</h3>
            <p className="text-sm text-muted-foreground">
              The AI responds with formatted text, tables, code blocks, and interactive cards for better readability.
            </p>
          </div>
          <div>
            <h3 className="font-bold mb-2">🔄 Conversation History</h3>
            <p className="text-sm text-muted-foreground">
              All your chats are saved. Switch between conversations seamlessly in the sidebar.
            </p>
          </div>
          <div>
            <h3 className="font-bold mb-2">📎 File Support</h3>
            <p className="text-sm text-muted-foreground">
              Upload transaction receipts, wallet exports, or CSV files for analysis.
            </p>
          </div>
          <div>
            <h3 className="font-bold mb-2">⚡ Quick Actions</h3>
            <p className="text-sm text-muted-foreground">
              Click suggested prompts to execute common tasks without typing.
            </p>
          </div>
        </div>
      </Card>

      <div>
        <h2 className="text-3xl font-bold mb-6">Best Practices</h2>
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-400" />
              Writing Effective Prompts
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-start gap-3 mb-2">
                  <span className="text-green-400">✓</span>
                  <div>
                    <strong>Good:</strong> "Compare gas costs for bridging 500 USDC from Ethereum to Polygon vs Base"
                  </div>
                </div>
                <div className="ml-6 text-sm text-muted-foreground">
                  Specific, includes amounts and chains
                </div>
              </div>

              <div>
                <div className="flex items-start gap-3 mb-2">
                  <span className="text-red-400">✗</span>
                  <div>
                    <strong>Not ideal:</strong> "Bridge stuff"
                  </div>
                </div>
                <div className="ml-6 text-sm text-muted-foreground">
                  Too vague, missing critical details
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-400" />
              Multi-Turn Conversations
            </h3>
            <p className="text-muted-foreground mb-4">
              The AI maintains context, so you can refine requests across multiple messages:
            </p>
            <Card className="p-4 bg-muted/30">
              <div className="space-y-3 text-sm">
                <div><strong>You:</strong> "Find yield opportunities for USDC"</div>
                <div><strong>AI:</strong> <span className="text-muted-foreground">[Shows 5 options]</span></div>
                <div><strong>You:</strong> "Only show options with less than 5% risk"</div>
                <div><strong>AI:</strong> <span className="text-muted-foreground">[Filters to 2 options]</span></div>
                <div><strong>You:</strong> "Which one has the lowest gas fees?"</div>
                <div><strong>AI:</strong> <span className="text-muted-foreground">[Recommends best option]</span></div>
              </div>
            </Card>
          </Card>

          <Card className="p-6">
            <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
              <Image className="w-5 h-5 text-purple-400" />
              Using Commands
            </h3>
            <p className="text-muted-foreground mb-4">
              Special commands for quick access to specific features:
            </p>
            <div className="grid gap-3">
              <Card className="p-3 bg-muted/30">
                <div className="font-mono text-sm text-primary mb-1">/portfolio</div>
                <div className="text-xs text-muted-foreground">Show complete portfolio breakdown</div>
              </Card>
              <Card className="p-3 bg-muted/30">
                <div className="font-mono text-sm text-primary mb-1">/depin</div>
                <div className="text-xs text-muted-foreground">View DePIN device status and earnings</div>
              </Card>
              <Card className="p-3 bg-muted/30">
                <div className="font-mono text-sm text-primary mb-1">/gas</div>
                <div className="text-xs text-muted-foreground">Check current gas prices across chains</div>
              </Card>
              <Card className="p-3 bg-muted/30">
                <div className="font-mono text-sm text-primary mb-1">/help</div>
                <div className="text-xs text-muted-foreground">Get AI usage tips and examples</div>
              </Card>
            </div>
          </Card>
        </div>
      </div>

      <Card className="p-8 bg-gradient-to-r from-green-500/10 to-blue-500/10 border-green-500/20">
        <h2 className="text-2xl font-bold mb-4">Pro Tips</h2>
        <ul className="space-y-3">
          <li className="flex items-start gap-3">
            <span className="text-green-400">💡</span>
            <span>Use "Explain like I'm 5" when learning new concepts</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-green-400">💡</span>
            <span>Ask "What are the risks?" before any financial action</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-green-400">💡</span>
            <span>Request step-by-step breakdowns for complex operations</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-green-400">💡</span>
            <span>Say "Compare options" when choosing between protocols</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-green-400">💡</span>
            <span>Use "Show me the math" for detailed calculations</span>
          </li>
        </ul>
      </Card>

      <div className="flex gap-4">
        <Link to="/chat" className="flex-1">
          <Button className="w-full" size="lg">
            <MessageSquare className="w-4 h-4 mr-2" />
            Start Chatting
          </Button>
        </Link>
        <Link to="/docs/ai/features" className="flex-1">
          <Button className="w-full" size="lg" variant="outline">
            View AI Features →
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default AIChatGuide;
