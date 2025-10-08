import AIAssistantChat from './chat/AIAssistantChat';

export default function StartEarningChat() {
  return (
    <section className="py-12">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Chat with Tempo AI
          </h2>
          <p className="text-lg text-muted-foreground">
            Get personalized yield optimization advice from our AI assistant. Ask about strategies, 
            risk management, or how to maximize your returns.
          </p>
        </div>
        
        <AIAssistantChat />
      </div>
    </section>
  );
}
