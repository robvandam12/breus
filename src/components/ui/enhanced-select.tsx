
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface EnhancedSelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  emptyMessage?: string;
  options: Array<{ value: string; label: string; }>;
  disabled?: boolean;
}

export const EnhancedSelect = ({ 
  value, 
  onValueChange, 
  placeholder, 
  emptyMessage = "No hay opciones disponibles",
  options,
  disabled 
}: EnhancedSelectProps) => {
  // Filter out any options with empty string values
  const validOptions = options.filter(option => option.value && option.value.trim() !== '');

  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {validOptions.length === 0 ? (
          <div className="py-6 text-center text-sm text-muted-foreground">
            {emptyMessage}
          </div>
        ) : (
          validOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  );
};
