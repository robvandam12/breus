
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { OperacionInfo } from "./OperacionInfo";
import { OperacionDocuments } from "./OperacionDocuments";
import { OperacionInmersiones } from "./OperacionInmersiones";
import { OperacionTimeline } from "./OperacionTimeline";
import { OperacionTeamManagerEnhanced } from "./OperacionTeamManagerEnhanced";
import { EditOperacionForm } from "./EditOperacionForm";
import { useOperaciones } from "@/hooks/useOperaciones";

interface OperacionDetailModalProps {
  operacion: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const OperacionDetailModal: React.FC<OperacionDetailModalProps> = ({
  operacion,
  open,
  onOpenChange
}) => {
  const [activeTab, setActiveTab] = useState("general");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { updateOperacion } = useOperaciones();

  const handleEditOperacion = async (data: any) => {
    try {
      await updateOperacion({ id: operacion.id, data });
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error('Error updating operacion:', error);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl font-bold">
                {operacion.nombre} - {operacion.codigo}
              </DialogTitle>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsEditDialogOpen(true)}
              >
                <Edit className="w-4 h-4 mr-2" />
                Editar
              </Button>
            </div>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="equipo">Equipo de Buceo</TabsTrigger>
              <TabsTrigger value="documentos">Documentos</TabsTrigger>
              <TabsTrigger value="inmersiones">Inmersiones</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-6 mt-6">
              <OperacionInfo operacion={operacion} />
              <OperacionDocuments operacionId={operacion.id} operacion={operacion} />
            </TabsContent>

            <TabsContent value="equipo" className="space-y-6 mt-6">
              <OperacionTeamManagerEnhanced 
                operacionId={operacion.id} 
                salmoneraId={operacion.salmonera_id || undefined}
                contratistaId={operacion.contratista_id || undefined}
              />
            </TabsContent>

            <TabsContent value="documentos" className="space-y-6 mt-6">
              <OperacionDocuments operacionId={operacion.id} operacion={operacion} />
            </TabsContent>

            <TabsContent value="inmersiones" className="space-y-6 mt-6">
              <OperacionInmersiones operacionId={operacion.id} />
            </TabsContent>

            <TabsContent value="timeline" className="space-y-6 mt-6">
              <OperacionTimeline operacionId={operacion.id} />
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl">
          <EditOperacionForm
            operacion={operacion}
            onSubmit={handleEditOperacion}
            onCancel={() => setIsEditDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};
