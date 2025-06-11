
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Check, User, FileText, Building, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const steps = [
  {
    id: 1,
    title: "Bienvenido a Breus",
    description: "Tu plataforma de gestión de buceo profesional",
    icon: <User className="w-6 h-6" />
  },
  {
    id: 2,
    title: "Completa tu Perfil",
    description: "Información personal y certificaciones",
    icon: <FileText className="w-6 h-6" />
  },
  {
    id: 3,
    title: "Asignación a Empresa",
    description: "Espera ser asignado a una empresa para comenzar",
    icon: <Building className="w-6 h-6" />
  }
];

export const BuzoOnboarding = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();
  const { profile } = useAuth();

  const isProfileComplete = (profile as any)?.perfil_completado;
  const isAssigned = profile?.salmonera_id || profile?.servicio_id;

  const handleNext = () => {
    if (currentStep === 2) {
      navigate('/profile-setup');
      return;
    }
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      navigate('/dashboard');
    }
  };

  const handleSkip = () => {
    navigate('/dashboard');
  };

  const getProgress = () => {
    let progress = 33; // Paso 1 completado por defecto
    if (isProfileComplete) progress = 66;
    if (isAssigned) progress = 100;
    return progress;
  };

  const currentStepData = steps[currentStep - 1];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-600 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg mb-4">
            <span className="text-white font-bold text-2xl">B</span>
          </div>
          <CardTitle className="text-2xl">Configuración de Buzo</CardTitle>
          <Progress value={getProgress()} className="w-full mt-4" />
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              {currentStepData.icon}
            </div>
            <div>
              <h3 className="font-semibold text-lg">{currentStepData.title}</h3>
              <p className="text-gray-600">{currentStepData.description}</p>
            </div>
          </div>

          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <FileText className="w-8 h-8 text-blue-600 mb-2" />
                  <h4 className="font-semibold mb-1">Bitácoras Digitales</h4>
                  <p className="text-sm text-gray-600">Crea y gestiona bitácoras de buceo profesional</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <User className="w-8 h-8 text-green-600 mb-2" />
                  <h4 className="font-semibold mb-1">Gestión de Equipos</h4>
                  <p className="text-sm text-gray-600">Forma parte de equipos de buceo profesional</p>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="p-4 border-l-4 border-blue-500 bg-blue-50">
                <h4 className="font-semibold text-blue-800">Perfil Profesional Requerido</h4>
                <p className="text-blue-700 text-sm mt-1">
                  Para crear bitácoras y participar en operaciones, necesitas completar tu perfil profesional con:
                </p>
                <ul className="text-blue-700 text-sm mt-2 space-y-1">
                  <li>• Información personal y contacto</li>
                  <li>• Certificaciones de buceo</li>
                  <li>• Foto de perfil</li>
                  <li>• Nacionalidad</li>
                  <li>• Contacto de emergencia</li>
                </ul>
              </div>
              {isProfileComplete && (
                <div className="flex items-center gap-2 text-green-600">
                  <Check className="w-5 h-5" />
                  <span className="font-medium">Perfil completado</span>
                </div>
              )}
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              {isAssigned ? (
                <div className="p-4 border-l-4 border-green-500 bg-green-50">
                  <h4 className="font-semibold text-green-800">¡Listo para comenzar!</h4>
                  <p className="text-green-700 text-sm mt-1">
                    Has sido asignado a una empresa y puedes acceder a todas las funcionalidades.
                  </p>
                </div>
              ) : (
                <div className="p-4 border-l-4 border-orange-500 bg-orange-50">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-orange-800">Pendiente de Asignación</h4>
                      <p className="text-orange-700 text-sm mt-1">
                        Un administrador debe asignarte a una empresa para que puedas:
                      </p>
                      <ul className="text-orange-700 text-sm mt-2 space-y-1">
                        <li>• Participar en operaciones</li>
                        <li>• Crear bitácoras de buceo</li>
                        <li>• Acceder a equipos de trabajo</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex gap-3 pt-4">
            {currentStep === 2 ? (
              <Button onClick={handleNext} className="flex-1">
                {isProfileComplete ? 'Continuar' : 'Completar Perfil'}
              </Button>
            ) : (
              <Button onClick={handleNext} className="flex-1">
                {currentStep === 3 ? 'Ir al Dashboard' : 'Continuar'}
              </Button>
            )}
            <Button variant="outline" onClick={handleSkip}>
              Saltar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
