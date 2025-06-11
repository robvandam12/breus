
import { BuzoOnboarding } from '@/components/onboarding/BuzoOnboarding';
import { SidebarProvider } from "@/components/ui/sidebar";
import { RoleBasedSidebar } from "@/components/navigation/RoleBasedSidebar";
import { Header } from "@/components/layout/Header";
import { Anchor } from "lucide-react";
import { useNavigate } from 'react-router-dom';

export default function BuzoOnboardingPage() {
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
            title="Bienvenido a Breus" 
            subtitle="Configuración inicial para buzos profesionales" 
            icon={Anchor} 
          />
          <div className="flex-1 overflow-auto">
            <div className="p-6">
              <BuzoOnboarding onComplete={handleComplete} />
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
