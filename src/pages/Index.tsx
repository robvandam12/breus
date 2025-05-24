
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Dashboard } from "@/components/Dashboard";

const Index = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <main className="flex-1 flex flex-col">
          <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200/60 supports-[backdrop-filter]:bg-white/80">
            <div className="flex h-16 items-center px-6 lg:px-8">
              <SidebarTrigger className="mr-4 p-2 rounded-full hover:bg-gray-100/80 transition-colors" />
              <div className="flex-1" />
              <div className="flex items-center space-x-4">
                <div className="text-sm font-medium text-gray-600 bg-white/60 px-3 py-1.5 rounded-full border border-gray-200/60">
                  {new Date().toLocaleDateString('es-CL', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
            </div>
          </header>
          <div className="flex-1 overflow-auto p-6">
            <Dashboard />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;
