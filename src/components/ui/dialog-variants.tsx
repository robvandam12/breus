
import React from 'react';
import { Dialog, DialogContent, DialogProps } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface DialogContentVariantProps extends React.ComponentPropsWithoutRef<typeof DialogContent> {
  variant?: 'default' | 'form' | 'detail' | 'wizard';
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

const DialogContentVariant = React.forwardRef<
  React.ElementRef<typeof DialogContent>,
  DialogContentVariantProps
>(({ className, variant = 'default', size = 'md', ...props }, ref) => {
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    full: 'max-w-7xl'
  };

  const variantClasses = {
    default: '',
    form: 'max-h-[85vh] overflow-y-auto',
    detail: 'max-h-[90vh] overflow-y-auto',
    wizard: 'max-h-[85vh] overflow-hidden'
  };

  return (
    <DialogContent
      ref={ref}
      className={cn(
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      {...props}
    />
  );
});

DialogContentVariant.displayName = "DialogContentVariant";

export { DialogContentVariant };
