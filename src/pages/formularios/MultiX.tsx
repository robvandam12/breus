
import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { Badge } from "@/components/ui/badge";
import { Plus, FileText, Calendar, Eye, Edit, Trash2 } from "lucide-react";
import { useMultiX } from "@/hooks/useMultiX";
import { MultiXWizard } from "@/components/multix/MultiXWizard";
import { useIsMobile } from '@/hooks/use-mobile';
import { MultiXRecord } from "@/types/multix";

export default function MultiX() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedMultiX, setSelectedMultiX] = useState<MultiXRecord | null>(null);
  const [showWizard, setShowWizard] = useState(false);
  const [wizardType, setWizardType] = useState<'mantencion' | 'faena'>('mantencion');
  const isMobile = useIsMobile();
  
  const { multiXRecords, isLoading, createMultiX, deleteMultiX } = useMultiX();

  const handleCreateNew = async (tipo: 'mantencion' | 'faena') => {
    const codigo = `MULTIX-${tipo.toUpperCase()}-${Date.now()}`;
    const fecha = new Date().toISOString().split('T')[0];
    
    try {
      const result = await createMultiX.mutateAsync({
        codigo,
        tipo_formulario: tipo,
        fecha
      });
      
      setSelectedMultiX(result);
      setWizardType(tipo);
      setShowWizard(true);
      setShowCreateDialog(false);
    } catch (error) {
      console.error('Error creating MultiX:', error);
    }
  };

  const handleEdit = (multiX: MultiXRecord) => {
    setSelectedMultiX(multiX);
    setWizardType(multiX.tipo_formulario);
    setShowWizard(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este formulario?')) {
      await deleteMultiX.mutateAsync(id);
    }
  };

  const handleCloseWizard = () => {
    setShowWizard(false);
    setSelectedMultiX(null);
  };

  const getEstadoBadgeColor = (estado: string) => {
    const colors: Record<string, string> = {
      borrador: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      revision: 'bg-blue-100 text-blue-800 border-blue-200',
      firmado: 'bg-green-100 text-green-800 border-green-200',
    };
    return colors[estado] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const CreateDialog = () => (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Crear Nuevo Formulario MultiX</CardTitle>
        <CardDescription>
          Selecciona el tipo de formulario que deseas crear
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          onClick={() => handleCreateNew('mantencion')}
          className="w-full h-20 flex-col gap-2"
          variant="outline"
          disabled={createMultiX.isPending}
        >
          <FileText className="w-6 h-6" />
          <div className="text-center">
            <div className="font-medium">Boleta de Mantención</div>
            <div className="text-xs text-muted-foreground">Mantención de Redes</div>
          </div>
        </Button>
        
        <Button
          onClick={() => handleCreateNew('faena')}
          className="w-full h-20 flex-col gap-2"
          variant="outline"
          disabled={createMultiX.isPending}
        >
          <FileText className="w-6 h-6" />
          <div className="text-center">
            <div className="font-medium">Boleta de Faena</div>
            <div className="text-xs text-muted-foreground">Faena de Redes</div>
          </div>
        </Button>
      </CardContent>
    </Card>
  );

  if (showWizard) {
    const WizardComponent = (
      <MultiXWizard
        multiXId={selectedMultiX?.id}
        tipo={wizardType}
        onClose={handleCloseWizard}
      />
    );

    if (isMobile) {
      return (
        <Drawer open={showWizard} onOpenChange={setShowWizard}>
          <DrawerContent>
            <div className="p-4 pt-6 max-h-[90vh] overflow-y-auto">
              {WizardComponent}
            </div>
          </DrawerContent>
        </Drawer>
      );
    }

    return (
      <Dialog open={showWizard} onOpenChange={setShowWizard}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          {WizardComponent}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <MainLayout
      title="MultiX - Formularios de Redes"
      subtitle="Gestión de boletas de mantención y faena de redes"
      icon={FileText}
      headerChildren={
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Formulario
        </Button>
      }
    >
      <div className="space-y-6">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-20 bg-muted rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : multiXRecords.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              No hay formularios MultiX
            </h3>
            <p className="text-muted-foreground mb-4">
              Comienza creando tu primer formulario de mantención o faena de redes.
            </p>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Crear Primer Formulario
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {multiXRecords.map((multiX) => (
              <Card key={multiX.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">
                        {multiX.tipo_formulario === 'mantencion' ? 
                          'Boleta de Mantención' : 'Boleta de Faena'}
                      </CardTitle>
                      <CardDescription>{multiX.codigo}</CardDescription>
                    </div>
                    <Badge className={getEstadoBadgeColor(multiX.estado)}>
                      {multiX.estado}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(multiX.fecha).toLocaleDateString('es-CL')}</span>
                    </div>
                    
                    {multiX.lugar_trabajo && (
                      <div className="text-sm">
                        <span className="font-medium">Lugar:</span> {multiX.lugar_trabajo}
                      </div>
                    )}
                    
                    <div className="text-sm">
                      <span className="font-medium">Progreso:</span> {multiX.progreso}%
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleEdit(multiX)}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Editar
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleDelete(multiX.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Dialog para crear nuevo formulario */}
      {isMobile ? (
        <Drawer open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DrawerContent>
            <div className="p-4 pt-6">
              <CreateDialog />
            </div>
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent>
            <CreateDialog />
          </DialogContent>
        </Dialog>
      )}
    </MainLayout>
  );
}
