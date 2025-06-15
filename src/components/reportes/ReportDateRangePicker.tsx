
import type { DateRange } from "react-day-picker";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";

interface ReportDateRangePickerProps {
    dateRange: DateRange | undefined;
    onDateChange: (dateRange: DateRange | undefined) => void;
    className?: string;
}

export const ReportDateRangePicker = ({ dateRange, onDateChange, className }: ReportDateRangePickerProps) => {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button id="date" variant={"outline"} className={`w-[300px] justify-start text-left font-normal ${className}`}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange?.from ? (
                        dateRange.to ? (
                            <>
                                {format(dateRange.from, "LLL dd, y", { locale: es })} -{" "}
                                {format(dateRange.to, "LLL dd, y", { locale: es })}
                            </>
                        ) : (
                            format(dateRange.from, "LLL dd, y", { locale: es })
                        )
                    ) : (
                        <span>Seleccionar rango</span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange?.from}
                    selected={dateRange}
                    onSelect={onDateChange}
                    numberOfMonths={2}
                />
            </PopoverContent>
        </Popover>
    );
};
