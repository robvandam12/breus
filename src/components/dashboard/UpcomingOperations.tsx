
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";

interface Operation {
  id: number;
  name: string;
  date: string;
  supervisor: string;
  status: string;
  divers: number;
}

interface UpcomingOperationsProps {
  operations: Operation[];
}

export const UpcomingOperations = ({ operations }: UpcomingOperationsProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "programada":
        return "bg-zinc-100 text-zinc-800 dark:bg-zinc-900/20 dark:text-zinc-400";
      case "en_progreso":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "completada":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "programada":
        return "Programada";
      case "en_progreso":
        return "En Progreso";
      case "completada":
        return "Completada";
      default:
        return status;
    }
  };

  return (
    <Card className="ios-card">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <Calendar className="w-5 h-5 text-zinc-600" />
          Operaciones Próximas
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {operations.map((operation, index) => (
          <div
            key={operation.id}
            className="p-4 rounded-xl bg-white/50 dark:bg-zinc-800/50 border border-zinc-200/50 dark:border-zinc-700/50 hover:bg-white/80 dark:hover:bg-zinc-800/80 transition-all duration-200 cursor-pointer group"
            style={{ animationDelay: `${(index + 4) * 100}ms` }}
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <h4 className="font-medium text-zinc-900 dark:text-zinc-100 text-sm leading-snug group-hover:text-zinc-700 dark:group-hover:text-zinc-400 transition-colors">
                  {operation.name}
                </h4>
                <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getStatusColor(operation.status)}`}>
                  {getStatusText(operation.status)}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-zinc-600 dark:text-zinc-400">
                <span>{operation.supervisor}</span>
                <span>{operation.divers} buzos</span>
              </div>
              <div className="text-xs font-medium text-zinc-500 dark:text-zinc-500">
                {new Date(operation.date).toLocaleDateString('es-CL', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric'
                })}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
