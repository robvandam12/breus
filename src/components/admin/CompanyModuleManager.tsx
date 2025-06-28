
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Building2, 
  Settings, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Info
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

interface CompanyModuleManagerProps {
  companyId: string;
  companyType: 'salmonera' | 'contratista';
  onClose: () => void;
}

export const CompanyModuleManager = ({ companyId, companyType, onClose }: CompanyModuleManagerProps) => {
  const { profile } = useAuth();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  // Obtener información de la empresa
  const { data: companyInfo } = useQuery({
    queryKey: ['company-info', companyId, companyType],
    queryFn: async () => {
      const table = companyType === 'salmonera' ? 'salmoneras' : 'contratistas';
      const { data, error } = await supabase
        .from(table)
        .select('id, nombre, rut')
        .eq('id', companyId)
        .single();

      if (error) throw error;
      return data;
    },
  });

  // Obtener módulos del sistema
  const { data: systemModules = [] } = useQuery({
    queryKey: ['system-modules'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('system_modules')
        .select('*')
        .order('category, display_name');

      if (error) throw error;
      return data;
    },
  });

  // Obtener módulos activos de la empresa
  const { data: companyModules = [] } = useQuery({
    queryKey: ['company-modules', companyId, companyType],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('company_modules')
        .select('*')
        .eq('company_id', companyId)
        .eq('company_type', companyType);

      if (error) throw error;
      return data;
    },
  });

  // Mutation para activar/desactivar módulos
  const toggleModuleMutation = useMutation({
    mutationFn: async ({ moduleName, isActive }: { moduleName: string; isActive: boolean }) => {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('company_modules')
        .upsert({
          company_id: companyId,
          company_type: companyType,
          module_name: moduleName,
          is_active: isActive,
          activated_by: isActive ? profile?.id : null,
          configuration: {},
        }, {
          onConflict: 'company_id,company_type,module_name'
        })
        .select()
        .single();

      if (error) throw error;

      // Registrar log de activación/desactivación
      await supabase
        .from('module_activation_logs')
        .insert({
          module_name: moduleName,
          company_id: companyId,
          company_type: companyType,
          action: isActive ? 'activated' : 'deactivated',
          performed_by: profile?.id,
        });

      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['company-modules', companyId, companyType] });
      queryClient.invalidateQueries({ queryKey: ['module-stats'] });
      toast({
        title: variables.isActive ? "Módulo Activado" : "Módulo Desactivado",
        description: `El módulo ha sido ${variables.isActive ? 'activado' : 'desactivado'} exitosamente.`,
      });
      setIsLoading(false);
    },
    onError: (error) => {
      console.error('Error toggling module:', error);
      toast({
        title: "Error",
        description: "No se pudo cambiar el estado del módulo.",
        variant: "destructive",
      });
      setIsLoading(false);
    },
  });

  const getModuleStatus = (moduleName: string) => {
    return companyModules.find(m => m.module_name === moduleName)?.is_active || false;
  };

  const handleToggleModule = (moduleName: string, currentStatus: boolean) => {
    toggleModuleMutation.mutate({
      moduleName,
      isActive: !currentStatus
    });
  };

  const groupedModules = systemModules.reduce((acc, module) => {
    if (!acc[module.category]) {
      acc[module.category] = [];
    }
    acc[module.category].push(module);
    return acc;
  }, {} as Record<string, typeof systemModules>);

  const categoryLabels = {
    operational: 'Operacionales',
    planning: 'Planificación',
    reporting: 'Reportes',
    integration: 'Integraciones'
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Gestión de Módulos - {companyInfo?.nombre}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Información de la empresa */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{companyInfo?.nombre}</h3>
                  <p className="text-sm text-gray-600">
                    {companyType === 'salmonera' ? 'Salmonera' : 'Contratista'} - RUT: {companyInfo?.rut}
                  </p>
                </div>
                <Badge variant={companyType === 'salmonera' ? 'default' : 'secondary'}>
                  {companyType === 'salmonera' ? 'Salmonera' : 'Contratista'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Información sobre módulos core */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Los módulos marcados como "Core" están siempre disponibles y no pueden ser desactivados.
              Los módulos opcionales pueden ser activados o desactivados según las necesidades de la empresa.
            </AlertDescription>
          </Alert>

          {/* Módulos por categoría */}
          <div className="space-y-6">
            {Object.entries(groupedModules).map(([category, modules]) => (
              <Card key={category}>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {categoryLabels[category as keyof typeof categoryLabels] || category}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {modules.map((module) => {
                    const isActive = getModuleStatus(module.name);
                    const isCore = module.is_core;
                    
                    return (
                      <div key={module.name} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium">{module.display_name}</h4>
                            <Badge className={isCore ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"}>
                              {isCore ? 'Core' : 'Opcional'}
                            </Badge>
                            {isActive && (
                              <Badge className="bg-green-100 text-green-800">
                                Activo
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{module.description}</p>
                          {module.dependencies && module.dependencies.length > 0 && (
                            <p className="text-xs text-gray-500">
                              Dependencias: {module.dependencies.join(', ')}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {isCore ? (
                            <div className="flex items-center gap-2 text-sm text-blue-600">
                              <CheckCircle className="w-4 h-4" />
                              Siempre Activo
                            </div>
                          ) : (
                            <div className="flex items-center space-x-2">
                              <Label htmlFor={`module-${module.name}`} className="text-sm">
                                {isActive ? 'Activado' : 'Desactivado'}
                              </Label>
                              <Switch
                                id={`module-${module.name}`}
                                checked={isActive}
                                onCheckedChange={() => handleToggleModule(module.name, isActive)}
                                disabled={isLoading}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Resumen */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Resumen de Módulos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    {systemModules.filter(m => m.is_core).length}
                  </div>
                  <div className="text-sm text-gray-600">Módulos Core</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {companyModules.filter(m => m.is_active).length}
                  </div>
                  <div className="text-sm text-gray-600">Módulos Activos</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-600">
                    {systemModules.filter(m => !m.is_core).length}
                  </div>
                  <div className="text-sm text-gray-600">Módulos Opcionales</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-600">
                    {systemModules.length}
                  </div>
                  <div className="text-sm text-gray-600">Total Disponibles</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={onClose}>
              Cerrar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
