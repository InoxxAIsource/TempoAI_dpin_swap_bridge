import { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Menu, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import ThinkingMessages from './ThinkingMessages';
import MessageContent from './MessageContent';
import WalletModal from '@/components/WalletModal';

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

const PRE_PROMPTS = [
  'Show me LP strategies for USDC-USDT pairs',
  'Compare gas costs for yield farming on different L2s',
  'What about leveraged stablecoin strategies?',
  'What are the best stablecoin yields right now?',
];

export default function ChatInterface() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

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
      
      if (!supabaseUrl) {
        throw new Error('VITE_SUPABASE_URL is not configured');
      }
      
      const url = `${supabaseUrl}/functions/v1/ai-defi-assistant`;
      
      const currentMessages = chats.find(c => c.id === chatId)?.messages || [];
      const allMessages = [...currentMessages, userMessage];
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: allMessages.map(m => ({
            role: m.role,
            content: m.content,
          })),
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
                    : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-white'
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
            Connect Wallet
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
                    className="absolute right-3 bottom-3 p-2 rounded-lg bg-white text-black hover:bg-gray-200 disabled:bg-gray-600 disabled:text-gray-400 transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-xl">
                {PRE_PROMPTS.map((prompt, idx) => (
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
                    <div className="flex items-start justify-center w-8 h-8 rounded-full bg-blue-600 text-white text-xs font-bold shrink-0 mt-1">
                      YS
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
                        <MessageContent content={message.content} />
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
                  <div className="flex items-start justify-center w-8 h-8 rounded-full bg-blue-600 text-white text-xs font-bold shrink-0 mt-1">
                    YS
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
                  className="absolute right-3 bottom-3 p-2 rounded-lg bg-white text-black hover:bg-gray-200 disabled:bg-gray-600 disabled:text-gray-400 transition-colors"
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
