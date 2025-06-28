
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Plus, 
  Calendar,
  Building2,
  Users,
  MapPin,
  MoreHorizontal,
  Filter
} from "lucide-react";
import { useOperaciones } from "@/hooks/useOperaciones";
import { OperationFlowWizard } from "./OperationFlowWizard";
import { CreateOperacionForm } from "./CreateOperacionForm";
import { WizardDialog } from "@/components/forms/WizardDialog";

export const OperacionesManager = () => {
  const { operaciones, isLoading } = useOperaciones();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("table");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const filteredOperaciones = operaciones.filter(operacion =>
    operacion.codigo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    operacion.nombre?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (estado: string) => {
    const statusMap = {
      'activa': { variant: 'default' as const, text: 'Activa' },
      'pausada': { variant: 'secondary' as const, text: 'Pausada' },
      'completada': { variant: 'outline' as const, text: 'Completada' },
      'cancelada': { variant: 'destructive' as const, text: 'Cancelada' },
    };
    return statusMap[estado as keyof typeof statusMap] || { variant: 'secondary' as const, text: estado };
  };

  const handleCreateOperacion = async (data: any) => {
    // Lógica para crear operación
    console.log('Creating operacion:', data);
    setIsCreateDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header con búsqueda y acciones */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Buscar operaciones..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filtros
          </Button>
          
          <WizardDialog
            triggerText="Nueva Operación"
            triggerIcon={Plus}
            triggerClassName="bg-blue-600 hover:bg-blue-700"
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
            size="xl"
          >
            <CreateOperacionForm
              onSubmit={handleCreateOperacion}
              onCancel={() => setIsCreateDialogOpen(false)}
            />
          </WizardDialog>
        </div>
      </div>

      {/* Tabs de visualización */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="table">Tabla</TabsTrigger>
          <TabsTrigger value="cards">Tarjetas</TabsTrigger>
          <TabsTrigger value="map">Mapa</TabsTrigger>
        </TabsList>

        <TabsContent value="table" className="space-y-4">
          {isLoading ? (
            <Card>
              <CardContent className="p-6 text-center">
                <p>Cargando operaciones...</p>
              </CardContent>
            </Card>
          ) : filteredOperaciones.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No hay operaciones registradas
                </h3>
                <p className="text-gray-500 mb-4">
                  Comienza creando la primera operación
                </p>
                <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Nueva Operación
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b bg-gray-50">
                      <tr>
                        <th className="text-left p-4 font-medium">Código</th>
                        <th className="text-left p-4 font-medium">Nombre</th>
                        <th className="text-left p-4 font-medium">Estado</th>
                        <th className="text-left p-4 font-medium">Fecha Inicio</th>
                        <th className="text-left p-4 font-medium">Salmonera</th>
                        <th className="text-left p-4 font-medium">Contratista</th>
                        <th className="text-right p-4 font-medium">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOperaciones.map((operacion) => {
                        const status = getStatusBadge(operacion.estado);
                        return (
                          <tr key={operacion.id} className="border-b hover:bg-gray-50">
                            <td className="p-4 font-medium">{operacion.codigo}</td>
                            <td className="p-4">{operacion.nombre}</td>
                            <td className="p-4">
                              <Badge variant={status.variant}>{status.text}</Badge>
                            </td>
                            <td className="p-4">
                              {new Date(operacion.fecha_inicio).toLocaleDateString('es-CL')}
                            </td>
                            <td className="p-4 text-sm text-gray-600">
                              {operacion.salmonera?.nombre || '-'}
                            </td>
                            <td className="p-4 text-sm text-gray-600">
                              {operacion.contratista?.nombre || '-'}
                            </td>
                            <td className="p-4 text-right">
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="cards" className="space-y-4">
          {isLoading ? (
            <Card>
              <CardContent className="p-6 text-center">
                <p>Cargando operaciones...</p>
              </CardContent>
            </Card>
          ) : filteredOperaciones.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No hay operaciones registradas
                </h3>
                <p className="text-gray-500 mb-4">
                  Comienza creando la primera operación
                </p>
                <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Nueva Operación
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredOperaciones.map((operacion) => {
                const status = getStatusBadge(operacion.estado);
                return (
                  <Card key={operacion.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">{operacion.codigo}</CardTitle>
                        <Badge variant={status.variant}>{status.text}</Badge>
                      </div>
                      <p className="text-sm text-gray-600">{operacion.nombre}</p>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>{new Date(operacion.fecha_inicio).toLocaleDateString('es-CL')}</span>
                      </div>
                      
                      {operacion.salmonera && (
                        <div className="flex items-center gap-2 text-sm">
                          <Building2 className="w-4 h-4 text-blue-500" />
                          <span>{operacion.salmonera.nombre}</span>
                        </div>
                      )}
                      
                      {operacion.contratista && (
                        <div className="flex items-center gap-2 text-sm">
                          <Users className="w-4 h-4 text-orange-500" />
                          <span>{operacion.contratista.nombre}</span>
                        </div>
                      )}
                      
                      <div className="pt-2 border-t">
                        <Button variant="outline" size="sm" className="w-full">
                          Ver Detalles
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="map" className="space-y-4">
          <Card>
            <CardContent className="p-12 text-center">
              <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Vista de Mapa
              </h3>
              <p className="text-gray-500">
                La visualización en mapa estará disponible próximamente
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
