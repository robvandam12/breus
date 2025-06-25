
import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

interface MainLayoutProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  headerChildren?: ReactNode;
  children: ReactNode;
}

export const MainLayout = ({ 
  title, 
  subtitle, 
  icon: Icon, 
  headerChildren, 
  children 
}: MainLayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {Icon && <Icon className="w-8 h-8 text-primary" />}
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
                {subtitle && (
                  <p className="text-gray-600 mt-1">{subtitle}</p>
                )}
              </div>
            </div>
            {headerChildren && (
              <div className="flex items-center gap-3">
                {headerChildren}
              </div>
            )}
          </div>
        </div>
        {children}
      </div>
    </div>
  );
};
