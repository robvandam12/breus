
import { SidebarProvider } from "@/components/ui/sidebar";
import { RoleBasedSidebar } from "@/components/navigation/RoleBasedSidebar";
import { Header } from "@/components/layout/Header";
import { useIsMobile } from "@/hooks/use-mobile";
import { BottomNavBar } from "@/components/navigation/BottomNavBar";

interface MainLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  icon: React.ElementType;
}

export const MainLayout = ({ children, title, subtitle, icon }: MainLayoutProps) => {
  const isMobile = useIsMobile();
  
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <RoleBasedSidebar />
        <main className="flex-1 flex flex-col pb-16 md:pb-0">
          <Header title={title} subtitle={subtitle} icon={icon} />
          <div className="flex-1 overflow-auto bg-muted/20">
            <div className="p-4 sm:p-6">
              {children}
            </div>
          </div>
        </main>
        {isMobile && <BottomNavBar />}
      </div>
    </SidebarProvider>
  );
};
