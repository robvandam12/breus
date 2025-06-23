
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight, Save, Check } from "lucide-react";
import { useNetworkMaintenance } from '@/hooks/useNetworkMaintenance';
import { useToast } from '@/hooks/use-toast';

// Importar todos los pasos
import { EncabezadoGeneral } from './steps/EncabezadoGeneral';
import { DotacionBuceo } from './steps/DotacionBuceo';
import { EquiposSuperficie } from './steps/EquiposSuperficie';
import { FaenasRedesStep } from './steps/FaenasRedes';
import { SistemasEquipos } from './steps/SistemasEquipos';
import { ResumenFirmas } from './steps/ResumenFirmas';

import type { NetworkMaintenanceData, NetworkMaintenanceFormData } from '@/types/network-maintenance';

interface NetworkMaintenanceWizardProps {
  operacionId: string;
  onComplete?: () => void;
}

const PASOS = [
  { id: 1, titulo: 'Encabezado General', descripcion: 'Información básica de la operación' },
  { id: 2, titulo: 'Dotación de Buceo', descripcion: 'Personal y equipos de buceo' },
  { id: 3, titulo: 'Equipos de Superficie', descripcion: 'Compresores y equipos auxiliares' },
  { id: 4, titulo: 'Faenas de Redes', descripcion: 'Trabajos específicos en redes' },
  { id: 5, titulo: 'Sistemas y Equipos', descripción: 'Equipos operacionales de la instalación' },
  { id: 6, titulo: 'Resumen y Firmas', descripción: 'Revisión final y firmas digitales' }
];

export const NetworkMaintenanceWizard = ({ operacionId, onComplete }: NetworkMaintenanceWizardProps) => {
  const [pasoActual, setPasoActual] = useState(1);
  const [formData, setFormData] = useState<NetworkMaintenanceData>({
    // Datos generales
    fecha: '',
    hora_inicio: '',
    hora_termino: '',
    lugar_trabajo: '',
    temperatura: 0,
    profundidad_max: 0,
    estado_puerto: '',
    nave_maniobras: '',
    matricula_nave: '',
    
    // Teams
    team_s: '',
    team_be: '',
    team_bi: '',
    
    // Dotación y equipos
    dotacion: [],
    equipos_superficie: [],
    
    // Faenas específicas
    faenas_mantencion: [],
    faenas_redes: [], // Nueva propiedad para fase 4
    
    // Sistemas y equipos (Paso 5)
    sistemas_equipos: [],
    
    // Resumen y firmas (Paso 6)
    observaciones_finales: '',
    contingencias: '',
    supervisor_responsable: '',
    firma_digital: '',
    
    // Control de formulario
    progreso: 0,
    firmado: false,
    estado: 'borrador'
  });

  const { createNetworkMaintenance, loading } = useNetworkMaintenance();
  const { toast } = useToast();

  const updateFormData = (updates: Partial<NetworkMaintenanceData>) => {
    setFormData(prev => ({
      ...prev,
      ...updates,
      progreso: Math.round(((pasoActual - 1) / (PASOS.length - 1)) * 100)
    }));
  };

  const validarPaso = (paso: number): boolean => {
    switch (paso) {
      case 1:
        return Boolean(formData.fecha && formData.hora_inicio && formData.lugar_trabajo);
      case 2:
        return formData.dotacion.length > 0;
      case 3:
        return formData.equipos_superficie.length > 0;
      case 4:
        return formData.faenas_redes.length > 0;
      case 5:
        return true; // Opcional
      case 6:
        return Boolean(formData.supervisor_responsable);
      default:
        return true;
    }
  };

  const siguientePaso = () => {
    if (validarPaso(pasoActual)) {
      setPasoActual(prev => Math.min(prev + 1, PASOS.length));
    } else {
      toast({
        title: "Campos requeridos",
        description: "Complete todos los campos obligatorios para continuar.",
        variant: "destructive",
      });
    }
  };

  const pasoAnterior = () => {
    setPasoActual(prev => Math.max(prev - 1, 1));
  };

  const guardarBorrador = async () => {
    try {
      const formSubmitData: NetworkMaintenanceFormData = {
        operacion_id: operacionId,
        codigo: `MR-${Date.now()}`,
        tipo_formulario: 'mantencion',
        network_maintenance_data: formData
      };

      await createNetworkMaintenance(formSubmitData);
      toast({
        title: "Borrador guardado",
        description: "El formulario ha sido guardado como borrador.",
      });
    } catch (error) {
      console.error('Error saving draft:', error);
    }
  };

  const completarFormulario = async () => {
    if (!validarPaso(6)) {
      toast({
        title: "Formulario incompleto",
        description: "Complete todos los campos requeridos.",
        variant: "destructive",
      });
      return;
    }

    try {
      const formSubmitData: NetworkMaintenanceFormData = {
        operacion_id: operacionId,
        codigo: `MR-${Date.now()}`,
        tipo_formulario: 'mantencion',
        network_maintenance_data: {
          ...formData,
          estado: 'completado',
          firmado: true
        }
      };

      await createNetworkMaintenance(formSubmitData);
      onComplete?.();
    } catch (error) {
      console.error('Error completing form:', error);
    }
  };

  const renderPasoActual = () => {
    switch (pasoActual) {
      case 1:
        return <EncabezadoGeneral formData={formData} updateFormData={updateFormData} />;
      case 2:
        return <DotacionBuceo formData={formData} updateFormData={updateFormData} />;
      case 3:
        return <EquiposSuperficie formData={formData} updateFormData={updateFormData} />;
      case 4:
        return <FaenasRedesStep formData={formData} updateFormData={updateFormData} />;
      case 5:
        return <SistemasEquipos formData={formData} updateFormData={updateFormData} />;
      case 6:
        return <ResumenFirmas formData={formData} updateFormData={updateFormData} />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header del Wizard */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Mantención de Redes</CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Paso {pasoActual} de {PASOS.length}: {PASOS[pasoActual - 1]?.titulo}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Progreso</p>
              <p className="font-semibold">{Math.round(((pasoActual - 1) / (PASOS.length - 1)) * 100)}%</p>
            </div>
          </div>
          <Progress value={((pasoActual - 1) / (PASOS.length - 1)) * 100} className="w-full" />
        </CardHeader>
      </Card>

      {/* Contenido del paso actual */}
      <Card>
        <CardContent className="p-6">
          {renderPasoActual()}
        </CardContent>
      </Card>

      {/* Controles de navegación */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={pasoAnterior}
              disabled={pasoActual === 1}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Anterior
            </Button>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={guardarBorrador}
                disabled={loading}
              >
                <Save className="w-4 h-4 mr-2" />
                Guardar Borrador
              </Button>

              {pasoActual === PASOS.length ? (
                <Button
                  onClick={completarFormulario}
                  disabled={loading || !validarPaso(pasoActual)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Completar Formulario
                </Button>
              ) : (
                <Button
                  onClick={siguientePaso}
                  disabled={!validarPaso(pasoActual)}
                >
                  Siguiente
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
