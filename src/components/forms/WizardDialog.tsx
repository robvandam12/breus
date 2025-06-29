
import React from 'react';
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface WizardDialogProps {
  children: React.ReactNode;
  triggerText: string;
  triggerIcon?: LucideIcon;
  triggerClassName?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  hideButton?: boolean;
}

export const WizardDialog = ({
  children,
  triggerText,
  triggerIcon: Icon,
  triggerClassName = "",
  open,
  onOpenChange,
  size = "md",
  hideButton = false
}: WizardDialogProps) => {
  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg", 
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    full: "max-w-7xl w-[90vw]"
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {!hideButton && (
        <DialogTrigger asChild>
          <Button className={triggerClassName}>
            {Icon && <Icon className="w-4 h-4 mr-2" />}
            {triggerText}
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className={`${sizeClasses[size]} max-h-[90vh] overflow-y-auto`}>
        {children}
      </DialogContent>
    </Dialog>
  );
};
