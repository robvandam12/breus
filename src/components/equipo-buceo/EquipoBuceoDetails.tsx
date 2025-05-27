
import React, { useEffect, useState } from 'react';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, User, Mail, Phone } from 'lucide-react';
import { useEquipoBuceo } from '@/hooks/useEquipoBuceo';

interface EquipoBuceoDetailsProps {
  equipoId: string;
  onClose: () => void;
}

export const EquipoBuceoDetails: React.FC<EquipoBuceoDetailsProps> = ({
  equipoId,
  onClose
}) => {
  const { equipos } = useEquipoBuceo();
  const [equipo, setEquipo] = useState<any>(null);

  useEffect(() => {
    const foundEquipo = equipos.find(e => e.id === equipoId);
    setEquipo(foundEquipo);
  }, [equipoId, equipos]);

  if (!equipo) {
    return (
      <div className="space-y-4">
        <DialogHeader>
          <DialogTitle>Cargando...</DialogTitle>
        </DialogHeader>
        <div className="p-4 text-center">
          <p>Cargando detalles del equipo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          {equipo.nombre}
        </DialogTitle>
      </DialogHeader>
      
      <div className="space-y-4">
        <div>
          <h3 className="font-medium mb-2">Información General</h3>
          <div className="bg-gray-50 p-3 rounded-lg space-y-2">
            <p><strong>Nombre:</strong> {equipo.nombre}</p>
            <p><strong>Descripción:</strong> {equipo.descripcion || 'Sin descripción'}</p>
            <p><strong>Estado:</strong> 
              <Badge variant={equipo.activo ? 'default' : 'secondary'} className="ml-2">
                {equipo.activo ? 'Activo' : 'Inactivo'}
              </Badge>
            </p>
            <p><strong>Empresa:</strong> {equipo.empresa_nombre || 'No asignada'}</p>
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-2">Miembros del Equipo ({equipo.miembros?.length || 0})</h3>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {equipo.miembros && equipo.miembros.length > 0 ? (
              equipo.miembros.map((miembro: any, index: number) => (
                <div key={miembro.id || index} className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{miembro.nombre_completo}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {miembro.email}
                        </span>
                        <Badge variant="outline" size="sm">
                          {miembro.rol_equipo}
                        </Badge>
                      </div>
                    </div>
                    <Badge variant={miembro.disponible ? 'default' : 'secondary'}>
                      {miembro.disponible ? 'Disponible' : 'No disponible'}
                    </Badge>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-gray-500">
                <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No hay miembros asignados a este equipo</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </div>
    </div>
  );
};
