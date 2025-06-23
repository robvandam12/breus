
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Settings, Activity, AlertTriangle, CheckCircle, X } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useModularSystem } from "@/hooks/useModularSystem";
import { toast } from "@/hooks/use-toast";

interface CompanyModuleManagerProps {
  companyId: string;
  onClose: () => void;
}

export const CompanyModuleManager: React.FC<CompanyModuleManagerProps> = ({
  companyId,
  onClose
}) => {
  const [reason, setReason] = useState('');
  const queryClient = useQueryClient();
  
  const { systemModules } = useModularSystem();

  // Obtener información de la empresa
  const { data: companyInfo } = useQuery({
    queryKey: ['company-info', companyId],
    queryFn: async () => {
      // Intentar obtener de salmoneras primero
      const { data: salmonera } = await supabase
        .from('salmoneras')
        .select('id, nombre, rut')
        .eq('id', companyId)
        .single();

      if (salmonera) {
        return { ...salmonera, type: 'salmonera' as const };
      }

      // Si no es salmonera, buscar en contratistas
      const { data: contratista } = await supabase
        .from('contratistas')
        .select('id, nombre, rut')
        .eq('id', companyId)
        .single();

      if (contratista) {
        return { ...contratista, type: 'contratista' as const };
      }

      throw new Error('Empresa no encontrada');
    },
  });

  // Obtener módulos activos de la empresa
  const { data: companyModules = [] } = useQuery({
    queryKey: ['company-modules', companyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('company_modules')
        .select('*')
        .eq('company_id', companyId)
        .eq('company_type', companyInfo?.type);

      if (error) throw error;
      return data || [];
    },
    enabled: !!companyInfo,
  });

  // Mutation para activar/desactivar módulo
  const toggleModuleMutation = useMutation({
    mutationFn: async ({ 
      moduleName, 
      isActive 
    }: { 
      moduleName: string; 
      isActive: boolean; 
    }) => {
      if (!companyInfo) throw new Error('Información de empresa no disponible');

      // Obtener configuración actual
      const { data: currentConfig } = await supabase
        .from('company_modules')
        .select('*')
        .eq('company_id', companyId)
        .eq('company_type', companyInfo.type)
        .eq('module_name', moduleName)
        .single();

      // Actualizar o insertar
      const { data, error } = await supabase
        .from('company_modules')
        .upsert({
          company_id: companyId,
          company_type: companyInfo.type,
          module_name: moduleName,
          is_active: isActive,
          activated_by: null, // Se establece automáticamente por el trigger
          configuration: currentConfig?.configuration || {},
        }, {
          onConflict: 'company_id,company_type,module_name'
        })
        .select()
        .single();

      if (error) throw error;

      // Registrar log de activación
      await supabase
        .from('module_activation_logs')
        .insert({
          company_id: companyId,
          company_type: companyInfo.type,
          module_name: moduleName,
          action: isActive ? 'activated' : 'deactivated',
          previous_state: currentConfig ? { is_active: currentConfig.is_active } : {},
          new_state: { is_active: isActive },
          reason: reason || null,
          performed_by: null, // Se establece automáticamente
        });

      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['company-modules', companyId] });
      queryClient.invalidateQueries({ queryKey: ['module-stats'] });
      
      toast({
        title: variables.isActive ? 'Módulo Activado' : 'Módulo Desactivado',
        description: `El módulo ha sido ${variables.isActive ? 'activado' : 'desactivado'} exitosamente.`,
      });
      
      setReason('');
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'No se pudo cambiar el estado del módulo.',
        variant: 'destructive',
      });
    },
  });

  const getModuleStatus = (moduleName: string) => {
    const module = companyModules.find(m => m.module_name === moduleName);
    return module?.is_active ?? false;
  };

  const isModuleCore = (moduleName: string) => {
    const module = systemModules.find(m => m.name === moduleName);
    return module?.is_core ?? false;
  };

  const handleToggleModule = async (moduleName: string, isActive: boolean) => {
    if (isModuleCore(moduleName) && !isActive) {
      toast({
        title: 'Módulo Core',
        description: 'Los módulos core no pueden ser desactivados.',
        variant: 'destructive',
      });
      return;
    }

    await toggleModuleMutation.mutateAsync({ moduleName, isActive });
  };

  if (!companyInfo) {
    return null;
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Gestión de Módulos - {companyInfo.nombre}
              </DialogTitle>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant={companyInfo.type === 'salmonera' ? 'default' : 'secondary'}>
                  {companyInfo.type === 'salmonera' ? 'Salmonera' : 'Contratista'}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {companyInfo.rut}
                </Badge>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Campo para razón del cambio */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Razón del Cambio</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Describe el motivo del cambio de estado del módulo..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="min-h-[60px]"
              />
            </CardContent>
          </Card>

          {/* Lista de módulos */}
          <div className="space-y-4">
            {systemModules.map((module) => {
              const isActive = getModuleStatus(module.name);
              const isCore = module.is_core;
              
              return (
                <Card key={module.name} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold">{module.display_name}</h3>
                          <Badge className={isCore ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"}>
                            {isCore ? 'Core' : 'Opcional'}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {module.category}
                          </Badge>
                          {isActive ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <AlertTriangle className="w-4 h-4 text-gray-400" />
                          )}
                        </div>
                        <p className="text-gray-600 text-sm mb-3">{module.description}</p>
                        {module.dependencies && module.dependencies.length > 0 && (
                          <div className="text-xs text-gray-500">
                            <span className="font-medium">Dependencias:</span> {module.dependencies.join(', ')}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-3 ml-4">
                        <div className="flex items-center space-x-2">
                          <Switch
                            id={`module-${module.name}`}
                            checked={isActive}
                            onCheckedChange={(checked) => handleToggleModule(module.name, checked)}
                            disabled={isCore || toggleModuleMutation.isPending}
                          />
                          <Label htmlFor={`module-${module.name}`} className="text-sm">
                            {isActive ? 'Activo' : 'Inactivo'}
                          </Label>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Información adicional */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Información Importante
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <span>Los módulos <strong>Core</strong> están siempre activos y no pueden desactivarse.</span>
              </div>
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <span>Desactivar un módulo puede afectar funcionalidades que dependen de él.</span>
              </div>
              <div className="flex items-start gap-2">
                <Activity className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Los cambios se aplicarán inmediatamente y se registrarán en los logs del sistema.</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};
