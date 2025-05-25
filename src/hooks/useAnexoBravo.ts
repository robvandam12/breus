
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface AnexoBravoFormData {
  operacion_id: string;
  fecha_verificacion: string;
  checklist_items: Array<{
    id: string;
    item: string;
    verificado: boolean;
    observaciones?: string;
  }>;
  jefe_centro_firma: string | null;
  supervisor_firma: string | null;
  observaciones_generales: string;
}

export interface AnexoBravo {
  id: string;
  codigo: string;
  operacion_id: string;
  operacion_nombre: string;
  fecha_creacion: string;
  fecha_verificacion: string;
  jefe_centro: string;
  supervisor: string;
  progreso: number;
  checklist_completo: boolean;
  estado: string;
  firmado: boolean;
  created_at: string;
  updated_at: string;
}

export const useAnexoBravo = () => {
  const queryClient = useQueryClient();

  const { data: anexosBravo = [], isLoading: loading, error } = useQuery({
    queryKey: ['anexos-bravo'],
    queryFn: async () => {
      console.log('Fetching Anexos Bravo...');
      const { data, error } = await supabase
        .from('anexo_bravo')
        .select(`
          *,
          operacion:operacion_id (
            nombre,
            codigo
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching Anexos Bravo:', error);
        throw error;
      }

      console.log('Anexos Bravo fetched:', data);
      return (data || []).map((item: any) => {
        const checklistItems = item.checklist_items || [];
        const completedItems = checklistItems.filter((i: any) => i.verificado).length;
        const progreso = checklistItems.length > 0 ? Math.round((completedItems / checklistItems.length) * 100) : 0;
        
        return {
          id: item.id,
          codigo: item.codigo || `AB-${item.id.slice(0, 8)}`,
          operacion_id: item.operacion_id,
          operacion_nombre: item.operacion?.nombre || 'Sin operación',
          fecha_creacion: new Date(item.created_at).toLocaleDateString(),
          fecha_verificacion: item.fecha_verificacion ? new Date(item.fecha_verificacion).toLocaleDateString() : 'Pendiente',
          jefe_centro: item.jefe_centro || 'Sin asignar',
          supervisor: item.supervisor || 'Sin asignar',
          progreso,
          checklist_completo: progreso === 100,
          estado: item.estado || 'borrador',
          firmado: !!(item.jefe_centro_firma && item.supervisor_firma),
          created_at: item.created_at,
          updated_at: item.updated_at,
        };
      }) as AnexoBravo[];
    },
  });

  const createAnexoBravoMutation = useMutation({
    mutationFn: async (anexoData: AnexoBravoFormData) => {
      console.log('Creating Anexo Bravo:', anexoData);
      
      const anexoRecord = {
        operacion_id: anexoData.operacion_id,
        codigo: `AB-${Date.now()}`,
        fecha_verificacion: anexoData.fecha_verificacion,
        checklist_items: anexoData.checklist_items,
        jefe_centro_firma: anexoData.jefe_centro_firma,
        supervisor_firma: anexoData.supervisor_firma,
        observaciones_generales: anexoData.observaciones_generales,
        estado: 'completado',
      };

      const { data, error } = await supabase
        .from('anexo_bravo')
        .insert([anexoRecord])
        .select()
        .single();

      if (error) {
        console.error('Error creating Anexo Bravo:', error);
        throw error;
      }

      console.log('Anexo Bravo created:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anexos-bravo'] });
      toast({
        title: "Anexo Bravo creado",
        description: "El Anexo Bravo ha sido creado exitosamente.",
      });
    },
    onError: (error) => {
      console.error('Error creating Anexo Bravo:', error);
      toast({
        title: "Error",
        description: "No se pudo crear el Anexo Bravo. Intente nuevamente.",
        variant: "destructive",
      });
    },
  });

  const deleteAnexoBravoMutation = useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting Anexo Bravo:', id);
      const { error } = await supabase
        .from('anexo_bravo')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting Anexo Bravo:', error);
        throw error;
      }

      console.log('Anexo Bravo deleted:', id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anexos-bravo'] });
      toast({
        title: "Anexo Bravo eliminado",
        description: "El Anexo Bravo ha sido eliminado exitosamente.",
      });
    },
    onError: (error) => {
      console.error('Error deleting Anexo Bravo:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el Anexo Bravo. Intente nuevamente.",
        variant: "destructive",
      });
    },
  });

  return {
    anexosBravo,
    loading,
    error,
    createAnexoBravo: createAnexoBravoMutation.mutateAsync,
    deleteAnexoBravo: deleteAnexoBravoMutation.mutateAsync,
    isCreating: createAnexoBravoMutation.isPending,
    isDeleting: deleteAnexoBravoMutation.isPending,
  };
};
