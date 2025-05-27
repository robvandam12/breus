
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { useOperaciones } from "@/hooks/useOperaciones";

export const OperacionesCalendarView = () => {
  const { operaciones, isLoading } = useOperaciones();
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatMonth = (date: Date) => {
    return date.toLocaleDateString('es-CL', { 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const getOperationsForDay = (day: number) => {
    const dayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return operaciones.filter(op => {
      const startDate = new Date(op.fecha_inicio);
      const endDate = op.fecha_fin ? new Date(op.fecha_fin) : startDate;
      return dayDate >= startDate && dayDate <= endDate;
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDay }, (_, i) => i);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="w-5 h-5" />
              Calendario de Operaciones
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-lg font-medium capitalize">
                {formatMonth(currentDate)}
              </span>
              <Button variant="outline" size="sm" onClick={() => navigateMonth('next')}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2 mb-4">
            {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
              <div key={day} className="text-center text-sm font-medium text-gray-500 p-2">
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-2">
            {emptyDays.map(day => (
              <div key={`empty-${day}`} className="h-24 border border-gray-100 rounded"></div>
            ))}
            
            {days.map(day => {
              const dayOperations = getOperationsForDay(day);
              const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();
              
              return (
                <div 
                  key={day} 
                  className={`h-24 border border-gray-200 rounded p-1 ${isToday ? 'bg-blue-50 border-blue-200' : ''}`}
                >
                  <div className={`text-sm font-medium mb-1 ${isToday ? 'text-blue-600' : ''}`}>
                    {day}
                  </div>
                  <div className="space-y-1">
                    {dayOperations.slice(0, 2).map((op, index) => (
                      <div
                        key={`${op.id}-${index}`}
                        className={`text-xs p-1 rounded truncate ${
                          op.estado === 'activa' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-gray-100 text-gray-600'
                        }`}
                        title={op.nombre}
                      >
                        {op.nombre}
                      </div>
                    ))}
                    {dayOperations.length > 2 && (
                      <div className="text-xs text-gray-500 text-center">
                        +{dayOperations.length - 2} más
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Operaciones de Este Mes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {operaciones
              .filter(op => {
                const startDate = new Date(op.fecha_inicio);
                return (
                  startDate.getMonth() === currentDate.getMonth() &&
                  startDate.getFullYear() === currentDate.getFullYear()
                );
              })
              .map(operacion => (
                <div key={operacion.id} className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <p className="font-medium">{operacion.nombre}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(operacion.fecha_inicio).toLocaleDateString('es-CL')} - 
                      Sitio no disponible
                    </p>
                  </div>
                  <Badge variant={operacion.estado === 'activa' ? 'default' : 'secondary'}>
                    {operacion.estado}
                  </Badge>
                </div>
              ))}
            {operaciones.filter(op => {
              const startDate = new Date(op.fecha_inicio);
              return (
                startDate.getMonth() === currentDate.getMonth() &&
                startDate.getFullYear() === currentDate.getFullYear()
              );
            }).length === 0 && (
              <p className="text-gray-500 text-center py-4">
                No hay operaciones programadas para este mes
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
