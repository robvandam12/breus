
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  FileText, 
  Plus, 
  Edit, 
  Trash2, 
  Copy,
  Settings,
  CheckCircle2,
  Clock,
  Loader2
} from "lucide-react";
import { useOperationTemplates, type OperationTemplate } from "@/hooks/useOperationTemplates";
import { toast } from "@/hooks/use-toast";

interface OperationTemplateManagerProps {
  onSelectTemplate?: (template: OperationTemplate) => void;
  onCreateFromTemplate?: (template: OperationTemplate) => void;
}

export const OperationTemplateManager = ({ onSelectTemplate, onCreateFromTemplate }: OperationTemplateManagerProps) => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<OperationTemplate | null>(null);
  const [newTemplate, setNewTemplate] = useState({
    nombre: '',
    descripcion: '',
    tipo_trabajo: '',
    tareas_predefinidas: '',
    duracion_estimada: 4,
    buzos_requeridos: 2,
    asistentes_requeridos: 1,
    supervisor_requerido: true,
    hpt_requerido: true,
    anexo_bravo_requerido: true,
    multix_requerido: false
  });

  const { 
    templates, 
    isLoading, 
    createFromTemplate, 
    isCreatingFromTemplate,
    createTemplate,
    isCreatingTemplate 
  } = useOperationTemplates();

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'inspeccion': return 'bg-blue-100 text-blue-800';
      case 'reparacion': return 'bg-red-100 text-red-800';
      case 'limpieza': return 'bg-green-100 text-green-800';
      case 'mantenimiento': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleUseTemplate = async (template: OperationTemplate) => {
    try {
      const result = await createFromTemplate({ templateId: template.id });
      onCreateFromTemplate?.(template);
      toast({
        title: "Operación creada",
        description: `Se ha creado una nueva operación basada en "${template.nombre}"`
      });
    } catch (error) {
      console.error('Error using template:', error);
    }
  };

  const handleCreateTemplate = async () => {
    try {
      const templateData = {
        nombre: newTemplate.nombre,
        descripcion: newTemplate.descripcion,
        tipo_trabajo: newTemplate.tipo_trabajo,
        tareas_predefinidas: newTemplate.tareas_predefinidas.split('\n').filter(t => t.trim()),
        duracion_estimada: newTemplate.duracion_estimada,
        personal_requerido: {
          supervisor: newTemplate.supervisor_requerido,
          buzos: newTemplate.buzos_requeridos,
          asistentes: newTemplate.asistentes_requeridos
        },
        documentos_requeridos: {
          hpt: newTemplate.hpt_requerido,
          anexoBravo: newTemplate.anexo_bravo_requerido,
          multiX: newTemplate.multix_requerido
        },
        configuracion: {}
      };

      await createTemplate(templateData);
      setShowCreateDialog(false);
      setNewTemplate({
        nombre: '',
        descripcion: '',
        tipo_trabajo: '',
        tareas_predefinidas: '',
        duracion_estimada: 4,
        buzos_requeridos: 2,
        asistentes_requeridos: 1,
        supervisor_requerido: true,
        hpt_requerido: true,
        anexo_bravo_requerido: true,
        multix_requerido: false
      });
    } catch (error) {
      console.error('Error creating template:', error);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Templates de Operación
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span className="ml-2">Cargando templates...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Templates de Operación
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowCreateDialog(true)}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Nuevo Template
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map((template) => (
              <Card key={template.id} className="border-2 hover:border-blue-200 transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Badge className={getTipoColor(template.tipo_trabajo)}>
                      {template.tipo_trabajo}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" onClick={() => setEditingTemplate(template)}>
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium">{template.nombre}</h4>
                    <p className="text-sm text-gray-600 mt-1">{template.descripcion}</p>
                  </div>
                </CardHeader>
                <CardContent className="pt-0 space-y-3">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Duración:</span>
                      <span>{template.duracion_estimada}h</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Personal:</span>
                      <span>{template.personal_requerido.buzos} buzos</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Usado:</span>
                      <span>{template.usado_veces} veces</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-medium text-gray-700">Tareas:</p>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {template.tareas_predefinidas.slice(0, 3).map((tarea, index) => (
                        <li key={index} className="flex items-start gap-1">
                          <span className="text-blue-500">•</span>
                          <span>{tarea}</span>
                        </li>
                      ))}
                      {template.tareas_predefinidas.length > 3 && (
                        <li className="text-gray-400 text-xs">
                          +{template.tareas_predefinidas.length - 3} más...
                        </li>
                      )}
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-medium text-gray-700">Documentos Requeridos:</p>
                    <div className="flex gap-2 flex-wrap">
                      {template.documentos_requeridos.hpt && (
                        <Badge variant="outline" className="text-xs">HPT</Badge>
                      )}
                      {template.documentos_requeridos.anexoBravo && (
                        <Badge variant="outline" className="text-xs">Anexo Bravo</Badge>
                      )}
                      {template.documentos_requeridos.multiX && (
                        <Badge variant="outline" className="text-xs">MultiX</Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      className="flex-1 flex items-center gap-2"
                      onClick={() => handleUseTemplate(template)}
                      disabled={isCreatingFromTemplate}
                    >
                      {isCreatingFromTemplate ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                      Usar Template
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onSelectTemplate?.(template)}
                    >
                      <Settings className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {templates.length === 0 && (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">No hay templates disponibles</p>
              <Button className="mt-4" onClick={() => setShowCreateDialog(true)}>
                Crear primer template
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Template Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Crear Nuevo Template</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Nombre</label>
                <Input 
                  placeholder="Nombre del template" 
                  value={newTemplate.nombre}
                  onChange={(e) => setNewTemplate({...newTemplate, nombre: e.target.value})}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Tipo de Trabajo</label>
                <Select value={newTemplate.tipo_trabajo} onValueChange={(value) => setNewTemplate({...newTemplate, tipo_trabajo: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inspeccion">Inspección</SelectItem>
                    <SelectItem value="reparacion">Reparación</SelectItem>
                    <SelectItem value="limpieza">Limpieza</SelectItem>
                    <SelectItem value="mantenimiento">Mantenimiento</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium">Descripción</label>
              <Textarea 
                placeholder="Descripción del template" 
                value={newTemplate.descripcion}
                onChange={(e) => setNewTemplate({...newTemplate, descripcion: e.target.value})}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Tareas Predefinidas (una por línea)</label>
              <Textarea 
                placeholder="Inspección visual&#10;Verificación de equipos&#10;Reporte de estado"
                rows={4}
                value={newTemplate.tareas_predefinidas}
                onChange={(e) => setNewTemplate({...newTemplate, tareas_predefinidas: e.target.value})}
              />
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium">Duración (horas)</label>
                <Input 
                  type="number" 
                  value={newTemplate.duracion_estimada}
                  onChange={(e) => setNewTemplate({...newTemplate, duracion_estimada: parseInt(e.target.value) || 0})}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Buzos Requeridos</label>
                <Input 
                  type="number" 
                  value={newTemplate.buzos_requeridos}
                  onChange={(e) => setNewTemplate({...newTemplate, buzos_requeridos: parseInt(e.target.value) || 0})}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Asistentes</label>
                <Input 
                  type="number" 
                  value={newTemplate.asistentes_requeridos}
                  onChange={(e) => setNewTemplate({...newTemplate, asistentes_requeridos: parseInt(e.target.value) || 0})}
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium">Documentos Requeridos</label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="hpt" 
                    checked={newTemplate.hpt_requerido}
                    onCheckedChange={(checked) => setNewTemplate({...newTemplate, hpt_requerido: !!checked})}
                  />
                  <label htmlFor="hpt" className="text-sm">HPT (Herramientas y Procedimientos)</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="anexo" 
                    checked={newTemplate.anexo_bravo_requerido}
                    onCheckedChange={(checked) => setNewTemplate({...newTemplate, anexo_bravo_requerido: !!checked})}
                  />
                  <label htmlFor="anexo" className="text-sm">Anexo Bravo (Análisis de Riesgo)</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="multix" 
                    checked={newTemplate.multix_requerido}
                    onCheckedChange={(checked) => setNewTemplate({...newTemplate, multix_requerido: !!checked})}
                  />
                  <label htmlFor="multix" className="text-sm">MultiX (Operaciones Complejas)</label>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancelar
              </Button>
              <Button 
                onClick={handleCreateTemplate}
                disabled={isCreatingTemplate || !newTemplate.nombre || !newTemplate.tipo_trabajo}
              >
                {isCreatingTemplate ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Creando...
                  </>
                ) : (
                  'Crear Template'
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
