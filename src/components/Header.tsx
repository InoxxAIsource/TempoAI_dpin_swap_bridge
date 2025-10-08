import { Link, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { Wallet } from 'lucide-react';

const Header = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="flex items-center justify-between max-w-7xl mx-auto px-6 md:px-12 py-4">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-full bg-primary" />
          <span className="text-2xl font-bold">Tempo</span>
        </Link>

        {/* Scrollable Navigation Menu */}
        <nav className="flex-1 overflow-x-auto scrollbar-hide mx-4 md:mx-8">
          <div className="flex items-center gap-2 md:gap-4 min-w-max">
            <Link 
              to="/portfolio" 
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                isActive('/portfolio') 
                  ? 'bg-primary text-primary-foreground' 
                  : 'hover:bg-muted'
              }`}
            >
              Portfolio
            </Link>
            <Link 
              to="/bridge" 
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                isActive('/bridge') 
                  ? 'bg-primary text-primary-foreground' 
                  : 'hover:bg-muted'
              }`}
            >
              Bridge
            </Link>
            <Link 
              to="/transactions" 
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                isActive('/transactions') 
                  ? 'bg-primary text-primary-foreground' 
                  : 'hover:bg-muted'
              }`}
            >
              Transactions
            </Link>
            <Link 
              to="/chat" 
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                isActive('/chat') 
                  ? 'bg-primary text-primary-foreground' 
                  : 'hover:bg-muted'
              }`}
            >
              AI Assistant
            </Link>
          </div>
        </nav>

        {/* Wallet Connection Button */}
        <Button className="rounded-full shrink-0" size="sm">
          <Wallet className="w-4 h-4" />
          <span className="hidden sm:inline ml-2">Connect</span>
        </Button>
      </div>
    </header>
  );
};

export default Header;
