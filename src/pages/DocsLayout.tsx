import { Outlet } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { DocsSidebar } from '@/components/docs/DocsSidebar';
import PageLayout from '@/components/layout/PageLayout';

const DocsLayout = () => {
  return (
    <PageLayout>
      <SidebarProvider defaultOpen={true}>
        <div className="min-h-screen flex w-full">
          <DocsSidebar />
          
          <div className="flex-1 min-w-0">
            <header className="h-14 md:h-16 border-b border-border flex items-center px-4 md:px-6 sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10">
              <SidebarTrigger className="mr-3 md:mr-4" />
              <h1 className="text-xl md:text-2xl font-bold truncate">Documentation</h1>
            </header>
            
            <main className="p-4 sm:p-6 md:p-8 lg:p-12 max-w-5xl">
              <Outlet />
            </main>
          </div>
        </div>
      </SidebarProvider>
    </PageLayout>
  );
};

export default DocsLayout;
