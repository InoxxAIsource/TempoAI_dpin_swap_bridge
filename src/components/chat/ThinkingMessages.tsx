import { useState, useEffect } from 'react';
import { Loader2, TrendingUp, Wallet, DollarSign, Sparkles } from 'lucide-react';

type ThinkingContext = 'yield' | 'wallet' | 'price' | 'general';

interface ThinkingMessagesProps {
  context?: ThinkingContext;
  onPause?: () => void;
  lastUserMessage?: string;
}

// Context-specific thinking message pools
const THINKING_MESSAGES = {
  yield: [
    "Scanning yield opportunities across chains...",
    "Checking DefiLlama for the safest strategies...",
    "Comparing APYs and risk levels...",
    "Analyzing audited protocols...",
    "Finding low-medium risk opportunities...",
    "Calculating TVL and safety scores..."
  ],
  wallet: [
    "Fetching your wallet balances...",
    "Calling Alchemy API...",
    "Checking token prices from CoinGecko...",
    "Calculating portfolio value...",
    "Analyzing your holdings..."
  ],
  price: [
    "Getting latest token prices...",
    "Calling CoinGecko API...",
    "Checking market data...",
    "Analyzing price trends..."
  ],
  general: [
    "Analyzing your question...",
    "Processing request...",
    "Let me check that for you...",
    "Thinking about the best approach...",
    "Gathering information..."
  ]
};

// Context-specific icons
const CONTEXT_ICONS = {
  yield: TrendingUp,
  wallet: Wallet,
  price: DollarSign,
  general: Sparkles
};

export function detectThinkingContext(message: string): ThinkingContext {
  if (!message) return 'general';
  
  const lower = message.toLowerCase();
  if (lower.match(/yield|apy|strategy|opportunities|defi|earn|return|protocol/)) return 'yield';
  if (lower.match(/wallet|balance|portfolio|holdings|asset/)) return 'wallet';
  if (lower.match(/price|value|worth|cost|token/)) return 'price';
  return 'general';
}

export default function ThinkingMessages({ 
  context = 'general', 
  onPause,
  lastUserMessage 
}: ThinkingMessagesProps) {
  const [messageIndex, setMessageIndex] = useState(0);
  
  // Detect context from last user message if provided
  const detectedContext = lastUserMessage 
    ? detectThinkingContext(lastUserMessage) 
    : context;
  
  const messages = THINKING_MESSAGES[detectedContext];
  const Icon = CONTEXT_ICONS[detectedContext];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 2000); // Rotate every 2 seconds
    
    return () => clearInterval(interval);
  }, [messages.length]);
  
  return (
    <div className="flex items-start gap-3">
      {/* AI Avatar */}
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-xs font-bold shrink-0">
        AI
      </div>
      
      {/* Thinking Message */}
      <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-muted border border-border">
        <div className="relative flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-primary" />
          <Icon className="w-3.5 h-3.5 text-primary/70" />
        </div>
        <span 
          key={messageIndex} 
          className="text-sm text-muted-foreground animate-fade-in"
        >
          {messages[messageIndex]}
        </span>
      </div>
      
      {/* Optional Pause Button */}
      {onPause && (
        <button
          onClick={onPause}
          className="px-3 py-1.5 text-xs rounded-full border border-border hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
        >
          Pause
        </button>
      )}
    </div>
  );
}
