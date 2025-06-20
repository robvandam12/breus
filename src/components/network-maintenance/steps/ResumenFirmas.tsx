
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, AlertCircle, FileText, Users, Settings, Network } from "lucide-react";
import type { NetworkMaintenanceData } from '@/types/network-maintenance';

interface ResumenFirmasProps {
  formData: NetworkMaintenanceData;
  updateFormData: (updates: Partial<NetworkMaintenanceData>) => void;
}

export const ResumenFirmas = ({ formData, updateFormData }: ResumenFirmasProps) => {
  const totalDotacion = (formData.dotacion || []).length;
  const totalEquipos = (formData.equipos_superficie || []).length;
  const totalFaenas = (formData.faenas_mantencion || []).length + (formData.faenas_redes || []).length;
  const totalSistemas = (formData.sistemas_equipos || []).length;

  const completionPercentage = () => {
    let completed = 0;
    let total = 6; // Total de secciones

    if (formData.fecha && formData.lugar_trabajo) completed++;
    if (totalDotacion > 0) completed++;
    if (totalEquipos >= 0) completed++; // Equipos pueden ser opcionales
    if (totalFaenas > 0) completed++;
    if (totalSistemas >= 0) completed++; // Sistemas pueden ser opcionales
    if (formData.observaciones_finales || formData.contingencias) completed++;

    return Math.round((completed / total) * 100);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Resumen y Firmas
        </h3>
        <p className="text-sm text-gray-600">
          Validación final del formulario de mantención de redes
        </p>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Estado del Formulario</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium">Completitud</span>
            <Badge variant={completionPercentage() === 100 ? "default" : "secondary"}>
              {completionPercentage()}% Completado
            </Badge>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${completionPercentage()}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Summary Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Información General
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Lugar:</span>
              <span className="font-medium">{formData.lugar_trabajo || 'No especificado'}</span>
            </div>
            <div className="flex justify-between">
              <span>Fecha:</span>
              <span className="font-medium">{formData.fecha || 'No especificada'}</span>
            </div>
            <div className="flex justify-between">
              <span>Nave:</span>
              <span className="font-medium">{formData.nave_maniobras || 'No especificada'}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Users className="w-4 h-4" />
              Personal y Equipos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Dotación:</span>
              <span className="font-medium">{totalDotacion} personas</span>
            </div>
            <div className="flex justify-between">
              <span>Equipos Superficie:</span>
              <span className="font-medium">{totalEquipos} equipos</span>
            </div>
            <div className="flex justify-between">
              <span>Sistemas:</span>
              <span className="font-medium">{totalSistemas} sistemas</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Network className="w-4 h-4" />
              Trabajos Realizados
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Faenas de Mantención:</span>
              <span className="font-medium">{(formData.faenas_mantencion || []).length}</span>
            </div>
            <div className="flex justify-between">
              <span>Faenas de Redes:</span>
              <span className="font-medium">{(formData.faenas_redes || []).length}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Faenas:</span>
              <span className="font-medium">{totalFaenas}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Estado Operativo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Profundidad Máx:</span>
              <span className="font-medium">{formData.profundidad_max || 0}m</span>
            </div>
            <div className="flex justify-between">
              <span>Temperatura:</span>
              <span className="font-medium">{formData.temperatura || 0}°C</span>
            </div>
            <div className="flex justify-between">
              <span>Estado Puerto:</span>
              <span className="font-medium">{formData.estado_puerto || 'No especificado'}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* Final Observations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="observaciones_finales">Observaciones Finales</Label>
          <Textarea
            id="observaciones_finales"
            value={formData.observaciones_finales || ''}
            onChange={(e) => updateFormData({ observaciones_finales: e.target.value })}
            placeholder="Observaciones generales del trabajo realizado..."
            rows={4}
          />
        </div>

        <div>
          <Label htmlFor="contingencias">Contingencias y Novedades</Label>
          <Textarea
            id="contingencias"
            value={formData.contingencias || ''}
            onChange={(e) => updateFormData({ contingencias: e.target.value })}
            placeholder="Registra cualquier contingencia o novedad..."
            rows={4}
          />
        </div>
      </div>

      {/* Validation Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Estado de Validación</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {formData.fecha && formData.lugar_trabajo ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-yellow-500" />
                )}
                <span className="text-sm">Información general completa</span>
              </div>
              <div className="flex items-center gap-2">
                {totalDotacion > 0 ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-yellow-500" />
                )}
                <span className="text-sm">Dotación asignada</span>
              </div>
              <div className="flex items-center gap-2">
                {totalFaenas > 0 ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-yellow-500" />
                )}
                <span className="text-sm">Faenas registradas</span>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <Label htmlFor="supervisor_nombre">Supervisor Responsable</Label>
                <Input
                  id="supervisor_nombre"
                  value={formData.supervisor_responsable || ''}
                  onChange={(e) => updateFormData({ supervisor_responsable: e.target.value })}
                  placeholder="Nombre del supervisor"
                />
              </div>
              <div>
                <Label htmlFor="firma_digital">Firma Digital</Label>
                <Input
                  id="firma_digital"
                  value={formData.firma_digital || ''}
                  onChange={(e) => updateFormData({ firma_digital: e.target.value })}
                  placeholder="Código de firma digital"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
