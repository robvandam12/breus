
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EnhancedUserInviteForm } from "@/components/users/forms/EnhancedUserInviteForm";
import { InviteUserOptions } from "@/hooks/useUsuarios";

interface UserInviteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (options: InviteUserOptions) => Promise<void>;
  allowedRoles?: string[];
}

export const UserInviteDialog = ({ 
  open, 
  onOpenChange, 
  onSubmit,
  allowedRoles 
}: UserInviteDialogProps) => {
  const handleSubmit = async (options: InviteUserOptions) => {
    await onSubmit(options);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Invitar Usuario</DialogTitle>
        </DialogHeader>
        <EnhancedUserInviteForm
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
          allowedRoles={allowedRoles}
        />
      </DialogContent>
    </Dialog>
  );
};
