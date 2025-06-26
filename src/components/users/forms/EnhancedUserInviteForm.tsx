
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertTriangle, User, Mail, UserCheck } from "lucide-react";
import { useEmailValidation } from "@/hooks/useEmailValidation";
import { InviteUserOptions } from "@/hooks/useUsuarios";

interface EnhancedUserInviteFormProps {
  onSubmit: (options: InviteUserOptions) => Promise<void>;
  onCancel: () => void;
  allowedRoles?: string[];
}

export const EnhancedUserInviteForm = ({
  onSubmit,
  onCancel,
  allowedRoles = ['admin_salmonera', 'admin_servicio', 'supervisor', 'buzo']
}: EnhancedUserInviteFormProps) => {
  const [email, setEmail] = useState("");
  const [rol, setRol] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkEmail, setCheckEmail] = useState(false);
  const [overwriteExisting, setOverwriteExisting] = useState(false);

  const { data: emailStatus, isLoading: checkingEmail, error: validationError } = useEmailValidation(
    email, 
    checkEmail && email.includes('@')
  );

  useEffect(() => {
    if (email && email.includes('@')) {
      const timer = setTimeout(() => setCheckEmail(true), 500);
      return () => clearTimeout(timer);
    } else {
      setCheckEmail(false);
    }
  }, [email]);

  const getRoleDisplayName = (role: string) => {
    const roleMap: Record<string, string> = {
      admin_salmonera: 'Admin Salmonera',
      admin_servicio: 'Admin Servicio',
      supervisor: 'Supervisor',
      buzo: 'Buzo',
    };
    return roleMap[role] || role;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !rol) {
      return;
    }

    setLoading(true);
    
    try {
      await onSubmit({
        email: email.toLowerCase(),
        rol,
        overwriteExisting,
        cancelPrevious: emailStatus?.hasPendingInvitation && overwriteExisting
      });
    } finally {
      setLoading(false);
    }
  };

  const canSubmit = email && rol && (!emailStatus?.exists || overwriteExisting);
  const showWarning = emailStatus?.exists && !overwriteExisting;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="email">Email *</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="usuario@empresa.com"
            required
            disabled={loading}
            className="pl-10"
          />
        </div>
        {checkingEmail && (
          <p className="text-xs text-gray-500 mt-1">Verificando email...</p>
        )}
        {validationError && (
          <p className="text-xs text-red-500 mt-1">
            No se pudo verificar el email. La invitación se creará sin validación previa.
          </p>
        )}
      </div>

      {/* Estado del email */}
      {emailStatus?.exists && (
        <Alert className={emailStatus.hasUser ? "border-red-200 bg-red-50" : "border-yellow-200 bg-yellow-50"}>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {emailStatus.hasUser ? (
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>
                  <strong>Usuario ya registrado:</strong> {emailStatus.user?.nombre} {emailStatus.user?.apellido} 
                  como {getRoleDisplayName(emailStatus.user?.rol || '')}
                </span>
              </div>
            ) : emailStatus.hasPendingInvitation ? (
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4" />
                <span>
                  <strong>Invitación pendiente</strong> para el rol de {getRoleDisplayName(emailStatus.pendingInvitation?.rol || '')}
                  {emailStatus.pendingInvitation?.fecha_expiracion && (
                    <span className="text-sm"> 
                      (expira: {new Date(emailStatus.pendingInvitation.fecha_expiracion).toLocaleDateString()})
                    </span>
                  )}
                </span>
              </div>
            ) : null}
          </AlertDescription>
        </Alert>
      )}

      <div>
        <Label htmlFor="rol">Rol *</Label>
        <Select value={rol} onValueChange={setRol} disabled={loading}>
          <SelectTrigger>
            <SelectValue placeholder="Selecciona un rol" />
          </SelectTrigger>
          <SelectContent>
            {allowedRoles.map((role) => (
              <SelectItem key={role} value={role}>
                {getRoleDisplayName(role)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Opción para sobrescribir */}
      {emailStatus?.exists && (
        <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
          <Checkbox
            id="overwrite"
            checked={overwriteExisting}
            onCheckedChange={(checked) => setOverwriteExisting(checked as boolean)}
            disabled={emailStatus.hasUser} // No permitir sobrescribir usuarios existentes
          />
          <Label htmlFor="overwrite" className="text-sm">
            {emailStatus.hasUser 
              ? "El usuario ya existe. Esta opción no está disponible."
              : "Cancelar invitación anterior y crear nueva"
            }
          </Label>
        </div>
      )}

      <div className="flex justify-end space-x-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={!canSubmit || loading || checkingEmail || emailStatus?.hasUser}
          className="min-w-24"
        >
          {loading ? "Enviando..." : "Invitar Usuario"}
        </Button>
      </div>

      {showWarning && (
        <p className="text-xs text-gray-500 text-center">
          {emailStatus?.hasUser 
            ? "No se puede invitar a un usuario que ya existe en el sistema."
            : "Active la casilla superior para sobrescribir la invitación existente."
          }
        </p>
      )}
    </form>
  );
};
