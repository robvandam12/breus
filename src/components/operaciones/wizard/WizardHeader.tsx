
import React from 'react';
import { Workflow, Save, Wifi, WifiOff } from 'lucide-react';

interface WizardHeaderProps {
  operacion?: any;
  isAutoSaving: boolean;
  lastSaveTime: Date | null;
}

export const WizardHeader = ({ operacion, isAutoSaving, lastSaveTime }: WizardHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Workflow className="w-6 h-6 text-blue-600" />
          Asistente de Operación
        </h2>
        {operacion && (
          <p className="text-gray-600 mt-1">
            {operacion.codigo} - {operacion.nombre}
          </p>
        )}
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-50 border">
          {isAutoSaving ? (
            <>
              <Save className="w-4 h-4 text-blue-600 animate-pulse" />
              <span className="text-sm text-blue-600 font-medium">Guardando...</span>
            </>
          ) : lastSaveTime ? (
            <>
              <Wifi className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-600 font-medium">
                Guardado {lastSaveTime.toLocaleTimeString()}
              </span>
            </>
          ) : (
            <>
              <WifiOff className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-500">Sin guardar</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
