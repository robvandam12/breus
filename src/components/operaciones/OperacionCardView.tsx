
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Calendar, Users, Settings, FileText, Activity, Search, Filter, Plus, Trash2 } from "lucide-react";

interface OperacionCardViewProps {
  operaciones: any[];
  onSelect: (operacion: any) => void;
  onEdit: (operacion: any) => void;
  onViewDetail: (operacion: any) => void;
  onDelete: (operacionId: string) => void;
}

export const OperacionCardView = ({ operaciones, onSelect, onEdit, onViewDetail, onDelete }: OperacionCardViewProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredOperaciones = operaciones.filter(op => {
    const matchesSearch = op.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         op.codigo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || op.estado === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (estado: string) => {
    const colors = {
      'activa': 'bg-green-100 text-green-700',
      'pausada': 'bg-yellow-100 text-yellow-700',
      'completada': 'bg-blue-100 text-blue-700',
      'cancelada': 'bg-red-100 text-red-700'
    };
    return colors[estado as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  const getDocumentStatus = (operacion: any) => {
    // Simulación de estado de documentos - esto debería venir de la base de datos
    const docs = {
      hpt: Math.random() > 0.5,
      anexoBravo: Math.random() > 0.5,
      inmersiones: Math.random() > 0.7
    };
    
    const total = Object.keys(docs).length;
    const completed = Object.values(docs).filter(Boolean).length;
    
    return { completed, total, docs };
  };

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex-1 min-w-64">
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
            <SelectItem value="activa">Activas</SelectItem>
            <SelectItem value="pausada">Pausadas</SelectItem>
            <SelectItem value="completada">Completadas</SelectItem>
            <SelectItem value="cancelada">Canceladas</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Cards Grid */}
      {filteredOperaciones.length === 0 ? (
        <div className="text-center py-12">
          <Activity className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-zinc-900 mb-2">No hay operaciones</h3>
          <p className="text-zinc-500 mb-4">
            {searchTerm || statusFilter !== 'all' 
              ? 'No se encontraron operaciones con los filtros aplicados'
              : 'Cree la primera operación para comenzar'
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOperaciones.map((operacion) => {
            const docStatus = getDocumentStatus(operacion);
            
            return (
              <Card key={operacion.id} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg font-semibold">{operacion.nombre}</CardTitle>
                      <p className="text-sm text-zinc-500">{operacion.codigo}</p>
                    </div>
                    <Badge className={getStatusBadge(operacion.estado)}>
                      {operacion.estado}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Información básica */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-zinc-600">
                      <MapPin className="w-4 h-4" />
                      <span>{operacion.sitios?.nombre || 'Sin asignar'}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-zinc-600">
                      <Users className="w-4 h-4" />
                      <span>{operacion.contratistas?.nombre || 'Sin asignar'}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-zinc-600">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(operacion.fecha_inicio).toLocaleDateString('es-CL')}</span>
                      {operacion.fecha_fin && (
                        <span className="text-zinc-400">
                          - {new Date(operacion.fecha_fin).toLocaleDateString('es-CL')}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Estado de documentos */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-zinc-700">Documentos</span>
                      <span className="text-sm text-zinc-500">
                        {docStatus.completed}/{docStatus.total}
                      </span>
                    </div>
                    
                    <div className="flex gap-2">
                      <Badge variant={docStatus.docs.hpt ? "default" : "outline"} className="text-xs">
                        HPT
                      </Badge>
                      <Badge variant={docStatus.docs.anexoBravo ? "default" : "outline"} className="text-xs">
                        Anexo Bravo
                      </Badge>
                      <Badge variant={docStatus.docs.inmersiones ? "default" : "outline"} className="text-xs">
                        Inmersiones
                      </Badge>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(docStatus.completed / docStatus.total) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Acciones */}
                  <div className="flex gap-2 pt-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => onViewDetail(operacion)}
                    >
                      <FileText className="w-4 h-4 mr-1" />
                      Ver Detalles
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onEdit(operacion)}
                    >
                      <Settings className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onDelete(operacion.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
