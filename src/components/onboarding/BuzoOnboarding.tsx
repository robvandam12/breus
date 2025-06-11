
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Anchor, 
  Users, 
  FileText, 
  Shield, 
  Building, 
  MapPin, 
  CheckCircle,
  ArrowRight,
  X,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';

interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  completed: boolean;
}

export const BuzoOnboarding = ({ onComplete }: { onComplete: () => void }) => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);

  // Verificar si el perfil está completo
  const isProfileComplete = () => {
    if (!profile?.perfil_buzo) return false;
    const requiredFields = ['rut', 'telefono', 'direccion', 'ciudad', 'region', 'nacionalidad'];
    const perfilBuzo = profile.perfil_buzo as any;
    return requiredFields.every(field => perfilBuzo[field]?.toString().trim());
  };

  const steps: OnboardingStep[] = [
    {
      id: 1,
      title: "Bienvenido a Breus",
      description: "Plataforma integral de gestión de buceo profesional",
      icon: <Anchor className="w-8 h-8 text-blue-600" />,
      completed: true
    },
    {
      id: 2,
      title: "Gestión de Documentos",
      description: "HPT, Anexo Bravo y bitácoras digitales",
      icon: <FileText className="w-8 h-8 text-teal-600" />,
      completed: false
    },
    {
      id: 3,
      title: "Control de Inmersiones",
      description: "Registro y seguimiento de operaciones de buceo",
      icon: <Users className="w-8 h-8 text-purple-600" />,
      completed: false
    },
    {
      id: 4,
      title: "Seguridad y Cumplimiento",
      description: "Protocolos de seguridad y certificaciones",
      icon: <Shield className="w-8 h-8 text-green-600" />,
      completed: false
    },
    {
      id: 5,
      title: "Completa tu Perfil",
      description: "Información profesional requerida",
      icon: <Building className="w-8 h-8 text-orange-600" />,
      completed: isProfileComplete()
    }
  ];

  const completedSteps = steps.filter(step => step.completed).length;
  const progress = (completedSteps / steps.length) * 100;

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToProfileSetup = () => {
    navigate('/profile-setup');
  };

  const finishOnboarding = () => {
    localStorage.setItem('onboarding_completed', 'true');
    onComplete();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">B</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Onboarding Breus</h1>
              <p className="text-gray-600">Configuración inicial para buzos</p>
            </div>
          </div>
          <Button variant="ghost" onClick={finishOnboarding} className="p-2">
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Progreso del Onboarding
            </span>
            <Badge variant="outline">
              {completedSteps} de {steps.length} completado
            </Badge>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Steps Overview */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Pasos de Configuración</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {steps.map((step, index) => (
                  <div
                    key={step.id}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                      currentStep === index
                        ? 'bg-blue-50 border border-blue-200'
                        : step.completed
                        ? 'bg-green-50'
                        : 'bg-gray-50'
                    }`}
                    onClick={() => setCurrentStep(index)}
                  >
                    <div className="flex-shrink-0">
                      {step.completed ? (
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      ) : (
                        step.icon
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium text-sm ${
                        currentStep === index ? 'text-blue-900' : 'text-gray-900'
                      }`}>
                        {step.title}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Current Step Content */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      {steps[currentStep].icon}
                      <div>
                        <CardTitle>{steps[currentStep].title}</CardTitle>
                        <p className="text-gray-600 mt-1">
                          {steps[currentStep].description}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {currentStep === 0 && (
                      <div className="text-center space-y-4">
                        <p className="text-lg text-gray-700">
                          ¡Bienvenido a la plataforma de gestión de buceo más avanzada de Chile!
                        </p>
                        <p className="text-gray-600">
                          Como buzo profesional, tendrás acceso a herramientas especializadas para:
                        </p>
                        <ul className="text-left space-y-2 max-w-md mx-auto">
                          <li className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            Gestionar tus bitácoras de buceo
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            Participar en operaciones asignadas
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            Recibir notificaciones importantes
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            Mantener tu perfil profesional actualizado
                          </li>
                        </ul>
                      </div>
                    )}

                    {currentStep === 1 && (
                      <div className="space-y-4">
                        <p className="text-gray-700">
                          En Breus, todos los documentos importantes se gestionan de forma digital:
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="border rounded-lg p-4">
                            <FileText className="w-8 h-8 text-blue-600 mb-2" />
                            <h3 className="font-semibold">HPT</h3>
                            <p className="text-sm text-gray-600">Hoja de Planificación del Trabajo</p>
                          </div>
                          <div className="border rounded-lg p-4">
                            <Shield className="w-8 h-8 text-green-600 mb-2" />
                            <h3 className="font-semibold">Anexo Bravo</h3>
                            <p className="text-sm text-gray-600">Protocolo de seguridad</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {currentStep === 2 && (
                      <div className="space-y-4">
                        <p className="text-gray-700">
                          Como buzo, podrás crear tus bitácoras de inmersión cuando:
                        </p>
                        <ul className="space-y-3">
                          <li className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                            <div>
                              <strong>Estés asignado a un equipo de buceo</strong>
                              <p className="text-sm text-gray-600">Formas parte de una operación activa</p>
                            </div>
                          </li>
                          <li className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                            <div>
                              <strong>El supervisor haya completado su bitácora</strong>
                              <p className="text-sm text-gray-600">Con los datos de tu inmersión</p>
                            </div>
                          </li>
                          <li className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                            <div>
                              <strong>Tu perfil esté completo</strong>
                              <p className="text-sm text-gray-600">Información profesional requerida</p>
                            </div>
                          </li>
                        </ul>
                      </div>
                    )}

                    {currentStep === 3 && (
                      <div className="space-y-4">
                        <p className="text-gray-700">
                          La seguridad es nuestra prioridad. El sistema te ayudará a:
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="border rounded-lg p-4">
                            <AlertTriangle className="w-8 h-8 text-orange-600 mb-2" />
                            <h3 className="font-semibold">Alertas</h3>
                            <p className="text-sm text-gray-600">Notificaciones de operaciones próximas</p>
                          </div>
                          <div className="border rounded-lg p-4">
                            <Shield className="w-8 h-8 text-green-600 mb-2" />
                            <h3 className="font-semibold">Protocolos</h3>
                            <p className="text-sm text-gray-600">Cumplimiento automático de normas</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {currentStep === 4 && (
                      <div className="space-y-4">
                        <p className="text-gray-700">
                          Para utilizar todas las funcionalidades, necesitas completar tu perfil profesional.
                        </p>
                        
                        {isProfileComplete() ? (
                          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <div className="flex items-center gap-2">
                              <CheckCircle className="w-5 h-5 text-green-600" />
                              <span className="font-medium text-green-800">¡Perfil completado!</span>
                            </div>
                            <p className="text-green-700 mt-2">
                              Tu perfil está completo y puedes usar todas las funcionalidades.
                            </p>
                          </div>
                        ) : (
                          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                            <div className="flex items-center gap-2">
                              <AlertTriangle className="w-5 h-5 text-orange-600" />
                              <span className="font-medium text-orange-800">Perfil incompleto</span>
                            </div>
                            <p className="text-orange-700 mt-2 mb-4">
                              Completa tu información profesional para acceder a todas las funcionalidades.
                            </p>
                            <Button onClick={goToProfileSetup} className="w-full">
                              <Building className="w-4 h-4 mr-2" />
                              Completar Perfil Ahora
                            </Button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Navigation */}
                    <div className="flex justify-between pt-6">
                      <Button
                        variant="outline"
                        onClick={prevStep}
                        disabled={currentStep === 0}
                      >
                        Anterior
                      </Button>
                      
                      {currentStep === steps.length - 1 ? (
                        <Button onClick={finishOnboarding} className="bg-green-600 hover:bg-green-700">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Finalizar
                        </Button>
                      ) : (
                        <Button onClick={nextStep}>
                          Siguiente
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};
