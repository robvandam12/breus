
import React from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { Header } from '@/components/layout/Header';
import { LucideIcon } from 'lucide-react';

interface MainLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  icon?: LucideIcon;
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
  console.log('MainLayout: Rendering with props:', { title, subtitle, className, contentClassName });
  
  return (
    <SidebarProvider>
      <div className={`min-h-screen flex w-full bg-gray-50 ${className}`}>
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Header unificado */}
          <Header 
            title={title || ''} 
            subtitle={subtitle} 
            icon={icon}
          >
            {headerChildren}
          </Header>
          
          {/* Content */}
          <main className={`flex-1 p-6 ${contentClassName}`}>
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};
