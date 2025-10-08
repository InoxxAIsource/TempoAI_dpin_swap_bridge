import AIAssistantChat from '@/components/chat/AIAssistantChat';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScrollingBackground from '@/components/ScrollingBackground';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Chat = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen">
      <ScrollingBackground />
      <div className="relative z-10">
        <Header />
        <main className="px-6 md:px-12 py-12">
          <div className="max-w-5xl mx-auto">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="mb-6 hover:bg-muted"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
            
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
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Chat;
