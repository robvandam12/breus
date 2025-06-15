
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, Edit, Trash2, Plus } from "lucide-react";

// Document Creation Button Component
interface DocumentCreationButtonProps {
  onClick: () => void;
  disabled: boolean;
  className: string;
  children: React.ReactNode;
}

export const DocumentCreationButton = ({ onClick, disabled, className, children }: DocumentCreationButtonProps) => {
  return (
    <Button 
      onClick={onClick}
      disabled={disabled}
      className={className}
      size="sm"
    >
      <Plus className="w-4 h-4 mr-2" />
      {children}
    </Button>
  );
};

// Operations Actions Component
interface OperacionesActionsProps {
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const OperacionesActions = ({ onView, onEdit, onDelete }: OperacionesActionsProps) => {
  return (
    <div className="flex justify-end gap-1">
      <Button
        variant="outline"
        size="sm"
        onClick={onView}
        className="ios-button-sm"
      >
        <Eye className="w-4 h-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={onEdit}
        className="ios-button-sm"
      >
        <Edit className="w-4 h-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={onDelete}
        className="ios-button-sm text-red-600 hover:text-red-700"
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
};

// Operations KPIs Component
interface OperacionesKPIsProps {
  operaciones: any[];
}

export const OperacionesKPIs = ({ operaciones }: OperacionesKPIsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="ios-card">
        <CardContent className="p-4">
          <div className="text-2xl font-bold text-blue-600">
            {operaciones.length}
          </div>
          <div className="text-sm text-zinc-500">Total Operaciones</div>
        </CardContent>
      </Card>
      <Card className="ios-card">
        <CardContent className="p-4">
          <div className="text-2xl font-bold text-green-600">
            {operaciones.filter(op => op.estado === 'activa').length}
          </div>
          <div className="text-sm text-zinc-500">Activas</div>
        </CardContent>
      </Card>
      <Card className="ios-card">
        <CardContent className="p-4">
          <div className="text-2xl font-bold text-yellow-600">
            {operaciones.filter(op => op.estado === 'pausada').length}
          </div>
          <div className="text-sm text-zinc-500">Pausadas</div>
        </CardContent>
      </Card>
      <Card className="ios-card">
        <CardContent className="p-4">
          <div className="text-2xl font-bold text-blue-600">
            {operaciones.filter(op => op.estado === 'completada').length}
          </div>
          <div className="text-sm text-zinc-500">Completadas</div>
        </CardContent>
      </Card>
    </div>
  );
};

// Inmersiones Actions Component (movido desde pages/operaciones)
interface InmersionesActionsProps {
  inmersionId: string;
  onView: (id: string) => void;
  onCreateBitacoraBuzo: (id: string) => void;
  onCreateBitacoraSupervisor: (id: string) => void;
}

export const InmersionesActions = ({ 
  inmersionId, 
  onView, 
  onCreateBitacoraBuzo, 
  onCreateBitacoraSupervisor 
}: InmersionesActionsProps) => {
  return (
    <div className="pt-3 border-t border-gray-200">
      <div className="flex gap-2 mb-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onView(inmersionId)}
          className="flex-1"
        >
          <Eye className="w-4 h-4 mr-1" />
          Ver
        </Button>
      </div>
      <div className="flex gap-1">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onCreateBitacoraBuzo(inmersionId)}
          className="flex-1 text-xs"
        >
          <Plus className="w-3 h-3 mr-1" />
          Bit. Buzo
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onCreateBitacoraSupervisor(inmersionId)}
          className="flex-1 text-xs"
        >
          <Plus className="w-3 h-3 mr-1" />
          Bit. Sup.
        </Button>
      </div>
    </div>
  );
};
