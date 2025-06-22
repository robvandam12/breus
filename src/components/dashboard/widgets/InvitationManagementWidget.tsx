
import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Mail, Clock, CheckCircle, XCircle, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { toast } from '@/hooks/use-toast';

interface Invitation {
  id: string;
  admin_email: string;
  empresa_nombre: string;
  status: string;
  invited_at: string;
  responded_at?: string;
}

const InvitationManagementWidget = () => {
  const queryClient = useQueryClient();

  const { data: invitations, isLoading } = useQuery({
    queryKey: ['contractor-invitations'],
    queryFn: async (): Promise<Invitation[]> => {
      const { data, error } = await supabase
        .from('contractor_invitations')
        .select('*')
        .order('invited_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data || [];
    },
    refetchInterval: 60000,
  });

  const deleteInvitation = useMutation({
    mutationFn: async (invitationId: string) => {
      const { error } = await supabase
        .from('contractor_invitations')
        .delete()
        .eq('id', invitationId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contractor-invitations'] });
      toast({
        title: "Invitación eliminada",
        description: "La invitación ha sido eliminada exitosamente.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo eliminar la invitación.",
        variant: "destructive",
      });
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'secondary';
      case 'accepted': return 'default';
      case 'rejected': return 'destructive';
      case 'expired': return 'outline';
      default: return 'secondary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return Clock;
      case 'accepted': return CheckCircle;
      case 'rejected': return XCircle;
      case 'expired': return XCircle;
      default: return Clock;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendiente';
      case 'accepted': return 'Aceptada';
      case 'rejected': return 'Rechazada';
      case 'expired': return 'Expirada';
      default: return status;
    }
  };

  if (isLoading || !invitations) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Cargando invitaciones...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-16 bg-gray-100 rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const pendingCount = invitations.filter(inv => inv.status === 'pending').length;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2">
        <Mail className="w-5 h-5 text-blue-500" />
        <CardTitle className="text-sm font-medium">
          Invitaciones de Contratistas ({pendingCount} pendientes)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {invitations.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            <Mail className="w-8 h-8 mx-auto mb-2" />
            <p className="text-sm">No hay invitaciones</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {invitations.map((invitation) => {
              const StatusIcon = getStatusIcon(invitation.status);
              return (
                <div
                  key={invitation.id}
                  className="flex items-center justify-between p-3 rounded-lg border bg-white"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <StatusIcon className={`w-4 h-4 ${
                      invitation.status === 'accepted' ? 'text-green-500' : 
                      invitation.status === 'rejected' || invitation.status === 'expired' ? 'text-red-500' : 
                      'text-yellow-500'
                    }`} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium">{invitation.empresa_nombre}</span>
                        <Badge variant={getStatusColor(invitation.status)} className="text-xs">
                          {getStatusText(invitation.status)}
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-500">
                        {invitation.admin_email}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <Clock className="w-3 h-3" />
                        {format(new Date(invitation.invited_at), 'dd/MM/yyyy HH:mm', { locale: es })}
                      </div>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => deleteInvitation.mutate(invitation.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InvitationManagementWidget;
