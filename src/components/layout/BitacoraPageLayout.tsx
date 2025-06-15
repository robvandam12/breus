
import React from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { RoleBasedSidebar } from "@/components/navigation/RoleBasedSidebar";
import { Header } from "@/components/layout/Header";
import { useIsMobile } from "@/hooks/use-mobile";
import { BottomNavBar } from "@/components/navigation/BottomNavBar";

interface BitacoraPageLayoutProps {
  title: string;
  subtitle: string;
  icon: React.ElementType;
  headerActions?: React.ReactNode;
  children: React.ReactNode;
  maxWidth?: 'full' | '7xl' | '6xl' | '5xl';
  padding?: 'sm' | 'md' | 'lg';
}

export const BitacoraPageLayout: React.FC<BitacoraPageLayoutProps> = ({
  title,
  subtitle,
  icon,
  headerActions,
  children,
  maxWidth = '7xl',
  padding = 'md'
}) => {
  const isMobile = useIsMobile();
  
  const maxWidthClasses = {
    'full': 'w-full',
    '7xl': 'max-w-7xl',
    '6xl': 'max-w-6xl',
    '5xl': 'max-w-5xl'
  };

  const paddingClasses = {
    'sm': 'p-4',
    'md': 'p-6',
    'lg': 'p-8'
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <RoleBasedSidebar />
        <main className="flex-1 flex flex-col">
          <Header 
            title={title}
            subtitle={subtitle}
            icon={icon}
          >
            {headerActions}
          </Header>
          
          <div className="flex-1 overflow-auto">
            <div className={`${paddingClasses[padding]} ${maxWidthClasses[maxWidth]} mx-auto w-full space-y-6`}>
              {children}
            </div>
          </div>
        </main>
        {isMobile && <BottomNavBar />}
      </div>
    </SidebarProvider>
  );
};
