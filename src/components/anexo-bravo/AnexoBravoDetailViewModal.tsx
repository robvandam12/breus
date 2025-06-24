
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Calendar, Clock, MapPin, User, CheckCircle, XCircle, Download, Shield } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface AnexoBravoDetailViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  anexo: any;
  onEdit?: (anexoId: string) => void;
  onDownload?: (anexo: any) => void;
}

export const AnexoBravoDetailViewModal = ({ 
  isOpen, 
  onClose, 
  anexo, 
  onEdit, 
  onDownload 
}: AnexoBravoDetailViewModalProps) => {
  if (!anexo) return null;

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
              <Shield className="w-5 h-5 text-blue-500" />
              Detalle Anexo Bravo - {anexo.codigo}
            </DialogTitle>
            <div className="flex items-center gap-2">
              {getStatusBadge(anexo.firmado, anexo.estado || 'borrador')}
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
                      {anexo.fecha ? format(new Date(anexo.fecha), 'dd/MM/yyyy', { locale: es }) : 'Sin fecha'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Supervisor</p>
                    <p className="font-medium">{anexo.supervisor || 'No asignado'}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Lugar de Faena</p>
                    <p className="font-medium">{anexo.lugar_faena || 'No especificado'}</p>
                  </div>
                </div>

                {anexo.empresa_nombre && (
                  <div>
                    <p className="text-sm text-gray-600">Empresa</p>
                    <p className="font-medium">{anexo.empresa_nombre}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Responsables */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Responsables</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {anexo.jefe_centro && (
                <div>
                  <p className="text-sm text-gray-600">Jefe de Centro</p>
                  <p className="font-medium">{anexo.jefe_centro}</p>
                </div>
              )}
              {anexo.supervisor_mandante_nombre && (
                <div>
                  <p className="text-sm text-gray-600">Supervisor Mandante</p>
                  <p className="font-medium">{anexo.supervisor_mandante_nombre}</p>
                </div>
              )}
              {anexo.supervisor_servicio_nombre && (
                <div>
                  <p className="text-sm text-gray-600">Supervisor Servicio</p>
                  <p className="font-medium">{anexo.supervisor_servicio_nombre}</p>
                </div>
              )}
              {anexo.buzo_o_empresa_nombre && (
                <div>
                  <p className="text-sm text-gray-600">Buzo/Empresa</p>
                  <p className="font-medium">{anexo.buzo_o_empresa_nombre}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Participantes */}
          {anexo.anexo_bravo_trabajadores && anexo.anexo_bravo_trabajadores.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Participantes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {anexo.anexo_bravo_trabajadores.map((trabajador: any, index: number) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <p className="font-medium">{trabajador.nombre}</p>
                      {trabajador.rol && <p className="text-sm text-gray-600">{trabajador.rol}</p>}
                      {trabajador.rut && <p className="text-xs text-gray-500">RUT: {trabajador.rut}</p>}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Estado del Checklist */}
          {anexo.anexo_bravo_checklist && anexo.anexo_bravo_checklist.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Estado del Checklist</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {anexo.anexo_bravo_checklist.map((item: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium">{item.item}</p>
                        {item.observaciones && (
                          <p className="text-sm text-gray-600 mt-1">{item.observaciones}</p>
                        )}
                      </div>
                      <div className="ml-3">
                        {item.verificado ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-500" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Observaciones Generales */}
          {anexo.observaciones_generales && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Observaciones Generales</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 whitespace-pre-wrap">{anexo.observaciones_generales}</p>
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
                onClick={() => onDownload(anexo)}
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Descargar PDF
              </Button>
            )}
            {onEdit && !anexo.firmado && (
              <Button 
                onClick={() => onEdit(anexo.id)}
                className="flex items-center gap-2"
              >
                Editar Anexo Bravo
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
