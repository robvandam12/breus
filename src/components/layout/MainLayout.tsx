
import React from 'react';
import { SidebarContent } from '@/components/navigation/SidebarContent';
import { LucideIcon } from 'lucide-react';
import { useSidebar } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

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
    <div className={`min-h-screen flex bg-gray-50 ${className}`}>
      {/* Sidebar */}
      <div className="w-80 bg-white fixed left-0 top-0 h-full z-20 border-r border-gray-100">
        <SidebarContent />
      </div>
      
      {/* Main Content */}
      <div className="flex-1 ml-80">
        {/* Header */}
        {(title || subtitle || headerChildren) && (
          <div className="bg-white/95 backdrop-blur-sm sticky top-0 z-10 px-8 py-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {Icon && (
                  <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                )}
                <div>
                  {title && <h1 className="text-2xl font-bold text-gray-900">{title}</h1>}
                  {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
                </div>
              </div>
              {headerChildren && (
                <div className="flex items-center gap-3">
                  {headerChildren}
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Page Content */}
        <div className={`p-8 ${contentClassName}`}>
          {children}
        </div>
      </div>
    </div>
  );
};
