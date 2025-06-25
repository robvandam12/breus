
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Settings, CheckCircle, XCircle, Package } from "lucide-react";
import { useModularSystem } from "@/hooks/useModularSystem";

export const ModuleAccessPanel = () => {
  const { activeModules, isLoading } = useModularSystem();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Acceso a Módulos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!activeModules || activeModules.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Acceso a Módulos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Sin Módulos Disponibles
            </h3>
            <p className="text-gray-600">
              No tienes acceso a ningún módulo en este momento.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Acceso a Módulos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activeModules.map((module) => {
            const isActive = module.is_active;
            const isCore = module.is_core;
            
            return (
              <div key={module.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {isActive ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-gray-400" />
                  )}
                  <div>
                    <h4 className="font-medium">{module.display_name}</h4>
                    <p className="text-sm text-gray-600">{module.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {isCore && (
                    <Badge variant="outline" className="text-xs">
                      Core
                    </Badge>
                  )}
                  <Badge variant={isActive ? "default" : "secondary"}>
                    {isActive ? 'Activo' : 'Inactivo'}
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
