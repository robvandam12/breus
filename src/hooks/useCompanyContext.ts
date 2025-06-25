
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from './use-toast';

export interface CompanyContext {
  id: string;
  nombre: string;
  tipo: 'salmonera' | 'contratista';
  modulos: string[];
}

export interface UserCompanyContext {
  companyId: string | null;
  companyType: 'salmonera' | 'contratista' | null;
  isSuperuser: boolean;
  selectedCompany: CompanyContext | null;
  availableCompanies: CompanyContext[];
  isLoading: boolean;
}

export const useCompanyContext = () => {
  const { profile } = useAuth();
  const [context, setContext] = useState<UserCompanyContext>({
    companyId: null,
    companyType: null,
    isSuperuser: false,
    selectedCompany: null,
    availableCompanies: [],
    isLoading: true,
  });

  // Obtener contexto del usuario actual
  useEffect(() => {
    const loadUserContext = async () => {
      if (!profile) {
        setContext(prev => ({ ...prev, isLoading: false }));
        return;
      }

      try {
        // Obtener contexto desde la función de base de datos
        const { data: userContext, error } = await supabase
          .rpc('get_user_company_context');

        if (error) throw error;

        const contextData = userContext?.[0];
        const isSuperuser = contextData?.is_superuser || profile.role === 'superuser';

        // Si es superuser, cargar todas las empresas disponibles
        if (isSuperuser) {
          const companies = await loadAllCompanies();
          setContext({
            companyId: null,
            companyType: null,
            isSuperuser: true,
            selectedCompany: null,
            availableCompanies: companies,
            isLoading: false,
          });
        } else {
          // Usuario normal, usar su empresa asignada
          const userCompany = await loadUserCompany(contextData);
          setContext({
            companyId: contextData?.company_id || null,
            companyType: contextData?.company_type as 'salmonera' | 'contratista' || null,
            isSuperuser: false,
            selectedCompany: userCompany,
            availableCompanies: userCompany ? [userCompany] : [],
            isLoading: false,
          });
        }
      } catch (error) {
        console.error('Error loading company context:', error);
        setContext(prev => ({ ...prev, isLoading: false }));
        toast({
          title: "Error",
          description: "No se pudo cargar el contexto empresarial",
          variant: "destructive",
        });
      }
    };

    loadUserContext();
  }, [profile]);

  const loadAllCompanies = async (): Promise<CompanyContext[]> => {
    try {
      // Cargar salmoneras
      const { data: salmoneras } = await supabase
        .from('salmoneras')
        .select('id, nombre')
        .eq('estado', 'activa');

      // Cargar contratistas
      const { data: contratistas } = await supabase
        .from('contratistas')
        .select('id, nombre')
        .eq('estado', 'activo');

      const companies: CompanyContext[] = [];

      // Procesar salmoneras
      if (salmoneras) {
        for (const salmonera of salmoneras) {
          const modules = await loadCompanyModules(salmonera.id, 'salmonera');
          companies.push({
            id: salmonera.id,
            nombre: salmonera.nombre,
            tipo: 'salmonera',
            modulos: modules,
          });
        }
      }

      // Procesar contratistas
      if (contratistas) {
        for (const contratista of contratistas) {
          const modules = await loadCompanyModules(contratista.id, 'contratista');
          companies.push({
            id: contratista.id,
            nombre: contratista.nombre,
            tipo: 'contratista',
            modulos: modules,
          });
        }
      }

      return companies;
    } catch (error) {
      console.error('Error loading companies:', error);
      return [];
    }
  };

  const loadUserCompany = async (contextData: any): Promise<CompanyContext | null> => {
    if (!contextData?.company_id || !contextData?.company_type) return null;

    try {
      const tableName = contextData.company_type === 'salmonera' ? 'salmoneras' : 'contratistas';
      const { data: company } = await supabase
        .from(tableName)
        .select('id, nombre')
        .eq('id', contextData.company_id)
        .single();

      if (!company) return null;

      const modules = await loadCompanyModules(company.id, contextData.company_type);
      
      return {
        id: company.id,
        nombre: company.nombre,
        tipo: contextData.company_type as 'salmonera' | 'contratista',
        modulos: modules,
      };
    } catch (error) {
      console.error('Error loading user company:', error);
      return null;
    }
  };

  const loadCompanyModules = async (companyId: string, companyType: string): Promise<string[]> => {
    try {
      const { data: modules } = await supabase
        .from('company_modules')
        .select('module_name')
        .eq('company_id', companyId)
        .eq('company_type', companyType)
        .eq('is_active', true);

      return modules?.map(m => m.module_name) || ['core_immersions'];
    } catch (error) {
      console.error('Error loading company modules:', error);
      return ['core_immersions'];
    }
  };

  const selectCompany = (company: CompanyContext | null) => {
    if (!context.isSuperuser && company?.id !== context.companyId) {
      toast({
        title: "Acceso denegado",
        description: "No puedes seleccionar una empresa diferente a la tuya",
        variant: "destructive",
      });
      return false;
    }

    setContext(prev => ({
      ...prev,
      selectedCompany: company,
    }));
    return true;
  };

  const hasModuleAccess = (moduleName: string): boolean => {
    return context.selectedCompany?.modulos?.includes(moduleName) || 
           context.selectedCompany?.modulos?.includes('core_immersions') || 
           false;
  };

  const requiresCompanySelection = (): boolean => {
    return context.isSuperuser && !context.selectedCompany;
  };

  const canCreateRecords = (): boolean => {
    return !requiresCompanySelection();
  };

  return {
    context,
    selectCompany,
    hasModuleAccess,
    requiresCompanySelection,
    canCreateRecords,
    refresh: () => {
      setContext(prev => ({ ...prev, isLoading: true }));
      // Trigger useEffect to reload
    },
  };
};
