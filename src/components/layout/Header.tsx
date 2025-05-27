
import React from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from '@/components/ui/breadcrumb';
import { NotificationButton } from './NotificationButton';

interface HeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ElementType;
  children?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle, icon: Icon, children }) => {
  return (
    <header className="ios-blur border-b border-border/20 sticky top-0 z-50 bg-white bg-opacity-80">
      <div className="flex h-16 md:h-18 items-center gap-2 px-4 md:px-8">
        <SidebarTrigger className="touch-target ios-button p-2 rounded-xl hover:bg-gray-100 transition-colors" />
        <Separator orientation="vertical" className="h-6 mx-2" />
        <div className="flex items-center gap-3">
          {Icon && <div className="w-6 h-6 flex items-center justify-center text-zinc-600"><Icon className="w-6 h-6" /></div>}
          <div>
            <h1 className="text-xl font-semibold text-zinc-900">{title}</h1>
            {subtitle && (
              <p className="text-sm text-zinc-500">{subtitle}</p>
            )}
          </div>
        </div>
        <div className="ml-auto flex items-center gap-3">
          {children}
          <NotificationButton />
        </div>
      </div>
    </header>
  );
};
