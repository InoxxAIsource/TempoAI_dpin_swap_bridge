import { Outlet } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { DocsSidebar } from '@/components/docs/DocsSidebar';
import PageLayout from '@/components/layout/PageLayout';

const DocsLayout = () => {
  return (
    <PageLayout showBackground={false}>
      <SidebarProvider defaultOpen={true}>
        <div className="min-h-screen flex w-full bg-background">
          <DocsSidebar />
          
          <div className="flex-1 min-w-0">
            <header className="h-14 md:h-16 border-b border-border flex items-center px-4 md:px-6 sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 z-10 shadow-sm">
              <SidebarTrigger className="mr-3 md:mr-4" />
              <h1 className="text-lg md:text-xl font-semibold truncate font-inter">Documentation</h1>
            </header>
            
            <main className="docs-content p-6 sm:p-8 md:p-10 lg:p-12 max-w-5xl mx-auto">
              <Outlet />
            </main>
          </div>
        </div>
      </SidebarProvider>
    </PageLayout>
  );
};

export default DocsLayout;
