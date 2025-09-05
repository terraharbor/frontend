import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { FC } from 'react';
import { Project } from '../../types/buisness';
import ProjectTokenForm, {
  ProjectTokenFormInput,
  ProjectTokenFormOutput,
} from '../forms/ProjectTokenForm';

type ProjectTokenModalProps = {
  open: boolean;
  projects: Project[];
  initialValues?: Partial<ProjectTokenFormInput>;
  onClose: () => void;
  onSubmit: (values: ProjectTokenFormOutput) => void;
  loading?: boolean;
};

const ProjectTokenModal: FC<ProjectTokenModalProps> = ({
  open,
  projects,
  initialValues,
  onClose,
  onSubmit,
  loading = false,
}) => {
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
      <DialogTitle>Create a project token</DialogTitle>
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
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProjectTokenModal;
