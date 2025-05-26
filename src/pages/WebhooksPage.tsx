
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const WebhooksPage = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Webhooks</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Configuración de Webhooks</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            La configuración de webhooks estará disponible próximamente.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default WebhooksPage;
