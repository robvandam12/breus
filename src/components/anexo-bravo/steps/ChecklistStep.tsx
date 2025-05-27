
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Shield, AlertTriangle } from 'lucide-react';

// Lista de verificación del Anexo Bravo
const checklistItems = [
  { 
    id: "traje", 
    label: "Traje de buceo en buen estado", 
    category: "Equipo Personal" 
  },
  { 
    id: "regulador", 
    label: "Regulador probado y funcional", 
    category: "Equipo Personal" 
  },
  { 
    id: "tanque", 
    label: "Tanque de aire con presión adecuada", 
    category: "Equipo Personal" 
  },
  { 
    id: "harness", 
    label: "Arnés y compensador de flotabilidad operativos", 
    category: "Equipo Personal" 
  },
  { 
    id: "mascara", 
    label: "Máscara facial y visor en buen estado", 
    category: "Equipo Personal" 
  },
  { 
    id: "aletas", 
    label: "Aletas completas y en buen estado", 
    category: "Equipo Personal" 
  },
  { 
    id: "cuchillo", 
    label: "Cuchillo de buceo accesible", 
    category: "Equipo Personal" 
  },
  { 
    id: "comunicacion", 
    label: "Equipos de comunicación operativos", 
    category: "Equipo Adicional" 
  },
  { 
    id: "iluminacion", 
    label: "Sistemas de iluminación funcionales", 
    category: "Equipo Adicional" 
  },
  { 
    id: "umbilical", 
    label: "Umbilical en buen estado (si aplica)", 
    category: "Equipo Adicional" 
  },
  { 
    id: "compresor", 
    label: "Compresor y suministro de aire verificados", 
    category: "Equipo Adicional" 
  },
  { 
    id: "emergencia", 
    label: "Equipo de emergencia disponible y accesible", 
    category: "Seguridad" 
  },
  { 
    id: "primeros_auxilios", 
    label: "Kit de primeros auxilios completo", 
    category: "Seguridad" 
  },
  { 
    id: "procedimientos", 
    label: "Procedimientos de emergencia revisados", 
    category: "Seguridad" 
  },
  { 
    id: "condiciones", 
    label: "Condiciones ambientales evaluadas", 
    category: "Seguridad" 
  }
];

export const ChecklistStep = ({ form }) => {
  const checklist = form.watch('anexo_bravo_checklist') || {};
  
  const handleCheckItem = (id: string, checked: boolean) => {
    const updatedChecklist = { 
      ...checklist, 
      [id]: {
        ...checklist[id],
        verificado: checked
      }
    };
    form.setValue('anexo_bravo_checklist', updatedChecklist);
  };
  
  const handleAddObservation = (id: string, observation: string) => {
    const updatedChecklist = { 
      ...checklist, 
      [id]: {
        ...checklist[id],
        observaciones: observation
      }
    };
    form.setValue('anexo_bravo_checklist', updatedChecklist);
  };

  // Agrupar los elementos de la lista por categoría
  const groupedItems = checklistItems.reduce((groups: Record<string, typeof checklistItems>, item) => {
    if (!groups[item.category]) {
      groups[item.category] = [];
    }
    groups[item.category].push(item);
    return groups;
  }, {});

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600" />
            Lista de Verificación de Equipos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {Object.entries(groupedItems).map(([category, items]) => (
              <div key={category} className="space-y-4">
                <h3 className="font-medium text-lg">{category}</h3>
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="border rounded-lg p-4 space-y-2">
                      <div className="flex items-start gap-3">
                        <Checkbox
                          id={`check_${item.id}`}
                          checked={checklist[item.id]?.verificado || false}
                          onCheckedChange={(checked) => handleCheckItem(item.id, checked as boolean)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <Label htmlFor={`check_${item.id}`} className="text-base font-medium">
                            {item.label}
                          </Label>
                          <Textarea
                            placeholder="Observaciones (opcional)"
                            className="mt-2 h-20"
                            value={checklist[item.id]?.observaciones || ''}
                            onChange={(e) => handleAddObservation(item.id, e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-sm text-amber-800">
            <strong>Importante:</strong> Verifique todos los equipos antes de la inmersión. Si cualquier equipo no está en condiciones óptimas, no proceda con la operación hasta resolver el problema.
          </div>
        </div>
      </div>
    </div>
  );
};
