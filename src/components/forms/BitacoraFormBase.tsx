
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

interface BitacoraFormBaseProps {
  title: string;
  subtitle?: string;
  icon?: React.ElementType;
  children: React.ReactNode;
  actions?: React.ReactNode;
  isLoading?: boolean;
  variant?: 'dialog' | 'page';
  className?: string;
}

export const BitacoraFormBase: React.FC<BitacoraFormBaseProps> = ({
  title,
  subtitle,
  icon: Icon,
  children,
  actions,
  isLoading = false,
  variant = 'dialog',
  className = ''
}) => {
  if (variant === 'dialog') {
    return (
      <>
        <DialogHeader className="pb-4">
          <DialogTitle className="flex items-center gap-2 text-lg">
            {Icon && <Icon className="w-5 h-5 text-blue-600" />}
            <div>
              <div>{title}</div>
              {subtitle && <div className="text-sm font-normal text-zinc-500 mt-1">{subtitle}</div>}
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <div className={`space-y-6 ${className}`}>
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
              <span className="ml-2 text-zinc-600">Procesando...</span>
            </div>
          )}
          {!isLoading && children}
          {actions && !isLoading && (
            <div className="flex gap-3 pt-4 border-t">
              {actions}
            </div>
          )}
        </div>
      </>
    );
  }

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {Icon && <Icon className="w-5 h-5 text-blue-600" />}
          <div>
            <div>{title}</div>
            {subtitle && <div className="text-sm font-normal text-zinc-500 mt-1">{subtitle}</div>}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            <span className="ml-2 text-zinc-600">Procesando...</span>
          </div>
        )}
        {!isLoading && children}
        {actions && !isLoading && (
          <div className="flex gap-3 pt-4 border-t">
            {actions}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
