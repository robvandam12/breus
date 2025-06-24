
import { useState } from 'react';

interface ConfirmationOptions {
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'destructive';
  onConfirm: () => Promise<void> | void;
}

export const useUniversalConfirmation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState<ConfirmationOptions>({
    title: '',
    description: '',
    confirmText: 'Confirmar',
    cancelText: 'Cancelar',
    variant: 'default',
    onConfirm: () => {}
  });

  const showConfirmation = (newOptions: ConfirmationOptions) => {
    setOptions({
      confirmText: 'Confirmar',
      cancelText: 'Cancelar',
      variant: 'default',
      ...newOptions
    });
    setIsOpen(true);
  };

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await options.onConfirm();
      setIsOpen(false);
    } catch (error) {
      console.error('Error in confirmation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  return {
    isOpen,
    setIsOpen,
    isLoading,
    options,
    showConfirmation,
    handleConfirm,
    handleCancel
  };
};
