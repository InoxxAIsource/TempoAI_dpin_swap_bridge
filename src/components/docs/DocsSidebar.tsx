import { Bot, Cpu, Book, Wallet, TrendingUp, Shield, Lightbulb, MessageSquare, Code, Key, User, ArrowLeftRight, DollarSign, Package, Terminal } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';

const docSections = [
  {
    label: 'AI Assistant',
    items: [
      { title: 'Getting Started', url: '/docs/ai/getting-started', icon: Book },
      { title: 'Features', url: '/docs/ai/features', icon: Bot },
      { title: 'Chat Interface', url: '/docs/ai/chat', icon: MessageSquare },
      { title: 'Technical Details', url: '/docs/ai/technical', icon: Cpu },
      { title: 'Use Cases', url: '/docs/ai/use-cases', icon: Lightbulb },
    ]
  },
  {
    label: 'AI Agent Builder',
    items: [
      { title: 'Getting Started', url: '/docs/ai-agent/getting-started', icon: Book },
      { title: 'Architecture', url: '/docs/ai-agent/architecture', icon: Cpu },
      { title: 'AI Models & Training', url: '/docs/ai-agent/ai-models', icon: Bot },
      { title: 'Wormhole Integration', url: '/docs/ai-agent/wormhole', icon: Shield },
    ]
  },
  {
    label: 'DePIN Network',
    items: [
      { title: 'Introduction', url: '/docs/depin/getting-started', icon: Book },
      { title: 'Device Setup Guide', url: '/docs/depin/device-setup', icon: Terminal },
      { title: 'Benefits', url: '/docs/depin/benefits', icon: TrendingUp },
      { title: 'Wormhole Bridge', url: '/docs/depin/wormhole', icon: Shield },
      { title: 'Economics', url: '/docs/depin/economics', icon: Wallet },
      { title: 'Advanced', url: '/docs/depin/advanced', icon: Cpu },
      { title: 'FAQ', url: '/docs/depin/faq', icon: Lightbulb },
    ]
  },
  {
    label: 'Cross-Chain Tools',
    items: [
      { title: 'Bridge: Getting Started', url: '/docs/bridge/getting-started', icon: Book },
      { title: 'Bridge: How It Works', url: '/docs/bridge/how-it-works', icon: Cpu },
      { title: 'Bridge: Networks & Tokens', url: '/docs/bridge/networks', icon: TrendingUp },
      { title: 'Bridge: Advanced', url: '/docs/bridge/advanced', icon: Shield },
      { title: 'Swap: Getting Started', url: '/docs/swap/getting-started', icon: Book },
      { title: 'Swap: How It Works', url: '/docs/swap/how-it-works', icon: Cpu },
      { title: 'Swap: Best Practices', url: '/docs/swap/best-practices', icon: Lightbulb },
    ]
  },
  {
    label: 'API Documentation',
    items: [
      { title: 'API Overview', url: '/docs/api/overview', icon: Code },
      { title: 'Authentication', url: '/docs/api/authentication', icon: Key },
      { title: 'User Management', url: '/docs/api/user-management', icon: User },
      { title: 'DePIN API', url: '/docs/api/depin', icon: Cpu },
      { title: 'Bridge & Swap', url: '/docs/api/bridge-swap', icon: ArrowLeftRight },
      { title: 'Rate Limits & Pricing', url: '/docs/api/rate-limits', icon: DollarSign },
      { title: 'SDK Reference', url: '/docs/api/sdk', icon: Package },
    ]
  }
];

export function DocsSidebar() {
  const { open } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;
  
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-[hsl(var(--docs-accent))]/10 text-[hsl(var(--docs-accent))] font-semibold border-l-3 border-[hsl(var(--docs-accent))] pl-2.5 shadow-sm" 
      : "hover:bg-sidebar-accent/60 hover:text-foreground transition-all pl-3 text-muted-foreground";

  return (
    <Sidebar className={open ? "w-64" : "w-0 md:w-14"} collapsible="offcanvas">
      <SidebarContent className="px-2 py-6">
        {open && (
          <div className="px-3 mb-8">
            <h2 className="text-lg font-bold text-sidebar-foreground font-inter">Documentation</h2>
          </div>
        )}
        {docSections.map((section) => (
          <SidebarGroup key={section.label} className="mb-8">
            <SidebarGroupLabel className="px-3 text-[11px] font-bold uppercase tracking-widest text-muted-foreground/80 mb-3 letter-spacing-[0.1em]">
              {open ? section.label : '•'}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {section.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild className="rounded-md h-9">
                      <NavLink to={item.url} end className={getNavCls}>
                        {item.icon && <item.icon className="h-4 w-4 flex-shrink-0" />}
                        {open && <span className="text-[13px] font-medium">{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
