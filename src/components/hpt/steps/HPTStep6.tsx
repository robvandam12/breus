
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { HPTWizardData } from '@/hooks/useHPTWizard';
import { Users, Plus, Trash2 } from 'lucide-react';
import { useEquiposBuceo } from '@/hooks/useEquiposBuceo';

interface HPTStep6Props {
  data: HPTWizardData;
  onUpdate: (updates: Partial<HPTWizardData>) => void;
}

export const HPTStep6: React.FC<HPTStep6Props> = ({ data, onUpdate }) => {
  const [nombreAsistente, setNombreAsistente] = useState('');
  const [rutAsistente, setRutAsistente] = useState('');
  const [empresaAsistente, setEmpresaAsistente] = useState('');
  
  const { equipos = [] } = useEquiposBuceo();

  const asistentes = data.hpt_conocimiento_asistentes || [];
  
  const handleSetConocimientoData = (field: string, value: string | number) => {
    onUpdate({
      hpt_conocimiento: {
        ...data.hpt_conocimiento,
        [field]: value
      }
    });
  };
  
  const handleAddAsistente = () => {
    if (!nombreAsistente) return;
    
    const newAsistente = {
      nombre: nombreAsistente,
      rut: rutAsistente,
      empresa: empresaAsistente,
    };
    
    onUpdate({
      hpt_conocimiento_asistentes: [...asistentes, newAsistente]
    });
    
    setNombreAsistente('');
    setRutAsistente('');
    setEmpresaAsistente('');
  };
  
  const handleRemoveAsistente = (index: number) => {
    const updatedAsistentes = [...asistentes];
    updatedAsistentes.splice(index, 1);
    
    onUpdate({
      hpt_conocimiento_asistentes: updatedAsistentes
    });
  };

  // Poblar automáticamente con miembros del equipo de buceo si operación ID y el arreglo está vacío
  React.useEffect(() => {
    if (data.operacion_id && asistentes.length === 0) {
      // Intentar encontrar el equipo de buceo asociado a la operación
      const operacion = {
        equipo_buceo_id: null
      }; // Esto debería venir de algún hook o prop
      
      if (operacion.equipo_buceo_id) {
        const equipoBuceo = equipos.find(e => e.id === operacion.equipo_buceo_id);
        
        if (equipoBuceo?.miembros?.length) {
          const miembrosEquipo = equipoBuceo.miembros.map((miembro: any) => ({
            nombre: miembro.usuario?.nombre + ' ' + (miembro.usuario?.apellido || ''),
            rut: 'Sin RUT', // No tenemos RUT en el usuario
            empresa: 'Empresa de buceo' // No tenemos empresa_nombre en EquipoBuceo
          }));
          
          onUpdate({
            hpt_conocimiento_asistentes: miembrosEquipo
          });
        }
      }
    }
  }, [data.operacion_id, equipos, asistentes.length, onUpdate]);
  
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Difusión y Firmas</h2>
        <p className="mt-2 text-gray-600">
          Registro de asistencia a la difusión de la HPT y firmas
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            Información de Difusión
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="fecha_difusion">Fecha de Difusión</Label>
              <Input
                id="fecha_difusion"
                type="date"
                value={data.hpt_conocimiento.fecha || ''}
                onChange={(e) => handleSetConocimientoData('fecha', e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="hora_difusion">Hora de Difusión</Label>
              <Input
                id="hora_difusion"
                type="time"
                value={data.hpt_conocimiento.hora || ''}
                onChange={(e) => handleSetConocimientoData('hora', e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="duracion">Duración (minutos)</Label>
              <Input
                id="duracion"
                type="number"
                min="1"
                value={data.hpt_conocimiento.duracion || 30}
                onChange={(e) => handleSetConocimientoData('duracion', Number(e.target.value))}
              />
            </div>
            
            <div>
              <Label htmlFor="relator_nombre">Nombre del Relator</Label>
              <Input
                id="relator_nombre"
                value={data.hpt_conocimiento.relator_nombre || ''}
                onChange={(e) => handleSetConocimientoData('relator_nombre', e.target.value)}
                placeholder="Nombre completo del relator"
              />
            </div>
            
            <div className="md:col-span-2">
              <Label htmlFor="relator_cargo">Cargo del Relator</Label>
              <Input
                id="relator_cargo"
                value={data.hpt_conocimiento.relator_cargo || ''}
                onChange={(e) => handleSetConocimientoData('relator_cargo', e.target.value)}
                placeholder="Cargo o función del relator"
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            Asistentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-4">
                <Input
                  placeholder="Nombre del asistente"
                  value={nombreAsistente}
                  onChange={(e) => setNombreAsistente(e.target.value)}
                />
              </div>
              <div className="md:col-span-3">
                <Input
                  placeholder="RUT/DNI"
                  value={rutAsistente}
                  onChange={(e) => setRutAsistente(e.target.value)}
                />
              </div>
              <div className="md:col-span-3">
                <Input
                  placeholder="Empresa"
                  value={empresaAsistente}
                  onChange={(e) => setEmpresaAsistente(e.target.value)}
                />
              </div>
              <div className="md:col-span-2">
                <Button 
                  onClick={handleAddAsistente}
                  className="w-full"
                  disabled={!nombreAsistente}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar
                </Button>
              </div>
            </div>

            {asistentes.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>RUT/DNI</TableHead>
                    <TableHead>Empresa</TableHead>
                    <TableHead className="w-16"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {asistentes.map((asistente: any, index: number) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{asistente.nombre}</TableCell>
                      <TableCell>{asistente.rut}</TableCell>
                      <TableCell>{asistente.empresa}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveAsistente(index)}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-6 bg-gray-50 rounded-lg border border-dashed">
                <Users className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500 mb-2">No hay asistentes registrados</p>
                <p className="text-sm text-gray-400">Agregue a los asistentes usando el formulario arriba</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-sm text-blue-800">
            <strong>Nota:</strong> Las firmas de los asistentes y del supervisor se recogerán una vez 
            que se guarde este documento. Es importante que todos los participantes de la operación 
            estén registrados para un adecuado control y trazabilidad.
          </div>
        </div>
      </div>
    </div>
  );
};
