import { Bot, Cpu, Book, Wallet, TrendingUp, Shield, Lightbulb, MessageSquare } from 'lucide-react';
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
  }
];

export function DocsSidebar() {
  const { open } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? 'bg-primary/10 text-primary font-semibold border-l-2 border-primary' : 'hover:bg-muted/50';

  return (
    <Sidebar className={open ? 'w-64' : 'w-14'}>
      <SidebarContent>
        {docSections.map((section) => {
          const hasActiveItem = section.items.some((item) => isActive(item.url));
          
          return (
            <SidebarGroup key={section.label}>
              <SidebarGroupLabel className="text-sm font-bold">
                {open && section.label}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {section.items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <NavLink to={item.url} end className={getNavCls}>
                          <item.icon className="h-4 w-4" />
                          {open && <span className="ml-2">{item.title}</span>}
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          );
        })}
      </SidebarContent>
    </Sidebar>
  );
}
