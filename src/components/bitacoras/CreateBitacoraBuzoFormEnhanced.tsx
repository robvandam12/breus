import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useOperaciones } from "@/hooks/useOperaciones";
import { useCentros } from "@/hooks/useCentros";

interface CreateBitacoraBuzoFormProps {
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
}

export const CreateBitacoraBuzoFormEnhanced = ({ onSubmit, onCancel }: CreateBitacoraBuzoFormProps) => {
  const { toast } = useToast();
  const { profile } = useAuth();
  const { operaciones } = useOperaciones();
  const { centros } = useCentros();

  const [formData, setFormData] = useState({
    operacion_id: '',
    centro_id: '',
    fecha: new Date().toISOString().split('T')[0],
    hora_inicio: '',
    hora_fin: '',
    nombre_faena: '',
    codigo_faena: '',
    profundidad_maxima: '',
    tiempo_fondo: '',
    equipo_utilizado: '',
    descripcion_trabajo: '',
    condiciones_climaticas: '',
    incidentes_destacables: '',
    nombre_supervisor: '',
    firma_supervisor: '',
    nombre_encargado_sst: '',
    firma_encargado_sst: '',
  });

  const [operacion, setOperacion] = useState<any>(null);

  useEffect(() => {
    if (formData.operacion_id) {
      const selectedOperacion = operaciones.find(op => op.id === formData.operacion_id);
      setOperacion(selectedOperacion);
    } else {
      setOperacion(null);
    }
  }, [formData.operacion_id, operaciones]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.operacion_id || !formData.fecha || !formData.hora_inicio || !formData.hora_fin) {
      toast({
        title: "Campos requeridos",
        description: "Operación, fecha, hora de inicio y fin son obligatorios.",
        variant: "destructive",
      });
      return;
    }

    try {
      const dataToSubmit = {
        ...formData,
        buzo_id: profile?.id,
        nombre_buzo: `${profile?.nombre} ${profile?.apellido}`,
      };

      await onSubmit(dataToSubmit);
      toast({
        title: "Bitácora creada",
        description: "La bitácora ha sido creada exitosamente.",
      });
      onCancel();
    } catch (error) {
      console.error('Error creating bitacora:', error);
      toast({
        title: "Error",
        description: "No se pudo crear la bitácora.",
        variant: "destructive",
      });
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Nueva Bitácora de Buceo</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="operacion_id">Operación *</Label>
            <Select
              value={formData.operacion_id}
              onValueChange={(value) => handleChange('operacion_id', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar operación" />
              </SelectTrigger>
              <SelectContent>
                {operaciones.map((op) => (
                  <SelectItem key={op.id} value={op.id}>
                    {op.codigo} - {op.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Información de la operación */}
          {operacion && (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Operación:</strong> {operacion.codigo} - {operacion.nombre}
                {operacion.centros && ` | Centro: ${operacion.centros.nombre}`}
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fecha">Fecha *</Label>
              <Input
                id="fecha"
                type="date"
                value={formData.fecha}
                onChange={(e) => handleChange('fecha', e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="centro_id">Centro</Label>
              <Select
                value={formData.centro_id}
                onValueChange={(value) => handleChange('centro_id', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar centro" />
                </SelectTrigger>
                <SelectContent>
                  {centros.map((centro) => (
                    <SelectItem key={centro.id} value={centro.id}>
                      {centro.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="hora_inicio">Hora Inicio *</Label>
              <Input
                id="hora_inicio"
                type="time"
                value={formData.hora_inicio}
                onChange={(e) => handleChange('hora_inicio', e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="hora_fin">Hora Fin *</Label>
              <Input
                id="hora_fin"
                type="time"
                value={formData.hora_fin}
                onChange={(e) => handleChange('hora_fin', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nombre_faena">Nombre de la Faena</Label>
              <Input
                id="nombre_faena"
                type="text"
                value={formData.nombre_faena}
                onChange={(e) => handleChange('nombre_faena', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="codigo_faena">Código de la Faena</Label>
              <Input
                id="codigo_faena"
                type="text"
                value={formData.codigo_faena}
                onChange={(e) => handleChange('codigo_faena', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="profundidad_maxima">Profundidad Máxima (m)</Label>
              <Input
                id="profundidad_maxima"
                type="number"
                value={formData.profundidad_maxima}
                onChange={(e) => handleChange('profundidad_maxima', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="tiempo_fondo">Tiempo en el Fondo (min)</Label>
              <Input
                id="tiempo_fondo"
                type="number"
                value={formData.tiempo_fondo}
                onChange={(e) => handleChange('tiempo_fondo', e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="equipo_utilizado">Equipo Utilizado</Label>
            <Input
              id="equipo_utilizado"
              type="text"
              value={formData.equipo_utilizado}
              onChange={(e) => handleChange('equipo_utilizado', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="descripcion_trabajo">Descripción del Trabajo</Label>
            <Textarea
              id="descripcion_trabajo"
              value={formData.descripcion_trabajo}
              onChange={(e) => handleChange('descripcion_trabajo', e.target.value)}
              placeholder="Describa detalladamente el trabajo realizado..."
            />
          </div>

          <div>
            <Label htmlFor="condiciones_climaticas">Condiciones Climáticas</Label>
            <Textarea
              id="condiciones_climaticas"
              value={formData.condiciones_climaticas}
              onChange={(e) => handleChange('condiciones_climaticas', e.target.value)}
              placeholder="Describa las condiciones climáticas durante la inmersión..."
            />
          </div>

          <div>
            <Label htmlFor="incidentes_destacables">Incidentes Destacables</Label>
            <Textarea
              id="incidentes_destacables"
              value={formData.incidentes_destacables}
              onChange={(e) => handleChange('incidentes_destacables', e.target.value)}
              placeholder="Describa cualquier incidente o anomalía ocurrida durante la inmersión..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nombre_supervisor">Nombre del Supervisor</Label>
              <Input
                id="nombre_supervisor"
                type="text"
                value={formData.nombre_supervisor}
                onChange={(e) => handleChange('nombre_supervisor', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="firma_supervisor">Firma del Supervisor</Label>
              <Input
                id="firma_supervisor"
                type="text"
                value={formData.firma_supervisor}
                onChange={(e) => handleChange('firma_supervisor', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nombre_encargado_sst">Nombre del Encargado SST</Label>
              <Input
                id="nombre_encargado_sst"
                type="text"
                value={formData.nombre_encargado_sst}
                onChange={(e) => handleChange('nombre_encargado_sst', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="firma_encargado_sst">Firma del Encargado SST</Label>
              <Input
                id="firma_encargado_sst"
                type="text"
                value={formData.firma_encargado_sst}
                onChange={(e) => handleChange('firma_encargado_sst', e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button type="submit">Crear Bitácora</Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
