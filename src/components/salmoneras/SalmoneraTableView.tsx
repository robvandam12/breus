
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Edit, Trash2, Eye, AlertTriangle } from "lucide-react";
import { Salmonera } from "@/hooks/useSalmoneras";
import { useToast } from "@/hooks/use-toast";

interface SalmoneraTableViewProps {
  salmoneras: Salmonera[];
  onEdit: (salmonera: Salmonera) => void;
  onDelete: (id: string) => Promise<void>;
  onSelect: (salmonera: Salmonera) => void;
}

export const SalmoneraTableView = ({ salmoneras, onEdit, onDelete, onSelect }: SalmoneraTableViewProps) => {
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const { toast } = useToast();

  const handleDelete = async (id: string) => {
    try {
      await onDelete(id);
      setDeleteConfirm(null);
      toast({
        title: "Salmonera eliminada",
        description: "La salmonera ha sido eliminada exitosamente.",
      });
    } catch (error) {
      console.error('Error deleting salmonera:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar la salmonera.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Empresa</TableHead>
            <TableHead>RUT</TableHead>
            <TableHead>Contacto</TableHead>
            <TableHead>Sitios</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {salmoneras.map((salmonera) => (
            <TableRow key={salmonera.id}>
              <TableCell>
                <div>
                  <div className="font-medium">{salmonera.nombre}</div>
                  <div className="text-sm text-zinc-500">{salmonera.direccion}</div>
                </div>
              </TableCell>
              <TableCell className="font-mono">{salmonera.rut}</TableCell>
              <TableCell>
                <div className="text-sm">
                  {salmonera.email && <div>{salmonera.email}</div>}
                  {salmonera.telefono && <div className="text-zinc-500">{salmonera.telefono}</div>}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{salmonera.sitios_activos || 0} sitios</Badge>
              </TableCell>
              <TableCell>
                <Badge 
                  variant={salmonera.estado === 'activa' ? 'default' : 'secondary'}
                  className={salmonera.estado === 'activa' ? 'bg-green-100 text-green-700' : ''}
                >
                  {salmonera.estado}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onSelect(salmonera)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onEdit(salmonera)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setDeleteConfirm(salmonera.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={deleteConfirm !== null} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              Confirmar eliminación
            </DialogTitle>
            <DialogDescription>
              ¿Está seguro de que desea eliminar esta salmonera? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 mt-6">
            <Button variant="outline" onClick={() => setDeleteConfirm(null)} className="flex-1">
              Cancelar
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
              className="flex-1"
            >
              Eliminar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
