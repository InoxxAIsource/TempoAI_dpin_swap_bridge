import { useState, useRef } from 'react';
import { Send, Loader2, Plus, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
}

const DEMO_MESSAGES: Message[] = [
  {
    id: 'm1',
    role: 'assistant',
    content: 'Welcome to Tempo AI! I can help you optimize your DeFi yield strategies. What would you like to know?',
    createdAt: new Date().toISOString(),
  },
];

export default function AIAssistantChat() {
  const [messages, setMessages] = useState<Message[]>(DEMO_MESSAGES);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = async () => {
    if (!input.trim() || isThinking) return;

    const userMessage: Message = {
      id: `m${Date.now()}`,
      role: 'user',
      content: input,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsThinking(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: `m${Date.now() + 1}`,
        role: 'assistant',
        content: getDemoResponse(input),
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsThinking(false);
    }, 1500);
  };

  const getDemoResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('yield') || lowerQuery.includes('apy')) {
      return 'Our AI-powered yield optimization strategies currently offer up to 18.7% APY across multiple DeFi protocols. Would you like me to explain how our AI automatically rebalances your portfolio for maximum returns?';
    }
    
    if (lowerQuery.includes('start') || lowerQuery.includes('begin') || lowerQuery.includes('deposit')) {
      return 'Getting started with Tempo is simple! You can deposit any amount to start earning optimized yields. Our AI will automatically allocate your funds across the best performing strategies. Would you like to know about our supported assets?';
    }
    
    if (lowerQuery.includes('risk') || lowerQuery.includes('safe')) {
      return 'Tempo employs multiple security layers: smart contract audits by leading firms, AI risk monitoring, and diversified strategies. We automatically adjust allocations based on real-time risk assessment. What specific security aspect would you like to learn more about?';
    }
    
    return 'I can help you with yield optimization strategies, getting started with deposits, understanding our AI algorithms, or answering questions about security and risk management. What interests you most?';
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[600px] rounded-2xl border border-border bg-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-border bg-muted/30">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary">
          <Sparkles className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h3 className="font-semibold">Tempo AI Assistant</h3>
          <p className="text-xs text-muted-foreground">Ask me anything about yield optimization</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        
        {isThinking && (
          <div className="flex items-start gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-xs font-bold">
              AI
            </div>
            <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-muted border border-border">
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]"></div>
                <div className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]"></div>
                <div className="h-2 w-2 animate-bounce rounded-full bg-primary"></div>
              </div>
              <span className="text-sm text-muted-foreground">AI is thinking...</span>
            </div>
          </div>
        )}
      </div>

      {/* Composer */}
      <div className="px-4 py-4 border-t border-border bg-muted/30">
        <div className="flex items-end gap-2">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about yield strategies, deposits, or optimization..."
              className="w-full min-h-[44px] max-h-32 px-4 py-3 pr-12 rounded-xl border border-border bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
              rows={1}
            />
          </div>
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isThinking}
            size="lg"
            className="rounded-xl px-4 h-[44px]"
          >
            {isThinking ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
        <div className="flex items-center gap-2 mt-3">
          <button 
            onClick={() => {
              setInput('Explain yield strategies');
              inputRef.current?.focus();
            }}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-full bg-muted hover:bg-muted/70"
          >
            Explain yield strategies
          </button>
          <button 
            onClick={() => {
              setInput('How to get started?');
              inputRef.current?.focus();
            }}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-full bg-muted hover:bg-muted/70"
          >
            How to get started?
          </button>
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === 'user';
  
  return (
    <div className={cn('flex gap-3', isUser ? 'justify-end' : 'justify-start')}>
      {!isUser && (
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-xs font-bold shrink-0">
          AI
        </div>
      )}
      <div
        className={cn(
          'max-w-[80%] px-4 py-3 rounded-2xl text-sm shadow-sm',
          isUser
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted border border-border text-foreground'
        )}
      >
        {message.content}
      </div>
      {isUser && (
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted border border-border text-xs font-bold shrink-0">
          You
        </div>
      )}
    </div>
  );
}
