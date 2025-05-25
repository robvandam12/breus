
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Webhook, Send, CheckCircle, XCircle, Clock } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface TestResult {
  id: string;
  url: string;
  method: string;
  status: number;
  responseTime: number;
  success: boolean;
  timestamp: string;
  response?: string;
  error?: string;
}

export const WebhookTester = () => {
  const [testUrl, setTestUrl] = useState('');
  const [testMethod, setTestMethod] = useState('POST');
  const [testPayload, setTestPayload] = useState('{\n  "event": "test",\n  "data": {\n    "message": "Test webhook from Breus"\n  }\n}');
  const [testHeaders, setTestHeaders] = useState('{\n  "Content-Type": "application/json",\n  "X-Breus-Webhook": "test"\n}');
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleTestWebhook = async () => {
    if (!testUrl) {
      toast({
        title: "URL requerida",
        description: "Por favor ingresa una URL para probar.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    const startTime = Date.now();

    try {
      let headers = {};
      let payload = null;

      try {
        headers = JSON.parse(testHeaders);
      } catch (e) {
        throw new Error('Headers JSON inválido');
      }

      if (testMethod !== 'GET' && testPayload) {
        try {
          payload = JSON.parse(testPayload);
        } catch (e) {
          throw new Error('Payload JSON inválido');
        }
      }

      const response = await fetch(testUrl, {
        method: testMethod,
        headers,
        body: payload ? JSON.stringify(payload) : null,
      });

      const endTime = Date.now();
      const responseTime = endTime - startTime;
      const responseText = await response.text();

      const result: TestResult = {
        id: Date.now().toString(),
        url: testUrl,
        method: testMethod,
        status: response.status,
        responseTime,
        success: response.ok,
        timestamp: new Date().toLocaleString('es-CL'),
        response: responseText
      };

      setTestResults(prev => [result, ...prev.slice(0, 9)]); // Keep last 10 results

      toast({
        title: response.ok ? "Webhook exitoso" : "Webhook falló",
        description: `Status: ${response.status}, Tiempo: ${responseTime}ms`,
        variant: response.ok ? "default" : "destructive",
      });

    } catch (error) {
      const endTime = Date.now();
      const responseTime = endTime - startTime;

      const result: TestResult = {
        id: Date.now().toString(),
        url: testUrl,
        method: testMethod,
        status: 0,
        responseTime,
        success: false,
        timestamp: new Date().toLocaleString('es-CL'),
        error: error instanceof Error ? error.message : 'Error desconocido'
      };

      setTestResults(prev => [result, ...prev.slice(0, 9)]);

      toast({
        title: "Error en webhook",
        description: error instanceof Error ? error.message : 'Error desconocido',
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return 'bg-green-100 text-green-700';
    if (status >= 400 && status < 500) return 'bg-yellow-100 text-yellow-700';
    if (status >= 500) return 'bg-red-100 text-red-700';
    return 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Webhook className="w-5 h-5" />
            Probador de Webhooks
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-3">
              <Label htmlFor="testUrl">URL del Webhook</Label>
              <Input
                id="testUrl"
                value={testUrl}
                onChange={(e) => setTestUrl(e.target.value)}
                placeholder="https://api.ejemplo.com/webhook"
              />
            </div>
            <div>
              <Label htmlFor="testMethod">Método</Label>
              <Select value={testMethod} onValueChange={setTestMethod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="POST">POST</SelectItem>
                  <SelectItem value="PUT">PUT</SelectItem>
                  <SelectItem value="PATCH">PATCH</SelectItem>
                  <SelectItem value="GET">GET</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="testHeaders">Headers (JSON)</Label>
              <Textarea
                id="testHeaders"
                value={testHeaders}
                onChange={(e) => setTestHeaders(e.target.value)}
                rows={4}
                className="font-mono text-sm"
              />
            </div>
            <div>
              <Label htmlFor="testPayload">Payload (JSON)</Label>
              <Textarea
                id="testPayload"
                value={testPayload}
                onChange={(e) => setTestPayload(e.target.value)}
                rows={4}
                className="font-mono text-sm"
                disabled={testMethod === 'GET'}
              />
            </div>
          </div>

          <Button
            onClick={handleTestWebhook}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Clock className="w-4 h-4 mr-2 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Probar Webhook
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {testResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Resultados de Pruebas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {testResults.map((result) => (
                <div key={result.id} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {result.success ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-600" />
                      )}
                      <span className="font-mono text-sm">{result.method} {result.url}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(result.status)}>
                        {result.status || 'ERROR'}
                      </Badge>
                      <span className="text-sm text-gray-500">{result.responseTime}ms</span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">{result.timestamp}</div>
                  {result.response && (
                    <details className="text-sm">
                      <summary className="cursor-pointer text-blue-600">Ver respuesta</summary>
                      <pre className="mt-2 p-2 bg-gray-50 rounded text-xs overflow-auto">
                        {result.response}
                      </pre>
                    </details>
                  )}
                  {result.error && (
                    <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                      {result.error}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
