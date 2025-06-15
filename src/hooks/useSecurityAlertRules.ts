import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import type { SecurityAlertRule } from '@/types/security';

export const useSecurityAlertRules = () => {
    const queryClient = useQueryClient();

    const { data: rules = [], isLoading } = useQuery<SecurityAlertRule[]>({
        queryKey: ['security_alert_rules'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('security_alert_rules')
                .select('*')
                .order('name', { ascending: true });

            if (error) throw error;
            return data as unknown as SecurityAlertRule[];
        },
    });

    const createRuleMutation = useMutation({
        mutationFn: async (newRule: Omit<SecurityAlertRule, 'id' | 'created_at' | 'updated_at'>) => {
            const { data, error } = await supabase
                .from('security_alert_rules')
                .insert(newRule as any)
                .select()
                .single();
            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['security_alert_rules'] });
            toast({ title: "Regla Creada", description: "La nueva regla de seguridad ha sido creada." });
        },
        onError: (error: any) => {
            toast({ title: "Error", description: `No se pudo crear la regla: ${error.message}`, variant: "destructive" });
        },
    });

    const updateRuleMutation = useMutation({
        mutationFn: async (updatedRule: Partial<SecurityAlertRule> & { id: string }) => {
            const { id, ...ruleToUpdate } = updatedRule;
            const { data, error } = await supabase
                .from('security_alert_rules')
                .update(ruleToUpdate as any)
                .eq('id', id)
                .select()
                .single();
            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['security_alert_rules'] });
            toast({ title: "Regla Actualizada", description: "La regla de seguridad ha sido actualizada." });
        },
        onError: (error: any) => {
            toast({ title: "Error", description: `No se pudo actualizar la regla: ${error.message}`, variant: "destructive" });
        },
    });

    const deleteRuleMutation = useMutation({
        mutationFn: async (ruleId: string) => {
            const { error } = await supabase
                .from('security_alert_rules')
                .delete()
                .eq('id', ruleId);
            if (error) throw error;
            return ruleId;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['security_alert_rules'] });
            toast({ title: "Regla Eliminada", description: "La regla de seguridad ha sido eliminada." });
        },
        onError: (error: any) => {
            toast({ title: "Error", description: `No se pudo eliminar la regla: ${error.message}`, variant: "destructive" });
        },
    });

    return {
        rules,
        isLoading,
        createRule: createRuleMutation.mutateAsync,
        updateRule: updateRuleMutation.mutateAsync,
        deleteRule: deleteRuleMutation.mutateAsync,
        isCreating: createRuleMutation.isPending,
        isUpdating: updateRuleMutation.isPending,
        isDeleting: deleteRuleMutation.isPending,
    };
};
