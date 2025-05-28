
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CreateOperacionForm } from "@/components/operaciones/CreateOperacionForm";
import { OperacionDetailModal } from "@/components/operaciones/OperacionDetailModal";
import { useOperaciones } from "@/hooks/useOperaciones";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Plus, Search, Calendar, MapPin, Users, Eye } from "lucide-react";

export const OperacionesPage = () => {
  const { operaciones, isLoading } = useOperaciones();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedOperacion, setSelectedOperacion] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOperaciones = operaciones.filter(op => 
    op.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    op.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (op.sitios?.nombre || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (op.contratistas?.nombre || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (estado: string) => {
    const colors = {
      'activa': 'bg-green-100 text-green-700',
      'pausada': 'bg-yellow-100 text-yellow-700', 
      'completada': 'bg-blue-100 text-blue-700',
      'cancelada': 'bg-red-100 text-red-700'
    };
    return colors[estado as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('es-CL');
  };

  if (isLoading) {
    return <LoadingSpinner text="Cargando operaciones..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Operaciones</h1>
          <p className="text-gray-600">Gestión de operaciones de buceo</p>
        </div>
        <Button onClick={() => setShowCreateForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nueva Operación
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Buscar operaciones..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOperaciones.map((operacion) => (
          <Card key={operacion.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{operacion.nombre}</CardTitle>
                  <p className="text-sm text-gray-500">{operacion.codigo}</p>
                </div>
                <Badge className={getStatusColor(operacion.estado)}>
                  {operacion.estado}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span>{operacion.sitios?.nombre || 'Sin sitio asignado'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-400" />
                  <span>{operacion.contratistas?.nombre || 'Sin contratista'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span>Inicio: {formatDate(operacion.fecha_inicio)}</span>
                </div>
                {operacion.fecha_fin && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span>Fin: {formatDate(operacion.fecha_fin)}</span>
                  </div>
                )}
              </div>
              
              <div className="pt-3 border-t">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => setSelectedOperacion(operacion)}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Ver Detalles
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredOperaciones.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No se encontraron operaciones</p>
        </div>
      )}

      {/* Modal para crear operación */}
      <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Nueva Operación</DialogTitle>
          </DialogHeader>
          <CreateOperacionForm onCancel={() => setShowCreateForm(false)} />
        </DialogContent>
      </Dialog>

      {/* Modal para ver detalles de operación */}
      <OperacionDetailModal 
        operacion={selectedOperacion}
        isOpen={!!selectedOperacion}
        onClose={() => setSelectedOperacion(null)}
      />
    </div>
  );
};
