
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Network, Edit, Eye, Calendar, User, MapPin, RefreshCw } from "lucide-react";
import { useNetworkMaintenance } from '@/hooks/useNetworkMaintenance';
import type { NetworkMaintenanceData } from '@/types/network-maintenance';

interface NetworkMaintenanceForm {
  id: string;
  form_data: NetworkMaintenanceData;
  status: string;
  created_at: string;
  updated_at: string;
  inmersion_id: string;
}

interface NetworkMaintenanceListProps {
  operacionId?: string;
  onEdit: (formId: string, formData: NetworkMaintenanceData) => void;
  onView: (formId: string, formData: NetworkMaintenanceData) => void;
}

export const NetworkMaintenanceList = ({ 
  operacionId, 
  onEdit, 
  onView 
}: NetworkMaintenanceListProps) => {
  const [forms, setForms] = useState<NetworkMaintenanceForm[]>([]);
  const [loading, setLoading] = useState(true);
  const { getNetworkMaintenanceByOperacion, getAllNetworkMaintenance } = useNetworkMaintenance();

  useEffect(() => {
    loadForms();
  }, [operacionId]);

  const loadForms = async () => {
    try {
      setLoading(true);
      let result: any[] = [];
      
      if (operacionId) {
        result = await getNetworkMaintenanceByOperacion(operacionId);
      } else {
        // Cargar todos los formularios del usuario
        result = await getAllNetworkMaintenance();
      }
      
      // Convertir los datos de Supabase a nuestro formato
      const formattedForms: NetworkMaintenanceForm[] = result.map(item => ({
        id: item.id,
        form_data: item.form_data as NetworkMaintenanceData,
        status: item.status,
        created_at: item.created_at,
        updated_at: item.updated_at,
        inmersion_id: item.inmersion_id
      }));
      
      setForms(formattedForms);
    } catch (error) {
      console.error('Error loading forms:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string, firmado?: boolean) => {
    if (firmado) {
      return <Badge className="bg-green-100 text-green-800">Completado</Badge>;
    }
    
    switch (status) {
      case 'draft':
        return <Badge className="bg-gray-100 text-gray-800">Borrador</Badge>;
      case 'completed':
        return <Badge className="bg-blue-100 text-blue-800">Finalizado</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-800">En Progreso</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-500 mt-2">Cargando formularios...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (forms.length === 0) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center text-gray-500">
            <Network className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">No hay formularios registrados</p>
            <p className="text-sm">Los formularios creados aparecerán aquí</p>
            <Button variant="outline" className="mt-4" onClick={loadForms}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Actualizar
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-600">
          {forms.length} formulario{forms.length !== 1 ? 's' : ''} encontrado{forms.length !== 1 ? 's' : ''}
        </p>
        <Button variant="ghost" size="sm" onClick={loadForms} disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
          Actualizar
        </Button>
      </div>
      
      {forms.map((form) => (
        <Card key={form.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <Network className="w-4 h-4" />
                  {form.form_data.tipo_formulario === 'mantencion' ? 'Mantención' : 'Faena'} de Redes
                  {getStatusBadge(form.status, form.form_data.firmado)}
                </CardTitle>
                <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                  {form.form_data.lugar_trabajo && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {form.form_data.lugar_trabajo}
                    </div>
                  )}
                  {form.form_data.fecha && (
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {form.form_data.fecha}
                    </div>
                  )}
                  {form.form_data.supervisor_responsable && (
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {form.form_data.supervisor_responsable}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onView(form.id, form.form_data)}
                >
                  <Eye className="w-4 h-4 mr-1" />
                  Ver
                </Button>
                {!form.form_data.firmado && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(form.id, form.form_data)}
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Editar
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-600">Dotación:</span>
                <p>{form.form_data.dotacion?.length || 0} personas</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Equipos:</span>
                <p>{form.form_data.equipos_superficie?.length || 0} equipos</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Faenas:</span>
                <p>{(form.form_data.faenas_mantencion?.length || 0) + (form.form_data.faenas_redes?.length || 0)} trabajos</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Progreso:</span>
                <p>{form.form_data.progreso || 0}%</p>
              </div>
            </div>
            <div className="mt-3 text-xs text-gray-500">
              Creado: {formatDate(form.created_at)} | 
              Actualizado: {formatDate(form.updated_at)}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
