import { Outlet } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { DocsSidebar } from '@/components/docs/DocsSidebar';
import PageLayout from '@/components/layout/PageLayout';

const DocsLayout = () => {
  return (
    <PageLayout>
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <DocsSidebar />
          
          <div className="flex-1">
            <header className="h-16 border-b border-border flex items-center px-6 sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10">
              <SidebarTrigger className="mr-4" />
              <h1 className="text-2xl font-bold">Documentation</h1>
            </header>
            
            <main className="p-6 md:p-12 max-w-5xl">
              <Outlet />
            </main>
          </div>
        </div>
      </SidebarProvider>
    </PageLayout>
  );
};

export default DocsLayout;
