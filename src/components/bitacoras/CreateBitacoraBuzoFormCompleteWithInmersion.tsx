
import { useState, useEffect } from "react";
import { CreateBitacoraBuzoFormComplete } from "./CreateBitacoraBuzoFormComplete";
import { BitacoraBuzoFormData } from "@/hooks/useBitacoras";

interface CreateBitacoraBuzoFormCompleteWithInmersionProps {
  inmersionId: string;
  onSubmit: (data: BitacoraBuzoFormData) => Promise<void>;
  onCancel: () => void;
}

export const CreateBitacoraBuzoFormCompleteWithInmersion = ({ 
  inmersionId,
  onSubmit, 
  onCancel 
}: CreateBitacoraBuzoFormCompleteWithInmersionProps) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: BitacoraBuzoFormData) => {
    setLoading(true);
    try {
      // Asegurar que el inmersion_id esté incluido en los datos
      const dataWithInmersion = {
        ...data,
        inmersion_id: inmersionId
      };
      await onSubmit(dataWithInmersion);
    } catch (error) {
      console.error('Error creating bitácora buzo:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CreateBitacoraBuzoFormComplete
      onSubmit={handleSubmit}
      onCancel={onCancel}
    />
  );
};
