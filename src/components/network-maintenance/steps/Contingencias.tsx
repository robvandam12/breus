
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle, FileText } from "lucide-react";
import type { NetworkMaintenanceData } from '@/types/network-maintenance';

interface ContingenciasProps {
  formData: NetworkMaintenanceData;
  updateFormData: (updates: Partial<NetworkMaintenanceData>) => void;
  readOnly?: boolean;
}

export const Contingencias = ({ formData, updateFormData, readOnly = false }: ContingenciasProps) => {
  const contingencias = formData.contingencias || {};

  const updateContingencia = (campo: string, valor: string) => {
    updateFormData({
      contingencias: {
        ...contingencias,
        [campo]: valor
      }
    });
  };

  const tiposContingencia = [
    { key: 'mortalidad', label: 'Mortalidad', placeholder: 'Registrar eventos de mortalidad...' },
    { key: 'bloom_algas', label: 'Bloom de Algas', placeholder: 'Registrar presencia de bloom de algas...' },
    { key: 'falla_equipos', label: 'Falla de Equipos', placeholder: 'Registrar fallas en equipos...' },
    { key: 'condiciones_mar', label: 'Condiciones del Mar', placeholder: 'Registrar condiciones adversas...' },
    { key: 'accidentes', label: 'Accidentes/Incidentes', placeholder: 'Registrar accidentes o incidentes...' },
    { key: 'otros_eventos', label: 'Otros Eventos', placeholder: 'Otros eventos relevantes...' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          Contingencias y Eventos
        </h3>
        <p className="text-sm text-gray-600">
          Registro de contingencias y eventos ocurridos durante la faena
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Registro de Contingencias</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {tiposContingencia.map((tipo) => (
            <div key={tipo.key} className="space-y-2">
              <Label htmlFor={tipo.key}>{tipo.label}</Label>
              <Textarea
                id={tipo.key}
                value={contingencias[tipo.key] || ''}
                onChange={(e) => updateContingencia(tipo.key, e.target.value)}
                placeholder={tipo.placeholder}
                rows={3}
                disabled={readOnly}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Observaciones Generales
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="observaciones_generales">Observaciones Generales de la Faena</Label>
            <Textarea
              id="observaciones_generales"
              value={contingencias.observaciones_generales || ''}
              onChange={(e) => updateContingencia('observaciones_generales', e.target.value)}
              placeholder="Registre cualquier observación general sobre el desarrollo de la faena..."
              rows={5}
              disabled={readOnly}
            />
          </div>
        </CardContent>
      </Card>

      {/* Información de ayuda */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-start gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-amber-900">Importante</p>
            <ul className="text-sm text-amber-700 mt-1 space-y-1">
              <li>• Registre todas las contingencias ocurridas durante la faena</li>
              <li>• Sea específico en las descripciones para facilitar el seguimiento</li>
              <li>• Incluya horarios cuando sea relevante</li>
              <li>• Mencione acciones correctivas tomadas</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
