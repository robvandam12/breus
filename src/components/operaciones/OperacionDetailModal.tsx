import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Plus } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { InmersionWizard } from "@/components/inmersion/InmersionWizard";
import { useInmersiones } from "@/hooks/useInmersiones";

interface Operacion {
  id: string;
  nombre: string;
  codigo: string;
  fecha_inicio: Date;
  fecha_termino: Date;
  descripcion: string;
}

interface OperacionDetailModalProps {
  operacion: Operacion;
  isOpen: boolean;
  onClose: () => void;
}

export const OperacionDetailModal = ({ operacion, isOpen, onClose }: OperacionDetailModalProps) => {
  const [activeTab, setActiveTab] = useState('general');
  const [showInmersionModal, setShowInmersionModal] = useState(false);
  const { inmersiones, createInmersion } = useInmersiones();
  
  const operacionInmersiones = inmersiones.filter(inmersion => inmersion.operacion_id === operacion.id);

  const handleCreateInmersion = () => {
    setShowInmersionModal(true);
  };

  const handleInmersionComplete = async (data: any) => {
    try {
      // Set the operation ID since it's known from context
      const inmersionData = {
        ...data,
        operacion_id: operacion.id
      };
      await createInmersion(inmersionData);
      setShowInmersionModal(false);
    } catch (error) {
      console.error('Error creating immersion:', error);
    }
  };

  const renderGeneralTab = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="nombre">Nombre</Label>
        <Input id="nombre" value={operacion.nombre} disabled />
      </div>
      <div>
        <Label htmlFor="codigo">Código</Label>
        <Input id="codigo" value={operacion.codigo} disabled />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Fecha de Inicio</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !operacion.fecha_inicio && "text-muted-foreground")}>
                <CalendarIcon className="mr-2 h-4 w-4" />
                {operacion.fecha_inicio ? format(operacion.fecha_inicio, "PPP", { locale: es }) : <span>Seleccionar fecha</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" >
              <Calendar
                mode="single"
                selected={operacion.fecha_inicio}
                onSelect={() => {}}
                disabled
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <div>
          <Label>Fecha de Término</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !operacion.fecha_termino && "text-muted-foreground")}>
                <CalendarIcon className="mr-2 h-4 w-4" />
                {operacion.fecha_termino ? format(operacion.fecha_termino, "PPP", { locale: es }) : <span>Seleccionar fecha</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" >
              <Calendar
                mode="single"
                selected={operacion.fecha_termino}
                onSelect={() => {}}
                disabled
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div>
        <Label htmlFor="descripcion">Descripción</Label>
        <Input id="descripcion" value={operacion.descripcion} disabled />
      </div>
    </div>
  );

  const renderInmersionesTab = () => (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={handleCreateInmersion}>
          <Plus className="w-4 h-4 mr-2" />
          Nueva Inmersión
        </Button>
      </div>
      {operacionInmersiones.length > 0 ? (
        <ul>
          {operacionInmersiones.map(inmersion => (
            <li key={inmersion.inmersion_id}>{inmersion.codigo}</li>
          ))}
        </ul>
      ) : (
        <p>No hay inmersiones asociadas a esta operación.</p>
      )}
    </div>
  );

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Detalle de Operación: {operacion.nombre}</DialogTitle>
          </DialogHeader>
          <Tabs defaultValue="general" className="space-y-4">
            <TabsList>
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="inmersiones">Inmersiones</TabsTrigger>
            </TabsList>
            <TabsContent value="general">
              {renderGeneralTab()}
            </TabsContent>
            <TabsContent value="inmersiones">
              {renderInmersionesTab()}
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Modal para nueva inmersión */}
      <Dialog open={showInmersionModal} onOpenChange={setShowInmersionModal}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nueva Inmersión para {operacion.nombre}</DialogTitle>
          </DialogHeader>
          <InmersionWizard
            operationId={operacion.id}
            onComplete={handleInmersionComplete}
            onCancel={() => setShowInmersionModal(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};
