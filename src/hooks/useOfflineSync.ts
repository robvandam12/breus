import { useState, useEffect, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type TableName = keyof Database['public']['Tables'];

export interface PendingAction {
  id: string;
  type: 'create' | 'update' | 'delete';
  table: TableName;
  payload: any; // For create: data, For update: { pk: object, data: object }, For delete: { pk: object }
  timestamp: number;
}

export const useOfflineSync = () => {
  const [pendingActions, setPendingActions] = useState<PendingAction[]>([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    const stored = localStorage.getItem('breus_pending_actions');
    if (stored) {
      try {
        setPendingActions(JSON.parse(stored));
      } catch (error) {
        console.error('Error loading pending actions:', error);
      }
    }

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('breus_pending_actions', JSON.stringify(pendingActions));
  }, [pendingActions]);

  const syncPendingActions = useCallback(async () => {
    if (isSyncing || !isOnline || pendingActions.length === 0) return;

    setIsSyncing(true);
    toast({
      title: "Sincronizando datos...",
      description: `Sincronizando ${pendingActions.length} acciones pendientes.`,
    });

    const actionsToSync = [...pendingActions];
    const successfullySyncedIds: string[] = [];
    
    for (const action of actionsToSync) {
      try {
        let response;
        switch (action.type) {
          case 'create':
            response = await supabase.from(action.table).insert(action.payload);
            break;
          case 'update':
            const { pk, data } = action.payload;
            response = await supabase.from(action.table).update(data).match(pk);
            break;
          case 'delete':
            response = await supabase.from(action.table).delete().match(action.payload.pk);
            break;
          default:
            throw new Error(`Unsupported action type: ${(action as any).type}`);
        }
        
        if (response.error) {
          throw response.error;
        }
        successfullySyncedIds.push(action.id);
      } catch (error: any) {
        console.error('Sync failed for action:', action.id, error.message);
        toast({
          title: "Error de sincronización",
          description: `Falló la acción en ${action.table}. Se reintentará más tarde.`,
          variant: "destructive",
        });
        setIsSyncing(false);
        return;
      }
    }

    setPendingActions(prev => prev.filter(action => !successfullySyncedIds.includes(action.id)));
    
    if (successfullySyncedIds.length > 0) {
      toast({
        title: "Sincronización completa",
        description: `Se sincronizaron ${successfullySyncedIds.length} acciones.`,
      });
      await queryClient.invalidateQueries();
    }
    
    setIsSyncing(false);
  }, [isOnline, pendingActions, queryClient, isSyncing]);

  useEffect(() => {
    if (isOnline && pendingActions.length > 0) {
      syncPendingActions();
    }
  }, [isOnline, pendingActions.length, syncPendingActions]);


  const addPendingAction = (action: Omit<PendingAction, 'id' | 'timestamp'>) => {
    const newAction: PendingAction = {
      ...action,
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now()
    };
    setPendingActions(prev => [...prev, newAction]);
    toast({
      title: "Modo Offline",
      description: "Acción guardada. Se sincronizará al recuperar la conexión.",
    });
  };

  const clearPendingActions = () => {
    setPendingActions([]);
  };

  return {
    pendingActions,
    isOnline,
    isSyncing,
    addPendingAction,
    hasPendingActions: pendingActions.length > 0,
    clearPendingActions
  };
};
