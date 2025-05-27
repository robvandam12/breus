
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { User, FileText, Building, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export const BuzoRestrictedView = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();

  const isProfileComplete = profile?.salmonera_id || profile?.servicio_id;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Bienvenido a Breus
        </h2>
        <p className="text-gray-600">
          Plataforma de gestión de buceo profesional
        </p>
      </div>

      {!isProfileComplete && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Para acceder a todas las funcionalidades, completa tu perfil y espera ser asignado a una empresa.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              Tu Perfil
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-sm text-gray-600">
                <strong>Nombre:</strong> {profile?.nombre} {profile?.apellido}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Email:</strong> {profile?.email}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Rol:</strong> Buzo
              </p>
              <p className="text-sm text-gray-600">
                <strong>Estado:</strong> {isProfileComplete ? 'Asignado' : 'Pendiente de asignación'}
              </p>
              <Button 
                variant="outline" 
                onClick={() => navigate('/profile-setup')}
                className="w-full"
              >
                Completar Perfil
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-green-600" />
              Mis Bitácoras
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-sm text-gray-600">
                Aquí podrás ver las bitácoras que has creado y firmado.
              </p>
              <div className="text-center py-4">
                <p className="text-2xl font-bold">0</p>
                <p className="text-sm text-gray-500">Bitácoras creadas</p>
              </div>
              <Button 
                variant="outline" 
                disabled={!isProfileComplete}
                className="w-full"
              >
                Ver Bitácoras
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="w-5 h-5 text-purple-600" />
              Estado de Empresa
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {isProfileComplete ? (
                <>
                  <p className="text-sm text-green-600 font-medium">
                    ✓ Asignado a empresa
                  </p>
                  <p className="text-sm text-gray-600">
                    Ya puedes acceder a todas las funcionalidades de la plataforma.
                  </p>
                </>
              ) : (
                <>
                  <p className="text-sm text-orange-600 font-medium">
                    ⏳ Pendiente de asignación
                  </p>
                  <p className="text-sm text-gray-600">
                    Un administrador debe asignarte a una empresa para que puedas comenzar a trabajar.
                  </p>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Acerca de Breus</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-sm text-gray-600">
                Breus es una plataforma integral para la gestión de operaciones de buceo profesional, 
                incluyendo control de inmersiones, documentación y equipos de trabajo.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Gestión de HPT y Anexo Bravo</li>
                <li>• Registro de inmersiones</li>
                <li>• Bitácoras digitales</li>
                <li>• Control de equipos</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
