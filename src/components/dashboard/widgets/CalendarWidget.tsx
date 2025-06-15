
import React from 'react';
import { useOperaciones } from '@/hooks/useOperaciones';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Calendar as CalendarIcon } from 'lucide-react';
import { CalendarWidgetSkeleton } from './skeletons/CalendarWidgetSkeleton';
import type { Operacion } from '@/hooks/useOperacionesQuery';
import { ScrollArea } from '@/components/ui/scroll-area';

const getStatusColor = (status: string) => {
    switch (status) {
        case 'activa': return 'bg-green-500';
        case 'completada': return 'bg-blue-500';
        case 'pausada': return 'bg-yellow-500';
        case 'cancelada': return 'bg-red-500';
        default: return 'bg-gray-400';
    }
};

const CalendarWidget = () => {
    const { operaciones, isLoading } = useOperaciones();
    const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(new Date());
    const [currentMonth, setCurrentMonth] = React.useState<Date>(new Date());

    const operationsByDate = React.useMemo(() => {
        const map = new Map<string, Operacion[]>();
        operaciones.forEach(op => {
            const opDate = new Date(op.fecha_inicio);
            // Quick fix for timezone issues by using UTC dates
            const date = new Date(opDate.getUTCFullYear(), opDate.getUTCMonth(), opDate.getUTCDate()).toDateString();
            if (!map.has(date)) {
                map.set(date, []);
            }
            map.get(date)?.push(op);
        });
        return map;
    }, [operaciones]);

    if (isLoading) {
        return <CalendarWidgetSkeleton />;
    }
    
    const modifiers = {
        hasOperation: Array.from(operationsByDate.keys()).map(dateStr => new Date(dateStr))
    };

    const selectedDayOperations = selectedDate ? operationsByDate.get(selectedDate.toDateString()) || [] : [];

    return (
        <Card className="h-full flex flex-col">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                    <CalendarIcon className="w-5 h-5" />
                    Calendario de Operaciones
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col lg:flex-row gap-4 overflow-hidden p-3 sm:p-4">
                <div className="flex justify-center lg:flex-shrink-0">
                    <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        month={currentMonth}
                        onMonthChange={setCurrentMonth}
                        modifiers={modifiers}
                        components={{
                            DayContent: ({ date, activeModifiers }) => {
                                const isSelected = activeModifiers.selected;
                                const hasOp = operationsByDate.has(date.toDateString());
                                return (
                                    <div className="relative w-full h-full flex items-center justify-center">
                                        {date.getDate()}
                                        {hasOp && !isSelected && <div className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-primary" />}
                                    </div>
                                );
                            }
                        }}
                        className="rounded-md border p-2"
                    />
                </div>
                <div className="flex-grow overflow-hidden flex flex-col">
                    <h3 className="font-semibold mb-2 flex-shrink-0">
                        {selectedDate ? `Operaciones para ${selectedDate.toLocaleDateString('es-CL')}` : 'Seleccione una fecha'}
                    </h3>
                    <ScrollArea className="flex-grow pr-3 -mr-3">
                        {selectedDayOperations.length > 0 ? (
                            <ul className="space-y-2">
                                {selectedDayOperations.map(op => (
                                    <li key={op.id} className="p-2 border rounded-lg hover:bg-muted/50 transition-colors">
                                        <div className="flex justify-between items-center">
                                            <span className="font-semibold text-sm">{op.nombre}</span>
                                            <Badge variant="secondary" className="text-xs capitalize">
                                                <span className={`w-2 h-2 rounded-full mr-2 ${getStatusColor(op.estado)}`}></span>
                                                {op.estado}
                                            </Badge>
                                        </div>
                                        <p className="text-xs text-muted-foreground">{op.codigo}</p>
                                        {op.sitios && <p className="text-xs text-muted-foreground mt-1">{op.sitios.nombre}</p>}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="h-full flex items-center justify-center">
                                <p className="text-sm text-muted-foreground text-center">
                                    No hay operaciones programadas.
                                </p>
                            </div>
                        )}
                    </ScrollArea>
                </div>
            </CardContent>
        </Card>
    );
};

export default React.memo(CalendarWidget);
