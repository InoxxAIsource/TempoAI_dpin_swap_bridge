import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-6 md:px-12 py-6 bg-background/80 backdrop-blur-sm">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary" />
          <span className="text-2xl font-bold">Tempo</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link to="/portfolio" className="text-sm hover:text-primary transition-colors">
            Portfolio
          </Link>
          <Link to="/bridge" className="text-sm hover:text-primary transition-colors">
            Bridge
          </Link>
          <Link to="/transactions" className="text-sm hover:text-primary transition-colors">
            Transactions
          </Link>
          <Link to="/chat" className="text-sm hover:text-primary transition-colors">
            AI Assistant
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
