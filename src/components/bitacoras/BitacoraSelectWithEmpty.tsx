
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

interface Option {
  id: string;
  label: string;
}

interface BitacoraSelectWithEmptyProps {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  options: Option[];
  placeholder: string;
  emptyMessage: string;
  emptyDescription?: string;
}

export const BitacoraSelectWithEmpty = ({ 
  label, 
  value, 
  onValueChange, 
  options, 
  placeholder, 
  emptyMessage,
  emptyDescription 
}: BitacoraSelectWithEmptyProps) => {
  if (options.length === 0) {
    return (
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>{emptyMessage}</strong>
            {emptyDescription && <p className="mt-1 text-sm">{emptyDescription}</p>}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.id} value={option.id}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
