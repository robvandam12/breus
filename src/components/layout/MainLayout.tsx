
import { ReactNode } from 'react';
import { ModularSidebar } from '@/components/navigation/ModularSidebar';
import { LucideIcon } from 'lucide-react';

interface MainLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  icon?: LucideIcon;
  actions?: ReactNode;
}

export const MainLayout = ({ 
  children, 
  title, 
  subtitle, 
  icon: Icon,
  actions 
}: MainLayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50/50 to-blue-50/30 flex w-full">
      <ModularSidebar />
      
      <main className="flex-1 ml-16 lg:ml-64 transition-all duration-300">
        {(title || subtitle || Icon || actions) && (
          <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {Icon && (
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-sm">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                )}
                <div>
                  {title && (
                    <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
                  )}
                  {subtitle && (
                    <p className="text-gray-600 mt-1">{subtitle}</p>
                  )}
                </div>
              </div>
              {actions && (
                <div className="flex items-center gap-3">
                  {actions}
                </div>
              )}
            </div>
          </header>
        )}
        
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
};
