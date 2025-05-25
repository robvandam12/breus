
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface DomainEvent {
  id: string;
  event_type: string;
  aggregate_id: string;
  aggregate_type: string;
  event_data: Record<string, any>;
  user_id: string | null;
  created_at: string;
}

export const useDomainEvents = () => {
  const [events, setEvents] = useState<DomainEvent[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch domain events
  const fetchEvents = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('domain_event')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      
      // Transformar los datos para asegurar que event_data sea Record<string, any>
      const transformedData = (data || []).map(item => ({
        ...item,
        event_data: typeof item.event_data === 'string' 
          ? JSON.parse(item.event_data) 
          : item.event_data || {}
      }));
      
      setEvents(transformedData);
    } catch (error) {
      console.error('Error fetching domain events:', error);
    } finally {
      setLoading(false);
    }
  };

  // Listen to real-time events
  useEffect(() => {
    fetchEvents();

    const channel = supabase
      .channel('domain-events')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'domain_event'
        },
        (payload) => {
          const newEvent = payload.new as any;
          const transformedEvent: DomainEvent = {
            ...newEvent,
            event_data: typeof newEvent.event_data === 'string' 
              ? JSON.parse(newEvent.event_data) 
              : newEvent.event_data || {}
          };
          
          setEvents(prev => [transformedEvent, ...prev]);

          // Show toast for important events
          if (['HPT_DONE', 'ANEXO_DONE', 'IMM_CREATED'].includes(transformedEvent.event_type)) {
            toast({
              title: getEventTitle(transformedEvent.event_type),
              description: getEventDescription(transformedEvent),
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const getEventTitle = (eventType: string): string => {
    const titles: Record<string, string> = {
      'HPT_DONE': 'HPT Firmado',
      'ANEXO_DONE': 'Anexo Bravo Firmado',
      'IMM_CREATED': 'Inmersión Creada',
      'IMM_COMPLETED': 'Inmersión Completada',
      'BITACORA_READY': 'Bitácora Lista'
    };
    return titles[eventType] || 'Evento del Sistema';
  };

  const getEventDescription = (event: DomainEvent): string => {
    const data = event.event_data;
    switch (event.event_type) {
      case 'HPT_DONE':
        return `HPT ${data.codigo || ''} firmado para la operación`;
      case 'ANEXO_DONE':
        return `Anexo Bravo ${data.codigo || ''} firmado para la operación`;
      case 'IMM_CREATED':
        return `Nueva inmersión ${data.codigo || ''} creada`;
      default:
        return 'Se ha generado un nuevo evento';
    }
  };

  return {
    events,
    loading,
    fetchEvents,
    getEventTitle,
    getEventDescription
  };
};
