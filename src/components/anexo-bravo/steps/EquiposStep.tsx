
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Settings, Plus, Trash } from 'lucide-react';

export const EquiposStep = ({ form }) => {
  const [equipoNombre, setEquipoNombre] = useState('');
  
  const equipos = form.watch('anexo_bravo_equipos') || [];

  const handleAddEquipo = () => {
    if (!equipoNombre) return;
    
    const newEquipo = {
      id: Date.now().toString(),
      equipo_nombre: equipoNombre,
      verificado: false,
      observaciones: '',
      orden: equipos.length + 1
    };
    
    form.setValue('anexo_bravo_equipos', [...equipos, newEquipo]);
    setEquipoNombre('');
  };

  const handleRemoveEquipo = (index) => {
    const updatedEquipos = [...equipos];
    updatedEquipos.splice(index, 1);
    
    // Actualizar el orden
    const reordered = updatedEquipos.map((e, i) => ({
      ...e,
      orden: i + 1
    }));
    
    form.setValue('anexo_bravo_equipos', reordered);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-blue-600" />
            Equipos Adicionales
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-10">
                <Input
                  placeholder="Nombre del equipo o herramienta"
                  value={equipoNombre}
                  onChange={(e) => setEquipoNombre(e.target.value)}
                />
              </div>
              <div className="md:col-span-2">
                <Button 
                  onClick={handleAddEquipo}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar
                </Button>
              </div>
            </div>

            {equipos.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>N°</TableHead>
                    <TableHead>Equipo</TableHead>
                    <TableHead className="w-16"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {equipos.map((equipo, index) => (
                    <TableRow key={equipo.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{equipo.equipo_nombre}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveEquipo(index)}
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
                <Settings className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500 mb-2">No hay equipos adicionales</p>
                <p className="text-sm text-gray-400">Agregue equipos usando el formulario arriba</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
