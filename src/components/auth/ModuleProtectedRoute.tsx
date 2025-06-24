
import React from 'react';
import { useModularSystem } from '@/hooks/useModularSystem';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ModuleProtectedRouteProps {
  children: React.ReactNode;
  requiredModule: string;
  moduleName?: string;
  description?: string;
}

export const ModuleProtectedRoute = ({
  children,
  requiredModule,
  moduleName,
  description
}: ModuleProtectedRouteProps) => {
  const { hasModuleAccess, isSuperuser } = useModularSystem();

  // Superusers tienen acceso completo
  if (isSuperuser) {
    return <>{children}</>;
  }

  // Verificar si tiene acceso al módulo
  if (hasModuleAccess(requiredModule)) {
    return <>{children}</>;
  }

  // Mostrar página de módulo no disponible
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-4">
            <Lock className="w-6 h-6 text-amber-600" />
          </div>
          <CardTitle className="text-xl font-semibold text-gray-900">
            Módulo No Disponible
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div>
            <p className="text-gray-600 mb-2">
              {moduleName || 'Este módulo'} no está activo para tu organización.
            </p>
            {description && (
              <p className="text-sm text-gray-500">{description}</p>
            )}
          </div>

          <div className="pt-4 space-y-2">
            <Button asChild variant="outline" className="w-full">
              <Link to="/">
                Volver al Dashboard
              </Link>
            </Button>
            
            <p className="text-xs text-gray-500">
              Contacta a tu administrador para activar este módulo
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
