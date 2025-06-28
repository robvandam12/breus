
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { X, FileText } from "lucide-react";
import { useBitacorasSupervisor, BitacoraSupervisorFormData } from "@/hooks/useBitacorasSupervisor";
import { useToast } from "@/hooks/use-toast";
import { EnterpriseSelector } from "@/components/common/EnterpriseSelector";
import { EnterpriseSelectionResult } from "@/hooks/useEnterpriseContext";

interface CreateBitacoraSupervisorFormBasicProps {
  inmersionId: string;
  onClose: () => void;
}

export const CreateBitacoraSupervisorFormBasic = ({ 
  inmersionId, 
  onClose 
}: CreateBitacoraSupervisorFormBasicProps) => {
  const { toast } = useToast();
  const { createBitacoraSupervisor } = useBitacorasSupervisor();
  const [enterpriseSelection, setEnterpriseSelection] = useState<EnterpriseSelectionResult | null>(null);
  
  const [formData, setFormData] = useState({
    codigo: '',
    fecha: new Date().toISOString().split('T')[0],
    supervisor: '',
    desarrollo_inmersion: '',
    evaluacion_general: '',
    incidentes: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.codigo || !formData.supervisor || !formData.desarrollo_inmersion || !formData.evaluacion_general) {
      toast({
        title: "Campos requeridos",
        description: "Todos los campos obligatorios deben ser completados.",
        variant: "destructive",
      });
      return;
    }

    if (!enterpriseSelection) {
      toast({
        title: "Selección empresarial requerida",
        description: "Debe seleccionar el contexto empresarial para la bitácora.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const bitacoraData: BitacoraSupervisorFormData = {
        ...formData,
        inmersion_id: inmersionId,
        fecha: formData.fecha,
        company_id: enterpriseSelection.salmonera_id,
        company_type: 'salmonera'
      };

      await createBitacoraSupervisor(bitacoraData);
      
      toast({
        title: "Bitácora creada",
        description: "La bitácora de supervisor ha sido creada exitosamente.",
      });
      
      onClose();
    } catch (error) {
      console.error('Error creating bitacora supervisor:', error);
      toast({
        title: "Error",
        description: "No se pudo crear la bitácora. Inténtalo de nuevo.",
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

  return (
    <Card className="ios-card max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Nueva Bitácora Supervisor
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
                placeholder="Ej: BS-2024-001"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="fecha">Fecha *</Label>
              <Input
                id="fecha"
                type="date"
                value={formData.fecha}
                onChange={(e) => handleChange('fecha', e.target.value)}
                className="ios-input"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="supervisor">Supervisor *</Label>
            <Input
              id="supervisor"
              value={formData.supervisor}
              onChange={(e) => handleChange('supervisor', e.target.value)}
              className="ios-input"
              placeholder="Nombre del supervisor"
              required
            />
          </div>

          <EnterpriseSelector
            onSelectionChange={setEnterpriseSelection}
            showCard={false}
            title="Contexto Empresarial"
            description="Seleccione las empresas involucradas en esta bitácora"
          />

          <div>
            <Label htmlFor="desarrollo_inmersion">Desarrollo de la Inmersión *</Label>
            <Textarea
              id="desarrollo_inmersion"
              value={formData.desarrollo_inmersion}
              onChange={(e) => handleChange('desarrollo_inmersion', e.target.value)}
              className="ios-input min-h-[100px]"
              placeholder="Describa el desarrollo de la inmersión..."
              required
            />
          </div>

          <div>
            <Label htmlFor="evaluacion_general">Evaluación General *</Label>
            <Textarea
              id="evaluacion_general"
              value={formData.evaluacion_general}
              onChange={(e) => handleChange('evaluacion_general', e.target.value)}
              className="ios-input min-h-[80px]"
              placeholder="Evaluación general de la inmersión..."
              required
            />
          </div>

          <div>
            <Label htmlFor="incidentes">Incidentes</Label>
            <Textarea
              id="incidentes"
              value={formData.incidentes}
              onChange={(e) => handleChange('incidentes', e.target.value)}
              className="ios-input min-h-[80px]"
              placeholder="Describa cualquier incidente ocurrido..."
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
              {isLoading ? 'Creando...' : 'Crear Bitácora'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
