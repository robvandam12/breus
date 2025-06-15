
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter } from "lucide-react";

interface OperacionesFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
}

export const OperacionesFilters = ({ searchTerm, setSearchTerm, statusFilter, setStatusFilter }: OperacionesFiltersProps) => {
  return (
    <div className="flex flex-wrap gap-4 items-center">
      <div className="flex-1 min-w-64">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Buscar por nombre o código..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Select value={statusFilter} onValueChange={setStatusFilter}>
        <SelectTrigger className="w-48">
          <Filter className="w-4 h-4 mr-2" />
          <SelectValue placeholder="Filtrar por estado" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos los estados</SelectItem>
          <SelectItem value="activa">Activas</SelectItem>
          <SelectItem value="pausada">Pausadas</SelectItem>
          <SelectItem value="completada">Completadas</SelectItem>
          <SelectItem value="cancelada">Canceladas</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
