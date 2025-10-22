import { Gift, Wallet, Plus, Book, Monitor } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from '@/components/ui/sidebar';
import { Badge } from '@/components/ui/badge';

interface DePINSidebarProps {
  activeClaimsCount?: number;
  deviceCount?: number;
}

const DePINSidebar = ({ activeClaimsCount = 0, deviceCount = 0 }: DePINSidebarProps) => {
  const { open } = useSidebar();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || 'my-devices';

  const navigationItems = [
    {
      title: 'My Devices',
      value: 'my-devices',
      icon: Monitor,
      badge: deviceCount,
    },
    {
      title: 'Claim/Redeem',
      value: 'claim',
      icon: Gift,
      badge: activeClaimsCount,
    },
    {
      title: 'Portfolio',
      value: 'portfolio',
      icon: Wallet,
    },
    {
      title: 'Add Device',
      value: 'add-device',
      icon: Plus,
    },
    {
      title: 'DePIN Docs',
      value: 'docs',
      icon: Book,
    },
  ];

  const handleNavClick = (value: string) => {
    setSearchParams({ tab: value });
  };

  return (
    <Sidebar className={open ? 'w-64' : 'w-0 md:w-14'} collapsible="offcanvas">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>DePIN Dashboard</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => {
                const isActive = currentTab === item.value;
                const Icon = item.icon;

                return (
                  <SidebarMenuItem key={item.value}>
                    <SidebarMenuButton
                      onClick={() => handleNavClick(item.value)}
                      className={
                        isActive
                          ? 'bg-primary/10 text-primary font-medium hover:bg-primary/20'
                          : 'hover:bg-muted/50'
                      }
                    >
                      <Icon className="h-4 w-4" />
                      {open && <span>{item.title}</span>}
                      {open && item.badge && item.badge > 0 && (
                        <Badge
                          variant="destructive"
                          className="ml-auto h-5 w-5 flex items-center justify-center p-0 text-xs"
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default DePINSidebar;
