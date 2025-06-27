
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { UnifiedInmersionForm } from '@/components/inmersion/UnifiedInmersionForm';
import { useInmersiones } from '@/hooks/useInmersiones';
import { toast } from '@/hooks/use-toast';

export const InmersionesDataTable = () => {
  const [showForm, setShowForm] = useState(false);
  const { inmersiones, createInmersion, isCreating } = useInmersiones();

  const handleCreateInmersion = async (data: any) => {
    try {
      await createInmersion(data);
      setShowForm(false);
      toast({
        title: "Éxito",
        description: "Inmersión creada correctamente",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Error al crear la inmersión",
        variant: "destructive",
      });
    }
  };

  if (showForm) {
    return (
      <UnifiedInmersionForm
        onSubmit={handleCreateInmersion}
        onCancel={() => setShowForm(false)}
        isLoading={isCreating}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Inmersiones</h2>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nueva Inmersión
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Inmersiones</CardTitle>
        </CardHeader>
        <CardContent>
          {inmersiones.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No hay inmersiones registradas</p>
              <Button onClick={() => setShowForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Crear Primera Inmersión
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {inmersiones.map((inmersion) => (
                <div key={inmersion.inmersion_id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{inmersion.codigo}</h3>
                      <p className="text-sm text-gray-600">{inmersion.objetivo}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(inmersion.fecha_inmersion).toLocaleDateString('es-CL')} - {inmersion.hora_inicio}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block px-2 py-1 rounded text-xs ${
                        inmersion.estado === 'completada' ? 'bg-green-100 text-green-800' :
                        inmersion.estado === 'en_curso' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {inmersion.estado}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
