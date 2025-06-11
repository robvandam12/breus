
import { CompleteProfileForm } from '@/components/profile/CompleteProfileForm';
import { SidebarProvider } from "@/components/ui/sidebar";
import { RoleBasedSidebar } from "@/components/navigation/RoleBasedSidebar";
import { Header } from "@/components/layout/Header";
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
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <RoleBasedSidebar />
        <main className="flex-1 flex flex-col">
          <Header 
            title="Completar Perfil" 
            subtitle="Información profesional requerida" 
            icon={User} 
          />
          <div className="flex-1 overflow-auto">
            <div className="p-6">
              <CompleteProfileForm onComplete={handleComplete} />
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
