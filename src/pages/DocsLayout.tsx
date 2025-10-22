import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { DocsSidebar } from '@/components/docs/DocsSidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import Header from '@/components/Header';

const DocsLayout = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Update sidebar state when screen size changes
  useEffect(() => {
    if (!isMobile) {
      setSidebarOpen(true);
    }
  }, [isMobile]);

  return (
    <div className="min-h-screen relative">
      <Header />
      <div className="pt-14 md:pt-20 lg:pt-24">
        <SidebarProvider open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <div className="min-h-screen flex w-full bg-background">
            <DocsSidebar />
            
            <div className="flex-1 min-w-0">
              <header className="h-14 md:h-16 border-b border-border flex items-center px-4 md:px-6 sticky top-[56px] md:top-[80px] lg:top-[96px] bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 z-10 shadow-sm">
                <SidebarTrigger className="mr-3 md:mr-4" />
                <h1 className="text-lg md:text-xl font-semibold truncate font-inter">Documentation</h1>
              </header>
              
              <main className="docs-content px-6 py-8 sm:px-8 sm:py-10 md:px-12 md:py-12 lg:px-16 lg:py-14 max-w-[900px] mx-auto">
                <Outlet />
              </main>
            </div>
          </div>
        </SidebarProvider>
      </div>
    </div>
  );
};

export default DocsLayout;
