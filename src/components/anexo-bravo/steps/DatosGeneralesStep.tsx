
import React, { useEffect } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';
import { useSitios } from '@/hooks/useSitios';
import { useEquiposBuceo } from '@/hooks/useEquiposBuceo';

export const DatosGeneralesStep = ({ form, operaciones, selectedOperacion, setSelectedOperacion }) => {
  const { sitios = [] } = useSitios();
  const { equipos = [] } = useEquiposBuceo();
  
  const operacionId = form.watch('operacion_id');
  
  useEffect(() => {
    if (operacionId && !selectedOperacion) {
      const operacion = operaciones.find(op => op.id === operacionId);
      if (operacion) {
        setSelectedOperacion(operacion);
        
        // Prellenar datos basados en la operación seleccionada
        form.setValue('supervisor', operacion.supervisor_asignado_nombre || '');
        form.setValue('fecha', new Date().toISOString().split('T')[0]);
        form.setValue('codigo', `AB-${new Date().getTime().toString().slice(-6)}`);
        
        // Si la operación tiene sitio
        if (operacion.sitio) {
          form.setValue('lugar_faena', operacion.sitio.nombre || '');
        }
        
        // Si la operación tiene contratista
        if (operacion.contratista) {
          form.setValue('empresa_nombre', operacion.contratista.nombre || '');
          form.setValue('buzo_o_empresa_nombre', operacion.contratista.nombre || '');
        }
        
        // Si la operación tiene equipo de buceo
        if (operacion.equipo_buceo) {
          const equipo = equipos.find(e => e.id === operacion.equipo_buceo_id);
          if (equipo) {
            form.setValue('equipo_buceo_id', equipo.id);
            form.setValue('equipo_buceo_nombre', equipo.nombre);
          }
        }
      }
    }
  }, [operacionId, operaciones, setSelectedOperacion, form, equipos]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Datos Generales
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            control={form.control}
            name="operacion_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Operación</FormLabel>
                <Select
                  disabled={!!selectedOperacion}
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione la operación" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {operaciones.map((operacion) => (
                      <SelectItem key={operacion.id} value={operacion.id}>
                        {operacion.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Seleccione la operación para la cual se está creando este Anexo Bravo
                </FormDescription>
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="codigo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Código</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="fecha"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fecha</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="empresa_nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Empresa</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="lugar_faena"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lugar de Faena</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="supervisor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Supervisor</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="buzo_o_empresa_nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Buzo o Empresa de Buceo</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="asistente_buzo_nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Asistente de Buzo (Nombre)</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Ingrese nombre del asistente" />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="asistente_buzo_matricula"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Asistente de Buzo (Matrícula)</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Opcional" />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
