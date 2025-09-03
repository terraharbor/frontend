import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { FC } from 'react';
import { ModalMode } from '../../types';
import { UserForm, UserFormInput, UserFormOutput } from '../forms/UserForm';

type UserModalProps = {
  open: boolean;
  mode: ModalMode;
  initialValues?: Partial<UserFormInput>;
  onClose: () => void;
  onSubmit: (values: UserFormOutput) => void;
  loading?: boolean;
};

const UserModal: FC<UserModalProps> = ({
  open,
  mode,
  initialValues,
  onClose,
  onSubmit,
  loading,
}) => {
  const title = mode === 'create' ? 'Create a user' : 'Edit the user';
  const cta = mode === 'create' ? 'Create' : 'Save';

  const handleProtectedClose = () => {
    if (loading) return;
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleProtectedClose}
      maxWidth="sm"
      fullWidth
      disableEscapeKeyDown={!!loading}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <UserForm defaultValues={initialValues} onSubmit={onSubmit} disabled={loading} />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleProtectedClose} color="inherit" disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" form="user-form" variant="contained" disabled={loading}>
          {cta}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserModal;
