import DocHero from "@/components/docs/DocHero";
import DocSection from "@/components/docs/DocSection";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Brain, Zap, TrendingUp, Shield } from "lucide-react";
import FeatureCard from "@/components/docs/FeatureCard";

const AIAgentGettingStarted = () => {
  return (
    <div className="space-y-12">
        <div>
          <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm mb-4">
            <span className="text-primary">New</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">AI Agent Builder - Getting Started</h1>
          <p className="text-xl text-muted-foreground">
            Build intelligent AI trading agents that automatically optimize your DeFi yields across chains using Wormhole.
          </p>
        </div>

      <DocSection title="Introduction to AI Trading Agents">
        <p className="text-lg mb-6">
          Transform from a manual trader to an automated AI-powered portfolio manager. 
          This guide teaches you how to create intelligent AI agents that use machine learning 
          and large language models (LLMs) to make trading decisions, optimize yields across 
          chains using Wormhole, and run 24/7 on autopilot.
        </p>

        <Alert className="mb-6">
          <Brain className="h-4 w-4" />
          <AlertDescription>
            <strong>AI Agents vs Rule-Based Bots:</strong> Traditional bots follow fixed rules 
            ("if APY {'>'} 5%, then deposit"). AI agents use trained models to make intelligent 
            decisions based on market patterns, learning from historical data and adapting to 
            changing conditions.
          </AlertDescription>
        </Alert>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <FeatureCard
            title="LLM-Based Agents"
            description="Use GPT-5, Gemini, or Claude to analyze market data and make decisions using natural language reasoning"
            icon={Brain}
          />
          <FeatureCard
            title="Reinforcement Learning"
            description="Train custom RL models that learn optimal trading strategies through trial and error"
            icon={TrendingUp}
          />
          <FeatureCard
            title="Supervised Learning"
            description="Build ML classifiers that predict profitable opportunities based on historical patterns"
            icon={Zap}
          />
          <FeatureCard
            title="Wormhole Integration"
            description="All agent types seamlessly bridge assets across chains for optimal yield positioning"
            icon={Shield}
          />
        </div>
      </DocSection>

      <DocSection title="What You'll Build">
        <p className="mb-4">
          By following this documentation, you'll create a personal AI DeFi agent that:
        </p>
        <ul className="list-disc list-inside space-y-2 mb-6 text-muted-foreground">
          <li>Monitors yields across Ethereum, Arbitrum, Optimism, Base, Polygon, and Solana</li>
          <li>Makes intelligent decisions using trained AI models (LLM, RL, or ML)</li>
          <li>Automatically bridges assets using Wormhole when better yields appear</li>
          <li>Deposits into protocols like Aave, Compound, Curve, and Uniswap</li>
          <li>Rebalances based on learned strategies and risk tolerance</li>
          <li>Handles gas optimization and transaction monitoring</li>
          <li>Runs autonomously in the cloud or on your local machine</li>
        </ul>

        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            <strong>Security First:</strong> Your AI agent runs with your private keys. 
            Always start with testnet, use small amounts initially, and implement proper 
            key management practices before deploying to mainnet.
          </AlertDescription>
        </Alert>
      </DocSection>

      <DocSection title="Prerequisites">
        <h3 className="text-xl font-semibold mb-4">Technical Requirements</h3>
        <div className="space-y-4 mb-6">
          <div>
            <h4 className="font-semibold mb-2">Programming Knowledge</h4>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li><strong>Python:</strong> Intermediate level (classes, async/await, APIs)</li>
              <li><strong>JavaScript/TypeScript:</strong> Alternative to Python, similar skill level</li>
              <li><strong>DeFi Basics:</strong> Understanding of yields, bridging, and protocols</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Development Environment</h4>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Python 3.9+ or Node.js 18+</li>
              <li>Code editor (VS Code recommended)</li>
              <li>Git for version control</li>
              <li>Testnet wallet with test funds (Sepolia, Base Sepolia)</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">API Keys (Optional, based on agent type)</h4>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li><strong>For LLM Agents:</strong> OpenAI, Anthropic, or Google Gemini API key</li>
              <li><strong>For All Agents:</strong> Infura/Alchemy RPC endpoints (free tier works)</li>
              <li><strong>For Data:</strong> DeFi Llama API (free, no key needed)</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Hardware (Local Development)</h4>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li><strong>LLM Agents:</strong> Any modern laptop (API-based, minimal compute)</li>
              <li><strong>RL/ML Training:</strong> GPU recommended (or use cloud: Colab, AWS)</li>
              <li><strong>Production:</strong> Cloud deployment (AWS Lambda, Google Cloud Functions)</li>
            </ul>
          </div>
        </div>
      </DocSection>

      <DocSection title="Choose Your AI Model Type">
        <p className="mb-6">
          Select the approach that matches your skill level and use case:
        </p>

        <div className="space-y-6">
          <div className="border rounded-lg p-6">
            <div className="flex items-start gap-4">
              <Brain className="h-8 w-8 text-primary mt-1" />
              <div>
                <h3 className="text-xl font-semibold mb-2">LLM-Based Agents (Recommended for Beginners)</h3>
                <p className="text-muted-foreground mb-3">
                  Use GPT-5, Gemini 2.5, or Claude to analyze market data and make decisions 
                  using natural language reasoning. No ML training required.
                </p>
                <div className="grid sm:grid-cols-2 gap-2 text-sm">
                  <div>
                    <strong className="text-green-600">Pros:</strong>
                    <ul className="list-disc list-inside text-muted-foreground">
                      <li>Easy to implement (100 lines of code)</li>
                      <li>No training data needed</li>
                      <li>Explainable decisions</li>
                      <li>Can reason about complex scenarios</li>
                    </ul>
                  </div>
                  <div>
                    <strong className="text-orange-600">Cons:</strong>
                    <ul className="list-disc list-inside text-muted-foreground">
                      <li>Requires API key ($)</li>
                      <li>Slower than local models</li>
                      <li>Depends on external service</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border rounded-lg p-6">
            <div className="flex items-start gap-4">
              <TrendingUp className="h-8 w-8 text-primary mt-1" />
              <div>
                <h3 className="text-xl font-semibold mb-2">Reinforcement Learning Agents (Advanced)</h3>
                <p className="text-muted-foreground mb-3">
                  Train custom RL models that learn optimal trading strategies through trial and 
                  error. Best for discovering novel strategies.
                </p>
                <div className="grid sm:grid-cols-2 gap-2 text-sm">
                  <div>
                    <strong className="text-green-600">Pros:</strong>
                    <ul className="list-disc list-inside text-muted-foreground">
                      <li>Discovers optimal strategies</li>
                      <li>Adapts to market conditions</li>
                      <li>No ongoing API costs</li>
                      <li>Can handle complex state spaces</li>
                    </ul>
                  </div>
                  <div>
                    <strong className="text-orange-600">Cons:</strong>
                    <ul className="list-disc list-inside text-muted-foreground">
                      <li>Requires significant training time</li>
                      <li>Needs GPU for efficient training</li>
                      <li>Complex to debug</li>
                      <li>Risk of overfitting</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border rounded-lg p-6">
            <div className="flex items-start gap-4">
              <Zap className="h-8 w-8 text-primary mt-1" />
              <div>
                <h3 className="text-xl font-semibold mb-2">Supervised Learning Agents (Intermediate)</h3>
                <p className="text-muted-foreground mb-3">
                  Build ML classifiers that predict profitable opportunities based on historical 
                  patterns. Good balance of simplicity and performance.
                </p>
                <div className="grid sm:grid-cols-2 gap-2 text-sm">
                  <div>
                    <strong className="text-green-600">Pros:</strong>
                    <ul className="list-disc list-inside text-muted-foreground">
                      <li>Faster training than RL</li>
                      <li>Interpretable features</li>
                      <li>Works with limited data</li>
                      <li>No API costs after training</li>
                    </ul>
                  </div>
                  <div>
                    <strong className="text-orange-600">Cons:</strong>
                    <ul className="list-disc list-inside text-muted-foreground">
                      <li>Needs labeled training data</li>
                      <li>Less flexible than RL</li>
                      <li>May not adapt to new patterns</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DocSection>

      <DocSection title="Next Steps">
        <div className="bg-muted/50 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Recommended Learning Path</h3>
          <ol className="list-decimal list-inside space-y-3">
            <li className="font-semibold">
              Understand the Architecture
              <p className="text-muted-foreground font-normal ml-6 mt-1">
                Learn how AI agents work and integrate with Wormhole
              </p>
            </li>
            <li className="font-semibold">
              Choose Your AI Model
              <p className="text-muted-foreground font-normal ml-6 mt-1">
                Explore LLM, RL, and ML options with code examples
              </p>
            </li>
            <li className="font-semibold">
              Master Wormhole Integration
              <p className="text-muted-foreground font-normal ml-6 mt-1">
                Learn cross-chain bridging patterns for agents
              </p>
            </li>
            <li className="font-semibold">
              Follow the Tutorial
              <p className="text-muted-foreground font-normal ml-6 mt-1">
                Build your first AI agent step-by-step
              </p>
            </li>
            <li className="font-semibold">
              Deploy to Production
              <p className="text-muted-foreground font-normal ml-6 mt-1">
                Learn deployment patterns and monitoring
              </p>
            </li>
          </ol>
        </div>

        <div className="flex gap-4 mt-8">
          <a 
            href="/docs/ai-agent/architecture" 
            className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Start with Architecture →
          </a>
          <a 
            href="/docs/ai-agent/ai-models" 
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-6 py-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
          >
            Explore AI Models →
          </a>
        </div>
      </DocSection>
    </div>
  );
};

export default AIAgentGettingStarted;
