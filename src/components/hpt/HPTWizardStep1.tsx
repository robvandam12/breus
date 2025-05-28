
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Building, Users, MapPin, Calendar } from 'lucide-react';
import { useOperaciones } from '@/hooks/useOperaciones';
import { useSalmoneras } from '@/hooks/useSalmoneras';
import { useContratistas } from '@/hooks/useContratistas';
import { useSitios } from '@/hooks/useSitios';
import { useEquipoBuceo } from '@/hooks/useEquipoBuceo';

interface HPTWizardStep1Props {
  data: any;
  updateData: (updates: any) => void;
}

export const HPTWizardStep1: React.FC<HPTWizardStep1Props> = ({ data, updateData }) => {
  const { operaciones } = useOperaciones();
  const { salmoneras } = useSalmoneras();
  const { contratistas } = useContratistas();
  const { sitios } = useSitios();
  const { equipos } = useEquipoBuceo();

  // Obtener la operación actual
  const operacion = operaciones.find(op => op.id === data.operacion_id);
  const salmonera = salmoneras.find(s => s.id === operacion?.salmonera_id);
  const contratista = contratistas.find(c => c.id === operacion?.contratista_id);
  const sitio = sitios.find(s => s.id === operacion?.sitio_id);
  
  // Obtener el equipo asignado a la operación
  const equipoAsignado = equipos.find(equipo => 
    equipo.id === operacion?.equipo_buceo_id
  );
  
  // Obtener supervisor del equipo
  const supervisor = equipoAsignado?.miembros?.find(
    miembro => miembro.rol_equipo === 'supervisor'
  );

  // Auto-poblar campos cuando cambian los datos de la operación
  React.useEffect(() => {
    if (operacion && salmonera && !data.empresa_servicio_nombre) {
      updateData({
        empresa_servicio_nombre: contratista?.nombre || '',
        centro_trabajo: sitio?.nombre || '',
        supervisor_responsable: supervisor?.nombre_completo || '',
      });
    }
  }, [operacion, salmonera, contratista, sitio, supervisor, data.empresa_servicio_nombre, updateData]);

  return (
    <div className="space-y-6">
      {/* Información de la Operación */}
      {operacion && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <Calendar className="w-5 h-5" />
              Operación Asignada
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-white">
                  {operacion.codigo}
                </Badge>
                <span className="font-medium">{operacion.nombre}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-blue-600">
                <Building className="w-4 h-4" />
                {salmonera?.nombre}
              </div>
              <div className="flex items-center gap-2 text-sm text-blue-600">
                <MapPin className="w-4 h-4" />
                {sitio?.nombre}
              </div>
              <div className="flex items-center gap-2 text-sm text-blue-600">
                <Users className="w-4 h-4" />
                {contratista?.nombre || 'Sin contratista'}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Información General del HPT */}
      <Card>
        <CardHeader>
          <CardTitle>Información General del HPT</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="codigo">Código HPT *</Label>
              <Input
                id="codigo"
                value={data.codigo || ''}
                onChange={(e) => updateData({ codigo: e.target.value })}
                placeholder="HPT-001"
                required
              />
            </div>

            <div>
              <Label htmlFor="fecha">Fecha de Creación *</Label>
              <Input
                id="fecha"
                type="date"
                value={data.fecha || new Date().toISOString().split('T')[0]}
                onChange={(e) => updateData({ fecha: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="titulo_trabajo">Título del Trabajo *</Label>
              <Input
                id="titulo_trabajo"
                value={data.titulo_trabajo || ''}
                onChange={(e) => updateData({ titulo_trabajo: e.target.value })}
                placeholder="Descripción del trabajo a realizar"
                required
              />
            </div>

            <div>
              <Label htmlFor="tipo_trabajo">Tipo de Trabajo *</Label>
              <Select
                value={data.tipo_trabajo || ''}
                onValueChange={(value) => updateData({ tipo_trabajo: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="inspeccion">Inspección</SelectItem>
                  <SelectItem value="mantenimiento">Mantenimiento</SelectItem>
                  <SelectItem value="reparacion">Reparación</SelectItem>
                  <SelectItem value="instalacion">Instalación</SelectItem>
                  <SelectItem value="limpieza">Limpieza</SelectItem>
                  <SelectItem value="otro">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="descripcion_trabajo">Descripción del Trabajo</Label>
            <Textarea
              id="descripcion_trabajo"
              value={data.descripcion_trabajo || ''}
              onChange={(e) => updateData({ descripcion_trabajo: e.target.value })}
              placeholder="Descripción detallada del trabajo a realizar..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Información de Empresa y Personal */}
      <Card>
        <CardHeader>
          <CardTitle>Información de Empresa y Personal</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="empresa_servicio">Empresa de Servicio</Label>
              <Input
                id="empresa_servicio"
                value={data.empresa_servicio_nombre || contratista?.nombre || ''}
                onChange={(e) => updateData({ empresa_servicio_nombre: e.target.value })}
                placeholder="Nombre de la empresa de servicio"
                className="bg-gray-50"
                readOnly={!!contratista}
              />
              {contratista && (
                <p className="text-xs text-gray-500 mt-1">Auto-poblado desde la operación</p>
              )}
            </div>

            <div>
              <Label htmlFor="centro_trabajo">Centro de Trabajo</Label>
              <Input
                id="centro_trabajo"
                value={data.centro_trabajo || sitio?.nombre || ''}
                onChange={(e) => updateData({ centro_trabajo: e.target.value })}
                placeholder="Nombre del centro de trabajo"
                className="bg-gray-50"
                readOnly={!!sitio}
              />
              {sitio && (
                <p className="text-xs text-gray-500 mt-1">Auto-poblado desde la operación</p>
              )}
            </div>

            <div>
              <Label htmlFor="supervisor">Supervisor Responsable</Label>
              <Input
                id="supervisor"
                value={data.supervisor_responsable || supervisor?.nombre_completo || ''}
                onChange={(e) => updateData({ supervisor_responsable: e.target.value })}
                placeholder="Nombre del supervisor"
                className={supervisor ? "bg-gray-50" : ""}
                readOnly={!!supervisor}
              />
              {supervisor && (
                <p className="text-xs text-gray-500 mt-1">Auto-poblado desde el equipo de buceo</p>
              )}
            </div>

            <div>
              <Label htmlFor="lugar_especifico">Lugar Específico</Label>
              <Input
                id="lugar_especifico"
                value={data.lugar_especifico || ''}
                onChange={(e) => updateData({ lugar_especifico: e.target.value })}
                placeholder="Ubicación específica dentro del centro"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fecha_inicio_planificada">Fecha Inicio Planificada *</Label>
              <Input
                id="fecha_inicio_planificada"
                type="date"
                value={data.fecha_inicio_planificada || ''}
                onChange={(e) => updateData({ fecha_inicio_planificada: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="fecha_fin_planificada">Fecha Fin Planificada</Label>
              <Input
                id="fecha_fin_planificada"
                type="date"
                value={data.fecha_fin_planificada || ''}
                onChange={(e) => updateData({ fecha_fin_planificada: e.target.value })}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
