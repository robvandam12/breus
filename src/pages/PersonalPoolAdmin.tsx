
import React from 'react';
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";
import { PersonalPoolTable } from "@/components/users/PersonalPoolTable";
import { useUsuarios } from "@/hooks/useUsuarios";

const PersonalPoolAdmin = () => {
  const { usuarios, isLoading } = useUsuarios();

  return (
    <MainLayout
      title="Personal Pool"
      subtitle="Administración de personal disponible"
      icon={Users}
    >
      <Card>
        <CardHeader>
          <CardTitle>Lista de Personal</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Cargando personal...</div>
          ) : (
            <PersonalPoolTable usuarios={usuarios} isLoading={isLoading} />
          )}
        </CardContent>
      </Card>
    </MainLayout>
  );
};

export default PersonalPoolAdmin;
