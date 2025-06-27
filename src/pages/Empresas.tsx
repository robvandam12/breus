
import React from 'react';
import { MainLayout } from "@/components/layout/MainLayout";
import { Building2 } from "lucide-react";

const Empresas = () => {
  return (
    <MainLayout
      title="Empresas"
      subtitle="Gestión de salmoneras y contratistas"
      icon={Building2}
    >
      <div className="space-y-6">
        <div className="text-center py-12">
          <Building2 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Gestión de Empresas
          </h3>
          <p className="text-gray-500">
            Administra salmoneras y empresas contratistas desde esta sección.
          </p>
        </div>
      </div>
    </MainLayout>
  );
};

export default Empresas;
