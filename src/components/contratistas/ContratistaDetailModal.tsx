
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { UserCheck, MapPin, Phone, Mail, Calendar, Award, Briefcase } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface ContratistaDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  contratista: any;
  onEdit?: (contratista: any) => void;
}

export const ContratistaDetailModal = ({ 
  isOpen, 
  onClose, 
  contratista, 
  onEdit 
}: ContratistaDetailModalProps) => {
  if (!contratista) return null;

  const getStatusBadge = (estado: string) => {
    const statusConfig = {
      'activo': 'bg-green-100 text-green-800 border-green-200',
      'inactivo': 'bg-gray-100 text-gray-800 border-gray-200',
      'suspendido': 'bg-red-100 text-red-800 border-red-200'
    };
    
    return (
      <Badge className={statusConfig[estado as keyof typeof statusConfig] || statusConfig.inactivo}>
        {estado?.charAt(0).toUpperCase() + estado?.slice(1)}
      </Badge>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-blue-500" />
              {contratista.nombre}
            </DialogTitle>
            {getStatusBadge(contratista.estado)}
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Información General */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <UserCheck className="w-4 h-4" />
                Información General
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Nombre Empresa</p>
                  <p className="font-medium">{contratista.nombre}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">RUT</p>
                  <p className="font-medium font-mono">{contratista.rut}</p>
                </div>

                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Dirección</p>
                    <p className="font-medium">{contratista.direccion}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {contratista.telefono && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Teléfono</p>
                      <p className="font-medium">{contratista.telefono}</p>
                    </div>
                  </div>
                )}

                {contratista.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium">{contratista.email}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Especialidades */}
          {contratista.especialidades && contratista.especialidades.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  Especialidades
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {contratista.especialidades.map((especialidad: string, index: number) => (
                    <Badge key={index} variant="outline" className="text-sm">
                      {especialidad}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Certificaciones */}
          {contratista.certificaciones && contratista.certificaciones.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  Certificaciones
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {contratista.certificaciones.map((certificacion: string, index: number) => (
                    <Badge key={index} variant="outline" className="text-sm bg-green-50 text-green-700 border-green-200">
                      {certificacion}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Información del Sistema */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Información del Sistema
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Fecha de Registro</p>
                <p className="font-medium">
                  {contratista.created_at ? format(new Date(contratista.created_at), 'dd/MM/yyyy HH:mm', { locale: es }) : 'No disponible'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Última Actualización</p>
                <p className="font-medium">
                  {contratista.updated_at ? format(new Date(contratista.updated_at), 'dd/MM/yyyy HH:mm', { locale: es }) : 'No disponible'}
                </p>
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* Acciones */}
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cerrar
            </Button>
            {onEdit && (
              <Button onClick={() => onEdit(contratista)}>
                Editar Contratista
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
