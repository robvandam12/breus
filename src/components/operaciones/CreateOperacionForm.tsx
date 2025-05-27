
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useOperaciones } from '@/hooks/useOperaciones';
import { useSitios } from '@/hooks/useSitios';
import { useContratistas } from '@/hooks/useContratistas';
import { useEquiposBuceo } from '@/hooks/useEquiposBuceo';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { AlertTriangle } from 'lucide-react';

interface CreateOperacionFormProps {
  onClose: () => void;
}

export const CreateOperacionForm: React.FC<CreateOperacionFormProps> = ({ onClose }) => {
  const { profile } = useAuth();
  const { createOperacion } = useOperaciones();
  const { sitios } = useSitios();
  const { contratistas } = useContratistas();
  const { equipos } = useEquiposBuceo();
  
  const [formData, setFormData] = useState({
    nombre: '',
    codigo: '',
    tareas: '',
    fecha_inicio: '',
    fecha_fin: '',
    sitio_id: '',
    contratista_id: '',
    equipo_buceo_id: '',
    estado: 'activa' as const
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validación de equipo de buceo
    if (!formData.equipo_buceo_id) {
      toast({
        title: "Error de validación",
        description: "Debe asignar un equipo de buceo antes de crear la operación. Los documentos requieren conocer todos los buzos y supervisores.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const operacionData = {
        ...formData,
        salmonera_id: profile?.salmonera_id || null,
        servicio_id: profile?.servicio_id || null,
      };
      
      await createOperacion(operacionData);
      toast({
        title: "Operación creada",
        description: "La operación ha sido creada exitosamente.",
      });
      onClose();
    } catch (error) {
      console.error('Error creating operacion:', error);
      toast({
        title: "Error",
        description: "No se pudo crear la operación.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Crear Nueva Operación</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nombre">Nombre de la Operación</Label>
              <Input
                id="nombre"
                value={formData.nombre}
                onChange={(e) => handleInputChange('nombre', e.target.value)}
                placeholder="Nombre descriptivo"
                required
              />
            </div>

            <div>
              <Label htmlFor="codigo">Código</Label>
              <Input
                id="codigo"
                value={formData.codigo}
                onChange={(e) => handleInputChange('codigo', e.target.value)}
                placeholder="OP-001"
                required
              />
            </div>

            <div>
              <Label htmlFor="fecha_inicio">Fecha de Inicio</Label>
              <Input
                id="fecha_inicio"
                type="date"
                value={formData.fecha_inicio}
                onChange={(e) => handleInputChange('fecha_inicio', e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="fecha_fin">Fecha de Fin</Label>
              <Input
                id="fecha_fin"
                type="date"
                value={formData.fecha_fin}
                onChange={(e) => handleInputChange('fecha_fin', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="sitio_id">Sitio</Label>
              <Select value={formData.sitio_id} onValueChange={(value) => handleInputChange('sitio_id', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar sitio" />
                </SelectTrigger>
                <SelectContent>
                  {sitios.map((sitio) => (
                    <SelectItem key={sitio.id} value={sitio.id}>
                      {sitio.nombre} - {sitio.codigo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="contratista_id">Contratista</Label>
              <Select value={formData.contratista_id} onValueChange={(value) => handleInputChange('contratista_id', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar contratista" />
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

            <div className="md:col-span-2">
              <Label htmlFor="equipo_buceo_id">Equipo de Buceo *</Label>
              <Select 
                value={formData.equipo_buceo_id} 
                onValueChange={(value) => handleInputChange('equipo_buceo_id', value)}
                required
              >
                <SelectTrigger className={!formData.equipo_buceo_id ? "border-red-300" : ""}>
                  <SelectValue placeholder="Seleccionar equipo de buceo" />
                </SelectTrigger>
                <SelectContent>
                  {equipos.map((equipo) => (
                    <SelectItem key={equipo.id} value={equipo.id}>
                      {equipo.nombre} - {equipo.descripcion}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {!formData.equipo_buceo_id && (
                <div className="flex items-center gap-2 mt-2 text-sm text-red-600">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Requerido para crear documentos (HPT, Anexo Bravo)</span>
                </div>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="tareas">Descripción de Tareas</Label>
            <Textarea
              id="tareas"
              value={formData.tareas}
              onChange={(e) => handleInputChange('tareas', e.target.value)}
              placeholder="Describe las tareas a realizar en esta operación..."
              rows={4}
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creando...' : 'Crear Operación'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
