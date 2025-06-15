
import { CompleteProfileForm } from '@/components/profile/CompleteProfileForm';
import { MainLayout } from "@/components/layout/MainLayout";
import { User } from "lucide-react";
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export default function ProfileSetup() {
  const { profile } = useAuth();
  const navigate = useNavigate();

  const handleComplete = () => {
    navigate('/');
  };

  return (
    <MainLayout
      title="Completar Perfil"
      subtitle="Información profesional requerida"
      icon={User}
    >
      <CompleteProfileForm onComplete={handleComplete} />
    </MainLayout>
  );
}
