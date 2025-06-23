
import { MainLayout } from "@/components/layout/MainLayout";
import { HPTWizardComplete } from "@/components/hpt/HPTWizardComplete";
import { FileText } from "lucide-react";

export default function HPT() {
  return (
    <MainLayout
      title="HPT - Habilitación Personal Técnico"
      subtitle="Formulario de habilitación para personal técnico de buceo"
      icon={FileText}
    >
      <HPTWizardComplete />
    </MainLayout>
  );
}
