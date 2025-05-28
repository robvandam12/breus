
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

interface CreateEquipoFormEnhancedProps {
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  salmoneraId?: string;
  contratistaId?: string;
}

export const CreateEquipoFormEnhanced = ({ 
  onSubmit, 
  onCancel, 
  salmoneraId, 
  contratistaId 
}: CreateEquipoFormEnhancedProps) => {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Determine which empresa_id to use based on available IDs
      const empresa_id = salmoneraId || contratistaId;
      const tipo_empresa = salmoneraId ? 'salmonera' : 'contratista';
      
      await onSubmit({
        ...formData,
        empresa_id,
        tipo_empresa,
        activo: true
      });
    } catch (error) {
      console.error('Error creating equipo:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-600" />
          Crear Nuevo Equipo de Buceo
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="nombre">Nombre del Equipo *</Label>
            <Input
              id="nombre"
              value={formData.nombre}
              onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
              placeholder="Nombre del equipo de buceo"
              required
            />
          </div>

          <div>
            <Label htmlFor="descripcion">Descripción</Label>
            <Textarea
              id="descripcion"
              value={formData.descripcion}
              onChange={(e) => setFormData(prev => ({ ...prev, descripcion: e.target.value }))}
              placeholder="Descripción del equipo..."
              rows={3}
            />
          </div>

          <div className="text-sm text-zinc-600 p-3 bg-zinc-50 rounded-lg">
            <p><strong>Empresa:</strong> {salmoneraId ? 'Salmonera' : 'Contratista'}</p>
            <p className="text-xs mt-1">
              Este equipo será creado para la {salmoneraId ? 'salmonera' : 'empresa contratista'} 
              asociada a esta operación y se asignará automáticamente.
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              type="submit" 
              disabled={!formData.nombre.trim() || isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? 'Creando...' : 'Crear y Asignar Equipo'}
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
