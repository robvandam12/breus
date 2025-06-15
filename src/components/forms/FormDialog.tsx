
import React from 'react';
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { DialogContentVariant } from "@/components/ui/dialog-variants";
import { Button } from "@/components/ui/button";

interface FormDialogProps {
  children: React.ReactNode;
  trigger?: React.ReactNode;
  triggerText?: string;
  triggerIcon?: React.ElementType;
  triggerVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  triggerClassName?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  variant?: 'default' | 'form' | 'detail' | 'wizard';
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

export const FormDialog: React.FC<FormDialogProps> = ({
  children,
  trigger,
  triggerText,
  triggerIcon: TriggerIcon,
  triggerVariant = 'default',
  triggerClassName = '',
  size = 'lg',
  variant = 'form',
  open,
  onOpenChange,
  className
}) => {
  const defaultTrigger = triggerText && (
    <Button variant={triggerVariant} className={triggerClassName}>
      {TriggerIcon && <TriggerIcon className="w-4 h-4 mr-2" />}
      {triggerText}
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {(trigger || defaultTrigger) && (
        <DialogTrigger asChild>
          {trigger || defaultTrigger}
        </DialogTrigger>
      )}
      <DialogContentVariant variant={variant} size={size} className={className}>
        {children}
      </DialogContentVariant>
    </Dialog>
  );
};
