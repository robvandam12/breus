
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { UserInviteForm } from "@/components/users/forms/UserInviteForm";

interface UserInviteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (userData: { email: string; rol: string }) => Promise<void>;
}

export const UserInviteDialog = ({ open, onOpenChange, onSubmit }: UserInviteDialogProps) => {
  const handleSubmit = async (userData: { email: string; rol: string }) => {
    await onSubmit(userData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invitar Usuario</DialogTitle>
        </DialogHeader>
        <UserInviteForm
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};
