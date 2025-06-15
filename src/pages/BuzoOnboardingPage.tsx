
import { BuzoOnboarding } from '@/components/onboarding/BuzoOnboarding';
import { MainLayout } from "@/components/layout/MainLayout";
import { Anchor } from "lucide-react";
import { useNavigate } from 'react-router-dom';

export default function BuzoOnboardingPage() {
  const navigate = useNavigate();

  const handleComplete = () => {
    navigate('/');
  };

  return (
    <MainLayout
      title="Bienvenido a Breus"
      subtitle="Configuración inicial para buzos profesionales"
      icon={Anchor}
    >
      <BuzoOnboarding onComplete={handleComplete} />
    </MainLayout>
  );
}
