import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { FC } from 'react';
import { ModalMode } from '../../types';
import { Project } from '../../types/buisness';
import ProjectTokenForm, {
  ProjectTokenFormInput,
  ProjectTokenFormOutput,
} from '../forms/ProjectTokenForm';

type ProjectTokenModalProps = {
  open: boolean;
  mode: ModalMode;
  projects: Project[];
  initialValues?: Partial<ProjectTokenFormInput>;
  onClose: () => void;
  onSubmit: (values: ProjectTokenFormOutput) => void;
  loading?: boolean;
};

const ProjectTokenModal: FC<ProjectTokenModalProps> = ({
  open,
  mode,
  projects,
  initialValues,
  onClose,
  onSubmit,
  loading = false,
}) => {
  const title = mode === 'create' ? 'Create a project token' : 'Edit the project token';
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
        <ProjectTokenForm
          projects={projects}
          defaultValues={initialValues}
          onSubmit={onSubmit}
          disabled={loading}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleProtectedClose} color="inherit" disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" form="project-token-form" variant="contained" disabled={loading}>
          {cta}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProjectTokenModal;
