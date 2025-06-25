
import { useState } from "react";

interface Toast {
  title: string;
  description?: string;
  variant?: "default" | "destructive";
}

export const toast = ({ title, description, variant = "default" }: Toast) => {
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
