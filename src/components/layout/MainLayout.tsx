
import React from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { RoleBasedSidebar } from "@/components/navigation/RoleBasedSidebar";
import { HeaderWithNotifications } from "@/components/layout/HeaderWithNotifications";

interface MainLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  icon?: React.ElementType;
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
  return (
    <SidebarProvider>
      <div className={`min-h-screen flex w-full bg-white ${className}`}>
        <RoleBasedSidebar />
        <main className={`flex-1 flex flex-col ${contentClassName}`}>
          <HeaderWithNotifications 
            title={title} 
            subtitle={subtitle} 
            icon={icon}
          >
            {headerChildren}
          </HeaderWithNotifications>
          <div className="flex-1 p-6">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};
