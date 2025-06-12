
import { SidebarProvider } from "@/components/ui/sidebar";
import { RoleBasedSidebar } from "@/components/navigation/RoleBasedSidebar";
import { Header } from "@/components/layout/Header";
import { ReactNode } from "react";

interface MainLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  icon?: React.ElementType;
  headerActions?: ReactNode;
}

export const MainLayout = ({ children, title, subtitle, icon, headerActions }: MainLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-white">
        <RoleBasedSidebar />
        <main className="flex-1 flex flex-col bg-white">
          <Header 
            title={title} 
            subtitle={subtitle} 
            icon={icon}
          >
            {headerActions}
          </Header>
          <div className="flex-1 overflow-auto bg-white">
            <div className="p-6">
              {children}
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};
