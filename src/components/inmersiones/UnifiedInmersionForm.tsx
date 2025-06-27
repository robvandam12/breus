import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Calendar, Zap, AlertCircle, Users } from "lucide-react";
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { InmersionTeamManagerEnhanced } from './InmersionTeamManagerEnhanced';

interface UnifiedInmersionFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

interface Salmonera {
  id: string;
  nombre: string;
}

interface Contratista {
  id: string;
  nombre: string;
}

interface Operacion {
  id: string;
  codigo: string;
  nombre: string;
  fecha_inicio: string;
}

interface Personal {
  usuario_id: string;
  nombre: string;
  apellido: string;
  rol: string;
}

export const UnifiedInmersionForm = ({ onSubmit, onCancel }: UnifiedInmersionFormProps) => {
  const { profile } = useAuth();
  const [isPlanned, setIsPlanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  
  // Estado del formulario
  const [formData, setFormData] = useState({
    salmonera_id: '',
    contratista_id: '',
    operacion_id: '',
    codigo_operacion_externa: '',
    objetivo: '',
    fecha_inmersion: '',
    profundidad_max: '',
    observaciones: '',
    buzo_principal_id: '',
    supervisor_id: ''
  });

  // Datos para selects
  const [salmoneras, setSalmoneras] = useState<Salmonera[]>([]);
  const [contratistas, setContratistas] = useState<Contratista[]>([]);
  const [operaciones, setOperaciones] = useState<Operacion[]>([]);
  const [personal, setPersonal] = useState<Personal[]>([]);

  // Cargar datos iniciales
  useEffect(() => {
    loadInitialData();
  }, [profile]);

  // Cargar contratistas cuando cambia salmonera
  useEffect(() => {
    if (formData.salmonera_id) {
      loadContratistas(formData.salmonera_id);
    }
  }, [formData.salmonera_id]);

  // Cargar operaciones cuando cambia contratista
  useEffect(() => {
    if (formData.contratista_id && isPlanned) {
      loadOperaciones(formData.contratista_id);
    }
  }, [formData.contratista_id, isPlanned]);

  const loadInitialData = async () => {
    try {
      // Cargar salmoneras (solo para superuser)
      if (profile?.role === 'superuser') {
        const { data: salmonerasData } = await supabase
          .from('salmoneras')
          .select('id, nombre')
          .eq('estado', 'activa');
        setSalmoneras(salmonerasData || []);
      }

      // Preseleccionar datos según rol
      if (profile?.role === 'admin_salmonera' && profile.salmonera_id) {
        setFormData(prev => ({ ...prev, salmonera_id: profile.salmonera_id! }));
        loadContratistas(profile.salmonera_id);
      }

      if (profile?.role === 'admin_servicio' && profile.servicio_id && profile.salmonera_id) {
        setFormData(prev => ({
          ...prev,
          salmonera_id: profile.salmonera_id!,
          contratista_id: profile.servicio_id!
        }));
        loadPersonal();
      }

    } catch (error) {
      console.error('Error loading initial data:', error);
    }
  };

  const loadContratistas = async (salmoneraId: string) => {
    try {
      const { data } = await supabase
        .from('salmonera_contratista')
        .select('contratista_id')
        .eq('salmonera_id', salmoneraId);

      if (data && data.length > 0) {
        const contratistaIds = data.map(item => item.contratista_id).filter(Boolean);
        
        if (contratistaIds.length > 0) {
          const { data: contratistasData } = await supabase
            .from('contratistas')
            .select('id, nombre')
            .in('id', contratistaIds);

          setContratistas(contratistasData || []);
        }
      }
    } catch (error) {
      console.error('Error loading contratistas:', error);
      setContratistas([]);
    }
  };

  const loadOperaciones = async (contratistaId: string) => {
    try {
      const { data } = await supabase
        .from('operacion')
        .select('id, codigo, nombre, fecha_inicio')
        .eq('contratista_id', contratistaId)
        .eq('estado', 'activa')
        .order('fecha_inicio', { ascending: true });

      setOperaciones(data || []);
    } catch (error) {
      console.error('Error loading operaciones:', error);
      setOperaciones([]);
    }
  };

  const loadPersonal = async () => {
    try {
      const { data, error } = await supabase
        .from('usuario')
        .select('usuario_id, nombre, apellido, rol')
        .in('rol', ['buzo', 'supervisor']);

      if (error) {
        console.error('Error loading personal:', error);
        setPersonal([]);
        return;
      }

      // Mapear explícitamente al tipo Personal
      const personalData: Personal[] = (data || []).map(user => ({
        usuario_id: user.usuario_id,
        nombre: user.nombre || '',
        apellido: user.apellido || '',
        rol: user.rol
      }));

      setPersonal(personalData);
    } catch (error) {
      console.error('Error loading personal:', error);
      setPersonal([]);
    }
  };

  const handleTeamUpdate = (updatedTeam: any[]) => {
    setTeamMembers(updatedTeam);
    
    // Actualizar campos principales basados en el equipo
    const supervisor = updatedTeam.find(member => member.role === 'supervisor');
    const buzoPrincipal = updatedTeam.find(member => member.role === 'buzo_principal');
    
    if (supervisor) {
      setFormData(prev => ({
        ...prev,
        supervisor_id: supervisor.user_id
      }));
    }
    
    if (buzoPrincipal) {
      setFormData(prev => ({
        ...prev,
        buzo_principal_id: buzoPrincipal.user_id
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const inmersionData = {
        ...formData,
        is_independent: !isPlanned,
        operacion_id: isPlanned ? formData.operacion_id : null,
        codigo_operacion_externa: !isPlanned ? formData.codigo_operacion_externa : null,
        profundidad_max: parseFloat(formData.profundidad_max),
        estado: 'planificada',
        team_members: teamMembers // Incluir los miembros del equipo
      };

      await onSubmit(inmersionData);
    } catch (error) {
      console.error('Error creating inmersion:', error);
      toast({
        title: "Error",
        description: "No se pudo crear la inmersión",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const canShowOperacionSelector = isPlanned && formData.contratista_id && operaciones.length > 0;
  const shouldShowOperacionWarning = isPlanned && formData.contratista_id && operaciones.length === 0;

  return (
    <Card className="w-full max-w-6xl">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Nueva Inmersión</span>
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4" />
            <Switch
              checked={isPlanned}
              onCheckedChange={setIsPlanned}
              id="inmersion-type"
            />
            <Calendar className="w-4 h-4" />
          </div>
        </CardTitle>
        <div className="flex gap-2">
          <Badge variant={!isPlanned ? "default" : "secondary"}>
            {!isPlanned ? "Independiente" : "Planificada"}
          </Badge>
          {isPlanned && (
            <Badge variant="outline">
              Asociada a Operación
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Selector de Salmonera (solo superuser) */}
          {profile?.role === 'superuser' && (
            <div>
              <Label htmlFor="salmonera">Salmonera *</Label>
              <Select
                value={formData.salmonera_id}
                onValueChange={(value) => setFormData(prev => ({ ...prev, salmonera_id: value, contratista_id: '', operacion_id: '' }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar salmonera" />
                </SelectTrigger>
                <SelectContent>
                  {salmoneras.map(salmonera => (
                    <SelectItem key={salmonera.id} value={salmonera.id}>
                      {salmonera.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Selector de Contratista */}
          {(profile?.role === 'superuser' || profile?.role === 'admin_salmonera') && (
            <div>
              <Label htmlFor="contratista">Contratista *</Label>
              <Select
                value={formData.contratista_id}
                onValueChange={(value) => setFormData(prev => ({ ...prev, contratista_id: value, operacion_id: '' }))}
                disabled={!formData.salmonera_id}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar contratista" />
                </SelectTrigger>
                <SelectContent>
                  {contratistas.map(contratista => (
                    <SelectItem key={contratista.id} value={contratista.id}>
                      {contratista.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Selector de Operación o Código Externo */}
          {isPlanned ? (
            <div>
              <Label htmlFor="operacion">Operación *</Label>
              {canShowOperacionSelector ? (
                <Select
                  value={formData.operacion_id}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, operacion_id: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar operación" />
                  </SelectTrigger>
                  <SelectContent>
                    {operaciones.map(operacion => (
                      <SelectItem key={operacion.id} value={operacion.id}>
                        {operacion.codigo} - {operacion.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : shouldShowOperacionWarning ? (
                <div className="p-4 border border-yellow-200 rounded-lg bg-yellow-50">
                  <div className="flex items-center gap-2 text-yellow-800">
                    <AlertCircle className="w-4 h-4" />
                    <span className="font-medium">No hay operaciones disponibles</span>
                  </div>
                  <p className="text-sm text-yellow-700 mt-2">
                    No se encontraron operaciones planificadas para este contratista.
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => window.open('/operaciones', '_blank')}
                  >
                    Crear Operación
                  </Button>
                </div>
              ) : (
                <Input disabled placeholder="Selecciona un contratista primero" />
              )}
            </div>
          ) : (
            <div>
              <Label htmlFor="codigo_externo">Código de Operación Externa *</Label>
              <Input
                id="codigo_externo"
                value={formData.codigo_operacion_externa}
                onChange={(e) => setFormData(prev => ({ ...prev, codigo_operacion_externa: e.target.value }))}
                placeholder="Ej: EXT-2024-001"
                required
              />
            </div>
          )}

          {/* Campos básicos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="objetivo">Objetivo *</Label>
              <Input
                id="objetivo"
                value={formData.objetivo}
                onChange={(e) => setFormData(prev => ({ ...prev, objetivo: e.target.value }))}
                placeholder="Objetivo de la inmersión"
                required
              />
            </div>
            <div>
              <Label htmlFor="fecha">Fecha de Inmersión *</Label>
              <Input
                id="fecha"
                type="date"
                value={formData.fecha_inmersion}
                onChange={(e) => setFormData(prev => ({ ...prev, fecha_inmersion: e.target.value }))}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="profundidad">Profundidad Máxima (m) *</Label>
            <Input
              id="profundidad"
              type="number"
              step="0.1"
              value={formData.profundidad_max}
              onChange={(e) => setFormData(prev => ({ ...prev, profundidad_max: e.target.value }))}
              placeholder="Ej: 15.5"
              required
            />
          </div>

          {/* Gestión de Personal de Buceo */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              <Label className="text-lg font-medium">Personal de Buceo</Label>
            </div>
            
            <InmersionTeamManagerEnhanced
              inmersionId={null} // Para nuevas inmersiones
              onTeamUpdate={handleTeamUpdate}
              isCreatingNew={true}
            />
          </div>

          <div>
            <Label htmlFor="observaciones">Observaciones</Label>
            <Textarea
              id="observaciones"
              value={formData.observaciones}
              onChange={(e) => setFormData(prev => ({ ...prev, observaciones: e.target.value }))}
              placeholder="Observaciones adicionales..."
              rows={3}
            />
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Creando...' : 'Crear Inmersión'}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
