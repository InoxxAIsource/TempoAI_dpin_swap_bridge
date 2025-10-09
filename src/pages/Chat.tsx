import AIAssistantChat from '@/components/chat/AIAssistantChat';

const Chat = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Chat with Tempo AI
          </h1>
          <p className="text-lg text-muted-foreground">
            Get personalized yield optimization advice from our AI assistant. Ask about strategies, 
            risk management, or how to maximize your returns.
          </p>
        </div>
        <AIAssistantChat />
      </div>
    </div>
  );
};

export default Chat;
