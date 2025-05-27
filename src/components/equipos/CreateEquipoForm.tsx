
import { useState } from "react";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Users } from "lucide-react";

interface CreateEquipoFormProps {
  onSubmit: (data: { nombre: string; descripcion?: string }) => void;
  onCancel: () => void;
}

export const CreateEquipoForm = ({ onSubmit, onCancel }: CreateEquipoFormProps) => {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nombre.trim()) return;
    
    onSubmit({
      nombre: formData.nombre.trim(),
      descripcion: formData.descripcion.trim() || undefined
    });
  };

  return (
    <div>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-600" />
          Crear Nuevo Equipo de Buceo
        </DialogTitle>
      </DialogHeader>
      
      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        <div>
          <Label htmlFor="nombre">Nombre del Equipo *</Label>
          <Input
            id="nombre"
            value={formData.nombre}
            onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
            placeholder="Ej: Equipo Alpha"
            required
          />
        </div>

        <div>
          <Label htmlFor="descripcion">Descripción</Label>
          <Textarea
            id="descripcion"
            value={formData.descripcion}
            onChange={(e) => setFormData(prev => ({ ...prev, descripcion: e.target.value }))}
            placeholder="Descripción del equipo (opcional)"
            rows={3}
          />
        </div>

        <div className="flex gap-3 pt-4">
          <Button type="submit" className="flex-1">
            Crear Equipo
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
};
