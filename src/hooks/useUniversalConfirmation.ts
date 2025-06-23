
import { useState } from 'react';

interface ConfirmationOptions {
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "destructive" | "warning" | "info";
  onConfirm: () => void | Promise<void>;
}

export const useUniversalConfirmation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState<ConfirmationOptions>({
    title: '',
    description: '',
    onConfirm: () => {}
  });

  const showConfirmation = (confirmationOptions: ConfirmationOptions) => {
    setOptions(confirmationOptions);
    setIsOpen(true);
  };

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await options.onConfirm();
    } catch (error) {
      console.error('Error in confirmation action:', error);
    } finally {
      setIsLoading(false);
      setIsOpen(false);
    }
  };

  const handleCancel = () => {
    setIsOpen(false);
    setIsLoading(false);
  };

  return {
    isOpen,
    isLoading,
    options,
    showConfirmation,
    handleConfirm,
    handleCancel,
    setIsOpen
  };
};
