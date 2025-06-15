
import { ShieldAlert } from "lucide-react";
import { AlertsLogTable } from "@/components/admin/AlertsLogTable";
import { MainLayout } from "@/components/layout/MainLayout";

const AlertsLog = () => {
  return (
    <MainLayout
      title="Registro de Alertas"
      subtitle="Historial completo de alertas de seguridad."
      icon={ShieldAlert}
    >
      <AlertsLogTable />
    </MainLayout>
  );
};

export default AlertsLog;
