
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface CreateOperacionFormProps {
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
}

interface Centro {
  id: string;
  nombre: string;
  salmonera_id: string;
}

interface Contratista {
  id: string;
  nombre: string;
}

export const CreateOperacionForm = ({ onSubmit, onCancel }: CreateOperacionFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [centros, setCentros] = useState<Centro[]>([]);
  const [contratistas, setContratistas] = useState<Contratista[]>([]);
  const [loadingCentros, setLoadingCentros] = useState(false);
  const [loadingContratistas, setLoadingContratistas] = useState(false);
  
  const [formData, setFormData] = useState({
    codigo: '',
    nombre: '',
    fecha_inicio: '',
    fecha_fin: '',
    estado: 'activa' as 'activa' | 'pausada' | 'completada' | 'cancelada',
    centro_id: '',
    contratista_id: '',
    tareas: ''
  });

  useEffect(() => {
    loadCentros();
    loadContratistas();
  }, []);

  const loadCentros = async () => {
    setLoadingCentros(true);
    try {
      const { data, error } = await supabase
        .from('centros')
        .select('id, nombre, salmonera_id')
        .eq('estado', 'activo')
        .order('nombre');

      if (error) throw error;
      setCentros(data || []);
    } catch (error) {
      console.error('Error loading centros:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los centros",
        variant: "destructive",
      });
    } finally {
      setLoadingCentros(false);
    }
  };

  const loadContratistas = async () => {
    setLoadingContratistas(true);
    try {
      const { data, error } = await supabase
        .from('contratistas')
        .select('id, nombre')
        .eq('estado', 'activo')
        .order('nombre');

      if (error) throw error;
      setContratistas(data || []);
    } catch (error) {
      console.error('Error loading contratistas:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los contratistas",
        variant: "destructive",
      });
    } finally {
      setLoadingContratistas(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Obtener salmonera_id del centro seleccionado
      const selectedCentro = centros.find(c => c.id === formData.centro_id);
      
      const operacionData = {
        ...formData,
        salmonera_id: selectedCentro?.salmonera_id || null,
        contratista_id: formData.contratista_id || null
      };

      await onSubmit(operacionData);
    } catch (error) {
      console.error('Error creating operacion:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle>Nueva Operación</CardTitle>
        <p className="text-sm text-gray-600">
          Crear una nueva operación de buceo
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="codigo">Código *</Label>
              <Input
                id="codigo"
                value={formData.codigo}
                onChange={(e) => setFormData(prev => ({ ...prev, codigo: e.target.value }))}
                placeholder="Ej: OP-2024-001"
                required
              />
            </div>
            <div>
              <Label htmlFor="estado">Estado</Label>
              <Select
                value={formData.estado}
                onValueChange={(value: 'activa' | 'pausada' | 'completada' | 'cancelada') => 
                  setFormData(prev => ({ ...prev, estado: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="activa">Activa</SelectItem>
                  <SelectItem value="pausada">Pausada</SelectItem>
                  <SelectItem value="completada">Completada</SelectItem>
                  <SelectItem value="cancelada">Cancelada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="nombre">Nombre de la Operación *</Label>
            <Input
              id="nombre"
              value={formData.nombre}
              onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
              placeholder="Nombre descriptivo de la operación"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="centro">Centro *</Label>
              <Select
                value={formData.centro_id}
                onValueChange={(value) => setFormData(prev => ({ ...prev, centro_id: value }))}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder={loadingCentros ? "Cargando..." : "Seleccionar centro"} />
                </SelectTrigger>
                <SelectContent>
                  {centros.map((centro) => (
                    <SelectItem key={centro.id} value={centro.id}>
                      {centro.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="contratista">Contratista</Label>
              <Select
                value={formData.contratista_id}
                onValueChange={(value) => setFormData(prev => ({ ...prev, contratista_id: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder={loadingContratistas ? "Cargando..." : "Seleccionar contratista"} />
                </SelectTrigger>
                <SelectContent>
                  {contratistas.map((contratista) => (
                    <SelectItem key={contratista.id} value={contratista.id}>
                      {contratista.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fecha_inicio">Fecha de Inicio *</Label>
              <Input
                id="fecha_inicio"
                type="date"
                value={formData.fecha_inicio}
                onChange={(e) => setFormData(prev => ({ ...prev, fecha_inicio: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="fecha_fin">Fecha de Fin</Label>
              <Input
                id="fecha_fin"
                type="date"
                value={formData.fecha_fin}
                onChange={(e) => setFormData(prev => ({ ...prev, fecha_fin: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="tareas">Descripción de Tareas</Label>
            <Textarea
              id="tareas"
              value={formData.tareas}
              onChange={(e) => setFormData(prev => ({ ...prev, tareas: e.target.value }))}
              placeholder="Descripción detallada de las tareas a realizar..."
              rows={4}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              type="submit" 
              disabled={isSubmitting} 
              className="flex-1"
            >
              {isSubmitting ? 'Creando...' : 'Crear Operación'}
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
