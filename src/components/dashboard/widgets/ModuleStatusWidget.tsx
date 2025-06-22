
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Settings, CheckCircle, XCircle } from 'lucide-react';

interface ModuleStats {
  module_name: string;
  total_companies: number;
  active_companies: number;
  activation_rate: number;
}

const ModuleStatusWidget = () => {
  const { data: moduleStats, isLoading } = useQuery({
    queryKey: ['module-status'],
    queryFn: async (): Promise<ModuleStats[]> => {
      // Obtener estadísticas de módulos por empresa
      const { data: companies } = await supabase
        .from('salmoneras')
        .select('id');

      const { data: modules } = await supabase
        .from('system_modules')
        .select('name, display_name')
        .eq('is_core', false);

      const totalCompanies = companies?.length || 0;
      
      if (!modules) return [];

      const moduleStats = await Promise.all(
        modules.map(async (module) => {
          const { data: activeModules } = await supabase
            .from('company_modules')
            .select('company_id')
            .eq('module_name', module.name)
            .eq('is_active', true);

          const activeCompanies = activeModules?.length || 0;
          const activationRate = totalCompanies > 0 ? (activeCompanies / totalCompanies) * 100 : 0;

          return {
            module_name: module.display_name || module.name,
            total_companies: totalCompanies,
            active_companies: activeCompanies,
            activation_rate: Math.round(activationRate)
          };
        })
      );

      return moduleStats;
    },
    refetchInterval: 60000, // Actualizar cada minuto
  });

  if (isLoading || !moduleStats) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2">
        <Settings className="w-5 h-5" />
        <CardTitle className="text-sm font-medium">Estado de Módulos por Empresa</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {moduleStats.map((module) => (
          <div key={module.module_name} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{module.module_name}</span>
              <div className="flex items-center gap-2">
                <Badge variant={module.activation_rate > 50 ? "default" : "secondary"} className="text-xs">
                  {module.activation_rate}%
                </Badge>
                {module.activation_rate > 0 ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <XCircle className="w-4 h-4 text-gray-400" />
                )}
              </div>
            </div>
            <Progress value={module.activation_rate} className="h-2" />
            <div className="text-xs text-gray-500">
              {module.active_companies} de {module.total_companies} empresas
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default ModuleStatusWidget;
