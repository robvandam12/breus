
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Dashboard } from "@/components/Dashboard";

const Index = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-slate-50/50">
        <AppSidebar />
        <main className="flex-1 flex flex-col">
          <header className="ios-blur border-b border-blue-200/20 sticky top-0 z-50">
            <div className="flex h-16 md:h-18 items-center px-4 md:px-8">
              <SidebarTrigger className="mr-4 touch-target ios-button p-2 rounded-xl hover:bg-blue-50/10 transition-colors" />
              <div className="flex-1" />
              <div className="flex items-center space-x-4">
                <div className="text-sm font-medium text-slate-600 hidden md:block">
                  {new Date().toLocaleDateString('es-CL', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-800 to-blue-900 flex items-center justify-center text-white text-sm font-semibold ios-shadow">
                  U
                </div>
              </div>
            </div>
          </header>
          <div className="flex-1 overflow-auto">
            <div className="p-4 md:p-8 max-w-7xl mx-auto">
              <Dashboard />
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;
