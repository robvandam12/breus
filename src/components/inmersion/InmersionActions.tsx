
import React from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Edit, Trash2, Eye, Play, CheckCircle } from 'lucide-react';
import { useInmersiones, type Inmersion } from '@/hooks/useInmersiones';
import { useNavigate } from 'react-router-dom';

interface InmersionActionsProps {
  inmersion: Inmersion;
  onEdit?: (inmersion: Inmersion) => void;
}

export const InmersionActions = ({ inmersion, onEdit }: InmersionActionsProps) => {
  const navigate = useNavigate();
  const { deleteInmersion, executeInmersion, completeInmersion } = useInmersiones();

  const handleView = () => {
    navigate(`/inmersiones/${inmersion.inmersion_id}`);
  };

  const handleEdit = () => {
    onEdit?.(inmersion);
  };

  const handleDelete = async () => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta inmersión?')) {
      try {
        await deleteInmersion(inmersion.inmersion_id);
      } catch (error) {
        console.error('Error deleting inmersion:', error);
      }
    }
  };

  const handleExecute = async () => {
    try {
      await executeInmersion(inmersion.inmersion_id);
    } catch (error) {
      console.error('Error executing inmersion:', error);
    }
  };

  const handleComplete = async () => {
    try {
      await completeInmersion(inmersion.inmersion_id);
    } catch (error) {
      console.error('Error completing inmersion:', error);
    }
  };

  const canExecute = inmersion.hpt_validado && inmersion.anexo_bravo_validado && 
                    inmersion.estado === 'planificada';
  const canComplete = inmersion.estado === 'en_progreso';
  const canEdit = inmersion.estado === 'planificada';
  const canDelete = inmersion.estado === 'planificada';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleView}>
          <Eye className="mr-2 h-4 w-4" />
          Ver detalles
        </DropdownMenuItem>
        
        {canEdit && (
          <DropdownMenuItem onClick={handleEdit}>
            <Edit className="mr-2 h-4 w-4" />
            Editar
          </DropdownMenuItem>
        )}
        
        {canExecute && (
          <DropdownMenuItem onClick={handleExecute}>
            <Play className="mr-2 h-4 w-4" />
            Ejecutar
          </DropdownMenuItem>
        )}
        
        {canComplete && (
          <DropdownMenuItem onClick={handleComplete}>
            <CheckCircle className="mr-2 h-4 w-4" />
            Completar
          </DropdownMenuItem>
        )}
        
        {canDelete && (
          <DropdownMenuItem onClick={handleDelete} className="text-red-600">
            <Trash2 className="mr-2 h-4 w-4" />
            Eliminar
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
