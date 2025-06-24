
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface EditContratistaFormProps {
  initialData: any;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
}

export const EditContratistaForm = ({ initialData, onSubmit, onCancel }: EditContratistaFormProps) => {
  const [formData, setFormData] = useState({
    nombre: initialData.nombre || '',
    rut: initialData.rut || '',
    direccion: initialData.direccion || '',
    email: initialData.email || '',
    telefono: initialData.telefono || '',
    estado: initialData.estado || 'activo',
    especialidades: initialData.especialidades || [],
    certificaciones: initialData.certificaciones || []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [newEspecialidad, setNewEspecialidad] = useState('');
  const [newCertificacion, setNewCertificacion] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nombre.trim() || !formData.rut.trim() || !formData.direccion.trim()) {
      return;
    }

    setIsLoading(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error updating contratista:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addEspecialidad = () => {
    if (newEspecialidad.trim() && !formData.especialidades.includes(newEspecialidad.trim())) {
      setFormData({
        ...formData,
        especialidades: [...formData.especialidades, newEspecialidad.trim()]
      });
      setNewEspecialidad('');
    }
  };

  const removeEspecialidad = (index: number) => {
    setFormData({
      ...formData,
      especialidades: formData.especialidades.filter((_, i) => i !== index)
    });
  };

  const addCertificacion = () => {
    if (newCertificacion.trim() && !formData.certificaciones.includes(newCertificacion.trim())) {
      setFormData({
        ...formData,
        certificaciones: [...formData.certificaciones, newCertificacion.trim()]
      });
      setNewCertificacion('');
    }
  };

  const removeCertificacion = (index: number) => {
    setFormData({
      ...formData,
      certificaciones: formData.certificaciones.filter((_, i) => i !== index)
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Información de la Empresa</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre de la Empresa *</Label>
              <Input
                id="nombre"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                placeholder="Nombre del contratista"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="rut">RUT *</Label>
              <Input
                id="rut"
                value={formData.rut}
                onChange={(e) => setFormData({ ...formData, rut: e.target.value })}
                placeholder="12.345.678-9"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="direccion">Dirección *</Label>
            <Input
              id="direccion"
              value={formData.direccion}
              onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
              placeholder="Dirección completa"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="contacto@contratista.com"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="telefono">Teléfono</Label>
              <Input
                id="telefono"
                value={formData.telefono}
                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                placeholder="+56 9 1234 5678"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="estado">Estado</Label>
            <Select value={formData.estado} onValueChange={(value) => setFormData({ ...formData, estado: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="activo">Activo</SelectItem>
                <SelectItem value="inactivo">Inactivo</SelectItem>
                <SelectItem value="suspendido">Suspendido</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Especialidades</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newEspecialidad}
              onChange={(e) => setNewEspecialidad(e.target.value)}
              placeholder="Agregar especialidad..."
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addEspecialidad())}
            />
            <Button type="button" onClick={addEspecialidad} variant="outline">
              Agregar
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.especialidades.map((especialidad, index) => (
              <Badge key={index} variant="outline" className="pr-1">
                {especialidad}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-auto p-1 ml-1"
                  onClick={() => removeEspecialidad(index)}
                >
                  <X className="w-3 h-3" />
                </Button>
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Certificaciones</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newCertificacion}
              onChange={(e) => setNewCertificacion(e.target.value)}
              placeholder="Agregar certificación..."
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCertificacion())}
            />
            <Button type="button" onClick={addCertificacion} variant="outline">
              Agregar
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.certificaciones.map((certificacion, index) => (
              <Badge key={index} variant="outline" className="pr-1 bg-green-50 text-green-700 border-green-200">
                {certificacion}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-auto p-1 ml-1"
                  onClick={() => removeCertificacion(index)}
                >
                  <X className="w-3 h-3" />
                </Button>
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Separator />

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Guardando...' : 'Guardar Cambios'}
        </Button>
      </div>
    </form>
  );
};
