
import { AnexoBravoWizard } from "./AnexoBravoWizard";

interface CreateAnexoBravoFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export const CreateAnexoBravoForm = ({ onSubmit, onCancel }: CreateAnexoBravoFormProps) => {
  return (
    <AnexoBravoWizard
      onSubmit={onSubmit}
      onCancel={onCancel}
    />
  );
};
