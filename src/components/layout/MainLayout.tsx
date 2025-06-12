
import { SidebarProvider } from "@/components/ui/sidebar";
import { RoleBasedSidebar } from "@/components/navigation/RoleBasedSidebar";
import { Header } from "@/components/layout/Header";

interface MainLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  icon: React.ElementType;
}

export const MainLayout = ({ children, title, subtitle, icon }: MainLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <RoleBasedSidebar />
        <main className="flex-1 flex flex-col">
          <Header title={title} subtitle={subtitle} icon={icon} />
          <div className="flex-1 overflow-auto">
            <div className="p-6">
              {children}
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};
