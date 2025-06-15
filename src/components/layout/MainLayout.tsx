
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
  headerChildren?: React.ReactNode;
  className?: string;
  contentClassName?: string;
}

export const MainLayout = ({ 
  children, 
  title, 
  subtitle, 
  icon, 
  headerChildren,
  className = "",
  contentClassName = ""
}: MainLayoutProps) => {
  const isMobile = useIsMobile();
  
  return (
    <SidebarProvider>
      <div className={`min-h-screen flex w-full bg-background ${className}`}>
        <RoleBasedSidebar />
        <main className="flex-1 flex flex-col pb-16 md:pb-0">
          <Header title={title} subtitle={subtitle} icon={icon}>
            {headerChildren}
          </Header>
          <div className="flex-1 overflow-auto bg-muted/20">
            <div className={`p-4 sm:p-6 max-w-full ${contentClassName}`}>
              {children}
            </div>
          </div>
        </main>
        {isMobile && <BottomNavBar />}
      </div>
    </SidebarProvider>
  );
};
