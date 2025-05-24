
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Upload, Plus, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface CreateOperacionFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export const CreateOperacionForm = ({ onSubmit, onCancel }: CreateOperacionFormProps) => {
  const [formData, setFormData] = useState({
    codigo: "",
    nombre: "",
    descripcion: "",
    salmonera: "",
    sitio: "",
    fechaInicio: undefined as Date | undefined,
    fechaFin: undefined as Date | undefined,
    supervisor: "",
    prioridad: "",
    tipo: "",
    contrato: null as File | null
  });

  const [buzos, setBuzos] = useState<string[]>([]);
  const [newBuzo, setNewBuzo] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      buzos,
      estado: "En Preparación"
    });
  };

  const addBuzo = () => {
    if (newBuzo.trim() && !buzos.includes(newBuzo.trim())) {
      setBuzos([...buzos, newBuzo.trim()]);
      setNewBuzo("");
    }
  };

  const removeBuzo = (buzo: string) => {
    setBuzos(buzos.filter(b => b !== buzo));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, contrato: file });
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl text-zinc-900">Nueva Operación</CardTitle>
        <p className="text-sm text-zinc-500">
          Crea una nueva operación de buceo para habilitar el equipo
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información Básica */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="codigo">Código de Operación*</Label>
              <Input
                id="codigo"
                value={formData.codigo}
                onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                placeholder="OP-2024-001"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="prioridad">Prioridad*</Label>
              <Select
                value={formData.prioridad}
                onValueChange={(value) => setFormData({ ...formData, prioridad: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar prioridad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Alta">Alta</SelectItem>
                  <SelectItem value="Media">Media</SelectItem>
                  <SelectItem value="Baja">Baja</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre de la Operación*</Label>
            <Input
              id="nombre"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              placeholder="Mantenimiento Jaulas Sitio Norte"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción</Label>
            <Textarea
              id="descripcion"
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              placeholder="Descripción detallada de la operación..."
              rows={3}
            />
          </div>

          {/* Empresa y Sitio */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="salmonera">Salmonera*</Label>
              <Select
                value={formData.salmonera}
                onValueChange={(value) => setFormData({ ...formData, salmonera: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar salmonera" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AquaChile S.A.">AquaChile S.A.</SelectItem>
                  <SelectItem value="Salmones Camanchaca">Salmones Camanchaca</SelectItem>
                  <SelectItem value="Cermaq Chile">Cermaq Chile</SelectItem>
                  <SelectItem value="Multiexport Foods">Multiexport Foods</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="sitio">Sitio*</Label>
              <Select
                value={formData.sitio}
                onValueChange={(value) => setFormData({ ...formData, sitio: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar sitio" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sitio Chiloé Norte">Sitio Chiloé Norte</SelectItem>
                  <SelectItem value="Centro Los Fiordos">Centro Los Fiordos</SelectItem>
                  <SelectItem value="Piscicultura Río Blanco">Piscicultura Río Blanco</SelectItem>
                  <SelectItem value="Centro Puerto Montt">Centro Puerto Montt</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Fechas */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Fecha de Inicio*</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.fechaInicio ? (
                      format(formData.fechaInicio, "PPP", { locale: es })
                    ) : (
                      <span>Seleccionar fecha</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.fechaInicio}
                    onSelect={(date) => setFormData({ ...formData, fechaInicio: date })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label>Fecha de Fin*</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.fechaFin ? (
                      format(formData.fechaFin, "PPP", { locale: es })
                    ) : (
                      <span>Seleccionar fecha</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.fechaFin}
                    onSelect={(date) => setFormData({ ...formData, fechaFin: date })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Equipo */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="supervisor">Supervisor*</Label>
              <Select
                value={formData.supervisor}
                onValueChange={(value) => setFormData({ ...formData, supervisor: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar supervisor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Diego Martínez">Diego Martínez</SelectItem>
                  <SelectItem value="Carlos Mendoza">Carlos Mendoza</SelectItem>
                  <SelectItem value="Ana López">Ana López</SelectItem>
                  <SelectItem value="Roberto Silva">Roberto Silva</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo de Operación*</Label>
              <Select
                value={formData.tipo}
                onValueChange={(value) => setFormData({ ...formData, tipo: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Mantenimiento">Mantenimiento</SelectItem>
                  <SelectItem value="Inspección">Inspección</SelectItem>
                  <SelectItem value="Limpieza">Limpieza</SelectItem>
                  <SelectItem value="Emergencia">Emergencia</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Buzos */}
          <div className="space-y-3">
            <Label>Buzos Asignados</Label>
            <div className="flex gap-2">
              <Input
                value={newBuzo}
                onChange={(e) => setNewBuzo(e.target.value)}
                placeholder="Nombre del buzo"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addBuzo())}
              />
              <Button type="button" onClick={addBuzo} variant="outline">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {buzos.map((buzo) => (
                <Badge key={buzo} variant="outline" className="flex items-center gap-1">
                  {buzo}
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={() => removeBuzo(buzo)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          {/* Contrato */}
          <div className="space-y-2">
            <Label htmlFor="contrato">Contrato PDF (Opcional)</Label>
            <div className="flex items-center gap-2">
              <Input
                id="contrato"
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="flex-1"
              />
              <Button type="button" variant="outline">
                <Upload className="w-4 h-4 mr-2" />
                Subir
              </Button>
            </div>
            {formData.contrato && (
              <p className="text-sm text-zinc-600">
                Archivo seleccionado: {formData.contrato.name}
              </p>
            )}
          </div>

          {/* Acciones */}
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit" className="ios-button">
              Crear Operación
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
