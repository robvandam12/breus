
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertTriangle, XCircle, Info } from 'lucide-react';

interface ValidationMessage {
  type: 'success' | 'warning' | 'error' | 'info';
  message: string;
}

interface StepValidationMessagesProps {
  stepId: string;
  messages: ValidationMessage[];
}

export const StepValidationMessages = ({ stepId, messages }: StepValidationMessagesProps) => {
  if (messages.length === 0) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4" />;
      case 'error':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const getAlertClass = (type: string) => {
    switch (type) {
      case 'success':
        return 'border-green-200 bg-green-50';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50';
      case 'error':
        return 'border-red-200 bg-red-50';
      default:
        return 'border-blue-200 bg-blue-50';
    }
  };

  const getTextClass = (type: string) => {
    switch (type) {
      case 'success':
        return 'text-green-800';
      case 'warning':
        return 'text-yellow-800';
      case 'error':
        return 'text-red-800';
      default:
        return 'text-blue-800';
    }
  };

  return (
    <div className="space-y-2">
      {messages.map((message, index) => (
        <Alert key={index} className={getAlertClass(message.type)}>
          {getIcon(message.type)}
          <AlertDescription className={getTextClass(message.type)}>
            {message.message}
          </AlertDescription>
        </Alert>
      ))}
    </div>
  );
};
