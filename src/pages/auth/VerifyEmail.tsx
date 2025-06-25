
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const VerifyEmail = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Verificar Email</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <p>
              Hemos enviado un enlace de verificación a tu correo electrónico.
            </p>
            <p className="text-sm text-gray-600">
              Por favor, revisa tu bandeja de entrada y haz clic en el enlace para verificar tu cuenta.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyEmail;
