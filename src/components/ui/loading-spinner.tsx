
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

export const LoadingSpinner = ({ 
  className, 
  size = 'md', 
  text = 'Cargando...' 
}: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-8 h-8'
  };

  return (
    <div className={cn("flex items-center justify-center gap-2", className)}>
      <Loader2 className={cn("animate-spin", sizeClasses[size])} />
      {text && <span className="text-sm text-zinc-500">{text}</span>}
    </div>
  );
};
