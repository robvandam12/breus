
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { X, FileText } from "lucide-react";
import { BitacoraBuzoFormData } from "@/hooks/useBitacorasBuzo";
import { useToast } from "@/hooks/use-toast";
import { EnterpriseSelector } from "@/components/common/EnterpriseSelector";
import { EnterpriseSelectionResult } from "@/hooks/useEnterpriseContext";

interface CreateBitacoraBuzoFormCompleteWithInmersionProps {
  onSubmit: (data: BitacoraBuzoFormData) => Promise<void>;
  onCancel: () => void;
}

export const CreateBitacoraBuzoFormCompleteWithInmersion = ({ 
  onSubmit, 
  onCancel 
}: CreateBitacoraBuzoFormCompleteWithInmersionProps) => {
  const { toast } = useToast();
  const [enterpriseSelection, setEnterpriseSelection] = useState<EnterpriseSelectionResult | null>(null);
  
  const [formData, setFormData] = useState({
    codigo: '',
    fecha: new Date().toISOString().split('T')[0],
    buzo: '',
    supervisor_nombre: '',
    inmersion_id: '',
    profundidad_maxima: 0,
    trabajos_realizados: '',
    estado_fisico_post: 'normal',
    objetivo_proposito: '',
    condamb_temp_agua_c: 0,
    condamb_visibilidad_fondo_mts: 0,
    datostec_hora_dejo_superficie: '',
    datostec_hora_llegada_superficie: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.codigo || !formData.buzo || !formData.trabajos_realizados) {
      toast({
        title: "Campos requeridos",
        description: "Código, buzo y trabajos realizados son obligatorios.",
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
      const bitacoraData: BitacoraBuzoFormData = {
        ...formData,
        empresa_nombre: enterpriseSelection.salmonera_id, // Mapear correctamente
        // Remover company_id ya que no existe en BitacoraBuzoFormData
      };

      await onSubmit(bitacoraData);
    } catch (error) {
      console.error('Error creating bitacora buzo:', error);
      toast({
        title: "Error",
        description: "No se pudo crear la bitácora. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Card className="ios-card max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-teal-600" />
            Nueva Bitácora Buzo
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información Básica */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Información Básica</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="codigo">Código *</Label>
                <Input
                  id="codigo"
                  value={formData.codigo}
                  onChange={(e) => handleChange('codigo', e.target.value)}
                  className="ios-input"
                  placeholder="Ej: BB-2024-001"
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

              <div>
                <Label htmlFor="buzo">Buzo *</Label>
                <Input
                  id="buzo"
                  value={formData.buzo}
                  onChange={(e) => handleChange('buzo', e.target.value)}
                  className="ios-input"
                  placeholder="Nombre del buzo"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="supervisor_nombre">Supervisor</Label>
                <Input
                  id="supervisor_nombre"
                  value={formData.supervisor_nombre}
                  onChange={(e) => handleChange('supervisor_nombre', e.target.value)}
                  className="ios-input"
                  placeholder="Nombre del supervisor"
                />
              </div>

              <div>
                <Label htmlFor="profundidad_maxima">Profundidad Máxima (m)</Label>
                <Input
                  id="profundidad_maxima"
                  type="number"
                  step="0.1"
                  value={formData.profundidad_maxima}
                  onChange={(e) => handleChange('profundidad_maxima', parseFloat(e.target.value) || 0)}
                  className="ios-input"
                />
              </div>
            </div>
          </div>

          <EnterpriseSelector
            onSelectionChange={setEnterpriseSelection}
            showCard={false}
            title="Contexto Empresarial"
            description="Seleccione las empresas involucradas en esta bitácora"
          />

          {/* Condiciones Ambientales */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Condiciones Ambientales</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="condamb_temp_agua_c">Temperatura del Agua (°C)</Label>
                <Input
                  id="condamb_temp_agua_c"
                  type="number"
                  step="0.1"
                  value={formData.condamb_temp_agua_c}
                  onChange={(e) => handleChange('condamb_temp_agua_c', parseFloat(e.target.value) || 0)}
                  className="ios-input"
                />
              </div>

              <div>
                <Label htmlFor="condamb_visibilidad_fondo_mts">Visibilidad en el Fondo (m)</Label>
                <Input
                  id="condamb_visibilidad_fondo_mts"
                  type="number"
                  step="0.1"
                  value={formData.condamb_visibilidad_fondo_mts}
                  onChange={(e) => handleChange('condamb_visibilidad_fondo_mts', parseFloat(e.target.value) || 0)}
                  className="ios-input"
                />
              </div>
            </div>
          </div>

          {/* Tiempos */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Tiempos de Inmersión</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="datostec_hora_dejo_superficie">Hora de Salida de Superficie</Label>
                <Input
                  id="datostec_hora_dejo_superficie"
                  type="time"
                  value={formData.datostec_hora_dejo_superficie}
                  onChange={(e) => handleChange('datostec_hora_dejo_superficie', e.target.value)}
                  className="ios-input"
                />
              </div>

              <div>
                <Label htmlFor="datostec_hora_llegada_superficie">Hora de Llegada a Superficie</Label>
                <Input
                  id="datostec_hora_llegada_superficie"
                  type="time"
                  value={formData.datostec_hora_llegada_superficie}
                  onChange={(e) => handleChange('datostec_hora_llegada_superficie', e.target.value)}
                  className="ios-input"
                />
              </div>
            </div>
          </div>

          {/* Trabajo Realizado */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Trabajo y Resultados</h3>
            <div>
              <Label htmlFor="objetivo_proposito">Objetivo/Propósito</Label>
              <Textarea
                id="objetivo_proposito"
                value={formData.objetivo_proposito}
                onChange={(e) => handleChange('objetivo_proposito', e.target.value)}
                className="ios-input min-h-[80px]"
                placeholder="Describe el objetivo de la inmersión..."
              />
            </div>

            <div>
              <Label htmlFor="trabajos_realizados">Trabajos Realizados *</Label>
              <Textarea
                id="trabajos_realizados"
                value={formData.trabajos_realizados}
                onChange={(e) => handleChange('trabajos_realizados', e.target.value)}
                className="ios-input min-h-[120px]"
                placeholder="Describe detalladamente los trabajos realizados..."
                required
              />
            </div>

            <div>
              <Label htmlFor="estado_fisico_post">Estado Físico Post-Inmersión</Label>
              <select
                id="estado_fisico_post"
                value={formData.estado_fisico_post}
                onChange={(e) => handleChange('estado_fisico_post', e.target.value)}
                className="ios-input w-full"
              >
                <option value="normal">Normal</option>
                <option value="fatiga_leve">Fatiga Leve</option>
                <option value="fatiga_moderada">Fatiga Moderada</option>
                <option value="malestar">Malestar</option>
                <option value="sintomas_descompresion">Síntomas de Descompresión</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
              className="ios-button"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="ios-button bg-teal-600 hover:bg-teal-700 text-white"
            >
              {isLoading ? 'Creando...' : 'Crear Bitácora'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
