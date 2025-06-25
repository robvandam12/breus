
import React from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

interface ContextInfo {
  type: string;
  message: string;
  variant: 'default' | 'destructive';
}

interface InmersionesContextInfoProps {
  contextInfo: ContextInfo;
}

export const InmersionesContextInfo: React.FC<InmersionesContextInfoProps> = ({
  contextInfo
}) => {
  return (
    <Alert variant={contextInfo.variant}>
      <Info className="h-4 w-4" />
      <AlertDescription>
        {contextInfo.message}
      </AlertDescription>
    </Alert>
  );
};
