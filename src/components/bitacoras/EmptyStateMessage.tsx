
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface EmptyStateMessageProps {
  title: string;
  description: string;
  action?: React.ReactNode;
}

export const EmptyStateMessage = ({ title, description, action }: EmptyStateMessageProps) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <AlertCircle className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-4 max-w-md">{description}</p>
      {action && (
        <div>{action}</div>
      )}
    </div>
  );
};
