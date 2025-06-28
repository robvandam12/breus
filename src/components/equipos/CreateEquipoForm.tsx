
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Users } from "lucide-react";
import { EnterpriseSelector } from "@/components/common/EnterpriseSelector";
import { EnterpriseSelectionResult } from "@/hooks/useEnterpriseContext";

interface CreateEquipoFormProps {
  onSubmit: (data: { 
    nombre: string; 
    descripcion: string; 
    empresa_id: string; 
    tipo_empresa: 'salmonera' | 'contratista';
    salmonera_id: string;
    contratista_id?: string;
  }) => Promise<void>;
  onCancel: () => void;
  salmoneraId?: string;
}

export const CreateEquipoForm = ({ onSubmit, onCancel, salmoneraId }: CreateEquipoFormProps) => {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: ''
  });
  const [enterpriseSelection, setEnterpriseSelection] = useState<EnterpriseSelectionResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!enterpriseSelection) {
      return;
    }
    
    setIsSubmitting(true);
    try {
      // Determinar empresa principal basada en el contexto
      const empresa_id = enterpriseSelection.contratista_id || enterpriseSelection.salmonera_id;
      const tipo_empresa = enterpriseSelection.contratista_id ? 'contratista' : 'salmonera';
      
      await onSubmit({
        ...formData,
        empresa_id,
        tipo_empresa,
        salmonera_id: enterpriseSelection.salmonera_id,
        contratista_id: enterpriseSelection.contratista_id || undefined
      });
    } catch (error) {
      console.error('Error creating equipo:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const canSubmit = formData.nombre.trim() && enterpriseSelection && !isSubmitting;

  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-600" />
          Crear Equipo de Buceo
        </DialogTitle>
      </DialogHeader>
      
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

        <EnterpriseSelector
          onSelectionChange={setEnterpriseSelection}
          showCard={false}
          title="Asignación Empresarial"
          description="El equipo será asignado a las empresas seleccionadas"
        />

        <div className="flex gap-3 pt-4">
          <Button 
            type="submit" 
            disabled={!canSubmit}
            className="flex-1"
          >
            {isSubmitting ? 'Creando...' : 'Crear Equipo'}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        </div>
      </form>
    </>
  );
};
