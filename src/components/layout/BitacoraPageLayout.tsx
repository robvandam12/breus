
import React from 'react';
import { MainLayout } from "@/components/layout/MainLayout";
import { LucideIcon } from 'lucide-react';

interface BitacoraPageLayoutProps {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  headerActions?: React.ReactNode;
  children: React.ReactNode;
  maxWidth?: 'full' | '7xl' | '6xl' | '5xl';
  padding?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const BitacoraPageLayout: React.FC<BitacoraPageLayoutProps> = ({
  title,
  subtitle,
  icon,
  headerActions,
  children,
  maxWidth = '7xl',
  padding = 'md',
  className = ""
}) => {
  const maxWidthClasses = {
    'full': 'w-full',
    '7xl': 'max-w-7xl',
    '6xl': 'max-w-6xl',
    '5xl': 'max-w-5xl'
  };

  const paddingClasses = {
    'sm': 'p-4',
    'md': 'p-6',
    'lg': 'p-8'
  };

  const contentClassName = `${paddingClasses[padding]} ${maxWidthClasses[maxWidth]} mx-auto w-full space-y-6`;

  return (
    <MainLayout
      title={title}
      subtitle={subtitle}
      icon={icon}
      headerChildren={headerActions}
      className={className}
      contentClassName={contentClassName}
    >
      {children}
    </MainLayout>
  );
};
