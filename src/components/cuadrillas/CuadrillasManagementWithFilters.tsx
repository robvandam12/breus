
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Users, Filter, Plus, Building2 } from "lucide-react";
import { useAuth } from '@/hooks/useAuth';
import { useCuadrillas } from '@/hooks/useCuadrillas';
import { supabase } from '@/integrations/supabase/client';
import { CuadrillaCreationWizardEnhanced } from './CuadrillaCreationWizardEnhanced';
import { CuadrillaManagementModal } from './CuadrillaManagementModal';
import { CuadrillasDataTable } from './CuadrillasDataTable';

interface Company {
  id: string;
  nombre: string;
  tipo: 'salmonera' | 'contratista';
}

export const CuadrillasManagementWithFilters = () => {
  const { profile } = useAuth();
  const { cuadrillas, isLoading, invalidateQueries, refetchQueries } = useCuadrillas();
  
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [filteredCuadrillas, setFilteredCuadrillas] = useState(cuadrillas);
  const [showCreateWizard, setShowCreateWizard] = useState(false);
  const [selectedCuadrillaId, setSelectedCuadrillaId] = useState<string | null>(null);

  useEffect(() => {
    if (profile?.role === 'superuser') {
      loadCompanies();
    }
  }, [profile]);

  useEffect(() => {
    filterCuadrillas();
  }, [cuadrillas, selectedCompany]);

  const loadCompanies = async () => {
    try {
      // Cargar salmoneras
      const { data: salmoneras } = await supabase
        .from('salmoneras')
        .select('id, nombre')
        .eq('estado', 'activa')
        .order('nombre');

      // Cargar contratistas
      const { data: contratistas } = await supabase
        .from('contratistas')
        .select('id, nombre')
        .eq('estado', 'activo')
        .order('nombre');

      const allCompanies: Company[] = [
        ...(salmoneras || []).map(s => ({ ...s, tipo: 'salmonera' as const })),
        ...(contratistas || []).map(c => ({ ...c, tipo: 'contratista' as const }))
      ];

      setCompanies(allCompanies);
    } catch (error) {
      console.error('Error loading companies:', error);
    }
  };

  const filterCuadrillas = () => {
    if (!selectedCompany) {
      setFilteredCuadrillas(cuadrillas);
      return;
    }

    const filtered = cuadrillas.filter(cuadrilla => 
      cuadrilla.empresa_id === selectedCompany.id && 
      cuadrilla.tipo_empresa === selectedCompany.tipo
    );
    setFilteredCuadrillas(filtered);
  };

  const handleCompanyChange = (companyId: string) => {
    const company = companies.find(c => c.id === companyId);
    setSelectedCompany(company || null);
  };

  const getEnterpriseContext = () => {
    if (!selectedCompany) return null;
    
    return selectedCompany.tipo === 'salmonera' 
      ? { salmonera_id: selectedCompany.id, context_metadata: { selection_mode: 'superuser_admin', empresa_origen_tipo: 'salmonera' } }
      : { contratista_id: selectedCompany.id, context_metadata: { selection_mode: 'superuser_admin', empresa_origen_tipo: 'contratista' } };
  };

  const handleCuadrillaCreated = (cuadrilla: any) => {
    setShowCreateWizard(false);
    invalidateQueries();
    refetchQueries();
  };

  const handleCuadrillaUpdated = (cuadrilla: any) => {
    invalidateQueries();
    refetchQueries();
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Cargando cuadrillas...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header con filtros */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="w-6 h-6 text-blue-600" />
          <div>
            <h2 className="text-xl font-semibold">Cuadrillas de Buceo</h2>
            <p className="text-gray-500">
              {profile?.role === 'superuser' ? 'Gestión global de cuadrillas' : 'Gestión de cuadrillas'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {profile?.role === 'superuser' && (
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <Select value={selectedCompany?.id || ''} onValueChange={handleCompanyChange}>
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="Filtrar por empresa" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas las empresas</SelectItem>
                  {companies.map(company => (
                    <SelectItem key={company.id} value={company.id}>
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4" />
                        <span>{company.nombre}</span>
                        <Badge variant="outline" className="text-xs">
                          {company.tipo === 'salmonera' ? 'Salmonera' : 'Contratista'}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <Button 
            onClick={() => setShowCreateWizard(true)}
            disabled={profile?.role === 'superuser' && !selectedCompany}
          >
            <Plus className="w-4 h-4 mr-2" />
            Nueva Cuadrilla
          </Button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{filteredCuadrillas.length}</div>
            <div className="text-sm text-gray-600">Total Cuadrillas</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {filteredCuadrillas.filter(c => c.estado === 'disponible').length}
            </div>
            <div className="text-sm text-gray-600">Disponibles</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">
              {filteredCuadrillas.filter(c => c.estado === 'ocupada').length}
            </div>
            <div className="text-sm text-gray-600">Ocupadas</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">
              {filteredCuadrillas.reduce((total, c) => total + (c.miembros?.length || 0), 0)}
            </div>
            <div className="text-sm text-gray-600">Total Miembros</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabla de datos */}
      <CuadrillasDataTable 
        cuadrillas={filteredCuadrillas}
        onManageCuadrilla={setSelectedCuadrillaId}
        showCompanyInfo={profile?.role === 'superuser' && !selectedCompany}
      />

      {/* Modales */}
      <CuadrillaCreationWizardEnhanced
        isOpen={showCreateWizard}
        onClose={() => setShowCreateWizard(false)}
        onCuadrillaCreated={handleCuadrillaCreated}
        enterpriseContext={getEnterpriseContext()}
      />

      {selectedCuadrillaId && (
        <CuadrillaManagementModal
          isOpen={!!selectedCuadrillaId}
          onClose={() => setSelectedCuadrillaId(null)}
          cuadrillaId={selectedCuadrillaId}
          onCuadrillaUpdated={handleCuadrillaUpdated}
        />
      )}
    </div>
  );
};
