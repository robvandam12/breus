
import React from 'react';
import { SidebarContent } from '@/components/navigation/SidebarContent';
import { LucideIcon } from 'lucide-react';

interface MainLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  icon?: LucideIcon;
}

export const MainLayout = ({ children, title, subtitle, icon: Icon }: MainLayoutProps) => {
  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-sm border-r border-gray-200 fixed left-0 top-0 h-full z-10">
        <SidebarContent />
      </div>
      
      {/* Main Content */}
      <div className="flex-1 ml-64">
        {/* Header */}
        {(title || subtitle) && (
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center gap-3">
              {Icon && <Icon className="w-6 h-6 text-blue-600" />}
              <div>
                {title && <h1 className="text-xl font-semibold text-gray-900">{title}</h1>}
                {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
              </div>
            </div>
          </div>
        )}
        
        {/* Page Content */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};
