
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar, X } from "lucide-react";
import { useOperaciones } from "@/hooks/useOperaciones";
import { useSitios } from "@/hooks/useSitios";
import { useToast } from "@/hooks/use-toast";
import { EnterpriseSelector } from "@/components/common/EnterpriseSelector";
import { EnterpriseSelectionResult } from "@/hooks/useEnterpriseContext";

interface CreateOperacionFormProps {
  onClose: () => void;
}

export const CreateOperacionForm = ({ onClose }: CreateOperacionFormProps) => {
  const { toast } = useToast();
  const { createOperacion } = useOperaciones();
  const { sitios } = useSitios();
  
  const [formData, setFormData] = useState({
    codigo: '',
    nombre: '',
    sitio_id: '',
    fecha_inicio: '',
    fecha_fin: '',
    tareas: ''
  });
  
  const [enterpriseSelection, setEnterpriseSelection] = useState<EnterpriseSelectionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.codigo || !formData.nombre || !formData.fecha_inicio) {
      toast({
        title: "Campos requeridos",
        description: "Código, nombre y fecha de inicio son obligatorios.",
        variant: "destructive",
      });
      return;
    }

    if (!enterpriseSelection) {
      toast({
        title: "Selección empresarial requerida",
        description: "Debe seleccionar el contexto empresarial para la operación.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const operacionData = {
        codigo: formData.codigo,
        nombre: formData.nombre,
        sitio_id: formData.sitio_id || null,
        salmonera_id: enterpriseSelection.salmonera_id,
        contratista_id: enterpriseSelection.contratista_id,
        fecha_inicio: formData.fecha_inicio,
        fecha_fin: formData.fecha_fin || null,
        tareas: formData.tareas || null,
        estado: 'activa' as const
      };

      await createOperacion(operacionData);
      
      toast({
        title: "Operación creada",
        description: `La operación "${formData.nombre}" ha sido creada exitosamente.`,
      });
      
      onClose();
    } catch (error) {
      console.error('Error creating operation:', error);
      toast({
        title: "Error",
        description: "No se pudo crear la operación. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Filtrar sitios según la salmonera seleccionada
  const filteredSitios = sitios.filter(sitio => 
    !enterpriseSelection?.salmonera_id || sitio.salmonera_id === enterpriseSelection.salmonera_id
  );

  return (
    <Card className="ios-card max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            Nueva Operación
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="codigo">Código *</Label>
              <Input
                id="codigo"
                value={formData.codigo}
                onChange={(e) => handleChange('codigo', e.target.value)}
                className="ios-input"
                placeholder="Ej: OP-2024-001"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="sitio_id">Sitio</Label>
              <select
                id="sitio_id"
                value={formData.sitio_id}
                onChange={(e) => handleChange('sitio_id', e.target.value)}
                className="ios-input w-full"
              >
                <option value="">Seleccionar sitio</option>
                {filteredSitios.map(sitio => (
                  <option key={sitio.id} value={sitio.id}>
                    {sitio.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <Label htmlFor="nombre">Nombre de la Operación *</Label>
            <Input
              id="nombre"
              value={formData.nombre}
              onChange={(e) => handleChange('nombre', e.target.value)}
              className="ios-input"
              placeholder="Describe la operación..."
              required
            />
          </div>

          <EnterpriseSelector
            onSelectionChange={setEnterpriseSelection}
            showCard={false}
            title="Contexto Empresarial"
            description="Seleccione las empresas involucradas en esta operación"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fecha_inicio">Fecha de Inicio *</Label>
              <Input
                id="fecha_inicio"
                type="date"
                value={formData.fecha_inicio}
                onChange={(e) => handleChange('fecha_inicio', e.target.value)}
                className="ios-input"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="fecha_fin">Fecha de Fin</Label>
              <Input
                id="fecha_fin"
                type="date"
                value={formData.fecha_fin}
                onChange={(e) => handleChange('fecha_fin', e.target.value)}
                className="ios-input"
                min={formData.fecha_inicio}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="tareas">Descripción de Tareas</Label>
            <Textarea
              id="tareas"
              value={formData.tareas}
              onChange={(e) => handleChange('tareas', e.target.value)}
              className="ios-input min-h-[100px]"
              placeholder="Describa las tareas a realizar en esta operación..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="ios-button"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="ios-button bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isLoading ? 'Creando...' : 'Crear Operación'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
