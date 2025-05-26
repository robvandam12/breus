
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EnhancedSelect } from "@/components/ui/enhanced-select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Filter, X } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface DashboardFiltersProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: any) => void;
}

export const DashboardFilters = ({ isOpen, onClose, onApplyFilters }: DashboardFiltersProps) => {
  const [filters, setFilters] = useState({
    dateRange: { from: undefined, to: undefined } as { from: Date | undefined; to: Date | undefined },
    sitio: '',
    estado: '',
    supervisor: '',
  });

  const handleApplyFilters = () => {
    onApplyFilters(filters);
    onClose();
  };

  const handleResetFilters = () => {
    const resetFilters = {
      dateRange: { from: undefined, to: undefined },
      sitio: '',
      estado: '',
      supervisor: '',
    };
    setFilters(resetFilters);
    onApplyFilters(resetFilters);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg bg-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold">Filtros de Búsqueda</h3>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Rango de Fechas</Label>
              <div className="grid grid-cols-2 gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filters.dateRange.from ? (
                        format(filters.dateRange.from, "dd/MM/yyyy", { locale: es })
                      ) : (
                        "Fecha desde"
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={filters.dateRange.from}
                      onSelect={(date) => setFilters(prev => ({
                        ...prev,
                        dateRange: { ...prev.dateRange, from: date }
                      }))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filters.dateRange.to ? (
                        format(filters.dateRange.to, "dd/MM/yyyy", { locale: es })
                      ) : (
                        "Fecha hasta"
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={filters.dateRange.to}
                      onSelect={(date) => setFilters(prev => ({
                        ...prev,
                        dateRange: { ...prev.dateRange, to: date }
                      }))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Sitio</Label>
              <EnhancedSelect
                value={filters.sitio}
                onValueChange={(value) => setFilters(prev => ({ ...prev, sitio: value }))}
                placeholder="Seleccionar sitio..."
                options={[
                  { value: 'centro-1', label: 'Centro 1' },
                  { value: 'centro-2', label: 'Centro 2' },
                  { value: 'centro-3', label: 'Centro 3' },
                ]}
              />
            </div>

            <div className="space-y-2">
              <Label>Estado</Label>
              <EnhancedSelect
                value={filters.estado}
                onValueChange={(value) => setFilters(prev => ({ ...prev, estado: value }))}
                placeholder="Seleccionar estado..."
                options={[
                  { value: 'activa', label: 'Activa' },
                  { value: 'completada', label: 'Completada' },
                  { value: 'suspendida', label: 'Suspendida' },
                ]}
              />
            </div>

            <div className="space-y-2">
              <Label>Supervisor</Label>
              <Input
                value={filters.supervisor}
                onChange={(e) => setFilters(prev => ({ ...prev, supervisor: e.target.value }))}
                placeholder="Nombre del supervisor..."
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6 pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={handleResetFilters}
              className="flex-1"
            >
              Limpiar
            </Button>
            <Button 
              onClick={handleApplyFilters}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              Aplicar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
