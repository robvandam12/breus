
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BaseUser } from "../BaseUserManagement";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface SuperuserEditUserFormProps {
  initialData: BaseUser;
  onSubmit: (userData: any) => Promise<void>;
  onCancel: () => void;
}

interface Company {
  id: string;
  nombre: string;
  tipo: 'salmonera' | 'contratista';
}

export const SuperuserEditUserForm = ({
  initialData,
  onSubmit,
  onCancel
}: SuperuserEditUserFormProps) => {
  const [loading, setLoading] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [formData, setFormData] = useState({
    nombre: initialData.nombre,
    apellido: initialData.apellido,
    email: initialData.email,
    rol: initialData.rol,
    empresa_id: initialData.salmonera_id || initialData.servicio_id || '',
    empresa_tipo: initialData.empresa_tipo || 'salmonera'
  });

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    try {
      // Cargar salmoneras
      const { data: salmoneras } = await supabase
        .from('salmoneras')
        .select('id, nombre')
        .eq('estado', 'activa');

      // Cargar contratistas
      const { data: contratistas } = await supabase
        .from('contratistas')
        .select('id, nombre')
        .eq('estado', 'activo');

      const allCompanies: Company[] = [
        ...(salmoneras || []).map(s => ({ ...s, tipo: 'salmonera' as const })),
        ...(contratistas || []).map(c => ({ ...c, tipo: 'contratista' as const }))
      ];

      setCompanies(allCompanies);
    } catch (error) {
      console.error('Error loading companies:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las empresas",
        variant: "destructive",
      });
    }
  };

  const handleCompanyChange = (companyId: string) => {
    const company = companies.find(c => c.id === companyId);
    if (company) {
      setFormData(prev => ({
        ...prev,
        empresa_id: companyId,
        empresa_tipo: company.tipo
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updateData: any = {
        nombre: formData.nombre,
        apellido: formData.apellido,
        email: formData.email,
        rol: formData.rol,
      };

      // Asignar empresa según el tipo
      if (formData.empresa_id) {
        if (formData.empresa_tipo === 'salmonera') {
          updateData.salmonera_id = formData.empresa_id;
          updateData.servicio_id = null;
        } else {
          updateData.servicio_id = formData.empresa_id;
          updateData.salmonera_id = null;
        }
      } else {
        updateData.salmonera_id = null;
        updateData.servicio_id = null;
      }

      await onSubmit(updateData);
    } catch (error) {
      console.error('Error updating user:', error);
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
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Editar Usuario</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nombre">Nombre *</Label>
              <Input
                id="nombre"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                required
                disabled={loading}
              />
            </div>
            <div>
              <Label htmlFor="apellido">Apellido *</Label>
              <Input
                id="apellido"
                value={formData.apellido}
                onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                required
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              disabled={loading}
            />
          </div>

          <div>
            <Label htmlFor="rol">Rol *</Label>
            <Select value={formData.rol} onValueChange={(value) => setFormData({ ...formData, rol: value })} disabled={loading}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="superuser">Superuser</SelectItem>
                <SelectItem value="admin_salmonera">Admin Salmonera</SelectItem>
                <SelectItem value="admin_servicio">Admin Servicio</SelectItem>
                <SelectItem value="supervisor">Supervisor</SelectItem>
                <SelectItem value="buzo">Buzo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="empresa">Empresa</Label>
            <Select 
              value={formData.empresa_id} 
              onValueChange={handleCompanyChange}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar empresa (opcional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Sin empresa asignada</SelectItem>
                {companies.map((company) => (
                  <SelectItem key={company.id} value={company.id}>
                    {company.nombre} ({company.tipo})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

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
              disabled={loading}
            >
              {loading ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
