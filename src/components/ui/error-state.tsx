
import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ 
  message = "Ocurrió un error al cargar los datos", 
  onRetry,
  className 
}) => {
  return (
    <div className={cn("flex flex-col items-center justify-center py-12", className)}>
      <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">Error</h3>
      <p className="text-gray-600 text-center mb-4 max-w-md">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Reintentar
        </Button>
      )}
    </div>
  );
};
