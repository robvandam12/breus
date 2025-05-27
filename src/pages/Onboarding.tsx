
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Anchor, Users, FileText, Shield, Building, MapPin } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function Onboarding() {
  const { profile } = useAuth();
  const navigate = useNavigate();

  const features = [
    {
      icon: <FileText className="w-8 h-8 text-blue-600" />,
      title: "Gestión de Documentos",
      description: "HPT, Anexo Bravo y bitácoras digitales"
    },
    {
      icon: <Anchor className="w-8 h-8 text-teal-600" />,
      title: "Control de Inmersiones",
      description: "Registro y seguimiento de operaciones de buceo"
    },
    {
      icon: <Users className="w-8 h-8 text-purple-600" />,
      title: "Equipos de Trabajo",
      description: "Gestión de buzos, supervisores y equipos"
    },
    {
      icon: <Shield className="w-8 h-8 text-green-600" />,
      title: "Seguridad y Cumplimiento",
      description: "Protocolos de seguridad y certificaciones"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-600 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg mb-6">
            <span className="text-white font-bold text-2xl">B</span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent mb-4">
            Bienvenido a Breus
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Plataforma integral de gestión de buceo profesional
          </p>
          <p className="text-sm text-gray-500">
            ¡Hola {profile?.nombre} {profile?.apellido}! Tu cuenta ha sido creada exitosamente.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {features.map((feature, index) => (
            <Card key={index} className="ios-card hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  {feature.icon}
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-gray-600 text-sm">{feature.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="ios-card">
          <CardHeader>
            <CardTitle className="text-center">Siguiente Paso</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">
              Para acceder a todas las funcionalidades de la plataforma, necesitas completar tu perfil profesional y ser asignado a una empresa.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => navigate('/profile-setup')}
                className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700"
              >
                <Users className="w-4 h-4 mr-2" />
                Completar Perfil
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate('/')}
              >
                Explorar Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
