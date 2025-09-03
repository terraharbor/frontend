import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { FC } from 'react';
import { ModalMode } from '../../types';
import { ProjectForm, ProjectFormInput, ProjectFormOutput } from '../forms/ProjectForm';

type ProjectModalProps = {
  open: boolean;
  mode: ModalMode;
  initialValues?: Partial<ProjectFormInput>;
  onClose: () => void;
  onSubmit: (values: ProjectFormOutput) => void;
  loading?: boolean;
};

const ProjectModal: FC<ProjectModalProps> = ({
  open,
  mode,
  initialValues,
  onClose,
  onSubmit,
  loading,
}) => {
  const title = mode === 'create' ? 'Create a project' : 'Edit the project';
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
        <ProjectForm defaultValues={initialValues} onSubmit={onSubmit} disabled={loading} />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleProtectedClose} color="inherit" disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" form="project-form" variant="contained" disabled={loading}>
          {cta}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProjectModal;
