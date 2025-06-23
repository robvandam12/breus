
import React from 'react';
import { ModularSidebar } from '@/components/navigation/ModularSidebar';
import { LucideIcon } from 'lucide-react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';

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
  icon: Icon, 
  headerChildren,
  className = "",
  contentClassName = ""
}: MainLayoutProps) => {
  console.log('MainLayout: Rendering with props:', { title, subtitle, className, contentClassName });
  
  return (
    <SidebarProvider>
      <div className={`min-h-screen flex w-full bg-gray-50 ${className}`}>
        {/* Sidebar Modular */}
        <ModularSidebar />
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <div className="bg-white/95 backdrop-blur-sm sticky top-0 z-10 px-6 py-4 border-b border-gray-100 flex items-center gap-4">
            <SidebarTrigger className="md:hidden" />
            
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-4 min-w-0">
                {Icon && (
                  <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                )}
                <div className="min-w-0">
                  {title && <h1 className="text-2xl font-bold text-gray-900 truncate">{title}</h1>}
                  {subtitle && <p className="text-sm text-gray-600 mt-1 truncate">{subtitle}</p>}
                </div>
              </div>
              {headerChildren && (
                <div className="flex items-center gap-3">
                  {headerChildren}
                </div>
              )}
            </div>
          </div>
          
          {/* Page Content */}
          <div className={`flex-1 p-6 overflow-auto ${contentClassName}`}>
            {children}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};
