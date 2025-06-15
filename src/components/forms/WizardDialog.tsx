
import React from 'react';
import { FormDialog } from './FormDialog';
import { Plus } from 'lucide-react';

interface WizardDialogProps {
  children: React.ReactNode;
  triggerText?: string;
  triggerIcon?: React.ElementType;
  triggerClassName?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  size?: 'lg' | 'xl' | 'full';
}

export const WizardDialog: React.FC<WizardDialogProps> = ({
  children,
  triggerText = "Nuevo",
  triggerIcon = Plus,
  triggerClassName = "",
  size = 'xl',
  ...props
}) => {
  return (
    <FormDialog
      variant="wizard"
      size={size}
      triggerText={triggerText}
      triggerIcon={triggerIcon}
      triggerClassName={triggerClassName}
      {...props}
    >
      {children}
    </FormDialog>
  );
};
