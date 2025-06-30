
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { SuperuserInmersionForm } from './forms/SuperuserInmersionForm';
import { SalmoneraInmersionForm } from './forms/SalmoneraInmersionForm';
import { ContratistaInmersionForm } from './forms/ContratistaInmersionForm';
import { BuzoSupervisorInmersionForm } from './forms/BuzoSupervisorInmersionForm';
import type { Inmersion } from '@/hooks/useInmersiones';

interface UnifiedInmersionFormProps {
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  initialData?: Inmersion;
}

export const UnifiedInmersionForm = ({ onSubmit, onCancel, initialData }: UnifiedInmersionFormProps) => {
  const { profile } = useAuth();

  // Determinar qué formulario mostrar según el rol del usuario
  const renderFormByRole = () => {
    switch (profile?.role) {
      case 'superuser':
        return (
          <SuperuserInmersionForm
            onSubmit={onSubmit}
            onCancel={onCancel}
            initialData={initialData}
          />
        );
      
      case 'admin_salmonera':
        return (
          <SalmoneraInmersionForm
            onSubmit={onSubmit}
            onCancel={onCancel}
            initialData={initialData}
          />
        );
      
      case 'admin_servicio':
        return (
          <ContratistaInmersionForm
            onSubmit={onSubmit}
            onCancel={onCancel}
            initialData={initialData}
          />
        );
      
      case 'supervisor':
      case 'buzo':
        return (
          <BuzoSupervisorInmersionForm
            onSubmit={onSubmit}
            onCancel={onCancel}
            initialData={initialData}
          />
        );
      
      default:
        return (
          <div className="text-center p-8">
            <p className="text-gray-500">
              No se pudo determinar el tipo de formulario para su rol.
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Por favor, contacte al administrador del sistema.
            </p>
          </div>
        );
    }
  };

  return renderFormByRole();
};
