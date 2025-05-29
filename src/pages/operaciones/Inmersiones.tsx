
import React, { useState, useEffect } from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { RoleBasedSidebar } from "@/components/navigation/RoleBasedSidebar";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Anchor, Calendar, User, Clock, LayoutGrid, LayoutList } from "lucide-react";
import { InmersionWizard } from "@/components/inmersion/InmersionWizard";
import { InmersionActions } from "@/components/inmersion/InmersionActions";
import { useInmersiones } from "@/hooks/useInmersiones";
import { useOperaciones } from "@/hooks/useOperaciones";
import { useRouter } from "@/hooks/useRouter";
import { useSearchParams } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

export default function Inmersiones() {
  const [showWizard, setShowWizard] = useState(false);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [searchParams] = useSearchParams();
  const { navigateTo } = useRouter();
  const { inmersiones, isLoading, createInmersion } = useInmersiones();
  const { operaciones } = useOperaciones();
  
  const operacionId = searchParams.get('operacion');

  useEffect(() => {
    if (operacionId) {
      setShowWizard(true);
    }
  }, [operacionId]);

  const handleCreateInmersion = async (data: any) => {
    try {
      await createInmersion(data);
      
      toast({
        title: "Inmersión creada",
        description: "La inmersión ha sido creada exitosamente.",
      });
      setShowWizard(false);
      
      if (operacionId) {
        navigateTo('/operaciones');
      }
    } catch (error: any) {
      console.error('Error creating inmersion:', error);
      toast({
        title: "Error",
        description: "No se pudo crear la inmersión.",
        variant: "destructive",
      });
    }
  };

  const handleShowWizard = () => {
    setShowWizard(true);
  };

  const handleCancel = () => {
    setShowWizard(false);
    if (operacionId) {
      navigateTo('/operaciones');
    }
  };

  const getOperacionData = (operacionId: string) => {
    return operaciones.find(op => op.id === operacionId);
  };

  const getEstadoBadgeColor = (estado: string) => {
    switch (estado) {
      case 'planificada':
        return 'bg-blue-100 text-blue-800';
      case 'en_progreso':
        return 'bg-yellow-100 text-yellow-800';
      case 'completada':
        return 'bg-green-100 text-green-800';
      case 'cancelada':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleViewInmersion = (inmersion: any) => {
    navigateTo(`/inmersiones/${inmersion.inmersion_id}`);
  };

  const handleEditInmersion = (inmersion: any) => {
    // TODO: Implementar edición de inmersión
    toast({
      title: "Función en desarrollo",
      description: "La edición de inmersiones estará disponible pronto.",
    });
  };

  if (showWizard) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-white">
          <RoleBasedSidebar />
          <main className="flex-1 flex flex-col bg-white">
            <Header 
              title="Nueva Inmersión" 
              subtitle="Crear inmersión de buceo" 
              icon={Anchor} 
            />
            
            <div className="flex-1 overflow-auto bg-white">
              <div className="p-6">
                <InmersionWizard
                  operationId={operacionId || undefined}
                  onComplete={handleCreateInmersion}
                  onCancel={handleCancel}
                />
              </div>
            </div>
          </main>
        </div>
      </SidebarProvider>
    );
  }

  const renderCardsView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {inmersiones.map((inmersion) => {
        const operacion = getOperacionData(inmersion.operacion_id);
        return (
          <Card key={inmersion.inmersion_id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{inmersion.codigo}</CardTitle>
                <div className="flex items-center gap-2">
                  <Badge className={getEstadoBadgeColor(inmersion.estado)}>
                    {inmersion.estado}
                  </Badge>
                  <InmersionActions
                    inmersion={inmersion}
                    onEdit={handleEditInmersion}
                    onView={handleViewInmersion}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {operacion && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>{operacion.nombre}</span>
                </div>
              )}
              
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>{new Date(inmersion.fecha_inmersion).toLocaleDateString()}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <User className="w-4 h-4" />
                <span>{inmersion.buzo_principal}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>{inmersion.hora_inicio} - {inmersion.hora_fin || 'En curso'}</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );

  const renderTableView = () => (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Código</TableHead>
            <TableHead>Operación</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead>Buzo Principal</TableHead>
            <TableHead>Supervisor</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {inmersiones.map((inmersion) => {
            const operacion = getOperacionData(inmersion.operacion_id);
            return (
              <TableRow key={inmersion.inmersion_id}>
                <TableCell className="font-medium">{inmersion.codigo}</TableCell>
                <TableCell>{operacion?.nombre || 'Sin operación'}</TableCell>
                <TableCell>{new Date(inmersion.fecha_inmersion).toLocaleDateString()}</TableCell>
                <TableCell>{inmersion.buzo_principal}</TableCell>
                <TableCell>{inmersion.supervisor}</TableCell>
                <TableCell>
                  <Badge className={getEstadoBadgeColor(inmersion.estado)}>
                    {inmersion.estado}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <InmersionActions
                    inmersion={inmersion}
                    onEdit={handleEditInmersion}
                    onView={handleViewInmersion}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Card>
  );

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-white">
        <RoleBasedSidebar />
        <main className="flex-1 flex flex-col bg-white">
          <Header 
            title="Inmersiones" 
            subtitle="Gestión de inmersiones de buceo" 
            icon={Anchor} 
          >
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <Button
                  variant={viewMode === 'cards' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('cards')}
                  className="h-8 px-3"
                >
                  <LayoutGrid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'table' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('table')}
                  className="h-8 px-3"
                >
                  <LayoutList className="w-4 h-4" />
                </Button>
              </div>
              <Button onClick={handleShowWizard}>
                <Plus className="w-4 h-4 mr-2" />
                Nueva Inmersión
              </Button>
            </div>
          </Header>
          
          <div className="flex-1 overflow-auto bg-white">
            <div className="p-6">
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Cargando inmersiones...</p>
                </div>
              ) : inmersiones.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <Anchor className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No hay inmersiones</h3>
                    <p className="text-gray-600 mb-6">
                      Comience creando su primera inmersión de buceo.
                    </p>
                    <Button onClick={handleShowWizard}>
                      <Plus className="w-4 h-4 mr-2" />
                      Nueva Inmersión
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                viewMode === 'cards' ? renderCardsView() : renderTableView()
              )}
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
