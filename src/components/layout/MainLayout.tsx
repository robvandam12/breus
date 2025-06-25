
import React from 'react';
import { cn } from "@/lib/utils";

export interface MainLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  icon?: React.ComponentType<{ className?: string }>;
  headerChildren?: React.ReactNode;
  className?: string;
  contentClassName?: string;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  title,
  subtitle,
  icon: Icon,
  headerChildren,
  className,
  contentClassName
}) => {
  return (
    <div className={cn("min-h-screen bg-gray-50", className)}>
      {(title || headerChildren) && (
        <div className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-6">
              {title && (
                <div className="flex items-center">
                  {Icon && <Icon className="w-8 h-8 text-blue-600 mr-3" />}
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
                    {subtitle && (
                      <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
                    )}
                  </div>
                </div>
              )}
              {headerChildren && (
                <div className="mt-4">{headerChildren}</div>
              )}
            </div>
          </div>
        </div>
      )}
      <main className={cn("max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", contentClassName)}>
        {children}
      </main>
    </div>
  );
};
