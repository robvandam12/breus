
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Search, Eye, Edit, Trash2, Plus, Calendar } from "lucide-react";
import { useOperaciones } from "@/hooks/useOperaciones";
import { EditOperacionForm } from "./EditOperacionForm";
import OperacionDetail from "./OperacionDetail";

export const OperacionesManager = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOperacion, setSelectedOperacion] = useState<any>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingOperacion, setEditingOperacion] = useState<any>(null);

  const { operaciones, isLoading, updateOperacion, deleteOperacion } = useOperaciones();

  const filteredOperaciones = operaciones.filter(op =>
    op.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    op.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewDetail = (operacion: any) => {
    setSelectedOperacion(operacion);
    setShowDetail(true);
  };

  const handleEdit = (operacion: any) => {
    setEditingOperacion(operacion);
    setShowEditForm(true);
  };

  const handleEditSubmit = async (data: any) => {
    if (!editingOperacion) return;
    
    try {
      await updateOperacion({ id: editingOperacion.id, data });
      setShowEditForm(false);
      setEditingOperacion(null);
    } catch (error) {
      console.error('Error updating operation:', error);
    }
  };

  const handleDelete = async (operacionId: string) => {
    if (window.confirm('¿Está seguro de que desea eliminar esta operación?')) {
      try {
        await deleteOperacion(operacionId);
      } catch (error) {
        console.error('Error deleting operation:', error);
      }
    }
  };

  const getEstadoBadgeColor = (estado: string) => {
    const colors: Record<string, string> = {
      activa: 'bg-green-100 text-green-700',
      pausada: 'bg-yellow-100 text-yellow-700',
      completada: 'bg-blue-100 text-blue-700',
      cancelada: 'bg-red-100 text-red-700',
    };
    return colors[estado] || 'bg-gray-100 text-gray-700';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="ml-4 text-gray-500">Cargando operaciones...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card className="ios-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              Gestión de Operaciones
            </CardTitle>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-4 h-4" />
                <Input
                  placeholder="Buscar operaciones..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64 ios-input"
                />
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="ios-card">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">
              {operaciones.length}
            </div>
            <div className="text-sm text-zinc-500">Total Operaciones</div>
          </CardContent>
        </Card>
        <Card className="ios-card">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {operaciones.filter(op => op.estado === 'activa').length}
            </div>
            <div className="text-sm text-zinc-500">Activas</div>
          </CardContent>
        </Card>
        <Card className="ios-card">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">
              {operaciones.filter(op => op.estado === 'pausada').length}
            </div>
            <div className="text-sm text-zinc-500">Pausadas</div>
          </CardContent>
        </Card>
        <Card className="ios-card">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">
              {operaciones.filter(op => op.estado === 'completada').length}
            </div>
            <div className="text-sm text-zinc-500">Completadas</div>
          </CardContent>
        </Card>
      </div>

      {/* Operations Table */}
      {filteredOperaciones.length === 0 ? (
        <Card className="ios-card text-center py-12">
          <CardContent>
            <Calendar className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-zinc-900 mb-2">
              {operaciones.length === 0 ? "No hay operaciones registradas" : "No se encontraron operaciones"}
            </h3>
            <p className="text-zinc-500">
              {operaciones.length === 0 
                ? "Comience creando la primera operación"
                : "Intenta ajustar la búsqueda"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="ios-card">
          <div className="ios-table-container">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Salmonera</TableHead>
                  <TableHead>Sitio</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha Inicio</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOperaciones.map((operacion) => (
                  <TableRow key={operacion.id}>
                    <TableCell>
                      <div className="font-medium">{operacion.codigo}</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{operacion.nombre}</div>
                      {operacion.tareas && (
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {operacion.tareas}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {operacion.salmoneras?.nombre || 'No asignada'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {operacion.sitios?.nombre || 'No asignado'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getEstadoBadgeColor(operacion.estado)}>
                        {operacion.estado}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(operacion.fecha_inicio).toLocaleDateString('es-CL')}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetail(operacion)}
                          className="ios-button-sm"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(operacion)}
                          className="ios-button-sm"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(operacion.id)}
                          className="ios-button-sm text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}

      {/* Detail Dialog */}
      <Dialog open={showDetail} onOpenChange={setShowDetail}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          {selectedOperacion && (
            <OperacionDetail operacion={selectedOperacion} />
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Form Dialog */}
      <Dialog open={showEditForm} onOpenChange={setShowEditForm}>
        <DialogContent className="max-w-2xl">
          {editingOperacion && (
            <EditOperacionForm
              operacion={editingOperacion}
              onSubmit={handleEditSubmit}
              onCancel={() => {
                setShowEditForm(false);
                setEditingOperacion(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
