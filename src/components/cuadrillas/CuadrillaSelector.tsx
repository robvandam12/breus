
import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Plus, Users, AlertTriangle, Building2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { EnterpriseSelector } from "@/components/common/EnterpriseSelector";
import { useEnterpriseModuleAccess } from "@/hooks/useEnterpriseModuleAccess";
import { useAuth } from "@/hooks/useAuth";

interface Cuadrilla {
  id: string;
  nombre: string;
  descripcion?: string;
  estado: string;
  empresa_id: string;
  tipo_empresa: string;
  miembros_count?: number;
}

interface CuadrillaSelectorProps {
  selectedCuadrillaId: string | null;
  onCuadrillaChange: (cuadrillaId: string | null) => void;
  fechaInmersion?: string;
  onCuadrillaCreated?: (cuadrilla: Cuadrilla) => void;
  showCreateButton?: boolean;
}

export const CuadrillaSelector: React.FC<CuadrillaSelectorProps> = ({
  selectedCuadrillaId,
  onCuadrillaChange,
  fechaInmersion,
  onCuadrillaCreated,
  showCreateButton = true
}) => {
  const { profile } = useAuth();
  const { getModulesForCompany } = useEnterpriseModuleAccess();
  const [cuadrillas, setCuadrillas] = useState<Cuadrilla[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedEnterprise, setSelectedEnterprise] = useState<any>(null);
  const [enterpriseModules, setEnterpriseModules] = useState<any>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newCuadrillaName, setNewCuadrillaName] = useState('');
  const [newCuadrillaDescription, setNewCuadrillaDescription] = useState('');

  // Para usuarios no superuser, usar su empresa automáticamente
  useEffect(() => {
    if (profile && profile.role !== 'superuser') {
      const autoEnterprise = {
        salmonera_id: profile.salmonera_id,
        contratista_id: profile.servicio_id,
        context_metadata: {
          selection_mode: profile.salmonera_id ? 'salmonera_admin' : 'contratista_admin',
          empresa_origen_tipo: profile.salmonera_id ? 'salmonera' : 'contratista'
        }
      };
      setSelectedEnterprise(autoEnterprise);
    }
  }, [profile]);

  // Cargar cuadrillas cuando se selecciona empresa
  useEffect(() => {
    if (selectedEnterprise) {
      loadCuadrillas();
      loadEnterpriseModules();
    }
  }, [selectedEnterprise]);

  const loadEnterpriseModules = async () => {
    if (!selectedEnterprise) return;

    try {
      const companyId = selectedEnterprise.salmonera_id || selectedEnterprise.contratista_id;
      const companyType = selectedEnterprise.salmonera_id ? 'salmonera' : 'contratista';
      
      const modules = await getModulesForCompany(companyId, companyType);
      setEnterpriseModules(modules);
    } catch (error) {
      console.error('Error loading enterprise modules:', error);
    }
  };

  const loadCuadrillas = async () => {
    if (!selectedEnterprise) return;

    setIsLoading(true);
    try {
      const companyId = selectedEnterprise.salmonera_id || selectedEnterprise.contratista_id;
      const companyType = selectedEnterprise.salmonera_id ? 'salmonera' : 'contratista';

      const { data, error } = await supabase
        .from('cuadrillas_buceo')
        .select(`
          id,
          nombre,
          descripcion,
          estado,
          empresa_id,
          tipo_empresa,
          cuadrilla_miembros(count)
        `)
        .eq('empresa_id', companyId)
        .eq('tipo_empresa', companyType)
        .eq('activo', true)
        .order('nombre');

      if (error) {
        throw error;
      }

      const cuadrillasWithCount = data?.map(cuadrilla => ({
        ...cuadrilla,
        miembros_count: cuadrilla.cuadrilla_miembros?.[0]?.count || 0
      })) || [];

      setCuadrillas(cuadrillasWithCount);

      // Verificar disponibilidad si hay fecha de inmersión
      if (fechaInmersion && cuadrillasWithCount.length > 0) {
        await checkAvailability(cuadrillasWithCount);
      }

    } catch (error) {
      console.error('Error loading cuadrillas:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las cuadrillas de buceo",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const checkAvailability = async (cuadrillasList: Cuadrilla[]) => {
    if (!fechaInmersion) return;

    try {
      for (const cuadrilla of cuadrillasList) {
        const { data } = await supabase
          .rpc('validate_cuadrilla_availability', {
            p_cuadrilla_id: cuadrilla.id,
            p_fecha_inmersion: fechaInmersion
          });

        if (data && data.length > 0 && !data[0].is_available) {
          // Marcar como no disponible (podrías agregar esta propiedad al estado si necesitas)
          console.log(`Cuadrilla ${cuadrilla.nombre} no disponible para ${fechaInmersion}`);
        }
      }
    } catch (error) {
      console.error('Error checking availability:', error);
    }
  };

  const handleCreateCuadrilla = async () => {
    if (!newCuadrillaName.trim() || !selectedEnterprise) return;

    try {
      const companyId = selectedEnterprise.salmonera_id || selectedEnterprise.contratista_id;
      const companyType = selectedEnterprise.salmonera_id ? 'salmonera' : 'contratista';

      const { data, error } = await supabase
        .from('cuadrillas_buceo')
        .insert([{
          nombre: newCuadrillaName.trim(),
          descripcion: newCuadrillaDescription.trim() || null,
          empresa_id: companyId,
          tipo_empresa: companyType,
          activo: true,
          estado: 'disponible'
        }])
        .select()
        .single();

      if (error) throw error;

      const newCuadrilla: Cuadrilla = {
        ...data,
        miembros_count: 0
      };

      setCuadrillas(prev => [...prev, newCuadrilla]);
      onCuadrillaChange(newCuadrilla.id);
      onCuadrillaCreated?.(newCuadrilla);

      // Reset form
      setNewCuadrillaName('');
      setNewCuadrillaDescription('');
      setShowCreateForm(false);

      toast({
        title: "Cuadrilla creada",
        description: `La cuadrilla "${newCuadrilla.nombre}" ha sido creada exitosamente.`,
      });

    } catch (error) {
      console.error('Error creating cuadrilla:', error);
      toast({
        title: "Error",
        description: "No se pudo crear la cuadrilla",
        variant: "destructive",
      });
    }
  };

  const selectedCuadrilla = cuadrillas.find(c => c.id === selectedCuadrillaId);

  // Solo mostrar selector de empresa para superusers
  if (profile?.role === 'superuser' && !selectedEnterprise) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Selección de Cuadrilla de Buceo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <EnterpriseSelector
            onSelectionChange={setSelectedEnterprise}
            showCard={false}
            title="Seleccionar Empresa"
            description="Primero debe seleccionar la empresa para ver sus cuadrillas"
            showModuleInfo={false}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          Cuadrilla de Buceo
        </CardTitle>
        {selectedEnterprise && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Building2 className="w-4 h-4" />
            <span>
              {selectedEnterprise.salmonera_id ? 'Salmonera' : 'Contratista'} seleccionado
            </span>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Mostrar información de módulos si es relevante */}
        {enterpriseModules && !enterpriseModules.hasPlanning && (
          <Alert>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <AlertDescription>
              Esta empresa no tiene el módulo de planificación activo. 
              Las cuadrillas funcionarán en modo básico.
            </AlertDescription>
          </Alert>
        )}

        {/* Selector de cuadrilla */}
        <div className="space-y-2">
          <Select
            value={selectedCuadrillaId || ""}
            onValueChange={(value) => onCuadrillaChange(value || null)}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder={
                isLoading 
                  ? "Cargando cuadrillas..." 
                  : cuadrillas.length === 0 
                    ? "No hay cuadrillas disponibles"
                    : "Seleccionar cuadrilla..."
              } />
            </SelectTrigger>
            <SelectContent>
              {cuadrillas.map((cuadrilla) => (
                <SelectItem key={cuadrilla.id} value={cuadrilla.id}>
                  <div className="flex flex-col">
                    <span>{cuadrilla.nombre}</span>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>{cuadrilla.miembros_count || 0} miembros</span>
                      <span>•</span>
                      <span className={`capitalize ${
                        cuadrilla.estado === 'disponible' ? 'text-green-600' : 'text-amber-600'
                      }`}>
                        {cuadrilla.estado}
                      </span>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Información de la cuadrilla seleccionada */}
        {selectedCuadrilla && (
          <div className="p-3 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-sm">{selectedCuadrilla.nombre}</h4>
            {selectedCuadrilla.descripcion && (
              <p className="text-xs text-gray-600 mt-1">{selectedCuadrilla.descripcion}</p>
            )}
            <div className="flex items-center gap-4 mt-2 text-xs text-gray-600">
              <span>{selectedCuadrilla.miembros_count || 0} miembros</span>
              <span className={`capitalize ${
                selectedCuadrilla.estado === 'disponible' ? 'text-green-600' : 'text-amber-600'
              }`}>
                {selectedCuadrilla.estado}
              </span>
            </div>
          </div>
        )}

        {/* Botón para crear nueva cuadrilla */}
        {showCreateButton && (
          <div className="space-y-2">
            {!showCreateForm ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCreateForm(true)}
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Crear Nueva Cuadrilla
              </Button>
            ) : (
              <div className="space-y-2 p-3 border rounded-lg">
                <input
                  type="text"
                  placeholder="Nombre de la cuadrilla"
                  value={newCuadrillaName}
                  onChange={(e) => setNewCuadrillaName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md text-sm"
                />
                <textarea
                  placeholder="Descripción (opcional)"
                  value={newCuadrillaDescription}
                  onChange={(e) => setNewCuadrillaDescription(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md text-sm resize-none"
                  rows={2}
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={handleCreateCuadrilla}
                    disabled={!newCuadrillaName.trim()}
                  >
                    Crear
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setShowCreateForm(false);
                      setNewCuadrillaName('');
                      setNewCuadrillaDescription('');
                    }}
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Mensaje cuando no hay cuadrillas */}
        {!isLoading && cuadrillas.length === 0 && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              No hay cuadrillas de buceo disponibles para esta empresa. 
              {showCreateButton && " Puede crear una nueva cuadrilla usando el botón de arriba."}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};
