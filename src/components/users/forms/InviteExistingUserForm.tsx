
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mail, User, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface InviteExistingUserFormProps {
  onSubmit: (userData: { email: string; userId: string }) => void;
  onCancel: () => void;
}

interface UserSearchResult {
  usuario_id: string;
  email: string;
  nombre: string;
  apellido: string;
  rol: string;
  salmonera_id?: string;
  servicio_id?: string;
}

export const InviteExistingUserForm = ({ onSubmit, onCancel }: InviteExistingUserFormProps) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [user, setUser] = useState<UserSearchResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (email && email.includes('@')) {
      const timer = setTimeout(() => searchUser(), 500);
      return () => clearTimeout(timer);
    } else {
      setUser(null);
      setError(null);
    }
  }, [email]);

  const searchUser = async () => {
    if (!email.includes('@')) return;
    
    setSearching(true);
    setError(null);
    
    try {
      const { data, error: searchError } = await supabase
        .from('usuario')
        .select('usuario_id, email, nombre, apellido, rol, salmonera_id, servicio_id')
        .eq('email', email.toLowerCase())
        .single();

      if (searchError) {
        if (searchError.code === 'PGRST116') {
          setError('No se encontró un usuario con este email');
          setUser(null);
        } else {
          throw searchError;
        }
      } else {
        if (data.salmonera_id || data.servicio_id) {
          setError('Este usuario ya pertenece a una empresa');
          setUser(null);
        } else {
          setUser(data);
          setError(null);
        }
      }
    } catch (err: any) {
      console.error('Error searching user:', err);
      setError('Error al buscar usuario');
      setUser(null);
    } finally {
      setSearching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Error",
        description: "Debe seleccionar un usuario válido",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      await onSubmit({
        email: user.email,
        userId: user.usuario_id
      });
    } finally {
      setLoading(false);
    }
  };

  const getRoleDisplayName = (role: string) => {
    const roleMap: Record<string, string> = {
      superuser: 'Superuser',
      admin_salmonera: 'Admin Salmonera',
      admin_servicio: 'Admin Servicio',
      supervisor: 'Supervisor',
      buzo: 'Buzo',
    };
    return roleMap[role] || role;
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5" />
          Invitar Usuario Existente
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email del Usuario *</Label>
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
            {searching && (
              <p className="text-xs text-gray-500 mt-1">Buscando usuario...</p>
            )}
          </div>

          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-red-700">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {user && (
            <Alert className="border-green-200 bg-green-50">
              <User className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-1">
                  <p className="font-medium text-green-800">
                    Usuario encontrado: {user.nombre} {user.apellido}
                  </p>
                  <p className="text-sm text-green-700">
                    Rol: {getRoleDisplayName(user.rol)}
                  </p>
                  <p className="text-xs text-green-600">
                    Este usuario se agregará a su empresa
                  </p>
                </div>
              </AlertDescription>
            </Alert>
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
              disabled={!user || loading || searching}
            >
              {loading ? "Agregando..." : "Agregar a Empresa"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
