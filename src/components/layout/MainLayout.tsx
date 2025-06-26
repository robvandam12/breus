
import React from 'react';
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ModularSidebar } from "@/components/navigation/ModularSidebar";

interface MainLayoutProps {
  title: string;
  subtitle?: string;
  icon?: React.ElementType;
  children: React.ReactNode;
  actions?: React.ReactNode;
  headerChildren?: React.ReactNode; // Alias para actions
  className?: string;
  contentClassName?: string;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ 
  title, 
  subtitle, 
  icon: Icon, 
  children, 
  actions,
  headerChildren, // Nueva prop para compatibilidad
  className = "",
  contentClassName = ""
}) => {
  // Use headerChildren if provided, otherwise fall back to actions
  const headerContent = headerChildren || actions;

  return (
    <div className={`min-h-screen flex w-full bg-gray-50 ${className}`}>
      <ModularSidebar />
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <SidebarTrigger className="mr-2" />
            {Icon && <Icon className="w-8 h-8 text-blue-600" />}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
              {subtitle && (
                <p className="text-gray-600 text-sm mt-1">{subtitle}</p>
              )}
            </div>
          </div>
          {headerContent && (
            <div className="flex items-center gap-3">
              {headerContent}
            </div>
          )}
        </div>
        
        {/* Content */}
        <div className={`flex-1 overflow-auto p-6 ${contentClassName}`}>
          {children}
        </div>
      </main>
    </div>
  );
};
