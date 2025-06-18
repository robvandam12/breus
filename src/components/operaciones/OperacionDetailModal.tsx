import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from "@/components/ui/badge";
import { Edit } from "lucide-react";
import { OperacionInfo } from "@/components/operaciones/OperacionInfo";
import { OperacionDocuments } from "@/components/operaciones/OperacionDocuments";
import { OperacionInmersiones } from "@/components/operaciones/OperacionInmersiones";
import { OperacionTimeline } from "@/components/operaciones/OperacionTimeline";
import { OperacionTeamManagerEnhanced } from "@/components/operaciones/OperacionTeamManagerEnhanced";
import { EditOperacionForm } from "@/components/operaciones/EditOperacionForm";
import { useOperaciones } from "@/hooks/useOperaciones";

interface OperacionDetailModalProps {
  operacion: any;
  isOpen: boolean;
  onClose: () => void;
}

const OperacionDetailModal = ({ operacion, isOpen, onClose }: OperacionDetailModalProps) => {
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

  const getStatusColor = (estado: string) => {
    const colors = {
      'activa': 'bg-green-100 text-green-700',
      'pausada': 'bg-yellow-100 text-yellow-700',
      'completada': 'bg-blue-100 text-blue-700',
      'cancelada': 'bg-red-100 text-red-700'
    };
    return colors[estado as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto z-50">
        {/* Header del Modal */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{operacion.nombre}</h2>
            <p className="text-gray-600">Código: {operacion.codigo}</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge className={getStatusColor(operacion.estado)}>
              {operacion.estado}
            </Badge>
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <Button 
                variant="outline"
                onClick={() => setIsEditDialogOpen(true)}
                className="flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Editar Operación
              </Button>
              <DialogContent className="max-w-3xl">
                <EditOperacionForm
                  operacion={operacion}
                  onSubmit={handleEditOperacion}
                  onCancel={() => setIsEditDialogOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="equipo">Equipo de Buceo</TabsTrigger>
              <TabsTrigger value="documentos">Documentos</TabsTrigger>
              <TabsTrigger value="inmersiones">Inmersiones</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-6">
              <OperacionInfo operacion={operacion} />
              <OperacionDocuments operacionId={operacion.id} operacion={operacion} />
            </TabsContent>

            <TabsContent value="equipo" className="space-y-6">
              <OperacionTeamManagerEnhanced 
                operacionId={operacion.id} 
                salmoneraId={operacion.salmonera_id || undefined}
                contratistaId={operacion.contratista_id || undefined}
              />
            </TabsContent>

            <TabsContent value="documentos" className="space-y-6">
              <OperacionDocuments operacionId={operacion.id} operacion={operacion} />
            </TabsContent>

            <TabsContent value="inmersiones" className="space-y-6">
              <OperacionInmersiones operacionId={operacion.id} />
            </TabsContent>

            <TabsContent value="timeline" className="space-y-6">
              <OperacionTimeline operacionId={operacion.id} />
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OperacionDetailModal;
