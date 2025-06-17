import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  FileText, 
  Plus, 
  Edit, 
  Trash2, 
  Copy,
  Settings,
  CheckCircle2,
  Clock
} from "lucide-react";

interface OperationTemplate {
  id: string;
  nombre: string;
  descripcion: string;
  tipo_trabajo: string;
  tareas_predefinidas: string[];
  duracion_estimada: number;
  personal_requerido: {
    supervisor: boolean;
    buzos: number;
    asistentes: number;
  };
  documentos_requeridos: {
    hpt: boolean;
    anexoBravo: boolean;
    multiX: boolean;
  };
  configuracion: any;
  usado_veces: number;
  created_at: string;
}

interface OperationTemplateManagerProps {
  onSelectTemplate?: (template: OperationTemplate) => void;
  onCreateFromTemplate?: (template: OperationTemplate) => void;
}

export const OperationTemplateManager = ({ onSelectTemplate, onCreateFromTemplate }: OperationTemplateManagerProps) => {
  const [templates] = useState<OperationTemplate[]>([
    {
      id: '1',
      nombre: 'Inspección de Redes',
      descripcion: 'Template estándar para inspección y mantenimiento de redes de cultivo',
      tipo_trabajo: 'inspeccion',
      tareas_predefinidas: [
        'Inspección visual de estructura',
        'Verificación de tensiones',
        'Reporte de estado general'
      ],
      duracion_estimada: 4,
      personal_requerido: {
        supervisor: true,
        buzos: 2,
        asistentes: 1
      },
      documentos_requeridos: {
        hpt: true,
        anexoBravo: true,
        multiX: false
      },
      configuracion: {},
      usado_veces: 15,
      created_at: '2024-01-15'
    },
    {
      id: '2',
      nombre: 'Reparación Estructural',
      descripcion: 'Template para trabajos de reparación y soldadura submarina',
      tipo_trabajo: 'reparacion',
      tareas_predefinidas: [
        'Evaluación de daños',
        'Preparación de superficie',
        'Soldadura submarina',
        'Control de calidad'
      ],
      duracion_estimada: 8,
      personal_requerido: {
        supervisor: true,
        buzos: 3,
        asistentes: 2
      },
      documentos_requeridos: {
        hpt: true,
        anexoBravo: true,
        multiX: true
      },
      configuracion: {},
      usado_veces: 8,
      created_at: '2024-01-10'
    },
    {
      id: '3',
      nombre: 'Limpieza de Jaulas',
      descripcion: 'Template para operaciones rutinarias de limpieza',
      tipo_trabajo: 'limpieza',
      tareas_predefinidas: [
        'Limpieza de bioincrustaciones',
        'Inspección de mallas',
        'Reporte de estado'
      ],
      duracion_estimada: 6,
      personal_requerido: {
        supervisor: true,
        buzos: 2,
        asistentes: 1
      },
      documentos_requeridos: {
        hpt: true,
        anexoBravo: false,
        multiX: false
      },
      configuracion: {},
      usado_veces: 22,
      created_at: '2024-01-05'
    }
  ]);

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<OperationTemplate | null>(null);

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'inspeccion': return 'bg-blue-100 text-blue-800';
      case 'reparacion': return 'bg-red-100 text-red-800';
      case 'limpieza': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleUseTemplate = (template: OperationTemplate) => {
    onCreateFromTemplate?.(template);
  };

  return (
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
                  >
                    <Copy className="w-3 h-3" />
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

      {/* Create Template Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Crear Nuevo Template</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Nombre</label>
                <Input placeholder="Nombre del template" />
              </div>
              <div>
                <label className="text-sm font-medium">Tipo de Trabajo</label>
                <Input placeholder="ej: inspección, reparación" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Descripción</label>
              <Textarea placeholder="Descripción del template" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium">Duración (horas)</label>
                <Input type="number" placeholder="4" />
              </div>
              <div>
                <label className="text-sm font-medium">Buzos Requeridos</label>
                <Input type="number" placeholder="2" />
              </div>
              <div>
                <label className="text-sm font-medium">Asistentes</label>
                <Input type="number" placeholder="1" />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancelar
              </Button>
              <Button onClick={() => setShowCreateDialog(false)}>
                Crear Template
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
