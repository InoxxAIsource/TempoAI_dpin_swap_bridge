const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-6 md:px-12 py-6">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary" />
          <span className="text-2xl font-bold">Tempo</span>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          <a href="#" className="text-sm hover:text-primary transition-colors">
            Blog
          </a>
          <a href="#" className="text-sm hover:text-primary transition-colors">
            Ecosystem
          </a>
          <a href="#" className="text-sm hover:text-primary transition-colors">
            Jobs
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
