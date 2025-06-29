
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

interface CreateOperacionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  enterpriseContext?: any;
}

export const CreateOperacionDialog = ({ isOpen, onClose, enterpriseContext }: CreateOperacionDialogProps) => {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [centros, setCentros] = useState<any[]>([]);
  const [supervisores, setSupervisores] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    codigo: '',
    nombre: '',
    tareas: '',
    fecha_inicio: '',
    fecha_fin: '',
    centro_id: '',
    supervisor_asignado_id: ''
  });

  React.useEffect(() => {
    if (isOpen && enterpriseContext) {
      loadCentros();
      loadSupervisores();
    }
  }, [isOpen, enterpriseContext]);

  const loadCentros = async () => {
    if (!enterpriseContext) return;

    try {
      const empresaId = enterpriseContext.salmonera_id || enterpriseContext.contratista_id;
      if (!empresaId) return;

      // Solo salmoneras tienen centros propios
      if (enterpriseContext.salmonera_id) {
        const { data } = await supabase
          .from('centros')
          .select('id, nombre')
          .eq('salmonera_id', empresaId)
          .eq('estado', 'activo')
          .order('nombre');
        
        setCentros(data || []);
      } else {
        // Contratistas pueden ver todos los centros
        const { data } = await supabase
          .from('centros')
          .select('id, nombre')
          .eq('estado', 'activo')
          .order('nombre');
        
        setCentros(data || []);
      }
    } catch (error) {
      console.error('Error loading centros:', error);
    }
  };

  const loadSupervisores = async () => {
    if (!enterpriseContext) return;

    try {
      const empresaId = enterpriseContext.salmonera_id || enterpriseContext.contratista_id;
      const empresaTipo = enterpriseContext.salmonera_id ? 'salmonera_id' : 'servicio_id';

      const { data } = await supabase
        .from('usuario')
        .select('usuario_id, nombre, apellido')
        .eq(empresaTipo, empresaId)
        .in('rol', ['supervisor', 'admin_salmonera', 'admin_servicio'])
        .order('nombre');

      setSupervisores(data || []);
    } catch (error) {
      console.error('Error loading supervisores:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.codigo || !formData.nombre || !formData.fecha_inicio) {
      toast({
        title: "Error",
        description: "Por favor complete los campos obligatorios",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const empresaId = enterpriseContext.salmonera_id || enterpriseContext.contratista_id;
      const empresaTipo = enterpriseContext.salmonera_id ? 'salmonera' : 'contratista';

      const operacionData = {
        codigo: formData.codigo,
        nombre: formData.nombre,
        tareas: formData.tareas || null,
        fecha_inicio: formData.fecha_inicio,
        fecha_fin: formData.fecha_fin || null,
        centro_id: formData.centro_id || null,
        supervisor_asignado_id: formData.supervisor_asignado_id || null,
        estado: 'activa',
        estado_aprobacion: 'pendiente',
        company_id: empresaId,
        company_type: empresaTipo,
        ...(empresaTipo === 'salmonera' ? { salmonera_id: empresaId } : { contratista_id: empresaId })
      };

      const { error } = await supabase
        .from('operacion')
        .insert([operacionData]);

      if (error) throw error;

      toast({
        title: "Operación creada",
        description: "La operación ha sido creada exitosamente",
      });

      queryClient.invalidateQueries({ queryKey: ['operaciones'] });
      onClose();
      
      // Reset form
      setFormData({
        codigo: '',
        nombre: '',
        tareas: '',
        fecha_inicio: '',
        fecha_fin: '',
        centro_id: '',
        supervisor_asignado_id: ''
      });

    } catch (error) {
      console.error('Error creating operacion:', error);
      toast({
        title: "Error",
        description: "No se pudo crear la operación",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Nueva Operación</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
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
              <Label htmlFor="nombre">Nombre *</Label>
              <Input
                id="nombre"
                value={formData.nombre}
                onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
                placeholder="Nombre de la operación"
                required
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
              rows={3}
            />
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
                min={formData.fecha_inicio}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="centro">Centro</Label>
              <Select
                value={formData.centro_id}
                onValueChange={(value) => setFormData(prev => ({ ...prev, centro_id: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar centro" />
                </SelectTrigger>
                <SelectContent>
                  {centros.map(centro => (
                    <SelectItem key={centro.id} value={centro.id}>
                      {centro.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="supervisor">Supervisor Asignado</Label>
              <Select
                value={formData.supervisor_asignado_id}
                onValueChange={(value) => setFormData(prev => ({ ...prev, supervisor_asignado_id: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar supervisor" />
                </SelectTrigger>
                <SelectContent>
                  {supervisores.map(supervisor => (
                    <SelectItem key={supervisor.usuario_id} value={supervisor.usuario_id}>
                      {supervisor.nombre} {supervisor.apellido}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creando...' : 'Crear Operación'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
