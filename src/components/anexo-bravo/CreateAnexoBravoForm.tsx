
import { AnexoBravoWizard } from "./AnexoBravoWizard";

interface CreateAnexoBravoFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export const CreateAnexoBravoForm = ({ onSubmit, onCancel }: CreateAnexoBravoFormProps) => {
  const handleComplete = (anexoId: string) => {
    // Call the original onSubmit with the anexoId
    onSubmit({ id: anexoId });
  };

  return (
    <AnexoBravoWizard
      onComplete={handleComplete}
      onCancel={onCancel}
    />
  );
};
