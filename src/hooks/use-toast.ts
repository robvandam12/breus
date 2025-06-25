
import { toast as sonnerToast } from "sonner";
import { useState } from "react";

export interface ToastProps {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
}

interface Toast extends ToastProps {
  id: string;
}

let toastId = 0;
const toasts: Toast[] = [];

export const toast = ({ title, description, variant = "default" }: ToastProps) => {
  if (variant === "destructive") {
    sonnerToast.error(title, {
      description,
    });
  } else {
    sonnerToast.success(title, {
      description,
    });
  }
};

export const useToast = () => {
  const [, forceUpdate] = useState({});
  
  return { 
    toast,
    toasts: [] // Return empty array to satisfy the Toaster component
  };
};
