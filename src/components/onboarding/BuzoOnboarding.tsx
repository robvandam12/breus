
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Circle, User, FileText, Building, Award } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

interface BuzoOnboardingProps {
  onComplete: () => void;
}

export const BuzoOnboarding = ({ onComplete }: BuzoOnboardingProps) => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);

  // Verificar si el perfil está completo - usando optional chaining y fallback
  const isProfileComplete = (profile as any)?.perfil_completado || false;

  const steps = [
    {
      id: 'welcome',
      title: 'Bienvenido a Breus',
      description: 'Plataforma integral de gestión de buceo profesional',
      icon: <Building className="w-12 h-12 text-blue-600" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-600">
            Breus es una plataforma diseñada específicamente para profesionales del buceo como tú. 
            Aquí podrás gestionar tus inmersiones, bitácoras y operaciones de manera segura y eficiente.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600 mt-1" />
              <div>
                <h4 className="font-semibold text-blue-900">Bitácoras Digitales</h4>
                <p className="text-sm text-blue-700">Registra y firma tus inmersiones de forma digital</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
              <Award className="w-6 h-6 text-green-600 mt-1" />
              <div>
                <h4 className="font-semibold text-green-900">Certificaciones</h4>
                <p className="text-sm text-green-700">Mantén al día tu información profesional</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'profile',
      title: 'Completa tu Perfil',
      description: 'Tu información profesional es esencial para trabajar en la plataforma',
      icon: <User className="w-12 h-12 text-green-600" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-600">
            Para poder crear bitácoras y participar en operaciones, necesitas completar tu perfil profesional.
            Esto incluye tu información personal, certificaciones y experiencia.
          </p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Circle className="w-5 h-5 text-yellow-600" />
              <span className="font-semibold text-yellow-900">Requerido para trabajar</span>
            </div>
            <p className="text-sm text-yellow-700">
              Sin un perfil completo no podrás crear bitácoras ni participar en operaciones de buceo.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'workflow',
      title: 'Flujo de Trabajo',
      description: 'Cómo funciona el proceso de buceo en Breus',
      icon: <FileText className="w-12 h-12 text-purple-600" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-600">
            Como buzo, seguirás este flujo de trabajo en cada operación:
          </p>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
              <div>
                <h4 className="font-semibold">Asignación a Operación</h4>
                <p className="text-sm text-gray-600">Serás asignado a un equipo de buceo para una operación específica</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
              <div>
                <h4 className="font-semibold">Supervisor Completa Bitácora</h4>
                <p className="text-sm text-gray-600">El supervisor registra los datos de la inmersión y tu participación</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
              <div>
                <h4 className="font-semibold">Creas tu Bitácora</h4>
                <p className="text-sm text-gray-600">Completas y firmas tu bitácora individual con los detalles de la inmersión</p>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      if (isProfileComplete) {
        onComplete();
      } else {
        navigate('/profile-setup');
      }
    }
  };

  const previousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-600 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg mb-4">
              <span className="text-white font-bold text-2xl">B</span>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              {currentStepData.title}
            </CardTitle>
            <p className="text-gray-600">{currentStepData.description}</p>
            
            <div className="mt-4">
              <div className="flex justify-center mb-2">
                <span className="text-sm text-gray-500">
                  Paso {currentStep + 1} de {steps.length}
                </span>
              </div>
              <Progress value={progress} className="w-full max-w-md mx-auto" />
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="flex justify-center mb-6">
              {currentStepData.icon}
            </div>

            {currentStepData.content}

            <div className="flex justify-between pt-6">
              <Button
                variant="outline"
                onClick={previousStep}
                disabled={currentStep === 0}
              >
                Anterior
              </Button>
              
              <Button
                onClick={nextStep}
                className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700"
              >
                {currentStep === steps.length - 1 
                  ? (isProfileComplete ? 'Finalizar' : 'Completar Perfil')
                  : 'Siguiente'
                }
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
