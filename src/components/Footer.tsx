import { Link } from 'react-router-dom';
import ProtocolPopover from './footer/ProtocolPopover';
import ComingSoonDialog from './footer/ComingSoonDialog';
const Footer = () => {
  const handleResearchClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  const productLinks = [{
    name: 'Protocol',
    type: 'popover'
  }, {
    name: 'Yield Farming',
    href: '/chat',
    type: 'link'
  }, {
    name: 'DePIN',
    href: '/depin',
    type: 'link'
  }, {
    name: 'Swap',
    href: '/swap',
    type: 'link'
  }, {
    name: 'Bridge',
    href: '/bridge',
    type: 'link'
  }, {
    name: 'AI Trading',
    type: 'coming-soon'
  }, {
    name: 'Staking',
    type: 'coming-soon'
  }, {
    name: 'Liquidity Pools',
    type: 'coming-soon'
  }];
  const resourceLinks = [{
    name: 'Documentation',
    href: '/docs'
  }, {
    name: 'Whitepaper',
    href: '#'
  }, {
    name: 'Research',
    href: '#',
    onClick: handleResearchClick
  }];
  return <footer className="relative px-6 md:px-12 py-20 border-t border-border">
      <div className="max-w-6xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-20">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-full bg-primary" />
              <span className="text-2xl font-bold">Tempo</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">The future of DeFi powered by wormhole. Maximize yields with smart protocols and developed by InoxXAI</p>
            <div className="flex gap-4">
              <a href="https://x.com/InoxxProtocol" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300">
                <span className="sr-only">Twitter</span>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a href="https://github.com/InoxxAIsource/TempoAI_dpin_swap_bridge" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300">
                <span className="sr-only">GitHub</span>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider">Product</h3>
            <ul className="space-y-3">
              {productLinks.map(link => <li key={link.name}>
                  {link.type === 'popover' ? <ProtocolPopover /> : link.type === 'coming-soon' ? <ComingSoonDialog featureName={link.name}>
                      <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                        {link.name}
                      </button>
                    </ComingSoonDialog> : <Link to={link.href!} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {link.name}
                    </Link>}
                </li>)}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider">Resources</h3>
            <ul className="space-y-3">
              {resourceLinks.map(link => <li key={link.name}>
                  {link.onClick ? <a href={link.href} onClick={link.onClick} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {link.name}
                    </a> : <Link to={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {link.name}
                    </Link>}
                </li>)}
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="border-t border-border pt-12 mb-12">
          <div className="max-w-2xl">
            <h3 className="text-2xl font-bold mb-4">Stay updated</h3>
            <p className="text-muted-foreground mb-6">
              Get the latest updates on protocol improvements, yield opportunities, and AI-powered trading strategies.
            </p>
            <div className="flex gap-4">
              <input type="email" placeholder="Enter your email" className="flex-1 px-4 py-3 rounded-full border border-border bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
              <button className="px-8 py-3 rounded-full bg-primary text-primary-foreground hover:opacity-90 transition-opacity font-medium">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">© 2025 Tempo Protocol. All rights reserved.</p>
          
        </div>
      </div>
    </footer>;
};
export default Footer;