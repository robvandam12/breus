
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, Edit, Network, Search, Filter, Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { NetworkMaintenanceWizard } from "@/components/network-maintenance/NetworkMaintenanceWizard";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export const NetworkMaintenanceManager = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [showWizard, setShowWizard] = useState(false);
  const [selectedType, setSelectedType] = useState<'mantencion' | 'faena_redes'>('mantencion');
  const [editingForm, setEditingForm] = useState<string | null>(null);
  const [viewingForm, setViewingForm] = useState<any>(null);

  const { data: maintenanceForms = [], isLoading, refetch } = useQuery({
    queryKey: ['network-maintenance-forms'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('multix')
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

  const filteredForms = maintenanceForms.filter(form => {
    const matchesSearch = form.codigo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         form.operacion?.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         form.lugar_trabajo?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || form.estado === statusFilter;
    const matchesType = typeFilter === "all" || form.tipo_formulario === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (estado: string) => {
    const colors = {
      'borrador': 'bg-gray-100 text-gray-700',
      'completado': 'bg-green-100 text-green-700',
      'en_progreso': 'bg-blue-100 text-blue-700',
      'cancelado': 'bg-red-100 text-red-700'
    };
    return colors[estado as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  const getTypeColor = (tipo: string) => {
    return tipo === 'mantencion' 
      ? 'bg-blue-100 text-blue-700' 
      : 'bg-green-100 text-green-700';
  };

  const handleCreateNew = (type: 'mantencion' | 'faena_redes') => {
    setSelectedType(type);
    setShowWizard(true);
  };

  const handleComplete = () => {
    setShowWizard(false);
    setEditingForm(null);
    refetch();
  };

  if (showWizard) {
    return (
      <NetworkMaintenanceWizard
        tipoFormulario={selectedType}
        onComplete={handleComplete}
        onCancel={() => setShowWizard(false)}
        editingFormId={editingForm || undefined}
      />
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Cargando formularios de mantención...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header con botones de acción */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Mantención de Redes</h2>
            <p className="text-gray-600">Gestión de formularios operativos para mantención y faenas</p>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={() => handleCreateNew('mantencion')}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Mantención
            </Button>
            <Button 
              onClick={() => handleCreateNew('faena_redes')}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Faena de Redes
            </Button>
          </div>
        </div>

        {/* Filtros */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Network className="h-5 w-5" />
                Formularios de Mantención
              </CardTitle>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Buscar por código, operación o lugar..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full sm:w-80"
                  />
                </div>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="mantencion">Mantención</SelectItem>
                    <SelectItem value="faena_redes">Faena de Redes</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-40">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="borrador">Borrador</SelectItem>
                    <SelectItem value="en_progreso">En Progreso</SelectItem>
                    <SelectItem value="completado">Completado</SelectItem>
                    <SelectItem value="cancelado">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredForms.length === 0 ? (
              <div className="text-center py-8">
                <Network className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No hay formularios de mantención
                </h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm || statusFilter !== "all" || typeFilter !== "all"
                    ? "No se encontraron formularios con los filtros aplicados." 
                    : "Comienza creando tu primer formulario de mantención."}
                </p>
                <div className="flex gap-2 justify-center">
                  <Button onClick={() => handleCreateNew('mantencion')}>
                    Crear Mantención
                  </Button>
                  <Button variant="outline" onClick={() => handleCreateNew('faena_redes')}>
                    Crear Faena de Redes
                  </Button>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Código</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Tipo</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Lugar de Trabajo</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Fecha</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Estado</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Progreso</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredForms.map((form) => (
                      <tr key={form.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <span className="font-mono text-sm">{form.codigo}</span>
                        </td>
                        <td className="py-3 px-4">
                          <Badge className={getTypeColor(form.tipo_formulario)}>
                            {form.tipo_formulario === 'mantencion' ? 'Mantención' : 'Faena de Redes'}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm">{form.lugar_trabajo || 'No especificado'}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm text-gray-600">
                            {form.fecha ? new Date(form.fecha).toLocaleDateString('es-CL') : 'Sin fecha'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <Badge className={getStatusColor(form.estado)}>
                            {form.estado}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ width: `${form.progreso || 0}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-gray-600">{form.progreso || 0}%</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setViewingForm(form)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedType(form.tipo_formulario as 'mantencion' | 'faena_redes');
                                setEditingForm(form.id);
                                setShowWizard(true);
                              }}
                              disabled={form.estado === 'completado'}
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
      </div>

      {/* Modal para ver formulario */}
      {viewingForm && (
        <Dialog open={!!viewingForm} onOpenChange={() => setViewingForm(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Ver Formulario - {viewingForm.codigo}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Código</label>
                  <p className="font-mono">{viewingForm.codigo}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Tipo</label>
                  <Badge className={getTypeColor(viewingForm.tipo_formulario)}>
                    {viewingForm.tipo_formulario === 'mantencion' ? 'Mantención' : 'Faena de Redes'}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Lugar de Trabajo</label>
                  <p>{viewingForm.lugar_trabajo || 'No especificado'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Fecha</label>
                  <p>{viewingForm.fecha ? new Date(viewingForm.fecha).toLocaleDateString('es-CL') : 'Sin fecha'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Estado</label>
                  <Badge className={getStatusColor(viewingForm.estado)}>
                    {viewingForm.estado}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Progreso</label>
                  <p>{viewingForm.progreso || 0}%</p>
                </div>
              </div>
              {viewingForm.multix_data && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Detalles del Formulario</label>
                  <div className="bg-gray-50 p-4 rounded-lg mt-2">
                    <pre className="text-xs text-gray-600 whitespace-pre-wrap">
                      {JSON.stringify(viewingForm.multix_data, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};
