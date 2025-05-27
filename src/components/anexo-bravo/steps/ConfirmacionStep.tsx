
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { FileCheck, Shield, Users, Settings } from 'lucide-react';

export const ConfirmacionStep = ({ form }) => {
  const { watch, setValue } = form;

  const datosGenerales = {
    codigo: watch('codigo'),
    fecha: watch('fecha'),
    empresa_nombre: watch('empresa_nombre'),
    lugar_faena: watch('lugar_faena'),
    supervisor: watch('supervisor'),
    buzo_o_empresa_nombre: watch('buzo_o_empresa_nombre'),
    asistente_buzo_nombre: watch('asistente_buzo_nombre')
  };

  const checklist = watch('anexo_bravo_checklist') || {};
  const participantes = watch('anexo_bravo_trabajadores') || [];
  const equipos = watch('anexo_bravo_equipos') || [];
  const observaciones = watch('observaciones_generales') || '';

  const itemsVerificados = Object.values(checklist).filter(item => item.verificado).length;
  const totalItems = Object.keys(checklist).length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-blue-600" />
            Resumen del Anexo Bravo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="font-medium text-lg">Datos Generales</h3>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Código</TableCell>
                  <TableCell>{datosGenerales.codigo}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Fecha</TableCell>
                  <TableCell>{datosGenerales.fecha}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Empresa</TableCell>
                  <TableCell>{datosGenerales.empresa_nombre}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Lugar de Faena</TableCell>
                  <TableCell>{datosGenerales.lugar_faena}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Supervisor</TableCell>
                  <TableCell>{datosGenerales.supervisor}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Buzo o Empresa de Buceo</TableCell>
                  <TableCell>{datosGenerales.buzo_o_empresa_nombre}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Asistente de Buzo</TableCell>
                  <TableCell>{datosGenerales.asistente_buzo_nombre}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-600" />
              <h3 className="font-medium text-lg">Lista de Verificación</h3>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-600">
                {itemsVerificados} de {totalItems} elementos verificados
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              <h3 className="font-medium text-lg">Participantes</h3>
            </div>
            {participantes.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>RUT/DNI</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {participantes.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell>{p.nombre}</TableCell>
                      <TableCell>{p.rut}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600">No hay participantes agregados</p>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-blue-600" />
              <h3 className="font-medium text-lg">Equipos Adicionales</h3>
            </div>
            {equipos.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Equipo</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {equipos.map((e) => (
                    <TableRow key={e.id}>
                      <TableCell>{e.equipo_nombre}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600">No hay equipos adicionales</p>
              </div>
            )}
          </div>

          <FormField
            control={form.control}
            name="observaciones_generales"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Observaciones Generales</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Ingrese observaciones adicionales..."
                    className="h-32"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
    </div>
  );
};
