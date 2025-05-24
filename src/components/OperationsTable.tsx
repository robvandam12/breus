
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

interface Operation {
  id: string;
  sitio: string;
  contratista: string;
  supervisor: string;
  estado: 'planificada' | 'en_progreso' | 'completada' | 'cancelada';
  fecha: string;
  buzos: number;
}

const mockOperations: Operation[] = [
  {
    id: "OP-001",
    sitio: "Sitio Los Boldos",
    contratista: "AquaTech Solutions",
    supervisor: "Juan Pérez",
    estado: "en_progreso",
    fecha: "2025-05-24",
    buzos: 3
  },
  {
    id: "OP-002", 
    sitio: "Centro Punta Arenas",
    contratista: "BuceoMar Ltda",
    supervisor: "María González",
    estado: "planificada",
    fecha: "2025-05-25",
    buzos: 2
  },
  {
    id: "OP-003",
    sitio: "Sitio Chiloé Norte",
    contratista: "AquaTech Solutions", 
    supervisor: "Carlos Silva",
    estado: "completada",
    fecha: "2025-05-23",
    buzos: 4
  }
];

const statusConfig = {
  planificada: { label: "Planificada", variant: "secondary" as const },
  en_progreso: { label: "En Progreso", variant: "default" as const },
  completada: { label: "Completada", variant: "outline" as const },
  cancelada: { label: "Cancelada", variant: "destructive" as const }
};

export function OperationsTable() {
  return (
    <div className="rounded-lg border bg-card">
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Operaciones Activas</h3>
            <p className="text-sm text-muted-foreground">
              Operaciones en curso y próximas
            </p>
          </div>
          <Button variant="outline" size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            Ver todas
          </Button>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Sitio</TableHead>
            <TableHead>Contratista</TableHead>
            <TableHead>Supervisor</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead>Buzos</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockOperations.map((operation) => (
            <TableRow key={operation.id} className="hover:bg-muted/50">
              <TableCell className="font-medium">{operation.id}</TableCell>
              <TableCell>{operation.sitio}</TableCell>
              <TableCell>{operation.contratista}</TableCell>
              <TableCell>{operation.supervisor}</TableCell>
              <TableCell>
                <Badge variant={statusConfig[operation.estado].variant}>
                  {statusConfig[operation.estado].label}
                </Badge>
              </TableCell>
              <TableCell>{operation.fecha}</TableCell>
              <TableCell>{operation.buzos}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
