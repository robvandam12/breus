
import React from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from '@/components/ui/breadcrumb';
import { NotificationButton } from './NotificationButton';
import { useIsMobile } from '@/hooks/use-mobile';

interface HeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ElementType;
  children?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle, icon: Icon, children }) => {
  const isMobile = useIsMobile();
  
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4 sticky top-0 z-50">
      <SidebarTrigger className="-ml-1 md:hidden" />
      <Separator orientation="vertical" className="mr-2 h-4 hidden md:block" />
      
      <Breadcrumb className="flex-1 min-w-0">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage className="flex items-center gap-2 min-w-0">
              {Icon && <Icon className="w-5 h-5 text-primary flex-shrink-0" />}
              <div className="min-w-0 flex-1">
                <span className="font-semibold text-lg text-foreground truncate block">{title}</span>
                {subtitle && !isMobile && (
                  <p className="text-sm text-muted-foreground truncate mt-0.5 block">{subtitle}</p>
                )}
              </div>
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      
      <div className="ml-auto flex items-center gap-2 flex-shrink-0">
        {children}
        <NotificationButton />
      </div>
    </header>
  );
};
