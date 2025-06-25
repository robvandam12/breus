
import { useState } from "react";

interface Toast {
  id: string;
  title: string;
  description?: string;
  variant?: "default" | "destructive";
  action?: React.ReactNode;
}

export const toast = ({ title, description, variant = "default" }: Omit<Toast, 'id'>) => {
  console.log(`[${variant.toUpperCase()}] ${title}${description ? `: ${description}` : ''}`);
  // Mock implementation - replace with actual toast system
};

export const useToast = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  
  return { 
    toast,
    toasts,
    setToasts
  };
};
