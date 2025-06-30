import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface ModuleAccessInfo {
  module_name: string;
  is_active: boolean;
  display_name: string;
  description?: string;
}

export interface EnterpriseModuleAccess {
  companyId: string;
  companyType: 'salmonera' | 'contratista';
  modules: ModuleAccessInfo[];
  hasPlanning: boolean;
  hasMaintenance: boolean;
  hasReporting: boolean;
  hasIntegrations: boolean;
}

export const useEnterpriseModuleAccess = () => {
  const { profile } = useAuth();
  const [moduleCache, setModuleCache] = useState<Map<string, EnterpriseModuleAccess>>(new Map());
  const [loading, setLoading] = useState(false);

  const getModuleKey = (companyId: string, companyType: string) => `${companyId}-${companyType}`;

  const getModulesForCompany = async (
    companyId: string, 
    companyType: 'salmonera' | 'contratista'
  ): Promise<EnterpriseModuleAccess> => {
    const cacheKey = getModuleKey(companyId, companyType);
    
    // Check cache first
    if (moduleCache.has(cacheKey)) {
      console.log('Using cached modules for:', cacheKey);
      return moduleCache.get(cacheKey)!;
    }

    setLoading(true);
    console.log('Loading modules for company:', companyId, companyType);
    
    try {
      // Si es superuser, obtener todos los módulos como activos
      if (profile?.role === 'superuser') {
        console.log('Loading modules for superuser');
        const { data: systemModules } = await supabase
          .from('system_modules')
          .select('name, display_name, description');

        const modules: ModuleAccessInfo[] = systemModules?.map(module => ({
          module_name: module.name,
          is_active: true,
          display_name: module.display_name,
          description: module.description
        })) || [];

        const result: EnterpriseModuleAccess = {
          companyId,
          companyType,
          modules,
          hasPlanning: true,
          hasMaintenance: true,
          hasReporting: true,
          hasIntegrations: true
        };

        moduleCache.set(cacheKey, result);
        setModuleCache(new Map(moduleCache));
        return result;
      }

      // Para usuarios normales, consultar módulos activos específicamente
      console.log('Loading modules for regular user - checking active modules only');
      
      // Obtener módulos core (siempre activos)
      const { data: coreModules } = await supabase
        .from('system_modules')
        .select('name, display_name, description')
        .eq('is_core', true);

      // CRÍTICO: Obtener SOLO módulos específicos de la empresa que estén ACTIVOS
      const { data: companyModules, error } = await supabase
        .from('company_modules')
        .select(`
          module_name,
          is_active,
          configuration,
          system_modules (
            display_name,
            description
          )
        `)
        .eq('company_id', companyId)
        .eq('company_type', companyType)
        .eq('is_active', true); // CLAVE: Solo obtener módulos activos

      if (error) {
        console.error('Error loading company modules:', error);
        throw error;
      }

      console.log('Core modules found:', coreModules?.length || 0);
      console.log('Active company modules found:', companyModules?.length || 0);
      console.log('Company modules detail:', companyModules);

      // Combinar módulos core con módulos activos de la empresa
      const allModules: ModuleAccessInfo[] = [
        // Módulos core (siempre activos)
        ...(coreModules?.map(module => ({
          module_name: module.name,
          is_active: true,
          display_name: module.display_name,
          description: module.description
        })) || []),
        
        // Módulos específicos activos de la empresa
        ...(companyModules?.map(module => ({
          module_name: module.module_name,
          is_active: true, // Ya filtrados por is_active = true
          display_name: module.system_modules?.display_name || module.module_name,
          description: module.system_modules?.description
        })) || [])
      ];

      // Eliminar duplicados (en caso de que un módulo core también esté en company_modules)
      const uniqueModules = allModules.filter((module, index, self) => 
        index === self.findIndex(m => m.module_name === module.module_name)
      );

      // VALIDACIÓN ESPECÍFICA: Solo considerar módulos activos para los flags
      const hasPlanning = uniqueModules.some(m => m.module_name === 'planning_operations' && m.is_active);
      const hasMaintenance = uniqueModules.some(m => m.module_name === 'maintenance_networks' && m.is_active);
      const hasReporting = uniqueModules.some(m => m.module_name === 'advanced_reporting' && m.is_active);
      const hasIntegrations = uniqueModules.some(m => m.module_name === 'external_integrations' && m.is_active);

      const result: EnterpriseModuleAccess = {
        companyId,
        companyType,
        modules: uniqueModules,
        hasPlanning,
        hasMaintenance,
        hasReporting,
        hasIntegrations
      };

      console.log('Final module result:', {
        companyId,
        companyType,
        totalModules: result.modules.length,
        hasPlanning: result.hasPlanning,
        hasMaintenance: result.hasMaintenance,
        hasReporting: result.hasReporting,
        hasIntegrations: result.hasIntegrations,
        moduleNames: result.modules.map(m => m.module_name),
        activeModules: result.modules.filter(m => m.is_active).map(m => m.module_name)
      });

      moduleCache.set(cacheKey, result);
      setModuleCache(new Map(moduleCache));
      return result;

    } catch (error) {
      console.error('Error loading company modules:', error);
      
      // Fallback: solo core_immersions
      const fallbackResult: EnterpriseModuleAccess = {
        companyId,
        companyType,
        modules: [{
          module_name: 'core_immersions',
          is_active: true,
          display_name: 'Inmersiones Core',
          description: 'Funcionalidad básica de inmersiones'
        }],
        hasPlanning: false,
        hasMaintenance: false,
        hasReporting: false,
        hasIntegrations: false
      };

      console.log('Using fallback result for company:', companyId, companyType);
      moduleCache.set(cacheKey, fallbackResult);
      setModuleCache(new Map(moduleCache));
      return fallbackResult;
    } finally {
      setLoading(false);
    }
  };

  const hasModuleAccess = (
    companyId: string,
    companyType: 'salmonera' | 'contratista',
    moduleName: string
  ): boolean => {
    const cacheKey = getModuleKey(companyId, companyType);
    const cached = moduleCache.get(cacheKey);
    
    if (!cached) return false;
    
    return cached.modules.some(m => m.module_name === moduleName && m.is_active);
  };

  const clearCache = () => {
    console.log('Clearing module access cache');
    setModuleCache(new Map());
  };

  return {
    getModulesForCompany,
    hasModuleAccess,
    loading,
    clearCache,
    moduleCache: Array.from(moduleCache.values())
  };
};
