import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bot, MessageSquare, Zap, TrendingUp, Link as LinkIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import CodeBlock from '@/components/docs/CodeBlock';

const AIGettingStarted = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-4">AI Assistant - Getting Started</h1>
        <p className="text-xl text-muted-foreground">
          Your intelligent companion for navigating DeFi, managing portfolios, and optimizing yields across chains.
        </p>
      </div>

      <Card className="p-8 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-500/20">
        <div className="flex items-start gap-6">
          <Bot className="w-12 h-12 text-purple-400 flex-shrink-0" />
          <div>
            <h2 className="text-2xl font-bold mb-3">What is the Tempo AI Assistant?</h2>
            <p className="text-muted-foreground mb-4">
              The Tempo AI Assistant is a conversational AI agent that helps you interact with DeFi protocols, 
              bridge assets across chains, manage your DePIN devices, and make informed decisions about yield strategies—all 
              through natural language chat.
            </p>
            <div className="flex gap-3">
              <Link to="/chat">
                <Button>
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Try AI Chat
                </Button>
              </Link>
              <Link to="/docs/ai/features">
                <Button variant="outline">
                  View Features
                  <LinkIcon className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="p-6">
          <MessageSquare className="w-8 h-8 text-primary mb-4" />
          <h3 className="text-xl font-bold mb-2">Natural Conversations</h3>
          <p className="text-sm text-muted-foreground">
            Ask questions in plain English. No need to understand complex DeFi jargon or technical concepts.
          </p>
        </Card>
        <Card className="p-6">
          <Zap className="w-8 h-8 text-yellow-400 mb-4" />
          <h3 className="text-xl font-bold mb-2">Instant Actions</h3>
          <p className="text-sm text-muted-foreground">
            Execute bridging, swapping, and yield strategies directly from the chat interface.
          </p>
        </Card>
        <Card className="p-6">
          <TrendingUp className="w-8 h-8 text-green-400 mb-4" />
          <h3 className="text-xl font-bold mb-2">Smart Recommendations</h3>
          <p className="text-sm text-muted-foreground">
            Get personalized suggestions based on your portfolio, risk tolerance, and goals.
          </p>
        </Card>
      </div>

      <div>
        <h2 className="text-3xl font-bold mb-6">Quick Start Guide</h2>
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center font-bold">
                1
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2">Navigate to AI Chat</h3>
                <p className="text-muted-foreground mb-3">
                  Click on "AI Chat" in the navigation menu or visit <code className="text-primary">/chat</code>
                </p>
                <Link to="/chat">
                  <Button size="sm" variant="outline">
                    Open AI Chat →
                  </Button>
                </Link>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center font-bold">
                2
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2">Connect Your Wallet (Optional)</h3>
                <p className="text-muted-foreground mb-3">
                  For personalized recommendations and portfolio analysis, connect your wallet. 
                  You can still use the AI without connecting—it's great for learning!
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center font-bold">
                3
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2">Start Asking Questions</h3>
                <p className="text-muted-foreground mb-3">
                  Try these example prompts to get started:
                </p>
                <Card className="p-4 bg-muted/30">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <span className="text-primary">💬</span>
                      <span>"What's the best way to earn yield on my USDC?"</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-primary">💬</span>
                      <span>"How do I bridge my tokens from Ethereum to Polygon?"</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-primary">💬</span>
                      <span>"Show me my DePIN device earnings"</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-primary">💬</span>
                      <span>"What's the gas cost to swap 100 USDC to ETH?"</span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div>
        <h2 className="text-3xl font-bold mb-6">Example Conversation</h2>
        <Card className="p-6 bg-card">
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                👤
              </div>
              <div className="flex-1">
                <div className="font-semibold mb-1">You</div>
                <div className="bg-muted/50 p-3 rounded-lg">
                  I have 1000 USDC on Ethereum. What's the cheapest way to move it to Polygon and start earning yield?
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                <Bot className="w-5 h-5 text-purple-400" />
              </div>
              <div className="flex-1">
                <div className="font-semibold mb-1">AI Assistant</div>
                <div className="bg-purple-500/10 p-4 rounded-lg border border-purple-500/20">
                  <p className="mb-3">
                    Great question! Here's the optimal path for your 1000 USDC:
                  </p>
                  <div className="space-y-3 text-sm">
                    <div>
                      <strong className="text-purple-400">1. Bridge via Wormhole:</strong>
                      <div className="ml-4 mt-1 text-muted-foreground">
                        • Bridge cost: $0.30<br />
                        • Gas on Ethereum: ~$2.50<br />
                        • Time: ~2 minutes<br />
                        • Net on Polygon: $997.20
                      </div>
                    </div>
                    <div>
                      <strong className="text-purple-400">2. Deposit in Aave on Polygon:</strong>
                      <div className="ml-4 mt-1 text-muted-foreground">
                        • Current APY: 6.2%<br />
                        • Gas to deposit: $0.15<br />
                        • Expected yearly earnings: ~$61.77
                      </div>
                    </div>
                    <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                      <strong className="text-green-400">Total cost: $2.95 (0.295%)</strong><br />
                      <span className="text-sm text-muted-foreground">
                        You'll break even on fees in just 18 days of yield earnings!
                      </span>
                    </div>
                  </div>
                  <Button className="mt-4" size="sm">
                    Execute This Strategy →
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-8 bg-gradient-to-r from-green-500/10 to-blue-500/10 border-green-500/20">
        <h2 className="text-2xl font-bold mb-4">Pro Tips for Using the AI Assistant</h2>
        <ul className="space-y-3">
          <li className="flex items-start gap-3">
            <span className="text-green-400 text-xl">✓</span>
            <span><strong>Be specific:</strong> Instead of "earn money", try "earn 8%+ APY on stablecoins with low risk"</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-green-400 text-xl">✓</span>
            <span><strong>Ask follow-ups:</strong> The AI remembers context, so you can refine strategies in conversation</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-green-400 text-xl">✓</span>
            <span><strong>Request comparisons:</strong> "Compare Aave vs Compound for USDC deposits"</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-green-400 text-xl">✓</span>
            <span><strong>Learn terminology:</strong> Ask "What does APY mean?" or "Explain impermanent loss"</span>
          </li>
        </ul>
      </Card>

      <div className="flex gap-4">
        <Link to="/docs/ai/features" className="flex-1">
          <Button className="w-full" size="lg">
            Explore AI Features →
          </Button>
        </Link>
        <Link to="/chat" className="flex-1">
          <Button className="w-full" size="lg" variant="outline">
            <MessageSquare className="w-4 h-4 mr-2" />
            Start Chatting
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default AIGettingStarted;
