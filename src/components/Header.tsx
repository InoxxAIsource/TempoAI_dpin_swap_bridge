import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Wallet, ChevronDown, Moon, Sun } from 'lucide-react';
import { useWalletContext } from '@/contexts/WalletContext';
import { useTheme } from '@/contexts/ThemeContext';
import WalletModal from './WalletModal';
import { supabase } from '@/integrations/supabase/client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

const Header = () => {
  const location = useLocation();
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [pendingClaimsCount, setPendingClaimsCount] = useState(0);
  const { theme, toggleTheme } = useTheme();
  const { 
    isAnyWalletConnected, 
    evmAddress, 
    solanaAddress,
    evmBalance,
    solanaBalance,
    disconnectEvm,
    disconnectSolana 
  } = useWalletContext();
  
  useEffect(() => {
    fetchPendingClaimsCount();
    
    // Subscribe to changes
    const channel = supabase
      .channel('claims-count')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'wormhole_transactions'
      }, () => {
        fetchPendingClaimsCount();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchPendingClaimsCount = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { count, error } = await supabase
        .from('wormhole_transactions')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .or('status.eq.pending,needs_redemption.eq.true');

      if (!error && count !== null) {
        setPendingClaimsCount(count);
      }
    } catch (error) {
      console.error('Error fetching pending claims:', error);
    }
  };

  const isActive = (path: string) => location.pathname === path;
  
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const handleDisconnectAll = () => {
    if (evmAddress) disconnectEvm();
    if (solanaAddress) disconnectSolana();
  };

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
              to="/swap" 
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                isActive('/swap') 
                  ? 'bg-primary text-primary-foreground' 
                  : 'hover:bg-muted'
              }`}
            >
              Swap
            </Link>
            <Link 
              to="/claim"
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap relative ${
                isActive('/claim') 
                  ? 'bg-primary text-primary-foreground' 
                  : 'hover:bg-muted'
              }`}
            >
              Claim
              {pendingClaimsCount > 0 && (
                <Badge className="ml-1.5 px-1.5 py-0 text-xs h-5 bg-red-500 hover:bg-red-600 absolute -top-1 -right-1">
                  {pendingClaimsCount}
                </Badge>
              )}
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
              to="/depin" 
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                isActive('/depin') 
                  ? 'bg-primary text-primary-foreground' 
                  : 'hover:bg-muted'
              }`}
            >
              DePIN
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
            <Link 
              to="/docs" 
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                isActive('/docs') 
                  ? 'bg-primary text-primary-foreground' 
                  : 'hover:bg-muted'
              }`}
            >
              Docs
            </Link>
          </div>
        </nav>

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleTheme}
          className="rounded-full shrink-0 mr-2"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </Button>

        {/* Wallet Connection Button */}
        {!isAnyWalletConnected ? (
          <Button 
            className="rounded-full shrink-0" 
            size="sm"
            onClick={() => setWalletModalOpen(true)}
          >
            <Wallet className="w-4 h-4" />
            <span className="hidden sm:inline ml-2">Connect</span>
          </Button>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="rounded-full shrink-0" size="sm" variant="outline">
                <Wallet className="w-4 h-4" />
                <span className="hidden sm:inline ml-2">
                  {evmAddress ? formatAddress(evmAddress) : formatAddress(solanaAddress!)}
                </span>
                <ChevronDown className="w-3 h-3 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {evmAddress && (
                <DropdownMenuItem className="flex flex-col items-start">
                  <span className="text-xs text-muted-foreground">EVM</span>
                  <span className="font-mono text-sm text-foreground">{formatAddress(evmAddress)}</span>
                  {evmBalance && <span className="text-xs text-muted-foreground">{evmBalance} ETH</span>}
                </DropdownMenuItem>
              )}
              {solanaAddress && (
                <DropdownMenuItem className="flex flex-col items-start">
                  <span className="text-xs text-muted-foreground">Solana</span>
                  <span className="font-mono text-sm text-foreground">{formatAddress(solanaAddress)}</span>
                  {solanaBalance && <span className="text-xs text-muted-foreground">{solanaBalance} SOL</span>}
                </DropdownMenuItem>
              )}
              <DropdownMenuItem 
                onClick={handleDisconnectAll}
                className="text-destructive cursor-pointer"
              >
                Disconnect All
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        
        <WalletModal open={walletModalOpen} onOpenChange={setWalletModalOpen} />
      </div>
    </header>
  );
};

export default Header;
