
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Plus, Eye, Edit2, Trash2 } from "lucide-react";
import { useNetworkMaintenance } from '@/hooks/useNetworkMaintenance';
import { toast } from '@/hooks/use-toast';

interface NetworkMaintenanceListProps {
  onCreateNew?: () => void;
  onEdit?: (formId: string) => void;
  onView?: (formId: string) => void;
}

export const NetworkMaintenanceList = ({ 
  onCreateNew, 
  onEdit, 
  onView 
}: NetworkMaintenanceListProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [networkMaintenanceForms, setNetworkMaintenanceForms] = useState<any[]>([]);

  const { 
    loading, 
    getNetworkMaintenanceByOperacion
  } = useNetworkMaintenance();

  // Por ahora mostraremos una lista vacía hasta que tengamos operaciones
  useEffect(() => {
    // Aquí podrías cargar formularios de una operación específica
    // const loadForms = async () => {
    //   const forms = await getNetworkMaintenanceByOperacion('operacion-id');
    //   setNetworkMaintenanceForms(forms);
    // };
    // loadForms();
  }, []);

  const filteredForms = networkMaintenanceForms.filter(form => {
    const matchesSearch = form.network_maintenance_data?.lugar_trabajo?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || form.network_maintenance_data?.estado === statusFilter;
    const matchesType = typeFilter === 'all' || form.network_maintenance_data?.tipo_formulario === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completado':
        return 'bg-green-100 text-green-800';
      case 'borrador':
        return 'bg-yellow-100 text-yellow-800';
      case 'aprobado':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'mantencion':
        return 'bg-blue-100 text-blue-800';
      case 'faena':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Filtros y búsqueda */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Formularios de Mantención de Redes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por lugar de trabajo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="borrador">Borrador</SelectItem>
                <SelectItem value="completado">Completado</SelectItem>
                <SelectItem value="aprobado">Aprobado</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los tipos</SelectItem>
                <SelectItem value="mantencion">Mantención</SelectItem>
                <SelectItem value="faena">Faena</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={onCreateNew}>
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Formulario
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de formularios */}
      <div className="space-y-4">
        {loading ? (
          <Card>
            <CardContent className="py-8">
              <div className="text-center text-gray-500">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p>Cargando formularios...</p>
              </div>
            </CardContent>
          </Card>
        ) : filteredForms.length === 0 ? (
          <Card>
            <CardContent className="py-8">
              <div className="text-center text-gray-500">
                <Filter className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">No se encontraron formularios</p>
                <p className="text-sm">
                  {searchTerm || statusFilter !== 'all' || typeFilter !== 'all'
                    ? 'Intenta ajustar los filtros de búsqueda'
                    : 'Crea tu primer formulario de mantención de redes'
                  }
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredForms.map((form, index) => (
            <Card key={form.id || index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">
                        {form.network_maintenance_data?.lugar_trabajo || 'Sin lugar especificado'}
                      </h3>
                      <Badge className={getStatusColor(form.network_maintenance_data?.estado || 'borrador')}>
                        {form.network_maintenance_data?.estado || 'Borrador'}
                      </Badge>
                      <Badge className={getTypeColor(form.network_maintenance_data?.tipo_formulario || 'mantencion')}>
                        {form.network_maintenance_data?.tipo_formulario === 'mantencion' ? 'Mantención' : 'Faena'}
                      </Badge>
                    </div>
                    
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>
                        <span className="font-medium">Fecha:</span> {form.network_maintenance_data?.fecha || 'No especificada'}
                      </p>
                      <p>
                        <span className="font-medium">Progreso:</span> {form.network_maintenance_data?.progreso || 0}%
                      </p>
                      {form.network_maintenance_data?.dotacion?.length > 0 && (
                        <p>
                          <span className="font-medium">Personal:</span> {form.network_maintenance_data.dotacion.length} miembros
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => onView?.(form.id)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => onEdit?.(form.id)}>
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
