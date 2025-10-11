import { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Menu, Plus, X, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import ThinkingMessages from './ThinkingMessages';
import MessageContent from './MessageContent';
import WalletModal from '@/components/WalletModal';
import { useWalletContext } from '@/contexts/WalletContext';
import { toast } from '@/hooks/use-toast';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
}

interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: string;
}

const DEFAULT_PRE_PROMPTS = [
  "Show me my portfolio",
  "What are the current best DeFi yield opportunities?",
  "How can I maximize returns on my stablecoins?",
  "Show me cross-chain yield strategies"
];

const generatePrePrompts = (portfolio: any) => {
  if (!portfolio || portfolio.totalValueUSD === 0) {
    return DEFAULT_PRE_PROMPTS;
  }

  const prompts: string[] = [];
  const holdings = portfolio.holdings || [];
  const topHoldings = portfolio.topHoldings || [];
  
  // Check for specific tokens
  const hasETH = holdings.some((h: any) => h.token === 'ETH');
  const hasUSDC = holdings.some((h: any) => h.token === 'USDC');
  const hasMainnetETH = holdings.some((h: any) => h.token === 'ETH' && h.chain === 'Ethereum' && h.network === 'mainnet');
  const hasSepoliaETH = holdings.some((h: any) => h.token === 'ETH' && h.chain === 'Sepolia' && h.network === 'testnet');
  
  // Personalized prompts based on holdings
  if (hasMainnetETH) {
    prompts.push('Show me best yields for my Ethereum ETH');
    prompts.push('Should I bridge my ETH to L2 to save gas?');
  }
  
  if (hasSepoliaETH) {
    prompts.push('What can I do with testnet ETH?');
  }
  
  if (hasUSDC) {
    prompts.push('Show me stablecoin yields across chains');
  }
  
  // Portfolio-level prompts
  if (portfolio.chainCount > 2) {
    prompts.push('How can I consolidate my portfolio?');
  }
  
  if (portfolio.totalValueUSD > 1000) {
    prompts.push('What are advanced yield strategies for larger portfolios?');
  }
  
  // Always include these
  prompts.push('Show me cross-chain opportunities');
  prompts.push('Analyze my portfolio risk');
  
  // Return 4 most relevant prompts
  return prompts.slice(0, 4);
};

export default function ChatInterface() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [portfolioContext, setPortfolioContext] = useState<any>(null);
  const [prePrompts, setPrePrompts] = useState(DEFAULT_PRE_PROMPTS);
  const [followUpPrompts, setFollowUpPrompts] = useState<string[]>([]);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { isAnyWalletConnected, evmAddress, solanaAddress } = useWalletContext();

  const currentChat = chats.find(c => c.id === currentChatId);
  const hasMessages = currentChat && currentChat.messages.length > 0;

  const createNewChat = () => {
    const newChat: Chat = {
      id: `chat-${Date.now()}`,
      title: 'New Chat',
      messages: [],
      createdAt: new Date().toISOString(),
    };
    setChats(prev => [newChat, ...prev]);
    setCurrentChatId(newChat.id);
    setSidebarOpen(false);
    
    // Reset pre-prompts to default OR regenerate from portfolio
    if (portfolioContext && portfolioContext.totalValueUSD > 0) {
      setPrePrompts(generatePrePrompts(portfolioContext));
    } else {
      setPrePrompts(DEFAULT_PRE_PROMPTS);
    }
  };

  // Generate follow-up prompts based on AI response
  const generateFollowUpPrompts = (aiResponse: string, portfolioContext: any): string[] => {
    const prompts: string[] = [];
    const response = aiResponse.toLowerCase();
    
    // Strategy-specific follow-ups
    if (response.includes('lido') || response.includes('staking')) {
      prompts.push('How does staking work?');
      prompts.push('Can I unstake anytime?');
    }
    
    if (response.includes('aave')) {
      prompts.push('What are Aave liquidation risks?');
      prompts.push('Show me Aave rates on other chains');
    }
    
    if (response.includes('compound')) {
      prompts.push('Compare Compound vs Aave');
    }
    
    // Action-specific follow-ups
    if (response.includes('[execute_card]') || response.includes('bridge')) {
      prompts.push('Walk me through the bridging process');
      prompts.push('How long does bridging take?');
      prompts.push('What are the gas fees?');
    }
    
    // Risk-related follow-ups
    if (response.includes('risk') || response.includes('safe')) {
      prompts.push("What's the safest option?");
      prompts.push('How do I minimize risk?');
    }
    
    // Base/limitation follow-ups
    if (response.includes('base') && response.includes('eth')) {
      prompts.push('How do I swap ETH to USDC?');
      prompts.push('Which DEX is cheapest for swapping?');
    }
    
    // Portfolio-aware follow-ups
    if (portfolioContext && portfolioContext.chainCount > 1) {
      prompts.push('Should I consolidate my assets?');
    }
    
    if (portfolioContext && portfolioContext.totalValueUSD < 100) {
      prompts.push('Best strategies for small portfolios?');
    }
    
    // Generic high-value follow-ups (always include 1-2)
    prompts.push('Show me other opportunities');
    prompts.push('What would you do with this portfolio?');
    
    // Return top 6 unique prompts
    return [...new Set(prompts)].slice(0, 6);
  };

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input;
    
    if (!textToSend.trim() || isThinking) return;

    // Clear follow-up prompts when starting new query
    setFollowUpPrompts([]);

    // Detect portfolio queries explicitly
    const isPortfolioQuery = textToSend.toLowerCase().includes('portfolio') || 
                             textToSend.toLowerCase().includes('holdings') ||
                             textToSend.toLowerCase().includes('balance') ||
                             textToSend.toLowerCase().includes('show me my');

    // Always fetch fresh portfolio for portfolio queries OR if not cached
    if (isAnyWalletConnected && (isPortfolioQuery || !portfolioContext)) {
      console.log('🔍 Fetching portfolio for query:', textToSend);
      try {
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
        const portfolioUrl = `${supabaseUrl}/functions/v1/wormhole-portfolio-fetcher`;
        
        const portResponse = await fetch(portfolioUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseKey}`,
          },
          body: JSON.stringify({ 
            evmAddress, 
            solanaAddress,
            includeTestnets: true 
          }),
        });
        
        if (portResponse.ok) {
          const data = await portResponse.json();
          console.log('✅ FULL PORTFOLIO DATA:', JSON.stringify(data, null, 2));
          
          // Enhanced client-side logging
          if (data.holdings && data.holdings.length > 0) {
            console.log('📊 Holdings breakdown:');
            data.holdings.forEach((h: any) => {
              console.log(`  - ${h.chain} (${h.network}): ${h.amount} ${h.token} ($${h.valueUSD})`);
            });
          }
          
          // Show toast for user visibility
          if (data.totalValueUSD > 0) {
            toast({
              title: "✅ Portfolio Loaded",
              description: `Found $${data.totalValueUSD.toFixed(2)} across ${data.chainCount} chain(s)`,
            });
          } else {
            // Zero balance detected - show warning
            toast({
              title: "⚠️ No Balance Detected",
              description: `Queried ${data.chainsQueried?.length || 0} chains but found 0 balance. Check wallet or try again.`,
              variant: "destructive"
            });
          }
          
          setPortfolioContext(data);
          setPrePrompts(generatePrePrompts(data));
        } else {
          // HTTP error
          const errorText = await portResponse.text();
          console.error('❌ Portfolio fetch HTTP error:', portResponse.status, errorText);
          
          toast({
            title: "❌ Portfolio Fetch Failed",
            description: errorText || `HTTP ${portResponse.status} error. Check edge function logs.`,
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('❌ Portfolio fetch error:', error);
        toast({
          title: "Portfolio Fetch Failed",
          description: "Unable to fetch your portfolio. Please try again.",
          variant: "destructive",
        });
      }
    }

    // Create new chat if none exists
    let chatId = currentChatId;
    if (!chatId) {
      const newChat: Chat = {
        id: `chat-${Date.now()}`,
        title: textToSend.slice(0, 30),
        messages: [],
        createdAt: new Date().toISOString(),
      };
      setChats(prev => [newChat, ...prev]);
      chatId = newChat.id;
      setCurrentChatId(chatId);
    }

    const userMessage: Message = {
      id: `m${Date.now()}`,
      role: 'user',
      content: textToSend,
      createdAt: new Date().toISOString(),
    };

    setChats(prev => prev.map(c => 
      c.id === chatId 
        ? { ...c, messages: [...c.messages, userMessage], title: c.messages.length === 0 ? textToSend.slice(0, 30) : c.title }
        : c
    ));

    setInput('');
    setIsThinking(true);

    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
      
      if (!supabaseUrl) {
        throw new Error('VITE_SUPABASE_URL is not configured');
      }
      
      const url = `${supabaseUrl}/functions/v1/ai-defi-assistant`;
      
      const currentMessages = chats.find(c => c.id === chatId)?.messages || [];
      const allMessages = [...currentMessages, userMessage];
      
      console.log('📤 Sending to AI:', {
        messages: allMessages.length,
        hasPortfolioContext: !!portfolioContext,
        portfolioValue: portfolioContext?.totalValueUSD,
        walletConnected: isAnyWalletConnected
      });

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseKey}`,
        },
        body: JSON.stringify({
          messages: allMessages.map(m => ({
            role: m.role,
            content: m.content,
          })),
          portfolioContext,
          walletConnected: isAnyWalletConnected
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      if (!response.body) {
        throw new Error('No response body');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantContent = '';
      let assistantId = `m${Date.now() + 1}`;
      
      setIsThinking(false);
      
      // Add initial empty assistant message
      setChats(prev => prev.map(c => 
        c.id === chatId 
          ? {
              ...c,
              messages: [
                ...c.messages,
                {
                  id: assistantId,
                  role: 'assistant',
                  content: '',
                  createdAt: new Date().toISOString(),
                },
              ],
            }
          : c
      ));

      let textBuffer = '';
      let streamingComplete = false;
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          streamingComplete = true;
          break;
        }

        textBuffer += decoder.decode(value, { stream: true });
        
        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf('\n')) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (line.startsWith(':') || line.trim() === '') continue;
          if (!line.startsWith('data: ')) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantContent += content;
              
              setChats(prev => prev.map(c => 
                c.id === chatId 
                  ? {
                      ...c,
                      messages: c.messages.map(m =>
                        m.id === assistantId
                          ? { ...m, content: assistantContent }
                          : m
                      ),
                    }
                  : c
              ));
            }
          } catch (e) {
            console.error('Error parsing SSE:', e);
          }
        }
      }

      // Generate follow-up prompts when streaming completes
      if (streamingComplete && assistantContent) {
        console.log('✅ Streaming complete, generating follow-up prompts');
        const followUps = generateFollowUpPrompts(assistantContent, portfolioContext);
        setFollowUpPrompts(followUps);
      }
    } catch (error) {
      console.error('Error calling AI:', error);
      setIsThinking(false);
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      setChats(prev => prev.map(c => 
        c.id === chatId 
          ? {
              ...c,
              messages: [
                ...c.messages,
                {
                  id: `m${Date.now() + 1}`,
                  role: 'assistant',
                  content: `❌ Error: ${errorMessage}`,
                  createdAt: new Date().toISOString(),
                },
              ],
            }
          : c
      ));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handlePrePrompt = (prompt: string) => {
    setInput(prompt);
    handleSend(prompt);
  };

  // Auto-adjust textarea height
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = Math.min(inputRef.current.scrollHeight, 200) + 'px';
    }
  }, [input]);

  // Regenerate pre-prompts when portfolio context changes
  useEffect(() => {
    if (portfolioContext && portfolioContext.totalValueUSD > 0) {
      const newPrompts = generatePrePrompts(portfolioContext);
      setPrePrompts(newPrompts);
      console.log('🎯 Updated pre-prompts based on portfolio:', newPrompts);
    }
  }, [portfolioContext]);

  return (
    <div className="flex h-screen w-full bg-black text-white">
      {/* Sidebar */}
      <div
        className={cn(
          'fixed left-0 top-0 z-50 h-full w-64 bg-zinc-950 border-r border-zinc-800 transition-transform duration-300 md:relative md:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between p-4 border-b border-zinc-800">
            <h2 className="text-sm font-semibold">Chat History</h2>
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden p-1 hover:bg-zinc-800 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <div className="p-2">
            <button
              onClick={createNewChat}
              className="flex w-full items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-zinc-800 transition-colors"
            >
              <Plus className="w-4 h-4" />
              New Chat
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-2">
            {chats.map(chat => (
              <button
                key={chat.id}
                onClick={() => {
                  setCurrentChatId(chat.id);
                  setSidebarOpen(false);
                }}
                className={cn(
                  'w-full text-left px-3 py-2 text-sm rounded-lg mb-1 transition-colors truncate',
                  currentChatId === chat.id
                    ? 'bg-zinc-800 text-white'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                )}
              >
                {chat.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <h1 className="text-sm font-medium">Tempo AI</h1>
          
          <Button
            onClick={() => setWalletModalOpen(true)}
            variant="outline"
            size="sm"
            className="bg-transparent border-zinc-700 hover:bg-zinc-800 hover:text-white text-white"
          >
            {isAnyWalletConnected 
              ? `${(evmAddress || solanaAddress)?.slice(0, 6)}...${(evmAddress || solanaAddress)?.slice(-4)}`
              : 'Connect Wallet'}
          </Button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto">
          {!hasMessages ? (
            // Initial centered view
            <div className="flex flex-col items-center justify-center h-full px-4 max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold mb-8 text-center">
                What can I help you with?
              </h2>
              
              <div className="w-full max-w-xl mb-6">
                <div className="relative">
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Message Tempo AI..."
                    className="w-full px-4 py-3 pr-12 rounded-2xl border border-zinc-700 bg-zinc-900 text-white resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[56px]"
                    rows={1}
                  />
                  <button
                    onClick={() => handleSend()}
                    disabled={!input.trim() || isThinking}
                    className="absolute right-3 bottom-3 p-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Pre-prompt suggestions with visual indicator */}
              <div className="w-full max-w-xl mb-2 text-center">
                <p className="text-xs text-muted-foreground">
                  {portfolioContext && portfolioContext.totalValueUSD > 0 
                    ? `✨ Personalized suggestions based on your $${portfolioContext.totalValueUSD.toFixed(2)} portfolio`
                    : '💡 Popular questions'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-xl">
                {prePrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handlePrePrompt(prompt)}
                    className="group relative p-4 text-left text-sm rounded-xl border border-zinc-700 bg-gradient-to-br from-zinc-900 to-zinc-900/50 hover:from-zinc-800 hover:to-zinc-800/50 hover:border-zinc-600 transition-all duration-200 hover:scale-[1.02] cursor-pointer"
                  >
                    <span className="flex items-start justify-between gap-2">
                      <span className="flex-1">{prompt}</span>
                      <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400 group-hover:translate-x-0.5 transition-all" />
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            // Chat messages view
            <div className="max-w-3xl mx-auto px-4 py-6">
              {currentChat?.messages.map((message) => (
                <div key={message.id} className={cn('mb-6 flex gap-4', message.role === 'user' ? 'justify-end' : 'justify-start')}>
                  {message.role === 'assistant' && (
                    <div className="px-2 py-1 rounded-md bg-zinc-800 text-white text-xs font-medium shrink-0 mt-1 h-fit">
                      Olivia
                    </div>
                  )}
                  <div className={cn('max-w-[85%]', message.role === 'user' && 'flex items-start gap-4')}>
                    <div
                      className={cn(
                        'px-4 py-3 rounded-2xl text-sm',
                        message.role === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-transparent text-white'
                      )}
                    >
                      {message.role === 'assistant' ? (
                        <MessageContent content={message.content} onPromptClick={handlePrePrompt} />
                      ) : (
                        message.content
                      )}
                    </div>
                    {message.role === 'user' && (
                      <div className="flex items-start justify-center w-8 h-8 rounded-full bg-blue-600 text-white text-xs font-bold shrink-0 mt-1">
                        JD
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {isThinking && (
                <div className="mb-6 flex gap-4 justify-start">
                  <div className="px-2 py-1 rounded-md bg-zinc-800 text-white text-xs font-medium shrink-0 mt-1 h-fit">
                    Olivia
                  </div>
                  <div className="max-w-[85%]">
                    <ThinkingMessages lastUserMessage={currentChat?.messages[currentChat.messages.length - 1]?.content || ''} />
                  </div>
                </div>
              )}

            </div>
          )}
        </div>

        {/* Persistent Suggestion Strip - Always Visible Above Input */}
        <div className="sticky bottom-0 left-0 right-0 border-t border-zinc-800 bg-zinc-950/95 backdrop-blur-sm">
          <div className="max-w-3xl mx-auto px-4 py-3">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <p className="text-xs text-muted-foreground font-medium">
                {hasMessages ? 'Quick actions:' : 'Try asking:'}
              </p>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {(hasMessages && followUpPrompts.length > 0 ? followUpPrompts.slice(0, 4) : prePrompts.slice(0, 4)).map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    handlePrePrompt(prompt);
                    setFollowUpPrompts([]);
                  }}
                  className="px-4 py-2 text-xs rounded-full border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 hover:border-zinc-600 transition-all cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1.5 animate-in fade-in slide-in-from-bottom-2 duration-300"
                >
                  <span>{prompt}</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Input Area (shown when there are messages) */}
        {hasMessages && (
          <div className="border-t border-zinc-800 p-4">
            <div className="max-w-3xl mx-auto">
              <div className="relative">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Message Tempo AI..."
                  className="w-full px-4 py-3 pr-12 rounded-2xl border border-zinc-700 bg-zinc-900 text-white resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[56px]"
                  rows={1}
                />
                <button
                  onClick={() => handleSend()}
                  disabled={!input.trim() || isThinking}
                  className="absolute right-3 bottom-3 p-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground transition-colors"
                >
                  {isThinking ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <WalletModal 
        open={walletModalOpen}
        onOpenChange={setWalletModalOpen}
      />
    </div>
  );
}
