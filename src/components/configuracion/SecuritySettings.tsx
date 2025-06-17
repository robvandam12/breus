
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { 
  Shield, 
  Key, 
  Lock, 
  Eye, 
  EyeOff, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Smartphone,
  Globe,
  Database,
  Activity
} from "lucide-react";

export const SecuritySettings = () => {
  const [show2FACode, setShow2FACode] = useState(false);
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: false,
    sessionTimeout: 30,
    passwordPolicy: {
      minLength: 8,
      requireUppercase: true,
      requireNumbers: true,
      requireSymbols: true
    },
    loginAttempts: 5,
    accountLockout: 15
  });

  const securityLogs = [
    {
      id: 1,
      event: 'Inicio de sesión exitoso',
      user: 'admin@breus.cl',
      ip: '192.168.1.100',
      timestamp: '2024-06-17 14:30:25',
      status: 'success'
    },
    {
      id: 2,
      event: 'Intento de acceso fallido',
      user: 'unknown@example.com',
      ip: '203.45.67.89',
      timestamp: '2024-06-17 14:25:12',
      status: 'warning'
    },
    {
      id: 3,
      event: 'Cambio de permisos',
      user: 'supervisor@breus.cl',
      ip: '192.168.1.105',
      timestamp: '2024-06-17 13:45:00',
      status: 'info'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'error': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default: return <Activity className="w-4 h-4 text-blue-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Autenticación de Dos Factores */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="w-5 h-5" />
            Autenticación de Dos Factores (2FA)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Habilitar 2FA</Label>
              <p className="text-sm text-gray-600">Añade una capa extra de seguridad a tu cuenta</p>
            </div>
            <Switch
              checked={securitySettings.twoFactorEnabled}
              onCheckedChange={(checked) => 
                setSecuritySettings(prev => ({ ...prev, twoFactorEnabled: checked }))
              }
            />
          </div>

          {securitySettings.twoFactorEnabled && (
            <div className="space-y-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2">
                <Key className="w-5 h-5 text-blue-600" />
                <Label className="font-medium">Código de Configuración</Label>
              </div>
              
              <div className="flex items-center gap-2">
                <Input
                  type={show2FACode ? "text" : "password"}
                  value="JBSWY3DPEHPK3PXP"
                  readOnly
                  className="font-mono text-sm bg-white"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShow2FACode(!show2FACode)}
                >
                  {show2FACode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
              
              <p className="text-sm text-blue-700">
                Escanea este código con tu aplicación de autenticación (Google Authenticator, Authy, etc.)
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Políticas de Seguridad */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Políticas de Seguridad
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Timeout de Sesión */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Tiempo de Expiración de Sesión (minutos)
            </Label>
            <Input
              type="number"
              value={securitySettings.sessionTimeout}
              onChange={(e) => setSecuritySettings(prev => ({ 
                ...prev, 
                sessionTimeout: parseInt(e.target.value) 
              }))}
              className="w-32"
            />
            <p className="text-sm text-gray-600">
              Las sesiones inactivas se cerrarán automáticamente después de este tiempo
            </p>
          </div>

          {/* Intentos de Login */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Máximo Intentos de Login</Label>
              <Input
                type="number"
                value={securitySettings.loginAttempts}
                onChange={(e) => setSecuritySettings(prev => ({ 
                  ...prev, 
                  loginAttempts: parseInt(e.target.value) 
                }))}
                className="w-24"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Bloqueo de Cuenta (minutos)</Label>
              <Input
                type="number"
                value={securitySettings.accountLockout}
                onChange={(e) => setSecuritySettings(prev => ({ 
                  ...prev, 
                  accountLockout: parseInt(e.target.value) 
                }))}
                className="w-24"
              />
            </div>
          </div>

          {/* Política de Contraseñas */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Política de Contraseñas</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Longitud mínima: 8 caracteres</span>
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Requiere mayúsculas</span>
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Requiere números</span>
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Requiere símbolos</span>
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Configuración de Red */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Seguridad de Red
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Database className="w-4 h-4" />
                RLS (Row Level Security)
              </h4>
              <p className="text-sm text-gray-600 mb-2">
                Habilitado en todas las tablas sensibles
              </p>
              <Badge className="bg-green-100 text-green-800">Activo</Badge>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Cifrado SSL/TLS
              </h4>
              <p className="text-sm text-gray-600 mb-2">
                Todas las conexiones están cifradas
              </p>
              <Badge className="bg-green-100 text-green-800">TLS 1.3</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Log de Seguridad */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Registro de Actividad de Seguridad
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {securityLogs.map((log) => (
              <div key={log.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(log.status)}
                  <div>
                    <p className="font-medium text-sm">{log.event}</p>
                    <p className="text-xs text-gray-600">
                      {log.user} desde {log.ip}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <Badge className={getStatusBadge(log.status)}>
                    {log.status}
                  </Badge>
                  <p className="text-xs text-gray-500 mt-1">{log.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 pt-4 border-t">
            <Button variant="outline" className="w-full">
              Ver Registro Completo
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Botones de Acción */}
      <div className="flex gap-4">
        <Button className="flex-1">
          Guardar Configuración
        </Button>
        <Button variant="outline">
          Exportar Configuración
        </Button>
      </div>
    </div>
  );
};
