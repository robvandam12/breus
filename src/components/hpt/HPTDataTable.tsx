
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, Edit, FileText, Search, Filter } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { HPTWizardComplete } from "./HPTWizardComplete";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export const HPTDataTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editingHpt, setEditingHpt] = useState<string | null>(null);
  const [viewingHpt, setViewingHpt] = useState<any>(null);

  const { data: hptDocuments = [], isLoading } = useQuery({
    queryKey: ['hpt-documents'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hpt')
        .select(`
          *,
          operacion:operacion_id (
            id,
            nombre,
            codigo,
            salmoneras:salmonera_id (nombre),
            contratistas:contratista_id (nombre)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const filteredDocuments = hptDocuments.filter(doc => {
    const matchesSearch = doc.codigo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.operacion?.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.supervisor?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || doc.estado === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (estado: string) => {
    const colors = {
      'borrador': 'bg-gray-100 text-gray-700',
      'firmado': 'bg-green-100 text-green-700',
      'completado': 'bg-blue-100 text-blue-700',
      'cancelado': 'bg-red-100 text-red-700'
    };
    return colors[estado as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Cargando documentos HPT...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Documentos HPT
            </CardTitle>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Buscar por código, operación o supervisor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full sm:w-80"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="borrador">Borrador</SelectItem>
                  <SelectItem value="firmado">Firmado</SelectItem>
                  <SelectItem value="completado">Completado</SelectItem>
                  <SelectItem value="cancelado">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredDocuments.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No hay documentos HPT
              </h3>
              <p className="text-gray-600">
                {searchTerm || statusFilter !== "all" 
                  ? "No se encontraron documentos con los filtros aplicados." 
                  : "Comienza creando tu primer documento HPT."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Código</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Operación</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Supervisor</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Empresa</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Estado</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Fecha</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDocuments.map((doc) => (
                    <tr key={doc.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <span className="font-mono text-sm">{doc.codigo}</span>
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium">{doc.operacion?.nombre || 'Sin operación'}</p>
                          <p className="text-sm text-gray-600">{doc.operacion?.codigo}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm">{doc.supervisor || 'No asignado'}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm">
                          {doc.operacion?.contratistas?.nombre || doc.operacion?.salmoneras?.nombre || 'N/A'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={getStatusColor(doc.estado)}>
                          {doc.estado}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm text-gray-600">
                          {new Date(doc.created_at).toLocaleDateString('es-CL')}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setViewingHpt(doc)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingHpt(doc.id)}
                            disabled={doc.estado === 'firmado' || doc.estado === 'completado'}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal para editar HPT */}
      {editingHpt && (
        <Dialog open={!!editingHpt} onOpenChange={() => setEditingHpt(null)}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Editar HPT</DialogTitle>
            </DialogHeader>
            <HPTWizardComplete
              hptId={editingHpt}
              onComplete={() => setEditingHpt(null)}
              onCancel={() => setEditingHpt(null)}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Modal para ver HPT */}
      {viewingHpt && (
        <Dialog open={!!viewingHpt} onOpenChange={() => setViewingHpt(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Ver HPT - {viewingHpt.codigo}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Código</label>
                  <p className="font-mono">{viewingHpt.codigo}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Estado</label>
                  <Badge className={getStatusColor(viewingHpt.estado)}>
                    {viewingHpt.estado}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Supervisor</label>
                  <p>{viewingHpt.supervisor || 'No asignado'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Fecha</label>
                  <p>{viewingHpt.fecha ? new Date(viewingHpt.fecha).toLocaleDateString('es-CL') : 'No definida'}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Descripción del Trabajo</label>
                <p className="text-sm text-gray-600 mt-1">
                  {viewingHpt.descripcion_trabajo || 'No especificada'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Plan de Trabajo</label>
                <p className="text-sm text-gray-600 mt-1">
                  {viewingHpt.plan_trabajo || 'No especificado'}
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};
