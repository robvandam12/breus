
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface DeleteEquipoModalProps {
  equipo: any;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting?: boolean;
}

export const DeleteEquipoModal = ({ 
  equipo, 
  isOpen, 
  onClose, 
  onConfirm, 
  isDeleting = false 
}: DeleteEquipoModalProps) => {
  if (!equipo) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="w-5 h-5" />
            Eliminar Equipo
          </DialogTitle>
          <DialogDescription className="text-left">
            ¿Estás seguro de que quieres eliminar el equipo <strong>"{equipo.nombre}"</strong>?
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-800">
              <strong>Esta acción no se puede deshacer.</strong> Se eliminarán:
            </p>
            <ul className="text-sm text-red-700 mt-2 ml-4 list-disc">
              <li>Toda la información del equipo</li>
              <li>Los {equipo.miembros?.length || 0} miembros asignados</li>
              <li>Las asignaciones a operaciones activas</li>
            </ul>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isDeleting}>
            Cancelar
          </Button>
          <Button 
            variant="destructive" 
            onClick={onConfirm}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700"
          >
            {isDeleting ? 'Eliminando...' : 'Eliminar Equipo'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
