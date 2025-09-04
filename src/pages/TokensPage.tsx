import { Add as AddIcon } from '@mui/icons-material';
import { Alert, Box, Stack, Typography } from '@mui/material';
import { FC, useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import ProjectTokenCard from '../components/cards/ProjectTokenCard';
import { ProjectTokenFormOutput } from '../components/forms/ProjectTokenForm';
import ConfirmationModal from '../components/modals/ConfirmationModal';
import ProjectTokenModal from '../components/modals/ProjectTokenModal';
import { useAuth } from '../components/providers/useAuth';
import { useToast } from '../components/providers/useToast';
import { sampleProjects, sampleProjectTokens } from '../sampleData';
import { ProjectToken } from '../types/buisness';

function generateTokenValue(length = 48) {
  const arr = new Uint8Array(length);
  crypto.getRandomValues(arr);
  return Array.from(arr, (b) => ('0' + (b & 0xff).toString(16)).slice(-2)).join('');
}

export const ProjectTokensPage: FC = () => {
  const { isAdmin, user } = useAuth();
  const { showToast } = useToast();

  const [tokens, setTokens] = useState<ProjectToken[]>(sampleProjectTokens ?? []);

  // Create modal
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Edit modal
  const [editToken, setEditToken] = useState<ProjectToken | null>(null);

  // Delete confirm
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [tokenToDelete, setTokenToDelete] = useState<ProjectToken | null>(null);

  // CREATE
  const openCreate = () => setIsCreateOpen(true);
  const closeCreate = () => setIsCreateOpen(false);

  const handleCreateSubmit = (values: { projectId: string } & ProjectTokenFormOutput) => {
    const newToken: ProjectToken = {
      value: generateTokenValue(48), // backend should generate & return once
      projectId: values.projectId,
      canRead: true, // always true
      canWrite: values.canWrite,
      createdAt: new Date(),
      createdBy: user?.id ?? '1',
    };

    setTokens((prev) => [newToken, ...prev]);
    closeCreate();
    showToast({ message: 'Token created successfully.', severity: 'success' });
  };

  // EDIT
  const openEdit = (t: ProjectToken) => setEditToken(t);
  const closeEdit = () => setEditToken(null);

  const handleEditSubmit = (values: { projectId: string } & ProjectTokenFormOutput) => {
    if (!editToken) return;

    setTokens((prev) =>
      prev.map((t) =>
        t.value === editToken.value && t.createdAt === editToken.createdAt
          ? {
              ...t,
              projectId: values.projectId, // allow moving token to another project if desired
              canWrite: values.canWrite,
              // canRead is always true; keep createdAt/value/createdBy unchanged
            }
          : t,
      ),
    );

    closeEdit();
    showToast({ message: 'Token updated successfully.', severity: 'success' });
  };

  // DELETE
  const handleAskDeleteToken = (token: ProjectToken) => {
    setTokenToDelete(token);
    setDeleteConfirmationOpen(true);
  };

  const confirmDeleteToken = () => {
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
          {tokens.map((t, idx) => (
            <ProjectTokenCard
              key={`${t.projectId}-${t.createdAt.toString()}-${idx}`}
              token={t}
              onEdit={isAdmin ? openEdit : undefined} // <-- enable edit
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
        mode="create"
        projects={sampleProjects}
        initialValues={{}}
        onClose={closeCreate}
        onSubmit={handleCreateSubmit}
      />

      {/* Edit modal */}
      {editToken && (
        <ProjectTokenModal
          open={!!editToken}
          mode="edit"
          projects={sampleProjects}
          initialValues={{
            projectId: editToken.projectId,
            canRead: true, // fixed
            canWrite: editToken.canWrite,
          }}
          onClose={closeEdit}
          onSubmit={handleEditSubmit}
        />
      )}

      <ConfirmationModal
        open={deleteConfirmationOpen}
        title="Delete token"
        message={
          tokenToDelete
            ? `Are you sure you want to delete this token for project "${
                sampleProjects.find((p) => p.id === tokenToDelete.projectId)?.name ??
                tokenToDelete.projectId
              }"? This action is irreversible.`
            : 'Are you sure you want to delete this token? This action is irreversible.'
        }
        confirmLabel="Delete"
        confirmColor="error"
        onConfirm={confirmDeleteToken}
        onCancel={cancelDeleteToken}
      />
    </Box>
  );
};

export default ProjectTokensPage;
