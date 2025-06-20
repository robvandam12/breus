
import React from 'react';
import { Header } from '@/components/layout/Header';
import { NotificationCenter } from '@/components/notifications/NotificationCenter';

interface HeaderWithNotificationsProps {
  title: string;
  subtitle?: string;
  icon?: React.ElementType;
  children?: React.ReactNode;
}

export const HeaderWithNotifications = ({ 
  title, 
  subtitle, 
  icon, 
  children 
}: HeaderWithNotificationsProps) => {
  return (
    <Header title={title} subtitle={subtitle} icon={icon}>
      <div className="flex items-center gap-2">
        {children}
        <NotificationCenter />
      </div>
    </Header>
  );
};
