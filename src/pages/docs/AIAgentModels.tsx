import DocHero from "@/components/docs/DocHero";
import DocSection from "@/components/docs/DocSection";
import CodeBlock from "@/components/docs/CodeBlock";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Brain, TrendingUp, Zap, AlertTriangle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AIAgentModels = () => {
  const llmPythonCode = `from openai import OpenAI
import json

class LLMTradingAgent:
    def __init__(self, api_key):
        self.client = OpenAI(api_key=api_key)
    
    def analyze_market(self, portfolio_data, yield_data):
        """Use GPT-5 to analyze market and decide actions"""
        prompt = f"""
You are an expert DeFi portfolio manager analyzing opportunities.

PORTFOLIO:
{json.dumps(portfolio_data, indent=2)}

CURRENT YIELDS ACROSS CHAINS:
{json.dumps(yield_data, indent=2)}

TASK: Decide the best action to maximize APY while considering:
1. Bridge costs (~$8 for Wormhole)
2. Gas costs on each chain
3. Risk level of protocols
4. Time to earn back bridge costs

Return ONLY valid JSON in this format:
{{
  "action": "bridge_and_deposit" | "deposit_same_chain" | "hold",
  "token": "USDC" | "ETH" | "DAI",
  "amount": 100,
  "from_chain": "Sepolia",
  "to_chain": "Arbitrum",
  "target_protocol": "Aave" | "Compound" | "Curve",
  "expected_apy": 5.2,
  "reasoning": "Detailed explanation of decision",
  "confidence": 0.85
}}
        """
        
        response = self.client.chat.completions.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"},
            temperature=0.3  # Lower = more conservative
        )
        
        decision = json.loads(response.choices[0].message.content)
        return decision

# Example usage
agent = LLMTradingAgent(api_key="sk-...")

portfolio = {
    "chains": {
        "Sepolia": {"USDC": 1000, "ETH": 0.5},
        "Arbitrum": {"USDC": 0}
    }
}

yields = {
    "Sepolia": {"Aave USDC": 3.1, "Compound USDC": 2.8},
    "Arbitrum": {"Aave USDC": 5.2, "Compound USDC": 4.9}
}

decision = agent.analyze_market(portfolio, yields)
print(f"Decision: {decision['action']}")
print(f"Reasoning: {decision['reasoning']}")`;

  const llmJsCode = `import OpenAI from 'openai';

class LLMTradingAgent {
    constructor(apiKey) {
        this.client = new OpenAI({ apiKey });
    }
    
    async analyzeMarket(portfolioData, yieldData) {
        const prompt = \`
You are an expert DeFi portfolio manager analyzing opportunities.

PORTFOLIO:
\${JSON.stringify(portfolioData, null, 2)}

CURRENT YIELDS ACROSS CHAINS:
\${JSON.stringify(yieldData, null, 2)}

Return ONLY valid JSON with: action, token, amount, from_chain, 
to_chain, target_protocol, expected_apy, reasoning, confidence
        \`;
        
        const response = await this.client.chat.completions.create({
            model: 'gpt-4o',
            messages: [{ role: 'user', content: prompt }],
            response_format: { type: 'json_object' },
            temperature: 0.3
        });
        
        return JSON.parse(response.choices[0].message.content);
    }
}

// Usage
const agent = new LLMTradingAgent('sk-...');
const decision = await agent.analyzeMarket(portfolio, yields);
console.log(\`Decision: \${decision.action}\`);`;

  const rlPythonCode = `import gym
from gym import spaces
import numpy as np
from stable_baselines3 import PPO
from stable_baselines3.common.vec_env import DummyVecEnv

class DeFiTradingEnv(gym.Env):
    """Custom RL environment for DeFi yield optimization"""
    
    def __init__(self, initial_balance=1000):
        super().__init__()
        
        # State: [balance, current_apy, gas_cost, bridge_cost, 
        #         eth_apy, arb_apy, opt_apy, base_apy]
        self.observation_space = spaces.Box(
            low=0, high=np.inf, shape=(8,), dtype=np.float32
        )
        
        # Actions: [hold, bridge_to_arbitrum, bridge_to_optimism, 
        #           bridge_to_base, deposit_aave, deposit_compound]
        self.action_space = spaces.Discrete(6)
        
        self.initial_balance = initial_balance
        self.reset()
    
    def reset(self):
        self.balance = self.initial_balance
        self.current_chain = "Sepolia"
        self.current_protocol = None
        self.step_count = 0
        return self._get_obs()
    
    def _get_obs(self):
        """Return current state observation"""
        # Fetch real-time APYs from DeFi Llama API
        apys = self._fetch_current_apys()
        
        return np.array([
            self.balance,
            apys.get(self.current_chain, 0),
            self._get_gas_cost(),
            self._get_bridge_cost(),
            apys.get("Ethereum", 0),
            apys.get("Arbitrum", 0),
            apys.get("Optimism", 0),
            apys.get("Base", 0)
        ], dtype=np.float32)
    
    def step(self, action):
        """Execute action and return new state, reward, done, info"""
        reward = 0
        
        if action == 0:  # Hold
            # Earn current APY
            reward = self.balance * (self._get_current_apy() / 365 / 100)
        
        elif action in [1, 2, 3]:  # Bridge to another chain
            bridge_cost = self._get_bridge_cost()
            gas_cost = self._get_gas_cost()
            total_cost = bridge_cost + gas_cost
            
            # Penalize if cost too high
            if total_cost > self.balance * 0.05:  # More than 5%
                reward = -total_cost
            else:
                self.balance -= total_cost
                self.current_chain = ["Arbitrum", "Optimism", "Base"][action - 1]
                # Reward potential APY improvement
                reward = self.balance * 0.01  # Small immediate reward
        
        elif action in [4, 5]:  # Deposit to protocol
            # Earn APY for this step
            apy_earned = self.balance * (self._get_current_apy() / 365 / 100)
            reward = apy_earned
        
        self.step_count += 1
        done = self.step_count >= 365  # One year simulation
        
        return self._get_obs(), reward, done, {}
    
    def _fetch_current_apys(self):
        """Fetch real APYs from DeFi Llama"""
        # In production, call actual API
        return {
            "Sepolia": 3.1,
            "Arbitrum": 5.2,
            "Optimism": 4.8,
            "Base": 5.0
        }
    
    def _get_bridge_cost(self):
        return 8.0  # USD
    
    def _get_gas_cost(self):
        return 2.0  # USD
    
    def _get_current_apy(self):
        apys = self._fetch_current_apys()
        return apys.get(self.current_chain, 0)

# Train the RL agent
env = DummyVecEnv([lambda: DeFiTradingEnv()])
model = PPO("MlpPolicy", env, verbose=1, learning_rate=0.0003)

print("Training RL agent...")
model.learn(total_timesteps=100000)

# Save trained model
model.save("defi_rl_agent")

# Use trained agent
print("Testing agent...")
obs = env.reset()
for i in range(100):
    action, _states = model.predict(obs, deterministic=True)
    obs, reward, done, info = env.step(action)
    print(f"Step {i}: Action {action}, Reward {reward}")
    if done:
        break`;

  const mlPythonCode = `from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
import pandas as pd
import numpy as np

class YieldOpportunityPredictor:
    """ML classifier to predict profitable yield opportunities"""
    
    def __init__(self):
        self.model = RandomForestClassifier(
            n_estimators=100,
            max_depth=10,
            random_state=42
        )
        self.feature_names = [
            'apy', 'tvl', 'protocol_age_days', 'chain_gas_cost',
            'bridge_cost', 'current_balance', 'risk_score'
        ]
    
    def prepare_training_data(self, historical_data):
        """
        Prepare features from historical DeFi data
        
        historical_data format:
        {
            'timestamp': '2024-01-15',
            'chain': 'Arbitrum',
            'protocol': 'Aave',
            'token': 'USDC',
            'apy': 5.2,
            'tvl': 1500000000,
            'protocol_age_days': 800,
            'gas_cost': 0.50,
            'bridge_cost': 8.20,
            'balance': 1000,
            'risk_score': 2,  # 1-10, lower is safer
            'outcome': 'profitable'  # Target variable
        }
        """
        df = pd.DataFrame(historical_data)
        
        # Feature engineering
        df['apy_minus_costs'] = df['apy'] - (
            (df['gas_cost'] + df['bridge_cost']) / df['balance'] * 100
        )
        df['tvl_billions'] = df['tvl'] / 1e9
        df['risk_adjusted_apy'] = df['apy'] / df['risk_score']
        
        # Features
        X = df[self.feature_names + ['apy_minus_costs', 'tvl_billions', 'risk_adjusted_apy']]
        
        # Target: 1 if profitable, 0 otherwise
        y = (df['outcome'] == 'profitable').astype(int)
        
        return X, y
    
    def train(self, historical_data):
        """Train the classifier on historical data"""
        X, y = self.prepare_training_data(historical_data)
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42
        )
        
        # Train
        print("Training ML model...")
        self.model.fit(X_train, y_train)
        
        # Evaluate
        train_score = self.model.score(X_train, y_train)
        test_score = self.model.score(X_test, y_test)
        print(f"Train accuracy: {train_score:.2%}")
        print(f"Test accuracy: {test_score:.2%}")
        
        # Feature importance
        importance = pd.DataFrame({
            'feature': X.columns,
            'importance': self.model.feature_importances_
        }).sort_values('importance', ascending=False)
        print("\\nFeature importance:")
        print(importance)
    
    def predict_best_opportunity(self, current_opportunities):
        """
        Predict which opportunity is most likely profitable
        
        current_opportunities: list of dict with same features as training
        Returns: best opportunity with confidence score
        """
        df = pd.DataFrame(current_opportunities)
        
        # Same feature engineering
        df['apy_minus_costs'] = df['apy'] - (
            (df['gas_cost'] + df['bridge_cost']) / df['balance'] * 100
        )
        df['tvl_billions'] = df['tvl'] / 1e9
        df['risk_adjusted_apy'] = df['apy'] / df['risk_score']
        
        X = df[self.feature_names + ['apy_minus_costs', 'tvl_billions', 'risk_adjusted_apy']]
        
        # Get probability of being profitable
        probabilities = self.model.predict_proba(X)[:, 1]
        
        # Select best
        best_idx = np.argmax(probabilities)
        best_opportunity = current_opportunities[best_idx]
        best_opportunity['confidence'] = float(probabilities[best_idx])
        
        return best_opportunity

# Example: Load historical data and train
historical_data = [
    {
        'timestamp': '2024-01-01', 'chain': 'Arbitrum', 'protocol': 'Aave',
        'token': 'USDC', 'apy': 5.2, 'tvl': 1.5e9, 'protocol_age_days': 800,
        'gas_cost': 0.50, 'bridge_cost': 8.0, 'balance': 1000, 'risk_score': 2,
        'outcome': 'profitable'
    },
    # ... more historical data
]

predictor = YieldOpportunityPredictor()
predictor.train(historical_data)

# Predict on current opportunities
current_opportunities = [
    {
        'chain': 'Optimism', 'protocol': 'Aave', 'apy': 4.8,
        'tvl': 1.2e9, 'protocol_age_days': 700, 'gas_cost': 0.30,
        'bridge_cost': 8.0, 'balance': 1000, 'risk_score': 2
    },
    {
        'chain': 'Base', 'protocol': 'Compound', 'apy': 5.1,
        'tvl': 0.8e9, 'protocol_age_days': 100, 'gas_cost': 0.20,
        'bridge_cost': 8.0, 'balance': 1000, 'risk_score': 5
    }
]

best = predictor.predict_best_opportunity(current_opportunities)
print(f"\\nBest opportunity: {best['chain']} - {best['protocol']}")
print(f"Confidence: {best['confidence']:.2%}")`;

  return (
    <div className="space-y-12">
        <div>
          <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm mb-4">
            <span className="text-primary">Core</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">AI Model Options</h1>
          <p className="text-xl text-muted-foreground">
            Explore different AI model types for building trading agents: LLM-based, Reinforcement Learning, and Supervised Learning approaches.
          </p>
        </div>

      <DocSection title="Choose Your AI Approach">
        <p className="text-lg mb-6">
          There are three main approaches to building AI trading agents, each with different 
          complexity levels, training requirements, and use cases. Choose based on your skill 
          level and goals.
        </p>

        <Alert className="mb-6">
          <Brain className="h-4 w-4" />
          <AlertDescription>
            <strong>Recommendation for Beginners:</strong> Start with LLM-based agents. They're 
            easiest to implement (no training needed), provide explainable decisions, and work 
            well for most yield optimization use cases.
          </AlertDescription>
        </Alert>
      </DocSection>

      <DocSection title="Option 1: LLM-Based Agents">
        <div className="flex items-start gap-4 mb-6">
          <Brain className="h-10 w-10 text-primary mt-1" />
          <div>
            <h3 className="text-2xl font-semibold mb-2">Large Language Model Agents</h3>
            <p className="text-muted-foreground">
              Use GPT-5, Gemini 2.5, or Claude to analyze market data and make decisions 
              using natural language reasoning. Best for: beginners, explainable decisions, 
              rapid prototyping.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="border rounded-lg p-4">
            <h4 className="font-semibold text-green-600 mb-2">Advantages</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>No training required</li>
              <li>Easy to implement (100 lines)</li>
              <li>Explainable reasoning</li>
              <li>Handles complex scenarios</li>
              <li>Can adapt via prompt changes</li>
            </ul>
          </div>
          <div className="border rounded-lg p-4">
            <h4 className="font-semibold text-orange-600 mb-2">Disadvantages</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Requires API key ($0.01-0.10/call)</li>
              <li>Slower than local models (2-5s)</li>
              <li>Depends on external service</li>
              <li>Rate limits apply</li>
            </ul>
          </div>
          <div className="border rounded-lg p-4">
            <h4 className="font-semibold mb-2">Best For</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Beginners to AI trading</li>
              <li>Rapid prototyping</li>
              <li>Conservative strategies</li>
              <li>Infrequent rebalancing</li>
            </ul>
          </div>
        </div>

        <h4 className="text-lg font-semibold mb-3">Implementation Example</h4>
        <Tabs defaultValue="python" className="mb-6">
          <TabsList>
            <TabsTrigger value="python">Python</TabsTrigger>
            <TabsTrigger value="javascript">JavaScript</TabsTrigger>
          </TabsList>
          <TabsContent value="python">
            <CodeBlock code={llmPythonCode} language="python" />
          </TabsContent>
          <TabsContent value="javascript">
            <CodeBlock code={llmJsCode} language="javascript" />
          </TabsContent>
        </Tabs>

        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Cost Consideration:</strong> LLM APIs typically cost $0.01-0.10 per decision. 
            If running hourly (24 decisions/day), monthly cost is ~$7-72. Use caching and reduce 
            frequency for cost savings.
          </AlertDescription>
        </Alert>
      </DocSection>

      <DocSection title="Option 2: Reinforcement Learning Agents">
        <div className="flex items-start gap-4 mb-6">
          <TrendingUp className="h-10 w-10 text-primary mt-1" />
          <div>
            <h3 className="text-2xl font-semibold mb-2">RL-Based Agents (Advanced)</h3>
            <p className="text-muted-foreground">
              Train custom RL models that learn optimal trading strategies through trial and error. 
              Best for: advanced users, discovering novel strategies, high-frequency trading.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="border rounded-lg p-4">
            <h4 className="font-semibold text-green-600 mb-2">Advantages</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Discovers optimal strategies</li>
              <li>No ongoing API costs</li>
              <li>Fast inference ({'<'}100ms)</li>
              <li>Adapts to market patterns</li>
              <li>Handles complex state spaces</li>
            </ul>
          </div>
          <div className="border rounded-lg p-4">
            <h4 className="font-semibold text-orange-600 mb-2">Disadvantages</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Requires training (hours to days)</li>
              <li>Needs GPU for efficiency</li>
              <li>Complex to debug</li>
              <li>Risk of overfitting</li>
              <li>Needs large datasets</li>
            </ul>
          </div>
          <div className="border rounded-lg p-4">
            <h4 className="font-semibold mb-2">Best For</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Experienced ML practitioners</li>
              <li>High-frequency strategies</li>
              <li>Novel strategy discovery</li>
              <li>Long-term deployment</li>
            </ul>
          </div>
        </div>

        <h4 className="text-lg font-semibold mb-3">Implementation Example (Python)</h4>
        <CodeBlock code={rlPythonCode} language="python" />

        <Alert className="mt-4">
          <Brain className="h-4 w-4" />
          <AlertDescription>
            <strong>Training Tips:</strong> Start with 100k timesteps for initial testing. 
            For production, train for 1M+ timesteps. Use Google Colab (free GPU) or AWS EC2 
            g4dn.xlarge ($0.50/hr) for training.
          </AlertDescription>
        </Alert>
      </DocSection>

      <DocSection title="Option 3: Supervised Learning Agents">
        <div className="flex items-start gap-4 mb-6">
          <Zap className="h-10 w-10 text-primary mt-1" />
          <div>
            <h3 className="text-2xl font-semibold mb-2">ML Classifier Agents (Intermediate)</h3>
            <p className="text-muted-foreground">
              Build ML classifiers that predict profitable opportunities based on historical 
              patterns. Best for: intermediate users, interpretable models, moderate frequency.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="border rounded-lg p-4">
            <h4 className="font-semibold text-green-600 mb-2">Advantages</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Faster training than RL</li>
              <li>Interpretable features</li>
              <li>Works with less data</li>
              <li>No API costs</li>
              <li>Easy to debug</li>
            </ul>
          </div>
          <div className="border rounded-lg p-4">
            <h4 className="font-semibold text-orange-600 mb-2">Disadvantages</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Needs labeled data</li>
              <li>Less flexible than RL</li>
              <li>May not adapt to new patterns</li>
              <li>Requires feature engineering</li>
            </ul>
          </div>
          <div className="border rounded-lg p-4">
            <h4 className="font-semibold mb-2">Best For</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Intermediate ML users</li>
              <li>Interpretable decisions</li>
              <li>Moderate-frequency trading</li>
              <li>Pattern-based strategies</li>
            </ul>
          </div>
        </div>

        <h4 className="text-lg font-semibold mb-3">Implementation Example (Python)</h4>
        <CodeBlock code={mlPythonCode} language="python" />
      </DocSection>

      <DocSection title="Comparison Matrix">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3 font-semibold">Feature</th>
                <th className="text-left p-3 font-semibold">LLM Agent</th>
                <th className="text-left p-3 font-semibold">RL Agent</th>
                <th className="text-left p-3 font-semibold">ML Agent</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <tr className="border-b">
                <td className="p-3 font-medium">Skill Level</td>
                <td className="p-3 text-green-600">Beginner</td>
                <td className="p-3 text-red-600">Advanced</td>
                <td className="p-3 text-yellow-600">Intermediate</td>
              </tr>
              <tr className="border-b">
                <td className="p-3 font-medium">Training Time</td>
                <td className="p-3">None</td>
                <td className="p-3">Hours to days</td>
                <td className="p-3">Minutes to hours</td>
              </tr>
              <tr className="border-b">
                <td className="p-3 font-medium">Inference Speed</td>
                <td className="p-3">2-5s</td>
                <td className="p-3">{'<'}100ms</td>
                <td className="p-3">{'<'}10ms</td>
              </tr>
              <tr className="border-b">
                <td className="p-3 font-medium">Ongoing Costs</td>
                <td className="p-3">$7-72/month</td>
                <td className="p-3">$0</td>
                <td className="p-3">$0</td>
              </tr>
              <tr className="border-b">
                <td className="p-3 font-medium">Explainability</td>
                <td className="p-3 text-green-600">High</td>
                <td className="p-3 text-red-600">Low</td>
                <td className="p-3 text-yellow-600">Medium</td>
              </tr>
              <tr className="border-b">
                <td className="p-3 font-medium">Adaptability</td>
                <td className="p-3 text-green-600">High (via prompts)</td>
                <td className="p-3 text-green-600">High (retrains)</td>
                <td className="p-3 text-yellow-600">Medium</td>
              </tr>
              <tr className="border-b">
                <td className="p-3 font-medium">Data Requirements</td>
                <td className="p-3">None</td>
                <td className="p-3">Large (100k+ samples)</td>
                <td className="p-3">Medium (1k+ samples)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </DocSection>

      <DocSection title="Next Steps">
        <p className="mb-6">
          Choose your approach and learn how to integrate it with Wormhole for cross-chain operations:
        </p>
        
        <div className="flex gap-4">
          <a 
            href="/docs/ai-agent/wormhole" 
            className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Wormhole Integration →
          </a>
          <a 
            href="/docs/ai-agent/build-your-own" 
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-6 py-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
          >
            Build Tutorial →
          </a>
        </div>
      </DocSection>
    </div>
  );
};

export default AIAgentModels;
