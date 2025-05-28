
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, MapPin, Users, Search, Filter, Eye, MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useOperaciones } from "@/hooks/useOperaciones";
import { useSalmoneras } from "@/hooks/useSalmoneras";
import { useContratistas } from "@/hooks/useContratistas";
import { useSitios } from "@/hooks/useSitios";
import { OperacionDetailModal } from "./OperacionDetailModal";

export const OperacionesManager = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOperacion, setSelectedOperacion] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);
  
  const { operaciones, isLoading } = useOperaciones();
  const { salmoneras } = useSalmoneras();
  const { contratistas } = useContratistas();
  const { sitios } = useSitios();

  const filteredOperaciones = operaciones.filter(operacion => {
    const matchesSearch = operacion.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         operacion.codigo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || operacion.estado === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getEstadoBadgeColor = (estado: string) => {
    switch (estado) {
      case 'activa':
        return 'bg-green-100 text-green-800';
      case 'planificada':
        return 'bg-blue-100 text-blue-800';
      case 'completada':
        return 'bg-gray-100 text-gray-800';
      case 'cancelada':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getSalmoneraName = (id: string) => {
    return salmoneras.find(s => s.id === id)?.nombre || 'Sin asignar';
  };

  const getContratistaName = (id: string) => {
    return contratistas.find(c => c.id === id)?.nombre || 'Sin asignar';
  };

  const getSitioName = (id: string) => {
    return sitios.find(s => s.id === id)?.nombre || 'Sin asignar';
  };

  const handleViewDetails = (operacion: any) => {
    setSelectedOperacion(operacion);
    setModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Cargando operaciones...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar operaciones..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="planificada">Planificada</SelectItem>
                <SelectItem value="activa">Activa</SelectItem>
                <SelectItem value="completada">Completada</SelectItem>
                <SelectItem value="cancelada">Cancelada</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Operaciones */}
      {filteredOperaciones.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No hay operaciones</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || statusFilter !== 'all' 
                ? 'No se encontraron operaciones con los filtros aplicados.'
                : 'Comience creando su primera operación de buceo.'
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOperaciones.map((operacion) => (
            <Card key={operacion.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{operacion.nombre}</CardTitle>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleViewDetails(operacion)}>
                        <Eye className="w-4 h-4 mr-2" />
                        Ver Detalles
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getEstadoBadgeColor(operacion.estado)}>
                    {operacion.estado}
                  </Badge>
                  <span className="text-sm text-gray-500">{operacion.codigo}</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {new Date(operacion.fecha_inicio).toLocaleDateString()} - 
                    {operacion.fecha_fin ? new Date(operacion.fecha_fin).toLocaleDateString() : 'En curso'}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{getSitioName(operacion.sitio_id)}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users className="w-4 h-4" />
                  <span>{getSalmoneraName(operacion.salmonera_id)} / {getContratistaName(operacion.contratista_id)}</span>
                </div>
                
                {operacion.tareas && (
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {operacion.tareas}
                  </p>
                )}
                
                <div className="pt-3 border-t border-gray-200">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleViewDetails(operacion)}
                    className="w-full"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Ver Detalles
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Modal de Detalles */}
      {selectedOperacion && (
        <OperacionDetailModal
          operacion={selectedOperacion}
          open={modalOpen}
          onOpenChange={setModalOpen}
        />
      )}
    </div>
  );
};
