
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Mail, RefreshCcw, X, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { useInvitationManagement, Invitation } from "@/hooks/useInvitationManagement";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export const InvitationManagement = () => {
  const { invitations, isLoading, cancelInvitation, resendInvitation, getInvitationStats } = useInvitationManagement();
  const [actionDialog, setActionDialog] = useState<{ type: 'cancel' | 'resend'; invitation: Invitation } | null>(null);

  const stats = getInvitationStats();

  const getStatusBadge = (invitation: Invitation) => {
    const now = new Date();
    const expiration = new Date(invitation.fecha_expiracion);
    
    if (invitation.estado === 'aceptada') {
      return <Badge className="bg-green-100 text-green-700"><CheckCircle className="w-3 h-3 mr-1" />Aceptada</Badge>;
    }
    if (invitation.estado === 'cancelada') {
      return <Badge className="bg-gray-100 text-gray-700"><XCircle className="w-3 h-3 mr-1" />Cancelada</Badge>;
    }
    if (invitation.estado === 'pendiente' && expiration < now) {
      return <Badge className="bg-red-100 text-red-700"><AlertCircle className="w-3 h-3 mr-1" />Expirada</Badge>;
    }
    return <Badge className="bg-yellow-100 text-yellow-700"><Clock className="w-3 h-3 mr-1" />Pendiente</Badge>;
  };

  const getRoleDisplayName = (rol: string) => {
    const roleMap: Record<string, string> = {
      admin_salmonera: 'Admin Salmonera',
      admin_servicio: 'Admin Servicio',
      supervisor: 'Supervisor',
      buzo: 'Buzo',
    };
    return roleMap[rol] || rol;
  };

  const canResend = (invitation: Invitation) => {
    return invitation.estado === 'pendiente' || invitation.estado === 'expirada';
  };

  const canCancel = (invitation: Invitation) => {
    return invitation.estado === 'pendiente';
  };

  const handleAction = async (type: 'cancel' | 'resend', invitation: Invitation) => {
    if (type === 'cancel') {
      await cancelInvitation(invitation.id);
    } else {
      await resendInvitation(invitation.id);
    }
    setActionDialog(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <LoadingSpinner text="Cargando invitaciones..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Estadísticas */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-gray-600">Total</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <div className="text-sm text-gray-600">Pendientes</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.accepted}</div>
            <div className="text-sm text-gray-600">Aceptadas</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{stats.expired}</div>
            <div className="text-sm text-gray-600">Expiradas</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-600">{stats.canceled}</div>
            <div className="text-sm text-gray-600">Canceladas</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabla de invitaciones */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Invitaciones Enviadas ({invitations.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {invitations.length === 0 ? (
            <div className="text-center py-8">
              <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No hay invitaciones enviadas
              </h3>
              <p className="text-gray-600">
                Las invitaciones que envíes aparecerán aquí.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Enviada</TableHead>
                  <TableHead>Expira</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invitations.map((invitation) => (
                  <TableRow key={invitation.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {invitation.nombre} {invitation.apellido}
                        </div>
                        <div className="text-xs text-gray-500">
                          ID: {invitation.id.slice(0, 8)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{invitation.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {getRoleDisplayName(invitation.rol)}
                      </Badge>
                    </TableCell>
                    <TableCell>{getStatusBadge(invitation)}</TableCell>
                    <TableCell>
                      {format(new Date(invitation.created_at), 'dd/MM/yyyy HH:mm', { locale: es })}
                    </TableCell>
                    <TableCell>
                      {format(new Date(invitation.fecha_expiracion), 'dd/MM/yyyy', { locale: es })}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {canResend(invitation) && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setActionDialog({ type: 'resend', invitation })}
                          >
                            <RefreshCcw className="w-4 h-4" />
                          </Button>
                        )}
                        {canCancel(invitation) && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setActionDialog({ type: 'cancel', invitation })}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Dialog de confirmación */}
      <AlertDialog open={!!actionDialog} onOpenChange={() => setActionDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {actionDialog?.type === 'cancel' ? 'Cancelar Invitación' : 'Reenviar Invitación'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {actionDialog?.type === 'cancel' 
                ? `¿Estás seguro de cancelar la invitación para ${actionDialog.invitation.email}? Esta acción no se puede deshacer.`
                : `¿Reenviar la invitación a ${actionDialog?.invitation.email}? Se generará un nuevo token y se extenderá la fecha de expiración.`
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => actionDialog && handleAction(actionDialog.type, actionDialog.invitation)}
            >
              {actionDialog?.type === 'cancel' ? 'Cancelar Invitación' : 'Reenviar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
