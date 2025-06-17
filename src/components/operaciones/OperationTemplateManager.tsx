
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Plus, Edit, Trash2, Clock, Users, Tools, Settings } from "lucide-react";
import { useOperationTemplates } from "@/hooks/useOperationTemplates";
import { toast } from "@/hooks/use-toast";

interface OperationTemplateManagerProps {
  onCreateFromTemplate: (template: any) => void;
}

export const OperationTemplateManager = ({ onCreateFromTemplate }: OperationTemplateManagerProps) => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<any>(null);
  const [newTemplate, setNewTemplate] = useState({
    nombre: '',
    descripcion: '',
    tipo: 'inspeccion',
    duracion_estimada: 4,
    personal_requerido: {
      supervisor: true,
      buzos: 2,
      apoyo_superficie: 1
    },
    documentos_requeridos: {
      hpt: true,
      anexo_bravo: true,
      multix: false
    },
    equipos_requeridos: ['Equipo Buceo Básico', 'Compresor', 'Embarcación'],
    tareas_predefinidas: []
  });

  const { templates, createTemplate, updateTemplate, deleteTemplate, isLoading } = useOperationTemplates();

  const handleCreateTemplate = async () => {
    try {
      await createTemplate(newTemplate);
      setShowCreateDialog(false);
      setNewTemplate({
        nombre: '',
        descripcion: '',
        tipo: 'inspeccion',
        duracion_estimada: 4,
        personal_requerido: {
          supervisor: true,
          buzos: 2,
          apoyo_superficie: 1
        },
        documentos_requeridos: {
          hpt: true,
          anexo_bravo: true,
          multix: false
        },
        equipos_requeridos: ['Equipo Buceo Básico', 'Compresor', 'Embarcación'],
        tareas_predefinidas: []
      });
      toast({
        title: "Template creado",
        description: "El template ha sido creado exitosamente.",
      });
    } catch (error) {
      console.error('Error creating template:', error);
      toast({
        title: "Error",
        description: "No se pudo crear el template.",
        variant: "destructive",
      });
    }
  };

  const handleEditTemplate = async () => {
    if (!editingTemplate) return;
    
    try {
      await updateTemplate(editingTemplate.id, editingTemplate);
      setEditingTemplate(null);
      toast({
        title: "Template actualizado",
        description: "El template ha sido actualizado exitosamente.",
      });
    } catch (error) {
      console.error('Error updating template:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el template.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTemplate = async (templateId: string) => {
    try {
      await deleteTemplate(templateId);
      toast({
        title: "Template eliminado",
        description: "El template ha sido eliminado exitosamente.",
      });
    } catch (error) {
      console.error('Error deleting template:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el template.",
        variant: "destructive",
      });
    }
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'inspeccion':
        return <Settings className="w-4 h-4" />;
      case 'reparacion':
        return <Tools className="w-4 h-4" />;
      case 'limpieza':
        return <Clock className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getTipoBadge = (tipo: string) => {
    const colors = {
      inspeccion: 'bg-blue-100 text-blue-800',
      reparacion: 'bg-orange-100 text-orange-800',
      limpieza: 'bg-green-100 text-green-800',
      mantenimiento: 'bg-purple-100 text-purple-800'
    };
    return colors[tipo as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Gestión de Templates</h2>
          <p className="text-gray-600">Plantillas predefinidas para operaciones</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Template
        </Button>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template) => (
          <Card key={template.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getTipoIcon(template.tipo)}
                  <h3 className="font-semibold">{template.nombre}</h3>
                </div>
                <Badge className={getTipoBadge(template.tipo)}>
                  {template.tipo}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-gray-600">{template.descripcion}</p>
              
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <Clock className="w-3 h-3" />
                  <span>Duración: {template.duracion_estimada}h</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-3 h-3" />
                  <span>Personal: {template.personal_requerido.buzos} buzos + supervisor</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="w-3 h-3" />
                  <span>Docs: {Object.values(template.documentos_requeridos).filter(Boolean).length}</span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button 
                  size="sm" 
                  onClick={() => onCreateFromTemplate(template)}
                  className="flex-1"
                >
                  Usar Template
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => setEditingTemplate(template)}
                >
                  <Edit className="w-3 h-3" />
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleDeleteTemplate(template.id)}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create Template Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Crear Nuevo Template</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Nombre del template"
              value={newTemplate.nombre}
              onChange={(e) => setNewTemplate({ ...newTemplate, nombre: e.target.value })}
            />
            <Textarea
              placeholder="Descripción"
              value={newTemplate.descripcion}
              onChange={(e) => setNewTemplate({ ...newTemplate, descripcion: e.target.value })}
            />
            <Select 
              value={newTemplate.tipo} 
              onValueChange={(value) => setNewTemplate({ ...newTemplate, tipo: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Tipo de operación" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="inspeccion">Inspección</SelectItem>
                <SelectItem value="reparacion">Reparación</SelectItem>
                <SelectItem value="limpieza">Limpieza</SelectItem>
                <SelectItem value="mantenimiento">Mantenimiento</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex gap-2">
              <Button onClick={handleCreateTemplate}>Crear Template</Button>
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Template Dialog */}
      <Dialog open={!!editingTemplate} onOpenChange={() => setEditingTemplate(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Template</DialogTitle>
          </DialogHeader>
          {editingTemplate && (
            <div className="space-y-4">
              <Input
                placeholder="Nombre del template"
                value={editingTemplate.nombre}
                onChange={(e) => setEditingTemplate({ ...editingTemplate, nombre: e.target.value })}
              />
              <Textarea
                placeholder="Descripción"
                value={editingTemplate.descripcion}
                onChange={(e) => setEditingTemplate({ ...editingTemplate, descripcion: e.target.value })}
              />
              <div className="flex gap-2">
                <Button onClick={handleEditTemplate}>Guardar Cambios</Button>
                <Button variant="outline" onClick={() => setEditingTemplate(null)}>
                  Cancelar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
