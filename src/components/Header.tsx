import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Wallet, ChevronDown, Moon, Sun, Menu, Layers, CheckCircle2 } from 'lucide-react';
import { useWalletContext } from '@/contexts/WalletContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useToast } from '@/hooks/use-toast';
import WalletModal from './WalletModal';
import { supabase } from '@/integrations/supabase/client';
import logoLight from '@/assets/logo-light.png';
import logoDark from '@/assets/logo-dark.png';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { ScrollArea } from './ui/scroll-area';
import ProtocolPopover from './footer/ProtocolPopover';
import ComingSoonDialog from './footer/ComingSoonDialog';

const Header = () => {
  const location = useLocation();
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [pendingClaimsCount, setPendingClaimsCount] = useState(0);
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();
  
  const {
    isAnyWalletConnected, 
    evmAddress, 
    solanaAddress,
    evmBalance,
    solanaBalance,
    disconnectAll,
    isWalletAuthenticated,
    isAuthenticated,
    authMethod,
    isSolanaConnected
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

  const handleDisconnectAll = async () => {
    try {
      await disconnectAll();
      
      // Force close the wallet modal if it's open
      setWalletModalOpen(false);
      
      toast({
        title: 'Disconnected',
        description: 'All wallets and sessions have been cleared',
      });
    } catch (error) {
      toast({
        title: 'Disconnect Failed',
        description: error instanceof Error ? error.message : 'Failed to disconnect',
        variant: 'destructive',
      });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="flex items-center justify-between max-w-7xl mx-auto px-3 md:px-6 lg:px-12 py-2 md:py-4">
        <Link to="/" className="flex items-center group shrink-0 focus:outline-none">
          <span className="text-2xl md:text-3xl lg:text-4xl font-archivo tracking-wider bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent transition-opacity duration-200 group-hover:opacity-80">
            TEMPO
          </span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-1 md:gap-2 flex-1 mx-2 md:mx-4 lg:mx-8">
          {/* Menu Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="rounded-full gap-1 text-xs md:text-sm px-2 md:px-3">
                <Menu className="w-3 h-3 md:w-4 md:h-4" />
                <span className="hidden sm:inline font-medium">Menu</span>
                <ChevronDown className="w-3 h-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56 bg-background z-[100]">
              <ScrollArea className="max-h-[400px]">
                <Link to="/portfolio">
                  <DropdownMenuItem className={isActive('/portfolio') ? 'bg-muted' : ''}>
                    Portfolio
                  </DropdownMenuItem>
                </Link>
                <Link to="/transactions">
                  <DropdownMenuItem className={isActive('/transactions') ? 'bg-muted' : ''}>
                    Transactions
                  </DropdownMenuItem>
                </Link>
                <Link to="/bridge">
                  <DropdownMenuItem className={isActive('/bridge') ? 'bg-muted' : ''}>
                    Bridge
                  </DropdownMenuItem>
                </Link>
                <Link to="/claim">
                  <DropdownMenuItem className={`relative ${isActive('/claim') ? 'bg-muted' : ''}`}>
                    Claim
                    {pendingClaimsCount > 0 && (
                      <Badge className="ml-1.5 px-1.5 py-0 text-xs h-5 bg-red-500 hover:bg-red-600">
                        {pendingClaimsCount}
                      </Badge>
                    )}
                  </DropdownMenuItem>
                </Link>
                <Link to="/chat">
                  <DropdownMenuItem className={isActive('/chat') ? 'bg-muted' : ''}>
                    AI Assistant
                  </DropdownMenuItem>
                </Link>
              </ScrollArea>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Products Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="rounded-full gap-1 text-xs md:text-sm px-2 md:px-3">
                <Layers className="w-3 h-3 md:w-4 md:h-4" />
                <span className="hidden sm:inline font-medium">Products</span>
                <ChevronDown className="w-3 h-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56 bg-background z-[100]">
              <ScrollArea className="max-h-[400px]">
                <div className="px-2 py-1.5">
                  <ProtocolPopover />
                </div>
                <Link to="/chat">
                  <DropdownMenuItem className={isActive('/chat') ? 'bg-muted' : ''}>
                    Yield Farming
                  </DropdownMenuItem>
                </Link>
                <Link to="/depin">
                  <DropdownMenuItem className={isActive('/depin') ? 'bg-muted' : ''}>
                    DePIN
                  </DropdownMenuItem>
                </Link>
                <Link to="/swap">
                  <DropdownMenuItem className={isActive('/swap') ? 'bg-muted' : ''}>
                    Swap
                  </DropdownMenuItem>
                </Link>
                <Link to="/bridge">
                  <DropdownMenuItem className={isActive('/bridge') ? 'bg-muted' : ''}>
                    Bridge
                  </DropdownMenuItem>
                </Link>
                <ComingSoonDialog featureName="AI Trading">
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    AI Trading
                  </DropdownMenuItem>
                </ComingSoonDialog>
                <ComingSoonDialog featureName="Staking">
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    Staking
                  </DropdownMenuItem>
                </ComingSoonDialog>
                <ComingSoonDialog featureName="Liquidity Pools">
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    Liquidity Pools
                  </DropdownMenuItem>
                </ComingSoonDialog>
              </ScrollArea>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Docs Tab */}
          <Link 
            to="/docs" 
            className={`px-2 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium transition-all duration-300 whitespace-nowrap ${
              isActive('/docs') 
                ? 'bg-primary text-primary-foreground' 
                : 'hover:bg-muted'
            }`}
          >
            Docs
          </Link>
        </nav>

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleTheme}
          className="rounded-full shrink-0 mr-1 md:mr-2 h-8 w-8 md:h-9 md:w-9 p-0"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun className="w-3 h-3 md:w-4 md:h-4" /> : <Moon className="w-3 h-3 md:w-4 md:h-4" />}
        </Button>

        {/* Wallet Connection Button */}
        {!isAnyWalletConnected ? (
          <Button 
            className="rounded-full shrink-0 text-xs md:text-sm px-2 md:px-4" 
            size="sm"
            onClick={() => setWalletModalOpen(true)}
          >
            <Wallet className="w-3 h-3 md:w-4 md:h-4" />
            <span className="hidden sm:inline ml-1 md:ml-2">Connect</span>
          </Button>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="rounded-full shrink-0 text-xs md:text-sm px-2 md:px-3" size="sm" variant="outline">
                <Wallet className="w-3 h-3 md:w-4 md:h-4" />
                <span className="hidden sm:inline ml-1 md:ml-2 max-w-[80px] lg:max-w-[120px] truncate">
                  {evmAddress ? formatAddress(evmAddress) : formatAddress(solanaAddress!)}
                </span>
                <ChevronDown className="w-3 h-3 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 bg-background z-[100]">
              {/* Authentication Status */}
              {isAuthenticated && (
                <DropdownMenuItem className="flex items-center gap-2 bg-muted/50">
                  <span className="text-xs">
                    {authMethod === 'wallet' ? '✓ Authenticated via Wallet' : '✓ Authenticated via Email'}
                  </span>
                </DropdownMenuItem>
              )}
              
              {evmAddress && (
                <DropdownMenuItem className="flex flex-col items-start">
                  <span className="text-xs text-muted-foreground">EVM</span>
                  <span className="font-mono text-sm text-foreground">{formatAddress(evmAddress)}</span>
                  {evmBalance && <span className="text-xs text-muted-foreground">{evmBalance} ETH</span>}
                </DropdownMenuItem>
              )}
              {solanaAddress && (
                <DropdownMenuItem className="flex flex-col items-start">
                  <div className="flex items-center gap-2 w-full">
                    <span className="text-xs text-muted-foreground">Solana</span>
                    {isWalletAuthenticated && (
                      <span className="text-xs text-green-500">✓</span>
                    )}
                  </div>
                  <span className="font-mono text-sm text-foreground">{formatAddress(solanaAddress)}</span>
                  {solanaBalance && <span className="text-xs text-muted-foreground">{solanaBalance} SOL</span>}
                  {!isWalletAuthenticated && isSolanaConnected && (
                    <span className="text-xs text-amber-500">⚠️ Not authenticated</span>
                  )}
                </DropdownMenuItem>
              )}
              <DropdownMenuItem 
                onClick={handleDisconnectAll}
                className="text-destructive cursor-pointer"
              >
                Disconnect All {authMethod === 'wallet' && '& Sign Out'}
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
