
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users, Plus, Trash } from 'lucide-react';
import { useEquiposBuceo } from '@/hooks/useEquiposBuceo';

export const ParticipantesStep = ({ form, selectedOperacion }) => {
  const [nombre, setNombre] = useState('');
  const [rut, setRut] = useState('');
  const { equipos = [] } = useEquiposBuceo();

  const participantes = form.watch('anexo_bravo_trabajadores') || [];

  const handleAddParticipante = () => {
    if (!nombre || !rut) return;
    
    const newParticipant = {
      id: Date.now().toString(),
      nombre,
      rut,
      orden: participantes.length + 1
    };
    
    form.setValue('anexo_bravo_trabajadores', [...participantes, newParticipant]);
    setNombre('');
    setRut('');
  };

  const handleRemoveParticipante = (index) => {
    const updatedParticipantes = [...participantes];
    updatedParticipantes.splice(index, 1);
    
    // Actualizar el orden
    const reordered = updatedParticipantes.map((p, i) => ({
      ...p,
      orden: i + 1
    }));
    
    form.setValue('anexo_bravo_trabajadores', reordered);
  };

  // Si hay una operación seleccionada y tiene equipo de buceo, agregar automáticamente a los miembros del equipo
  React.useEffect(() => {
    if (selectedOperacion?.equipo_buceo_id && participantes.length === 0) {
      // Buscar el equipo de buceo de la operación
      const equipoBuceo = equipos.find(e => e.id === selectedOperacion.equipo_buceo_id);
      
      if (equipoBuceo && equipoBuceo.miembros && equipoBuceo.miembros.length > 0) {
        // Agregar solo a los buzos del equipo
        const buzosMiembros = equipoBuceo.miembros
          .filter(m => m.rol_equipo === 'buzo')
          .map((miembro, index) => ({
            id: Date.now().toString() + index,
            nombre: miembro.usuario?.nombre + ' ' + miembro.usuario?.apellido,
            rut: miembro.usuario?.rut || 'Sin RUT',
            orden: index + 1
          }));
        
        if (buzosMiembros.length > 0) {
          form.setValue('anexo_bravo_trabajadores', buzosMiembros);
        }
      }
    }
  }, [selectedOperacion, equipos, form, participantes.length]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            Participantes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-6">
                <Input
                  placeholder="Nombre del trabajador"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                />
              </div>
              <div className="md:col-span-4">
                <Input
                  placeholder="RUT/DNI"
                  value={rut}
                  onChange={(e) => setRut(e.target.value)}
                />
              </div>
              <div className="md:col-span-2">
                <Button 
                  onClick={handleAddParticipante}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar
                </Button>
              </div>
            </div>

            {participantes.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>N°</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>RUT/DNI</TableHead>
                    <TableHead className="w-16"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {participantes.map((participante, index) => (
                    <TableRow key={participante.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{participante.nombre}</TableCell>
                      <TableCell>{participante.rut}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveParticipante(index)}
                        >
                          <Trash className="w-4 h-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-6 bg-gray-50 rounded-lg border border-dashed">
                <Users className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500 mb-2">No hay participantes agregados</p>
                <p className="text-sm text-gray-400">Agregue trabajadores usando el formulario arriba</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
