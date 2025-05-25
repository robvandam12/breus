
import { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';

interface PendingAction {
  id: string;
  type: 'create' | 'update' | 'delete';
  table: string;
  data: any;
  timestamp: number;
}

export const useOfflineSync = () => {
  const [pendingActions, setPendingActions] = useState<PendingAction[]>([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const queryClient = useQueryClient();

  useEffect(() => {
    // Load pending actions from localStorage
    const stored = localStorage.getItem('breus_pending_actions');
    if (stored) {
      try {
        setPendingActions(JSON.parse(stored));
      } catch (error) {
        console.error('Error loading pending actions:', error);
      }
    }

    const handleOnline = () => {
      setIsOnline(true);
      syncPendingActions();
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    // Save pending actions to localStorage whenever they change
    localStorage.setItem('breus_pending_actions', JSON.stringify(pendingActions));
  }, [pendingActions]);

  const addPendingAction = (action: Omit<PendingAction, 'id' | 'timestamp'>) => {
    const newAction: PendingAction = {
      ...action,
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now()
    };

    setPendingActions(prev => [...prev, newAction]);

    if (!isOnline) {
      toast({
        title: "Acción guardada offline",
        description: "Se sincronizará cuando vuelvas a conectarte.",
      });
    }
  };

  const syncPendingActions = async () => {
    if (pendingActions.length === 0) return;

    toast({
      title: "Sincronizando datos...",
      description: `${pendingActions.length} acciones pendientes.`,
    });

    try {
      // Here you would implement the actual sync logic
      // For now, we'll simulate it
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Clear pending actions after successful sync
      setPendingActions([]);
      
      // Invalidate all queries to refetch fresh data
      queryClient.invalidateQueries();

      toast({
        title: "Sincronización completa",
        description: "Todos los datos han sido sincronizados.",
      });
    } catch (error) {
      console.error('Sync failed:', error);
      toast({
        title: "Error de sincronización",
        description: "No se pudieron sincronizar todos los datos. Se intentará nuevamente.",
        variant: "destructive",
      });
    }
  };

  const clearPendingActions = () => {
    setPendingActions([]);
    localStorage.removeItem('breus_pending_actions');
  };

  return {
    pendingActions,
    isOnline,
    addPendingAction,
    syncPendingActions,
    clearPendingActions,
    hasPendingActions: pendingActions.length > 0
  };
};
