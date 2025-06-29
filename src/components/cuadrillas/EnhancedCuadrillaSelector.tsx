
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Users, User } from "lucide-react";
import { useAuth } from '@/hooks/useAuth';
import { useCuadrillas } from '@/hooks/useCuadrillas';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { EnterpriseSelector } from '@/components/common/EnterpriseSelector';

interface EnhancedCuadrillaSelectorProps {
  selectedCuadrillaId: string | null;
  onCuadrillaChange: (cuadrillaId: string | null) => void;
  fechaInmersion?: string;
  onCuadrillaCreated?: (cuadrilla: any) => void;
}

interface Cuadrilla {
  id: string;
  nombre: string;
  estado: string;
  empresa_id: string;
  tipo_empresa: string;
  _count?: {
    miembros: number;
  };
}

export const EnhancedCuadrillaSelector = ({
  selectedCuadrillaId,
  onCuadrillaChange,
  fechaInmersion,
  onCuadrillaCreated
}: EnhancedCuadrillaSelectorProps) => {
  const { profile } = useAuth();
  const [selectedEnterprise, setSelectedEnterprise] = useState<any>(null);
  const [cuadrillas, setCuadrillas] = useState<Cuadrilla[]>([]);
  const [loading, setLoading] = useState(false);
  const [availability, setAvailability] = useState<Record<string, boolean>>({});

  // Auto-configurar empresa para usuarios no superuser
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

  // Cargar cuadrillas cuando cambia la empresa
  useEffect(() => {
    if (selectedEnterprise) {
      loadCuadrillas();
    }
  }, [selectedEnterprise]);

  // Verificar disponibilidad cuando cambia la fecha
  useEffect(() => {
    if (fechaInmersion && cuadrillas.length > 0) {
      checkAvailability();
    }
  }, [fechaInmersion, cuadrillas]);

  const loadCuadrillas = async () => {
    if (!selectedEnterprise) return;

    setLoading(true);
    try {
      const empresaId = selectedEnterprise.salmonera_id || selectedEnterprise.contratista_id;
      const tipoEmpresa = selectedEnterprise.salmonera_id ? 'salmonera' : 'contratista';

      const { data, error } = await supabase
        .from('cuadrillas_buceo')
        .select(`
          id,
          nombre,
          estado,
          empresa_id,
          tipo_empresa,
          cuadrilla_miembros(count)
        `)
        .eq('empresa_id', empresaId)
        .eq('tipo_empresa', tipoEmpresa)
        .eq('activo', true)
        .order('nombre');

      if (error) throw error;

      const cuadrillasFormatted = data.map(cuadrilla => ({
        ...cuadrilla,
        _count: {
          miembros: cuadrilla.cuadrilla_miembros?.[0]?.count || 0
        }
      }));

      setCuadrillas(cuadrillasFormatted);
    } catch (error) {
      console.error('Error loading cuadrillas:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las cuadrillas",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const checkAvailability = async () => {
    if (!fechaInmersion) return;

    const availabilityMap: Record<string, boolean> = {};
    
    for (const cuadrilla of cuadrillas) {
      try {
        const { data } = await supabase
          .rpc('validate_cuadrilla_availability', {
            p_cuadrilla_id: cuadrilla.id,
            p_fecha_inmersion: fechaInmersion
          });

        availabilityMap[cuadrilla.id] = data?.[0]?.is_available || false;
      } catch (error) {
        console.error(`Error checking availability for cuadrilla ${cuadrilla.id}:`, error);
        availabilityMap[cuadrilla.id] = true; // Asumir disponible si hay error
      }
    }

    setAvailability(availabilityMap);
  };

  const handleCreateCuadrilla = async () => {
    if (!selectedEnterprise) return;

    try {
      const empresaId = selectedEnterprise.salmonera_id || selectedEnterprise.contratista_id;
      const tipoEmpresa = selectedEnterprise.salmonera_id ? 'salmonera' : 'contratista';

      const { data, error } = await supabase
        .from('cuadrillas_buceo')
        .insert([{
          nombre: `Cuadrilla ${Date.now()}`,
          empresa_id: empresaId,
          tipo_empresa: tipoEmpresa,
          estado: 'disponible',
          activo: true
        }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Cuadrilla creada",
        description: "La nueva cuadrilla ha sido creada exitosamente",
      });

      await loadCuadrillas();
      onCuadrillaChange(data.id);
      onCuadrillaCreated?.(data);
    } catch (error) {
      console.error('Error creating cuadrilla:', error);
      toast({
        title: "Error",
        description: "No se pudo crear la cuadrilla",
        variant: "destructive",
      });
    }
  };

  const handleEnterpriseChange = (result: any) => {
    setSelectedEnterprise(result);
    onCuadrillaChange(null); // Limpiar selección cuando cambia la empresa
  };

  // Mostrar selector de empresa para superusers
  if (profile?.role === 'superuser' && !selectedEnterprise) {
    return (
      <div className="space-y-4">
        <EnterpriseSelector
          onSelectionChange={handleEnterpriseChange}
          showCard={false}
          title="Seleccionar Empresa para Cuadrillas"
          description="Seleccione la empresa para gestionar las cuadrillas de buceo"
          autoSubmit={true}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Mostrar empresa seleccionada para superusers */}
      {profile?.role === 'superuser' && selectedEnterprise && (
        <div className="flex items-center justify-between text-sm text-gray-600 p-3 bg-gray-50 rounded-lg">
          <span>
            Empresa: {selectedEnterprise.salmonera_id ? 'Salmonera' : 'Contratista'}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedEnterprise(null)}
            className="text-blue-600 hover:text-blue-800 h-auto p-1"
          >
            Cambiar
          </Button>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Cuadrilla de Buceo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Select
              value={selectedCuadrillaId || ''}
              onValueChange={(value) => onCuadrillaChange(value || null)}
              disabled={loading}
            >
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Seleccionar cuadrilla..." />
              </SelectTrigger>
              <SelectContent>
                {cuadrillas.map((cuadrilla) => (
                  <SelectItem key={cuadrilla.id} value={cuadrilla.id}>
                    <div className="flex items-center justify-between w-full">
                      <span>{cuadrilla.nombre}</span>
                      <div className="flex items-center gap-2 ml-2">
                        <Badge variant="outline" className="text-xs">
                          <User className="w-3 h-3 mr-1" />
                          {cuadrilla._count?.miembros || 0}
                        </Badge>
                        {fechaInmersion && (
                          <Badge
                            variant={availability[cuadrilla.id] ? "default" : "destructive"}
                            className="text-xs"
                          >
                            {availability[cuadrilla.id] ? "Disponible" : "Ocupada"}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button 
              onClick={handleCreateCuadrilla}
              disabled={loading}
              variant="outline"
              size="icon"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {fechaInmersion && selectedCuadrillaId && !availability[selectedCuadrillaId] && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                ⚠️ Esta cuadrilla ya tiene una asignación para la fecha seleccionada.
              </p>
            </div>
          )}

          {cuadrillas.length === 0 && !loading && (
            <div className="text-center py-6 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="text-sm">No hay cuadrillas disponibles</p>
              <Button 
                onClick={handleCreateCuadrilla}
                className="mt-2"
                size="sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Crear Primera Cuadrilla
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
