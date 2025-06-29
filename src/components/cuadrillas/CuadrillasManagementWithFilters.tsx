
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
import { CuadrillaManagementModalMejorado } from './CuadrillaManagementModalMejorado';
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

  const isSuperuser = profile?.role === 'superuser';

  useEffect(() => {
    if (isSuperuser) {
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

  const handleCompanyChange = (companyValue: string) => {
    if (companyValue === 'all') {
      setSelectedCompany(null);
      return;
    }
    
    const [companyId, companyType] = companyValue.split('|');
    const company = companies.find(c => c.id === companyId && c.tipo === companyType);
    setSelectedCompany(company || null);
  };

  const handleCuadrillaCreated = (cuadrilla: any) => {
    setShowCreateWizard(false);
    setTimeout(() => {
      invalidateQueries();
      refetchQueries();
    }, 100);
  };

  const handleCuadrillaUpdated = (cuadrilla: any) => {
    setTimeout(() => {
      invalidateQueries();
      refetchQueries();
    }, 100);
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
              {isSuperuser ? 'Gestión global de cuadrillas' : 'Gestión de cuadrillas'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isSuperuser && (
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <Select value={selectedCompany ? `${selectedCompany.id}|${selectedCompany.tipo}` : 'all'} onValueChange={handleCompanyChange}>
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="Filtrar por empresa" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las empresas</SelectItem>
                  {companies.map(company => (
                    <SelectItem key={`${company.id}-${company.tipo}`} value={`${company.id}|${company.tipo}`}>
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

          <Button onClick={() => setShowCreateWizard(true)}>
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
        showCompanyInfo={isSuperuser && !selectedCompany}
      />

      {/* Modales */}
      <CuadrillaCreationWizardEnhanced
        isOpen={showCreateWizard}
        onClose={() => setShowCreateWizard(false)}
        onCuadrillaCreated={handleCuadrillaCreated}
        enterpriseContext={isSuperuser ? null : undefined}
      />

      {selectedCuadrillaId && (
        <CuadrillaManagementModalMejorado
          isOpen={!!selectedCuadrillaId}
          onClose={() => setSelectedCuadrillaId(null)}
          cuadrillaId={selectedCuadrillaId}
          onCuadrillaUpdated={handleCuadrillaUpdated}
        />
      )}
    </div>
  );
};
