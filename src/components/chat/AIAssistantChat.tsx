import { useState, useRef } from 'react';
import { Send, Loader2, Plus, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import ThinkingMessages from './ThinkingMessages';

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
  const [lastUserMessage, setLastUserMessage] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = async () => {
    console.log('=== handleSend called ===');
    console.log('Input value:', input);
    console.log('isThinking:', isThinking);
    
    if (!input.trim() || isThinking) {
      console.log('Skipping send - empty input or already thinking');
      return;
    }

    const userMessage: Message = {
      id: `m${Date.now()}`,
      role: 'user',
      content: input,
      createdAt: new Date().toISOString(),
    };

    const userInput = input;
    setMessages((prev) => [...prev, userMessage]);
    setLastUserMessage(input);
    setInput('');
    setIsThinking(true);

    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      console.log('Environment variable VITE_SUPABASE_URL:', supabaseUrl);
      
      if (!supabaseUrl) {
        throw new Error('VITE_SUPABASE_URL is not configured. Please check your .env file.');
      }
      
      const url = `${supabaseUrl}/functions/v1/ai-defi-assistant`;
      console.log('Calling AI endpoint:', url);
      console.log('Sending messages:', [...messages, userMessage].length);
      
      // Call the AI edge function with streaming
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      console.log('Response status:', response.status, response.statusText);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('API Error:', errorData);
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      if (!response.body) {
        console.error('No response body from API');
        throw new Error('No response body');
      }

      console.log('Starting to stream response...');

      // Handle streaming response
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantContent = '';
      let assistantId = `m${Date.now() + 1}`;
      
      setIsThinking(false);
      
      // Add initial empty assistant message
      setMessages((prev) => [
        ...prev,
        {
          id: assistantId,
          role: 'assistant',
          content: '',
          createdAt: new Date().toISOString(),
        },
      ]);

      let textBuffer = '';
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        textBuffer += decoder.decode(value, { stream: true });
        
        // Process line-by-line
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
              
              // Update the assistant message with new content
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId
                    ? { ...m, content: assistantContent }
                    : m
                )
              );
            }
          } catch (e) {
            console.error('Error parsing SSE:', e);
          }
        }
      }
    } catch (error) {
      console.error('Error calling AI - Full error:', error);
      console.error('Error stack:', error instanceof Error ? error.stack : 'No stack');
      setIsThinking(false);
      
      // Add error message to chat
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('Displaying error to user:', errorMessage);
      
      setMessages((prev) => [
        ...prev,
        {
          id: `m${Date.now() + 1}`,
          role: 'assistant',
          content: `❌ Error: ${errorMessage}\n\nPlease check the console for details and try again.`,
          createdAt: new Date().toISOString(),
        },
      ]);
    }
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
          <ThinkingMessages lastUserMessage={lastUserMessage} />
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
