
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useSalmoneras } from "@/hooks/useSalmoneras";
import { useContratistas } from "@/hooks/useContratistas";
import { useSitios } from "@/hooks/useSitios";
import { useUsuarios } from "@/hooks/useUsuarios";
import { useEquiposBuceo } from "@/hooks/useEquiposBuceo";
import { Save, X } from "lucide-react";

interface EditOperacionFormProps {
  operacion: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export const EditOperacionForm = ({ operacion, onSubmit, onCancel }: EditOperacionFormProps) => {
  const [formData, setFormData] = useState({
    codigo: operacion?.codigo || '',
    nombre: operacion?.nombre || '',
    tareas: operacion?.tareas || '',
    fecha_inicio: operacion?.fecha_inicio || '',
    fecha_fin: operacion?.fecha_fin || '',
    estado: operacion?.estado || 'activa',
    estado_aprobacion: operacion?.estado_aprobacion || 'pendiente',
    salmonera_id: operacion?.salmonera_id || '',
    contratista_id: operacion?.contratista_id || '',
    sitio_id: operacion?.sitio_id || '',
    servicio_id: operacion?.servicio_id || '',
    equipo_buceo_id: operacion?.equipo_buceo_id || '',
    supervisor_asignado_id: operacion?.supervisor_asignado_id || ''
  });

  const { salmoneras } = useSalmoneras();
  const { contratistas } = useContratistas();
  const { sitios } = useSitios();
  const { usuarios } = useUsuarios();
  const { equipos } = useEquiposBuceo();

  // Filtrar supervisores
  const supervisores = usuarios?.filter(u => 
    u.rol === 'admin_servicio' || u.rol === 'superuser'
  ) || [];

  // FIX: Función helper para manejar valores válidos de Select
  const getSelectValue = (value: string | null | undefined) => {
    if (!value || value === 'null' || value === 'undefined') return '';
    return value;
  };

  // FIX: Función para validar si un item debe mostrarse en Select
  const isValidSelectValue = (value: any) => {
    return value && value !== '' && value !== 'null' && value !== 'undefined';
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value === '__empty__' ? '' : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Limpiar datos antes de enviar
    const cleanData = { ...formData };
    Object.keys(cleanData).forEach(key => {
      if (cleanData[key as keyof typeof cleanData] === '' || 
          cleanData[key as keyof typeof cleanData] === '__empty__') {
        cleanData[key as keyof typeof cleanData] = null;
      }
    });

    console.log('Submitting edit form with data:', cleanData);
    onSubmit(cleanData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Código */}
        <div className="space-y-2">
          <Label htmlFor="codigo">Código*</Label>
          <Input
            id="codigo"
            value={formData.codigo}
            onChange={(e) => handleInputChange('codigo', e.target.value)}
            placeholder="Código de la operación"
            required
          />
        </div>

        {/* Nombre */}
        <div className="space-y-2">
          <Label htmlFor="nombre">Nombre*</Label>
          <Input
            id="nombre"
            value={formData.nombre}
            onChange={(e) => handleInputChange('nombre', e.target.value)}
            placeholder="Nombre de la operación"
            required
          />
        </div>

        {/* Estado */}
        <div className="space-y-2">
          <Label>Estado</Label>
          <Select value={formData.estado} onValueChange={(value) => handleInputChange('estado', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="activa">Activa</SelectItem>
              <SelectItem value="pausada">Pausada</SelectItem>
              <SelectItem value="completada">Completada</SelectItem>
              <SelectItem value="cancelada">Cancelada</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Estado de Aprobación */}
        <div className="space-y-2">
          <Label>Estado de Aprobación</Label>
          <Select 
            value={getSelectValue(formData.estado_aprobacion)} 
            onValueChange={(value) => handleInputChange('estado_aprobacion', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Estado de aprobación" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pendiente">Pendiente</SelectItem>
              <SelectItem value="aprobada">Aprobada</SelectItem>
              <SelectItem value="rechazada">Rechazada</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Salmonera */}
        <div className="space-y-2">
          <Label>Salmonera</Label>
          <Select 
            value={getSelectValue(formData.salmonera_id)} 
            onValueChange={(value) => handleInputChange('salmonera_id', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar salmonera" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__empty__">Sin asignar</SelectItem>
              {salmoneras?.filter(s => isValidSelectValue(s.id)).map((salmonera) => (
                <SelectItem key={salmonera.id} value={salmonera.id}>
                  {salmonera.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Contratista */}
        <div className="space-y-2">
          <Label>Contratista</Label>
          <Select 
            value={getSelectValue(formData.contratista_id)} 
            onValueChange={(value) => handleInputChange('contratista_id', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar contratista" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__empty__">Sin asignar</SelectItem>
              {contratistas?.filter(c => isValidSelectValue(c.id)).map((contratista) => (
                <SelectItem key={contratista.id} value={contratista.id}>
                  {contratista.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Sitio */}
        <div className="space-y-2">
          <Label>Sitio</Label>
          <Select 
            value={getSelectValue(formData.sitio_id)} 
            onValueChange={(value) => handleInputChange('sitio_id', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar sitio" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__empty__">Sin asignar</SelectItem>
              {sitios?.filter(s => isValidSelectValue(s.id)).map((sitio) => (
                <SelectItem key={sitio.id} value={sitio.id}>
                  {sitio.codigo} - {sitio.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Equipo de Buceo */}
        <div className="space-y-2">
          <Label>Equipo de Buceo</Label>
          <Select 
            value={getSelectValue(formData.equipo_buceo_id)} 
            onValueChange={(value) => handleInputChange('equipo_buceo_id', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar equipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__empty__">Sin asignar</SelectItem>
              {equipos?.filter(e => isValidSelectValue(e.id) && e.activo).map((equipo) => (
                <SelectItem key={equipo.id} value={equipo.id}>
                  {equipo.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Supervisor Asignado */}
        <div className="space-y-2">
          <Label>Supervisor Asignado</Label>
          <Select 
            value={getSelectValue(formData.supervisor_asignado_id)} 
            onValueChange={(value) => handleInputChange('supervisor_asignado_id', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar supervisor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__empty__">Sin asignar</SelectItem>
              {supervisores.filter(s => isValidSelectValue(s.usuario_id)).map((supervisor) => (
                <SelectItem key={supervisor.usuario_id} value={supervisor.usuario_id}>
                  {supervisor.nombre} {supervisor.apellido}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Fechas */}
        <div className="space-y-2">
          <Label htmlFor="fecha_inicio">Fecha de Inicio*</Label>
          <Input
            id="fecha_inicio"
            type="date"
            value={formData.fecha_inicio}
            onChange={(e) => handleInputChange('fecha_inicio', e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="fecha_fin">Fecha de Fin</Label>
          <Input
            id="fecha_fin"
            type="date"
            value={formData.fecha_fin}
            onChange={(e) => handleInputChange('fecha_fin', e.target.value)}
          />
        </div>
      </div>

      {/* Tareas */}
      <div className="space-y-2">
        <Label htmlFor="tareas">Tareas</Label>
        <Textarea
          id="tareas"
          value={formData.tareas}
          onChange={(e) => handleInputChange('tareas', e.target.value)}
          placeholder="Descripción de las tareas a realizar"
          rows={3}
        />
      </div>

      {/* Botones */}
      <div className="flex items-center gap-3 pt-4 border-t">
        <Button type="submit" className="flex items-center gap-2">
          <Save className="w-4 h-4" />
          Guardar Cambios
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="flex items-center gap-2">
          <X className="w-4 h-4" />
          Cancelar
        </Button>
      </div>
    </form>
  );
};
