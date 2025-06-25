
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users } from "lucide-react";
import type { FishingNetworkMaintenanceData, DotacionMember } from '@/types/fishing-networks';

interface DotacionTableProps {
  formData: FishingNetworkMaintenanceData;
  updateFormData: (updates: Partial<FishingNetworkMaintenanceData>) => void;
  readOnly?: boolean;
}

export const DotacionTable = ({ formData, updateFormData, readOnly = false }: DotacionTableProps) => {
  const roles = [
    { key: 'contratista', label: 'Contratista' },
    { key: 'supervisor', label: 'Supervisor' },
    { key: 'buzo_emerg_1', label: 'Buzo Emerg 1' },
    { key: 'buzo_emerg_2', label: 'Buzo Emerg 2' },
    { key: 'buzo_1', label: 'Buzo Nº 1' },
    { key: 'buzo_2', label: 'Buzo Nº 2' },
    { key: 'buzo_3', label: 'Buzo Nº 3' },
    { key: 'buzo_4', label: 'Buzo Nº 4' },
    { key: 'buzo_5', label: 'Buzo Nº 5' },
    { key: 'buzo_6', label: 'Buzo Nº 6' },
    { key: 'buzo_7', label: 'Buzo Nº 7' },
    { key: 'buzo_8', label: 'Buzo Nº 8' },
    { key: 'compresor_1', label: 'Compresor 1' },
    { key: 'compresor_2', label: 'Compresor 2' },
  ];

  // Crear dotación por defecto si no existe
  const defaultDotacion = roles.reduce((acc, role) => {
    acc[role.key as keyof typeof acc] = {
      rol: role.label,
      nombre: '',
      apellido: '',
      matricula: ''
    };
    return acc;
  }, {} as Record<string, DotacionMember>);

  const currentDotacion = formData.dotacion || defaultDotacion;

  const handleMemberChange = (roleKey: string, field: keyof DotacionMember, value: string) => {
    const currentMember = currentDotacion[roleKey as keyof typeof currentDotacion] || {
      rol: roles.find(r => r.key === roleKey)?.label || '',
      nombre: '',
      apellido: '',
      matricula: ''
    };

    updateFormData({
      dotacion: {
        ...currentDotacion,
        [roleKey]: {
          ...currentMember,
          [field]: value
        }
      }
    });
  };

  const getMemberData = (roleKey: string): DotacionMember => {
    const defaultMember: DotacionMember = {
      rol: roles.find(r => r.key === roleKey)?.label || '',
      nombre: '',
      apellido: '',
      matricula: ''
    };

    return currentDotacion[roleKey as keyof typeof currentDotacion] || defaultMember;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          Dotación - Personal
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rol</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Apellido</TableHead>
                <TableHead>Nº Matrícula</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roles.map((role) => {
                const memberData = getMemberData(role.key);
                return (
                  <TableRow key={role.key}>
                    <TableCell className="font-medium">{role.label}</TableCell>
                    <TableCell>
                      <Input
                        value={memberData.nombre}
                        onChange={(e) => handleMemberChange(role.key, 'nombre', e.target.value)}
                        placeholder="Nombre"
                        disabled={readOnly}
                        className="min-w-[120px]"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={memberData.apellido}
                        onChange={(e) => handleMemberChange(role.key, 'apellido', e.target.value)}
                        placeholder="Apellido"
                        disabled={readOnly}
                        className="min-w-[120px]"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={memberData.matricula}
                        onChange={(e) => handleMemberChange(role.key, 'matricula', e.target.value)}
                        placeholder="Matrícula"
                        disabled={readOnly}
                        className="min-w-[100px]"
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
