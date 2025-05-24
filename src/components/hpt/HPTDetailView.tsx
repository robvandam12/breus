
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  FileText, 
  Users, 
  Shield, 
  Wrench, 
  Phone, 
  PenTool, 
  Calendar,
  Clock,
  User,
  CheckCircle,
  AlertTriangle,
  Thermometer,
  Eye,
  Waves
} from "lucide-react";

interface HPTDetailData {
  id: string;
  codigo: string;
  operacion_id: string;
  fecha_programada: string;
  hora_inicio: string;
  hora_fin: string;
  supervisor: string;
  jefe_obra: string;
  descripcion_trabajo: string;
  plan_trabajo: string;
  buzos: Array<{
    nombre: string;
    certificacion: string;
    vencimiento: string;
    rol: string;
  }>;
  asistentes: Array<{
    nombre: string;
    rol: string;
  }>;
  tipo_trabajo: string;
  profundidad_maxima: number;
  corrientes: string;
  visibilidad: string;
  temperatura: number;
  riesgos_identificados: string[];
  medidas_control: string[];
  equipo_buceo: string[];
  herramientas: string[];
  equipo_seguridad: string[];
  equipo_comunicacion: string[];
  plan_emergencia: string;
  contactos_emergencia: Array<{
    nombre: string;
    cargo: string;
    telefono: string;
  }>;
  hospital_cercano: string;
  camara_hiperbarica: string;
  supervisor_firma: string | null;
  jefe_obra_firma: string | null;
  observaciones: string;
  firmado: boolean;
  created_at: string;
}

interface HPTDetailViewProps {
  data: HPTDetailData;
  onEdit?: () => void;
  onPrint?: () => void;
}

export const HPTDetailView = ({ data, onEdit, onPrint }: HPTDetailViewProps) => {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8 text-blue-600" />
              <div>
                <CardTitle className="text-2xl">{data.codigo}</CardTitle>
                <p className="text-gray-600">Hoja de Preparación de Trabajo</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={data.firmado ? "default" : "secondary"} className="bg-green-100 text-green-700">
                {data.firmado ? "Firmado" : "Borrador"}
              </Badge>
              {onEdit && !data.firmado && (
                <Button variant="outline" onClick={onEdit}>
                  Editar
                </Button>
              )}
              {onPrint && (
                <Button variant="outline" onClick={onPrint}>
                  Imprimir
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Información General */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Información General
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="font-medium">Fecha:</span>
              <span>{new Date(data.fecha_programada).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="font-medium">Horario:</span>
              <span>{data.hora_inicio} - {data.hora_fin}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-gray-500" />
              <span className="font-medium">Supervisor:</span>
              <span>{data.supervisor}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-gray-500" />
              <span className="font-medium">Jefe de Obra:</span>
              <span>{data.jefe_obra}</span>
            </div>
          </div>
          <Separator />
          <div>
            <h4 className="font-medium mb-2">Descripción del Trabajo</h4>
            <p className="text-gray-700">{data.descripcion_trabajo}</p>
          </div>
          <div>
            <h4 className="font-medium mb-2">Plan de Trabajo</h4>
            <p className="text-gray-700">{data.plan_trabajo}</p>
          </div>
        </CardContent>
      </Card>

      {/* Equipo de Buceo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Equipo de Buceo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-3">Buzos Certificados ({data.buzos.length})</h4>
            <div className="space-y-2">
              {data.buzos.map((buzo, index) => (
                <div key={index} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                    <div className="flex-1">
                      <div className="font-medium text-blue-900">{buzo.nombre}</div>
                      <div className="text-sm text-blue-700">
                        {buzo.certificacion} - {buzo.rol}
                      </div>
                      <div className="text-xs text-blue-600">
                        Vence: {new Date(buzo.vencimiento).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {data.asistentes.length > 0 && (
            <div>
              <h4 className="font-medium mb-3">Personal de Apoyo ({data.asistentes.length})</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {data.asistentes.map((asistente, index) => (
                  <div key={index} className="p-2 bg-gray-50 rounded border">
                    <div className="font-medium">{asistente.nombre}</div>
                    <div className="text-sm text-gray-600">{asistente.rol}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Análisis de Riesgos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Análisis de Riesgos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="font-medium">Tipo de Trabajo:</span>
              <span className="ml-2">{data.tipo_trabajo}</span>
            </div>
            <div className="flex items-center gap-2">
              <Thermometer className="w-4 h-4 text-gray-500" />
              <span className="font-medium">Profundidad Máxima:</span>
              <span>{data.profundidad_maxima}m</span>
            </div>
            <div className="flex items-center gap-2">
              <Waves className="w-4 h-4 text-gray-500" />
              <span className="font-medium">Corrientes:</span>
              <span>{data.corrientes}</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-gray-500" />
              <span className="font-medium">Visibilidad:</span>
              <span>{data.visibilidad}</span>
            </div>
          </div>
          
          {data.riesgos_identificados.length > 0 && (
            <div>
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                Riesgos Identificados
              </h4>
              <ul className="list-disc list-inside space-y-1">
                {data.riesgos_identificados.map((riesgo, index) => (
                  <li key={index} className="text-gray-700">{riesgo}</li>
                ))}
              </ul>
            </div>
          )}
          
          {data.medidas_control.length > 0 && (
            <div>
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-500" />
                Medidas de Control
              </h4>
              <ul className="list-disc list-inside space-y-1">
                {data.medidas_control.map((medida, index) => (
                  <li key={index} className="text-gray-700">{medida}</li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Equipos y Herramientas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wrench className="w-5 h-5" />
            Equipos y Herramientas
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-2">Equipo de Buceo</h4>
            <ul className="list-disc list-inside space-y-1 text-sm">
              {data.equipo_buceo.map((equipo, index) => (
                <li key={index}>{equipo}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Herramientas</h4>
            <ul className="list-disc list-inside space-y-1 text-sm">
              {data.herramientas.map((herramienta, index) => (
                <li key={index}>{herramienta}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Equipo de Seguridad</h4>
            <ul className="list-disc list-inside space-y-1 text-sm">
              {data.equipo_seguridad.map((equipo, index) => (
                <li key={index}>{equipo}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Comunicación</h4>
            <ul className="list-disc list-inside space-y-1 text-sm">
              {data.equipo_comunicacion.map((equipo, index) => (
                <li key={index}>{equipo}</li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Procedimientos de Emergencia */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="w-5 h-5" />
            Procedimientos de Emergencia
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Plan de Emergencia</h4>
            <p className="text-gray-700">{data.plan_emergencia}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Hospital Cercano</h4>
              <p className="text-gray-700">{data.hospital_cercano}</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Cámara Hiperbárica</h4>
              <p className="text-gray-700">{data.camara_hiperbarica}</p>
            </div>
          </div>

          {data.contactos_emergencia.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Contactos de Emergencia</h4>
              <div className="space-y-2">
                {data.contactos_emergencia.map((contacto, index) => (
                  <div key={index} className="p-2 bg-red-50 rounded border border-red-200">
                    <div className="font-medium text-red-900">{contacto.nombre}</div>
                    <div className="text-sm text-red-700">{contacto.cargo}</div>
                    <div className="text-sm text-red-600">{contacto.telefono}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Autorizaciones */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PenTool className="w-5 h-5" />
            Autorizaciones y Firmas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.observaciones && (
            <div>
              <h4 className="font-medium mb-2">Observaciones</h4>
              <p className="text-gray-700">{data.observaciones}</p>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Supervisor</h4>
              <p className="text-sm text-gray-600 mb-2">{data.supervisor}</p>
              {data.supervisor_firma ? (
                <div className="p-2 bg-green-50 border border-green-200 rounded">
                  <div className="flex items-center gap-2 text-green-700 mb-1">
                    <CheckCircle className="w-4 h-4" />
                    <span className="font-medium text-sm">Firmado</span>
                  </div>
                  <div className="text-xs text-green-600">{data.supervisor_firma}</div>
                </div>
              ) : (
                <div className="p-2 bg-gray-50 border rounded">
                  <span className="text-sm text-gray-500">Pendiente de firma</span>
                </div>
              )}
            </div>

            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Jefe de Obra</h4>
              <p className="text-sm text-gray-600 mb-2">{data.jefe_obra}</p>
              {data.jefe_obra_firma ? (
                <div className="p-2 bg-green-50 border border-green-200 rounded">
                  <div className="flex items-center gap-2 text-green-700 mb-1">
                    <CheckCircle className="w-4 h-4" />
                    <span className="font-medium text-sm">Firmado</span>
                  </div>
                  <div className="text-xs text-green-600">{data.jefe_obra_firma}</div>
                </div>
              ) : (
                <div className="p-2 bg-gray-50 border rounded">
                  <span className="text-sm text-gray-500">Pendiente de firma</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-center text-sm text-gray-500">
        Documento creado el {new Date(data.created_at).toLocaleString()}
      </div>
    </div>
  );
};
