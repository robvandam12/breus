
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useOperaciones } from "@/hooks/useOperaciones";
import { useSalmoneras } from "@/hooks/useSalmoneras";
import { useContratistas } from "@/hooks/useContratistas";
import { useSitios } from "@/hooks/useSitios";
import { useEquipoBuceo } from "@/hooks/useEquipoBuceo";

interface AnexoBravoWizardProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  defaultOperacionId?: string;
  type?: 'simple' | 'completo';
}

export const AnexoBravoWizard = ({ 
  onSubmit, 
  onCancel, 
  defaultOperacionId,
  type = 'simple' 
}: AnexoBravoWizardProps) => {
  const [formData, setFormData] = useState({
    operacion_id: defaultOperacionId || '',
    codigo: '',
    fecha: new Date().toISOString().split('T')[0],
    supervisor: '',
    empresa_nombre: '',
    lugar_faena: '',
    buzo_o_empresa_nombre: '',
    asistente_buzo_nombre: '',
    observaciones_generales: ''
  });

  const { operaciones } = useOperaciones();
  const { salmoneras } = useSalmoneras();
  const { contratistas } = useContratistas();
  const { sitios } = useSitios();
  const { equipos } = useEquipoBuceo();

  const selectedOperacion = operaciones.find(op => op.id === formData.operacion_id);

  const handleOperacionChange = (operacionId: string) => {
    const operacion = operaciones.find(op => op.id === operacionId);
    if (operacion) {
      // Auto-populate fields based on operation
      const salmonera = salmoneras.find(s => s.id === operacion.salmonera_id);
      const contratista = contratistas.find(c => c.id === operacion.contratista_id);
      const sitio = sitios.find(s => s.id === operacion.sitio_id);
      
      setFormData(prev => ({
        ...prev,
        operacion_id: operacionId,
        codigo: `AB-${operacion.codigo}-${Date.now()}`,
        empresa_nombre: salmonera?.nombre || '',
        lugar_faena: sitio?.nombre || '',
        buzo_o_empresa_nombre: contratista?.nombre || ''
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      form_version: type === 'completo' ? 2 : 1,
      estado: 'borrador',
      firmado: false
    });
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>
          {type === 'completo' ? 'Nuevo Anexo Bravo Completo' : 'Nuevo Anexo Bravo'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="operacion">Operación *</Label>
              <Select
                value={formData.operacion_id}
                onValueChange={handleOperacionChange}
                disabled={!!defaultOperacionId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar operación..." />
                </SelectTrigger>
                <SelectContent>
                  {operaciones.map((operacion) => (
                    <SelectItem key={operacion.id} value={operacion.id}>
                      {operacion.nombre} - {operacion.codigo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="codigo">Código *</Label>
              <Input
                id="codigo"
                value={formData.codigo}
                onChange={(e) => setFormData(prev => ({ ...prev, codigo: e.target.value }))}
                required
                readOnly
              />
            </div>

            <div>
              <Label htmlFor="fecha">Fecha *</Label>
              <Input
                id="fecha"
                type="date"
                value={formData.fecha}
                onChange={(e) => setFormData(prev => ({ ...prev, fecha: e.target.value }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="supervisor">Supervisor *</Label>
              <Input
                id="supervisor"
                value={formData.supervisor}
                onChange={(e) => setFormData(prev => ({ ...prev, supervisor: e.target.value }))}
                placeholder="Nombre del supervisor"
                required
              />
            </div>

            <div>
              <Label htmlFor="empresa">Empresa (Salmonera)</Label>
              <Input
                id="empresa"
                value={formData.empresa_nombre}
                readOnly
                className="bg-gray-50"
              />
            </div>

            <div>
              <Label htmlFor="lugar_faena">Lugar de Faena (Sitio)</Label>
              <Input
                id="lugar_faena"
                value={formData.lugar_faena}
                readOnly
                className="bg-gray-50"
              />
            </div>

            <div>
              <Label htmlFor="buzo_empresa">Buzo o Empresa de Buceo (Contratista)</Label>
              <Input
                id="buzo_empresa"
                value={formData.buzo_o_empresa_nombre}
                readOnly
                className="bg-gray-50"
              />
            </div>

            <div>
              <Label htmlFor="asistente">Asistente de Buzo</Label>
              <Input
                id="asistente"
                value={formData.asistente_buzo_nombre}
                onChange={(e) => setFormData(prev => ({ ...prev, asistente_buzo_nombre: e.target.value }))}
                placeholder="Nombre del asistente (campo libre)"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="observaciones">Observaciones Generales</Label>
            <Textarea
              id="observaciones"
              value={formData.observaciones_generales}
              onChange={(e) => setFormData(prev => ({ ...prev, observaciones_generales: e.target.value }))}
              placeholder="Observaciones adicionales..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">
              Crear Anexo Bravo
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
