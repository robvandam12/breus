
import React from 'react';
import { MainLayout } from "@/components/layout/MainLayout";
import { Building2 } from "lucide-react";

const Empresas = () => {
  return (
    <MainLayout
      title="Empresas"
      subtitle="Gestión de empresas del sistema"
      icon={Building2}
    >
      <div className="space-y-6">
        <div className="text-center py-8">
          <Building2 className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Módulo de Empresas
          </h3>
          <p className="text-gray-600">
            Aquí podrás gestionar las empresas del sistema
          </p>
        </div>
      </div>
    </MainLayout>
  );
};

export default Empresas;
