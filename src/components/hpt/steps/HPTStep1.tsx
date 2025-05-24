
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useOperaciones } from "@/hooks/useOperaciones";
import { Building2, MapPin, Calendar } from "lucide-react";

interface HPTStep1Props {
  data: any;
  onUpdate: (data: any) => void;
}

export const HPTStep1 = ({ data, onUpdate }: HPTStep1Props) => {
  const { operaciones, isLoading } = useOperaciones();

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Información General</h2>
        <p className="mt-2 text-gray-600">
          Selecciona la operación y completa los datos básicos del HPT
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Operación
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="operacion">Operación *</Label>
            <Select
              value={data.operacion_id || ''}
              onValueChange={(value) => onUpdate({ operacion_id: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar operación..." />
              </SelectTrigger>
              <SelectContent>
                {operaciones.map((operacion) => (
                  <SelectItem key={operacion.id} value={operacion.id}>
                    {operacion.codigo} - {operacion.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="supervisor">Supervisor *</Label>
            <Input
              id="supervisor"
              value={data.supervisor || ''}
              onChange={(e) => onUpdate({ supervisor: e.target.value })}
              placeholder="Nombre del supervisor"
            />
          </div>

          <div>
            <Label htmlFor="plan_trabajo">Plan de Trabajo *</Label>
            <Textarea
              id="plan_trabajo"
              value={data.plan_trabajo || ''}
              onChange={(e) => onUpdate({ plan_trabajo: e.target.value })}
              placeholder="Describe el plan de trabajo detallado..."
              className="min-h-[120px]"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
