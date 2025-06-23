
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { BreusLogo } from '@/components/ui/breus-logo';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <BreusLogo size={80} />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            {title}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {subtitle || 'Sistema de Gestión de Buceo'}
          </p>
        </div>
        <Card>
          <CardContent>
            {children}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
