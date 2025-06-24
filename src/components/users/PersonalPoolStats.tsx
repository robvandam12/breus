
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Users, UserCheck, UserX, Crown } from "lucide-react";
import { UserByCompany } from "@/hooks/useUsersByCompany";

interface PersonalPoolStatsProps {
  usuarios: UserByCompany[];
  empresaType: 'salmonera' | 'contratista';
}

export const PersonalPoolStats: React.FC<PersonalPoolStatsProps> = ({ usuarios, empresaType }) => {
  const totalUsuarios = usuarios.length;
  const usuariosActivos = usuarios.filter(u => u.perfil_completado).length;
  const usuariosPendientes = usuarios.filter(u => !u.perfil_completado).length;
  const supervisores = usuarios.filter(u => u.rol === 'supervisor').length;
  const buzos = usuarios.filter(u => u.rol === 'buzo').length;
  const admins = usuarios.filter(u => 
    u.rol === 'admin_salmonera' || u.rol === 'admin_servicio'
  ).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-zinc-600">Total Personnel</p>
              <p className="text-2xl font-bold">{totalUsuarios}</p>
            </div>
            <Users className="w-8 h-8 text-blue-500" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-zinc-600">Active</p>
              <p className="text-2xl font-bold text-green-600">{usuariosActivos}</p>
            </div>
            <UserCheck className="w-8 h-8 text-green-500" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-zinc-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{usuariosPendientes}</p>
            </div>
            <UserX className="w-8 h-8 text-yellow-500" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-zinc-600">
                {empresaType === 'salmonera' ? 'Admins' : 'Admins'}
              </p>
              <p className="text-2xl font-bold text-purple-600">{admins}</p>
              <div className="text-xs text-zinc-500 mt-1">
                {supervisores} Supervisors • {buzos} Divers
              </div>
            </div>
            <Crown className="w-8 h-8 text-purple-500" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
