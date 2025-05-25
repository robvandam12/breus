
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

// Manual types until Supabase regenerates
interface WebhookRow {
  id: string;
  name: string;
  url: string;
  secret_token: string;
  events: string[];
  active: boolean;
  success_count: number;
  error_count: number;
  last_triggered: string | null;
  created_at: string;
  updated_at: string;
}

export interface Webhook {
  id: string;
  name: string;
  url: string;
  secret_token: string;
  events: string[];
  active: boolean;
  created_at: string;
  updated_at: string;
  last_triggered?: string;
  success_count: number;
  error_count: number;
}

export interface WebhookFormData {
  name: string;
  url: string;
  secret_token: string;
  events: string[];
  active: boolean;
}

export const useWebhooks = () => {
  const queryClient = useQueryClient();

  const { data: webhooks = [], isLoading, error } = useQuery({
    queryKey: ['webhooks'],
    queryFn: async () => {
      console.log('useWebhooks - Fetching webhooks...');
      const { data, error } = await supabase
        .from('webhooks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('useWebhooks - Error fetching webhooks:', error);
        throw error;
      }

      // Transform data to match interface
      const transformedData = (data || []).map((item: any) => ({
        id: item.id,
        name: item.name,
        url: item.url,
        secret_token: item.secret_token,
        events: item.events || [],
        active: item.active,
        success_count: item.success_count,
        error_count: item.error_count,
        last_triggered: item.last_triggered,
        created_at: item.created_at,
        updated_at: item.updated_at
      }));

      console.log('useWebhooks - Webhooks data:', transformedData);
      return transformedData as Webhook[];
    },
  });

  const createWebhookMutation = useMutation({
    mutationFn: async (webhookData: WebhookFormData) => {
      console.log('Creating webhook:', webhookData);
      
      const { data, error } = await supabase
        .from('webhooks')
        .insert([{
          name: webhookData.name,
          url: webhookData.url,
          secret_token: webhookData.secret_token,
          events: webhookData.events,
          active: webhookData.active,
          success_count: 0,
          error_count: 0
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating webhook:', error);
        throw error;
      }

      console.log('Webhook created:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['webhooks'] });
      toast({
        title: "Webhook creado",
        description: "El webhook ha sido creado exitosamente.",
      });
    },
    onError: (error) => {
      console.error('Error creating webhook:', error);
      toast({
        title: "Error",
        description: "No se pudo crear el webhook. Intente nuevamente.",
        variant: "destructive",
      });
    },
  });

  const updateWebhookMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<WebhookFormData> }) => {
      console.log('Updating webhook:', id, data);
      const { data: updatedData, error } = await supabase
        .from('webhooks')
        .update({
          name: data.name,
          url: data.url,
          secret_token: data.secret_token,
          events: data.events,
          active: data.active
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating webhook:', error);
        throw error;
      }

      console.log('Webhook updated:', updatedData);
      return updatedData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['webhooks'] });
      toast({
        title: "Webhook actualizado",
        description: "El webhook ha sido actualizado exitosamente.",
      });
    },
    onError: (error) => {
      console.error('Error updating webhook:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el webhook. Intente nuevamente.",
        variant: "destructive",
      });
    },
  });

  const deleteWebhookMutation = useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting webhook:', id);
      const { error } = await supabase
        .from('webhooks')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting webhook:', error);
        throw error;
      }

      console.log('Webhook deleted:', id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['webhooks'] });
      toast({
        title: "Webhook eliminado",
        description: "El webhook ha sido eliminado exitosamente.",
      });
    },
    onError: (error) => {
      console.error('Error deleting webhook:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el webhook. Intente nuevamente.",
        variant: "destructive",
      });
    },
  });

  const testWebhookMutation = useMutation({
    mutationFn: async (id: string) => {
      console.log('Testing webhook:', id);
      
      // Simulate webhook test by calling a test endpoint
      const webhook = webhooks.find(w => w.id === id);
      if (!webhook) throw new Error('Webhook no encontrado');

      const testPayload = {
        event: 'test',
        timestamp: new Date().toISOString(),
        data: {
          message: 'Este es un evento de prueba desde Breus'
        }
      };

      try {
        const response = await fetch(webhook.url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Breus-Signature': `sha256=${btoa(webhook.secret_token + JSON.stringify(testPayload))}`
          },
          body: JSON.stringify(testPayload)
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        return response;
      } catch (error) {
        console.error('Webhook test failed:', error);
        throw error;
      }
    },
    onSuccess: () => {
      toast({
        title: "Webhook probado",
        description: "El webhook respondió correctamente.",
      });
    },
    onError: (error: any) => {
      console.error('Error testing webhook:', error);
      toast({
        title: "Error en prueba",
        description: error.message || "El webhook no respondió correctamente.",
        variant: "destructive",
      });
    },
  });

  return {
    webhooks,
    isLoading,
    error,
    createWebhook: createWebhookMutation.mutateAsync,
    updateWebhook: updateWebhookMutation.mutateAsync,
    deleteWebhook: deleteWebhookMutation.mutateAsync,
    testWebhook: testWebhookMutation.mutateAsync,
    isCreating: createWebhookMutation.isPending,
    isUpdating: updateWebhookMutation.isPending,
    isDeleting: deleteWebhookMutation.isPending,
    isTesting: testWebhookMutation.isPending,
  };
};
