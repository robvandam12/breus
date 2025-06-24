
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Building, MapPin, Phone, Mail, Calendar, Users } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface SalmoneraDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  salmonera: any;
  onEdit?: (salmonera: any) => void;
}

export const SalmoneraDetailModal = ({ 
  isOpen, 
  onClose, 
  salmonera, 
  onEdit 
}: SalmoneraDetailModalProps) => {
  if (!salmonera) return null;

  const getStatusBadge = (estado: string) => {
    const statusConfig = {
      'activa': 'bg-green-100 text-green-800 border-green-200',
      'inactiva': 'bg-gray-100 text-gray-800 border-gray-200',
      'suspendida': 'bg-red-100 text-red-800 border-red-200'
    };
    
    return (
      <Badge className={statusConfig[estado as keyof typeof statusConfig] || statusConfig.inactiva}>
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
              <Building className="w-5 h-5 text-blue-500" />
              {salmonera.nombre}
            </DialogTitle>
            {getStatusBadge(salmonera.estado)}
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Información General */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Building className="w-4 h-4" />
                Información General
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Nombre Empresa</p>
                  <p className="font-medium">{salmonera.nombre}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">RUT</p>
                  <p className="font-medium font-mono">{salmonera.rut}</p>
                </div>

                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Dirección</p>
                    <p className="font-medium">{salmonera.direccion}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {salmonera.telefono && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Teléfono</p>
                      <p className="font-medium">{salmonera.telefono}</p>
                    </div>
                  </div>
                )}

                {salmonera.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium">{salmonera.email}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Sitios Activos</p>
                    <p className="font-medium">{salmonera.sitios_activos || 0}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

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
                  {salmonera.created_at ? format(new Date(salmonera.created_at), 'dd/MM/yyyy HH:mm', { locale: es }) : 'No disponible'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Última Actualización</p>
                <p className="font-medium">
                  {salmonera.updated_at ? format(new Date(salmonera.updated_at), 'dd/MM/yyyy HH:mm', { locale: es }) : 'No disponible'}
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
              <Button onClick={() => onEdit(salmonera)}>
                Editar Salmonera
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
