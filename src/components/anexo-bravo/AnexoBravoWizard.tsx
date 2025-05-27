
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { FileCheck, Calendar, Users, CheckSquare, FileText } from "lucide-react";
import { useOperaciones } from "@/hooks/useOperaciones";
import { useEquiposBuceoEnhanced } from "@/hooks/useEquiposBuceoEnhanced";
import { useSitios } from "@/hooks/useSitios";
import { useContratistas } from "@/hooks/useContratistas";

interface AnexoBravoWizardProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  defaultOperacionId?: string;
  type?: 'simple' | 'complete';
}

export const AnexoBravoWizard = ({ onSubmit, onCancel, defaultOperacionId, type = 'simple' }: AnexoBravoWizardProps) => {
  const { operaciones } = useOperaciones();
  const { equipos } = useEquiposBuceoEnhanced();
  const { sitios } = useSitios();
  const { contratistas } = useContratistas();

  const [formData, setFormData] = useState({
    operacion_id: defaultOperacionId || '',
    codigo: '',
    supervisor: '',
    jefe_centro: '',
    empresa_nombre: '',
    lugar_faena: '',
    buzo_o_empresa_nombre: '',
    asistente_buzo_nombre: '',
    fecha_verificacion: new Date().toISOString().split('T')[0],
    observaciones_generales: '',
    checklist_items: type === 'complete' ? [
      'Equipos de buceo revisados',
      'Equipos de comunicación operativos',
      'Equipos de seguridad verificados',
      'Herramientas necesarias disponibles',
      'Plan de emergencia revisado',
      'Condiciones meteorológicas evaluadas',
      'Personal certificado presente',
      'Documentación completa'
    ] : [
      'Equipos de buceo revisados',
      'Equipos de comunicación operativos',
      'Equipos de seguridad verificados',
      'Personal certificado presente'
    ],
    trabajadores: [] as Array<{ nombre: string; rut: string; }>
  });

  // Pre-populate data when operation is selected
  useEffect(() => {
    if (formData.operacion_id) {
      const operacion = operaciones.find(op => op.id === formData.operacion_id);
      if (operacion) {
        const sitio = sitios.find(s => s.id === operacion.sitio_id);
        const contratista = contratistas.find(c => c.id === operacion.contratista_id);
        const equipo = equipos.find(e => e.id === operacion.equipo_buceo_id);
        const supervisor = equipo?.miembros?.find(m => m.rol_equipo === 'supervisor');
        
        // Generate code
        const codigo = `AB-${operacion.codigo}-${Date.now().toString().slice(-4)}`;
        
        // Get team members
        const trabajadores = equipo?.miembros?.map(miembro => ({
          nombre: miembro.nombre_completo || '',
          rut: miembro.matricula || ''
        })) || [];
        
        setFormData(prev => ({
          ...prev,
          codigo,
          supervisor: supervisor?.nombre_completo || '',
          empresa_nombre: contratista?.nombre || '',
          lugar_faena: sitio?.nombre || '',
          buzo_o_empresa_nombre: contratista?.nombre || '',
          trabajadores
        }));
      }
    }
  }, [formData.operacion_id, operaciones, sitios, contratistas, equipos]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const submitData = {
      ...formData,
      user_id: 'temp-user-id', // Will be replaced with actual user ID
      estado: 'borrador',
      firmado: false,
      progreso: 0,
      checklist_completo: false
    };
    
    onSubmit(submitData);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileCheck className="w-6 h-6 text-green-600" />
            {type === 'complete' ? 'Anexo Bravo Completo' : 'Anexo Bravo Estándar'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Información Básica */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="operacion">Operación *</Label>
                <Select value={formData.operacion_id} onValueChange={(value) => setFormData(prev => ({ ...prev, operacion_id: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar operación..." />
                  </SelectTrigger>
                  <SelectContent>
                    {operaciones.map((operacion) => (
                      <SelectItem key={operacion.id} value={operacion.id}>
                        {operacion.codigo} - {operacion.nombre}
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
                  placeholder="AB-XXX-XXXX"
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
                <Label htmlFor="jefe_centro">Jefe de Centro *</Label>
                <Input
                  id="jefe_centro"
                  value={formData.jefe_centro}
                  onChange={(e) => setFormData(prev => ({ ...prev, jefe_centro: e.target.value }))}
                  placeholder="Nombre del jefe de centro"
                  required
                />
              </div>

              <div>
                <Label htmlFor="empresa_nombre">Empresa</Label>
                <Input
                  id="empresa_nombre"
                  value={formData.empresa_nombre}
                  onChange={(e) => setFormData(prev => ({ ...prev, empresa_nombre: e.target.value }))}
                  placeholder="Nombre de la empresa"
                  readOnly
                />
              </div>

              <div>
                <Label htmlFor="lugar_faena">Lugar de Faena</Label>
                <Input
                  id="lugar_faena"
                  value={formData.lugar_faena}
                  onChange={(e) => setFormData(prev => ({ ...prev, lugar_faena: e.target.value }))}
                  placeholder="Sitio de la faena"
                  readOnly
                />
              </div>

              <div>
                <Label htmlFor="buzo_o_empresa_nombre">Buzo o Empresa de Buceo</Label>
                <Input
                  id="buzo_o_empresa_nombre"
                  value={formData.buzo_o_empresa_nombre}
                  onChange={(e) => setFormData(prev => ({ ...prev, buzo_o_empresa_nombre: e.target.value }))}
                  placeholder="Contratista de buceo"
                  readOnly
                />
              </div>

              <div>
                <Label htmlFor="asistente_buzo_nombre">Asistente de Buzo</Label>
                <Input
                  id="asistente_buzo_nombre"
                  value={formData.asistente_buzo_nombre}
                  onChange={(e) => setFormData(prev => ({ ...prev, asistente_buzo_nombre: e.target.value }))}
                  placeholder="Nombre del asistente (opcional)"
                />
              </div>

              <div>
                <Label htmlFor="fecha_verificacion">Fecha de Verificación *</Label>
                <Input
                  id="fecha_verificacion"
                  type="date"
                  value={formData.fecha_verificacion}
                  onChange={(e) => setFormData(prev => ({ ...prev, fecha_verificacion: e.target.value }))}
                  required
                />
              </div>
            </div>

            {/* Trabajadores Principales */}
            <div>
              <Label className="text-base font-medium">Trabajadores Principales (Equipo de Buceo)</Label>
              <div className="mt-2 space-y-2">
                {formData.trabajadores.map((trabajador, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Users className="w-4 h-4 text-blue-600" />
                    <div className="flex-1">
                      <span className="font-medium">{trabajador.nombre}</span>
                      {trabajador.rut && <span className="text-sm text-gray-500 ml-2">({trabajador.rut})</span>}
                    </div>
                  </div>
                ))}
                {formData.trabajadores.length === 0 && (
                  <p className="text-sm text-gray-500">Seleccione una operación para cargar el equipo de buceo</p>
                )}
              </div>
            </div>

            {/* Lista de Verificación */}
            <div>
              <Label className="text-base font-medium flex items-center gap-2">
                <CheckSquare className="w-4 h-4" />
                Lista de Verificación
              </Label>
              <div className="mt-3 space-y-3">
                {formData.checklist_items.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Checkbox id={`checklist-${index}`} />
                    <Label htmlFor={`checklist-${index}`} className="text-sm">
                      {item}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Observaciones */}
            <div>
              <Label htmlFor="observaciones">Observaciones Generales</Label>
              <Textarea
                id="observaciones"
                value={formData.observaciones_generales}
                onChange={(e) => setFormData(prev => ({ ...prev, observaciones_generales: e.target.value }))}
                placeholder="Observaciones adicionales..."
                rows={4}
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700">
                <FileCheck className="w-4 h-4 mr-2" />
                Crear Anexo Bravo
              </Button>
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
