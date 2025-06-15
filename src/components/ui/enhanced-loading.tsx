
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface EnhancedLoadingProps {
  isLoading: boolean;
  error?: Error | null;
  isEmpty?: boolean;
  onRetry?: () => void;
  emptyMessage?: string;
  errorMessage?: string;
  loadingText?: string;
  skeletonRows?: number;
  children: React.ReactNode;
}

export const EnhancedLoading: React.FC<EnhancedLoadingProps> = ({
  isLoading,
  error,
  isEmpty = false,
  onRetry,
  emptyMessage = "No hay datos disponibles",
  errorMessage = "Error al cargar los datos",
  loadingText = "Cargando...",
  skeletonRows = 3,
  children
}) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-center py-4">
          <LoadingSpinner text={loadingText} size="md" />
        </div>
        <div className="space-y-2">
          {Array.from({ length: skeletonRows }).map((_, index) => (
            <Skeleton key={index} className="h-12 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <div>
            <p className="font-semibold">{errorMessage}</p>
            <p className="text-sm mt-1">{error.message}</p>
          </div>
          {onRetry && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onRetry}
              className="ml-4"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Reintentar
            </Button>
          )}
        </AlertDescription>
      </Alert>
    );
  }

  if (isEmpty) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return <>{children}</>;
};
