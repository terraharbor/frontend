import { Add as AddIcon } from '@mui/icons-material';
import { Alert, Box, Stack, Typography } from '@mui/material';
import { FC, useEffect, useState } from 'react';
import { ProjectService } from '../api/projectService';
import { TokenService } from '../api/tokenService';
import { PageHeader } from '../components/PageHeader';
import ProjectTokenCard from '../components/cards/ProjectTokenCard';
import { ProjectTokenFormOutput } from '../components/forms/ProjectTokenForm';
import ConfirmationModal from '../components/modals/ConfirmationModal';
import ProjectTokenModal from '../components/modals/ProjectTokenModal';
import { useAuth } from '../components/providers/useAuth';
import { useToast } from '../components/providers/useToast';
import { Project, ProjectToken } from '../types/buisness';
import { getErrorMessage, logError } from '../utils/simpleErrorHandler';

/*
function generateTokenValue(length = 48) {
  const arr = new Uint8Array(length);
  crypto.getRandomValues(arr);
  return Array.from(arr, (b) => ('0' + (b & 0xff).toString(16)).slice(-2)).join('');
}
  */

export const ProjectTokensPage: FC = () => {
  const { isAdmin } = useAuth();
  const { showToast } = useToast();
  const [tokens, setTokens] = useState<ProjectToken[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadTokens = async () => {
    setLoading(true);
    try {
      const tokensData = await TokenService.getProjectTokens();
      const projectsData = await ProjectService.getProjects();

      setTokens(tokensData);
      setProjects(projectsData);
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      showToast({ message: `Error loading tokens: ${errorMessage}`, severity: 'error' });
      logError('loadTokens', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTokens();
  }, []);

  // Create modal
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Delete confirm
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [tokenToDelete, setTokenToDelete] = useState<ProjectToken | null>(null);

  // CREATE
  const openCreate = () => setIsCreateOpen(true);
  const closeCreate = () => setIsCreateOpen(false);

  const handleCreateSubmit = async (values: ProjectTokenFormOutput) => {
    console.log('Submit');
    setIsSubmitting(true);
    try {
      await TokenService.createProjectToken({
        project_id: values.projectId,
      });
      showToast({ message: 'Token created successfully', severity: 'success' });
      await loadTokens(); // Reload data from API
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      showToast({ message: `Error creating token: ${errorMessage}`, severity: 'error' });
      logError('createToken', err);
    } finally {
      setIsSubmitting(false);
      closeCreate();
    }

    /*
    const newToken: ProjectToken = {
      value: generateTokenValue(48), // backend should generate & return once
      projectId: values.projectId,
      canRead: true, // always true
      canWrite: values.canWrite,
      createdAt: new Date(),
      createdBy: user?.id ?? '1',
    };

    setTokens((prev) => [newToken, ...prev]);
    */
  };

  // DELETE
  const handleAskDeleteToken = (token: ProjectToken) => {
    setTokenToDelete(token);
    setDeleteConfirmationOpen(true);
  };

  const confirmDeleteToken = async () => {
    if (!tokenToDelete) return;

    try {
      await TokenService.deleteProjectToken(tokenToDelete.token);
      showToast({ message: 'Token deleted successfully', severity: 'success' });
      await loadTokens(); // Reload data from API
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      showToast({ message: `Error deleting token: ${errorMessage}`, severity: 'error' });
      logError('deleteToken', err);
    } finally {
      setDeleteConfirmationOpen(false);
      setTokenToDelete(null);
    }
    /*
    if (tokenToDelete) {
      setTokens((prev) =>
        prev.filter(
          (t) => !(t.projectId === tokenToDelete.projectId && t.value === tokenToDelete.value),
        ),
      );
      showToast({ message: 'Token deleted successfully.', severity: 'success' });
      setTokenToDelete(null);
    }
    setDeleteConfirmationOpen(false);
    */
  };

  const cancelDeleteToken = () => {
    setTokenToDelete(null);
    setDeleteConfirmationOpen(false);
  };

  if (!isAdmin) return <Alert severity="error">You are not allowed to access this page</Alert>;

  return (
    <Box>
      <PageHeader
        title="Project Tokens"
        action={
          isAdmin
            ? {
                label: 'New',
                onClick: openCreate,
                startIcon: <AddIcon />,
                variant: 'contained',
                color: 'primary',
              }
            : undefined
        }
      />

      {tokens.length > 0 ? (
        <Stack spacing={1}>
          {tokens.map((t) => (
            <ProjectTokenCard
              key={t.token}
              token={t}
              onDelete={isAdmin ? handleAskDeleteToken : undefined}
            />
          ))}
        </Stack>
      ) : (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="200px"
          sx={{ mt: 4 }}
        >
          <Typography variant="h6" color="text.secondary" textAlign="center">
            No token
          </Typography>
        </Box>
      )}

      {/* Create modal */}
      <ProjectTokenModal
        open={isCreateOpen}
        projects={projects}
        initialValues={{}}
        onClose={closeCreate}
        onSubmit={handleCreateSubmit}
      />

      <ConfirmationModal
        open={deleteConfirmationOpen}
        title="Delete token"
        message={'Are you sure you want to delete this token? This action is irreversible.'}
        confirmLabel="Delete"
        confirmColor="error"
        onConfirm={confirmDeleteToken}
        onCancel={cancelDeleteToken}
      />
    </Box>
  );
};

export default ProjectTokensPage;
