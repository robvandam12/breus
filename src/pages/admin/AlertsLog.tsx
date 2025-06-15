
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ShieldAlert } from "lucide-react";
import { AlertsLogTable } from "@/components/admin/AlertsLogTable";

const AlertsLog = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50 dark:bg-zinc-900">
        <AppSidebar />
        <main className="flex-1 flex flex-col">
          <header className="ios-blur border-b border-border/20 sticky top-0 z-50 bg-white/80 dark:bg-zinc-900/80">
            <div className="flex h-16 md:h-18 items-center px-4 md:px-8">
              <SidebarTrigger className="mr-4 touch-target ios-button p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors" />
              <div className="flex items-center gap-3">
                <ShieldAlert className="w-6 h-6 text-zinc-600 dark:text-zinc-400" />
                <div>
                  <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">Registro de Alertas</h1>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">Historial completo de alertas de seguridad.</p>
                </div>
              </div>
            </div>
          </header>
          
          <div className="flex-1 overflow-auto">
            <div className="p-4 md:p-8 max-w-full mx-auto space-y-6">
              <AlertsLogTable />
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AlertsLog;
