
import React from 'react';
import { SidebarContent } from '@/components/navigation/SidebarContent';
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
  icon: Icon, 
  headerChildren,
  className = "",
  contentClassName = ""
}: MainLayoutProps) => {
  console.log('MainLayout: Rendering with props:', { title, subtitle, className, contentClassName });
  
  return (
    <div className={`min-h-screen flex bg-gray-50 ${className}`}>
      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-b from-slate-900 to-slate-800 fixed left-0 top-0 h-full z-40">
        <SidebarContent />
      </div>
      
      {/* Main Content */}
      <div className="flex-1 ml-64">
        {/* Header */}
        {(title || subtitle || headerChildren) && (
          <div className="bg-white px-6 py-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {Icon && <Icon className="w-6 h-6 text-blue-600" />}
                <div>
                  {title && <h1 className="text-xl font-semibold text-gray-900">{title}</h1>}
                  {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
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
        <div className={`p-6 ${contentClassName}`}>
          {children}
        </div>
      </div>
    </div>
  );
};
