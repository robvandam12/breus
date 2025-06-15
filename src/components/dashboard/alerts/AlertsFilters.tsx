
import React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Search } from "lucide-react";

interface AlertsFiltersProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    filterPriority: string;
    setFilterPriority: (priority: string) => void;
    showAcknowledged: string;
    setShowAcknowledged: (value: string) => void;
}

export const AlertsFilters = ({
    searchTerm,
    setSearchTerm,
    filterPriority,
    setFilterPriority,
    showAcknowledged,
    setShowAcknowledged,
}: AlertsFiltersProps) => {
    return (
        <div className="mt-4 flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Buscar por código o tipo..." className="pl-8" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>
            <Select value={filterPriority} onValueChange={setFilterPriority}>
                <SelectTrigger className="w-full sm:w-[160px]">
                    <SelectValue placeholder="Prioridad" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Toda Prioridad</SelectItem>
                    <SelectItem value="critical">Crítica</SelectItem>
                    <SelectItem value="emergency">Emergencia</SelectItem>
                    <SelectItem value="warning">Advertencia</SelectItem>
                </SelectContent>
            </Select>
            <ToggleGroup type="single" value={showAcknowledged} onValueChange={val => val && setShowAcknowledged(val)} className="w-full sm:w-auto">
                <ToggleGroupItem value="unacknowledged">Activas</ToggleGroupItem>
                <ToggleGroupItem value="all">Todas</ToggleGroupItem>
            </ToggleGroup>
        </div>
    );
};
