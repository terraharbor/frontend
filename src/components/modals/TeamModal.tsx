import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { FC } from 'react';
import { ModalMode } from '../../types';
import { TeamForm, TeamFormInput, TeamFormOutput } from '../forms/TeamForm';

type TeamModalProps = {
  open: boolean;
  mode: ModalMode;
  initialValues?: Partial<TeamFormInput>;
  onClose: () => void;
  onSubmit: (values: TeamFormOutput) => void;
  loading?: boolean;
};

const TeamModal: FC<TeamModalProps> = ({
  open,
  mode,
  initialValues,
  onClose,
  onSubmit,
  loading,
}) => {
  const title = mode === 'create' ? 'Créer une équipe' : 'Modifier l’équipe';
  const cta = mode === 'create' ? 'Créer' : 'Enregistrer';

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
        <TeamForm defaultValues={initialValues} onSubmit={onSubmit} disabled={loading} />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleProtectedClose} color="inherit" disabled={loading}>
          Annuler
        </Button>
        <Button type="submit" form="team-form" variant="contained" disabled={loading}>
          {cta}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TeamModal;
