
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface AnexoBravoStep1Props {
  data: any;
  onUpdate: (updates: any) => void;
}

export const AnexoBravoStep1 = ({ data, onUpdate }: AnexoBravoStep1Props) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            📋 Información General
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="codigo">Código del Anexo Bravo *</Label>
              <Input
                id="codigo"
                value={data.codigo}
                onChange={(e) => onUpdate({ codigo: e.target.value })}
                placeholder="AB-001"
              />
            </div>
            <div>
              <Label htmlFor="fecha_verificacion">Fecha de Verificación *</Label>
              <Input
                id="fecha_verificacion"
                type="date"
                value={data.fecha_verificacion}
                onChange={(e) => onUpdate({ fecha_verificacion: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="lugar_faena">Lugar de Faena *</Label>
              <Input
                id="lugar_faena"
                value={data.lugar_faena}
                onChange={(e) => onUpdate({ lugar_faena: e.target.value })}
                placeholder="Sitio de trabajo"
                disabled
              />
              <p className="text-xs text-gray-500 mt-1">Poblado automáticamente desde la operación</p>
            </div>
            <div>
              <Label htmlFor="empresa_nombre">Empresa Mandante</Label>
              <Input
                id="empresa_nombre"
                value={data.empresa_nombre}
                onChange={(e) => onUpdate({ empresa_nombre: e.target.value })}
                placeholder="Nombre de la empresa"
                disabled
              />
              <p className="text-xs text-gray-500 mt-1">Poblado automáticamente desde la operación</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="buzo_o_empresa_nombre">Empresa de Buceo *</Label>
              <Input
                id="buzo_o_empresa_nombre"
                value={data.buzo_o_empresa_nombre}
                onChange={(e) => onUpdate({ buzo_o_empresa_nombre: e.target.value })}
                placeholder="Contratista de buceo"
                disabled
              />
              <p className="text-xs text-gray-500 mt-1">Poblado automáticamente desde la operación</p>
            </div>
            <div>
              <Label htmlFor="asistente_buzo_nombre">Asistente de Buzo</Label>
              <Input
                id="asistente_buzo_nombre"
                value={data.asistente_buzo_nombre}
                onChange={(e) => onUpdate({ asistente_buzo_nombre: e.target.value })}
                placeholder="Nombre del asistente (externo)"
              />
              <p className="text-xs text-gray-500 mt-1">Personal externo, no de la aplicación</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="supervisor">Supervisor *</Label>
              <Input
                id="supervisor"
                value={data.supervisor}
                onChange={(e) => onUpdate({ supervisor: e.target.value })}
                placeholder="Supervisor del equipo"
                disabled
              />
              <p className="text-xs text-gray-500 mt-1">Poblado automáticamente del equipo de buceo</p>
            </div>
            <div>
              <Label htmlFor="jefe_centro">Jefe de Centro</Label>
              <Input
                id="jefe_centro"
                value={data.jefe_centro}
                onChange={(e) => onUpdate({ jefe_centro: e.target.value })}
                placeholder="Nombre del jefe de centro"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
