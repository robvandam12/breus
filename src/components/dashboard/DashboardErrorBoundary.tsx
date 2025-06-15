
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class DashboardErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo
    });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="p-6 space-y-4">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <div>
                <p className="font-semibold">Error en el Dashboard</p>
                <p className="text-sm mt-1">
                  Ha ocurrido un error inesperado. Por favor, intenta recargar el componente.
                </p>
                {process.env.NODE_ENV === 'development' && this.state.error && (
                  <details className="mt-2 text-xs">
                    <summary className="cursor-pointer">Detalles del error</summary>
                    <pre className="mt-1 whitespace-pre-wrap bg-red-50 p-2 rounded text-red-800">
                      {this.state.error.toString()}
                      {this.state.errorInfo?.componentStack}
                    </pre>
                  </details>
                )}
              </div>
              <div className="flex gap-2 ml-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={this.handleReset}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reintentar
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => window.location.reload()}
                >
                  Recargar Página
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      );
    }

    return this.props.children;
  }
}
