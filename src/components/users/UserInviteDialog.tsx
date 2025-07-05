
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { SimpleUserInviteForm } from "@/components/users/forms/SimpleUserInviteForm";

interface UserInviteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: { email: string; rol: string }) => Promise<void>;
  allowedRoles?: string[];
}

export const UserInviteDialog = ({ 
  open, 
  onOpenChange, 
  onSubmit,
  allowedRoles 
}: UserInviteDialogProps) => {
  const handleSubmit = async (data: { email: string; rol: string }) => {
    await onSubmit(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Invitar Usuario</DialogTitle>
        </DialogHeader>
        <SimpleUserInviteForm
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};
