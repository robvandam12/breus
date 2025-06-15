
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Trash2 } from 'lucide-react';
import type { SecurityAlertRule } from '@/types/security';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface AlertRulesTableProps {
  rules: SecurityAlertRule[];
  onEdit: (rule: SecurityAlertRule) => void;
  onDelete: (ruleId: string) => void;
}

export const AlertRulesTable = ({ rules, onEdit, onDelete }: AlertRulesTableProps) => {
  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Prioridad</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Plantilla</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rules.map((rule) => (
              <TableRow key={rule.id}>
                <TableCell className="font-medium">{rule.name}</TableCell>
                <TableCell>
                  <Badge variant="outline">{rule.type}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={rule.priority === 'critical' || rule.priority === 'emergency' ? 'destructive' : rule.priority === 'warning' ? 'secondary' : 'default'}>
                    {rule.priority}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={rule.enabled ? 'default' : 'outline'} className={rule.enabled ? 'bg-green-100 text-green-800' : ''}>
                    {rule.enabled ? 'Habilitada' : 'Deshabilitada'}
                  </Badge>
                </TableCell>
                <TableCell>{rule.is_template ? 'Sí' : 'No'}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => onEdit(rule)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                       <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta acción no se puede deshacer. Esto eliminará permanentemente la regla de alerta.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => onDelete(rule.id)} className="bg-red-600 hover:bg-red-700">Eliminar</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
