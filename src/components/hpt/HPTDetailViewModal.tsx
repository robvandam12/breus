
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Calendar, Clock, MapPin, User, CheckCircle, XCircle, Download } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface HPTDetailViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  hpt: any;
  onEdit?: (hptId: string) => void;
  onDownload?: (hpt: any) => void;
}

export const HPTDetailViewModal = ({ 
  isOpen, 
  onClose, 
  hpt, 
  onEdit, 
  onDownload 
}: HPTDetailViewModalProps) => {
  if (!hpt) return null;

  const getStatusBadge = (firmado: boolean, estado: string) => {
    if (firmado) {
      return (
        <Badge className="bg-green-100 text-green-800 border-green-200">
          <CheckCircle className="w-3 h-3 mr-1" />
          Firmado
        </Badge>
      );
    }
    
    switch (estado) {
      case 'en_progreso':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">En Progreso</Badge>;
      case 'borrador':
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Borrador</Badge>;
      default:
        return <Badge variant="secondary">{estado}</Badge>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-blue-500" />
              Detalle HPT - {hpt.codigo}
            </DialogTitle>
            <div className="flex items-center gap-2">
              {getStatusBadge(hpt.firmado, hpt.estado || 'borrador')}
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Información General */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Información General</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Fecha</p>
                    <p className="font-medium">
                      {hpt.fecha ? format(new Date(hpt.fecha), 'dd/MM/yyyy', { locale: es }) : 'Sin fecha'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Horario</p>
                    <p className="font-medium">
                      {hpt.hora_inicio && hpt.hora_fin 
                        ? `${hpt.hora_inicio} - ${hpt.hora_fin}`
                        : 'Sin horario definido'
                      }
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Supervisor</p>
                    <p className="font-medium">{hpt.supervisor || 'No asignado'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Lugar Específico</p>
                    <p className="font-medium">{hpt.lugar_especifico || 'No especificado'}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Plan de Trabajo */}
          {hpt.plan_trabajo && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Plan de Trabajo</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 whitespace-pre-wrap">{hpt.plan_trabajo}</p>
              </CardContent>
            </Card>
          )}

          {/* Descripción del Trabajo */}
          {hpt.descripcion_trabajo && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Descripción del Trabajo</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 whitespace-pre-wrap">{hpt.descripcion_trabajo}</p>
              </CardContent>
            </Card>
          )}

          {/* Condiciones Ambientales */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Condiciones Ambientales</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {hpt.temperatura && (
                <div>
                  <p className="text-sm text-gray-600">Temperatura</p>
                  <p className="font-medium">{hpt.temperatura}°C</p>
                </div>
              )}
              {hpt.visibilidad && (
                <div>
                  <p className="text-sm text-gray-600">Visibilidad</p>
                  <p className="font-medium">{hpt.visibilidad}</p>
                </div>
              )}
              {hpt.corrientes && (
                <div>
                  <p className="text-sm text-gray-600">Corrientes</p>
                  <p className="font-medium">{hpt.corrientes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Buzos Asignados */}
          {hpt.buzos && hpt.buzos.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Buzos Asignados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {hpt.buzos.map((buzo: any, index: number) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <p className="font-medium">{buzo.nombre}</p>
                      {buzo.rol && <p className="text-sm text-gray-600">{buzo.rol}</p>}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Observaciones */}
          {hpt.observaciones && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Observaciones</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 whitespace-pre-wrap">{hpt.observaciones}</p>
              </CardContent>
            </Card>
          )}

          <Separator />

          {/* Acciones */}
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cerrar
            </Button>
            {onDownload && (
              <Button 
                variant="outline" 
                onClick={() => onDownload(hpt)}
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Descargar PDF
              </Button>
            )}
            {onEdit && !hpt.firmado && (
              <Button 
                onClick={() => onEdit(hpt.id)}
                className="flex items-center gap-2"
              >
                Editar HPT
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
