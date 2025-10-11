import { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Menu, Plus, X } from 'lucide-react';
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
  if (!portfolio) return DEFAULT_PRE_PROMPTS;

  const prompts = [];
  
  // If user has assets on Ethereum mainnet
  if (portfolio.hasEthereumMainnet && portfolio.ethereumGasHigh) {
    prompts.push('Bridge my assets to Arbitrum to save on gas');
  }
  
  // If user has stablecoins not earning yield
  if (portfolio.hasIdleStablecoins) {
    prompts.push('Show me safe stablecoin yields above 5%');
  }
  
  // If user has assets on multiple chains
  if (portfolio.chainCount > 3) {
    prompts.push('Consolidate my portfolio to fewer chains');
  }
  
  // Always include these
  prompts.push('Show me best yield opportunities');
  prompts.push('What are cross-chain arbitrage opportunities?');
  
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
  };

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input;
    
    if (!textToSend.trim() || isThinking) return;

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
          console.log('✅ Portfolio fetched:', {
            totalValueUSD: data.totalValueUSD,
            totalValueType: typeof data.totalValueUSD,
            holdings: data.holdings?.length || 0,
            chains: data.chainCount
          });
          setPortfolioContext(data);
          setPrePrompts(generatePrePrompts(data));
        } else {
          console.error('❌ Portfolio fetch failed:', portResponse.status);
          const errorText = await portResponse.text();
          console.error('Error details:', errorText);
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
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-xl">
                {prePrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handlePrePrompt(prompt)}
                    className="p-4 text-left text-sm rounded-xl border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 transition-colors"
                  >
                    {prompt}
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
