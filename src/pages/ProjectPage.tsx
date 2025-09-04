import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Alert, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import { FC, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import StateFileCard from '../components/cards/StateFileCard';
import TeamCard from '../components/cards/TeamCard';
import { ProjectFormOutput } from '../components/forms/ProjectForm';
import JsonViewer from '../components/JsonViewer';
import ConfirmationModal from '../components/modals/ConfirmationModal';
import ProjectModal from '../components/modals/ProjectModal';
import StateFileCompareModal from '../components/modals/StateFileCompareModal';
import StateFileViewerModal from '../components/modals/StateFileViewerModal';
import TeamsPickerModal from '../components/modals/TeamsPickerModal';
import PageHeader from '../components/PageHeader';
import { useAuth } from '../components/providers/useAuth';
import { useToast } from '../components/providers/useToast';
import {
  sampleProjects,
  sampleStateFileInfos,
  sampleStateFilesTerraform,
  sampleTeams,
  sampleUsers,
} from '../sampleData';
import { Project, StateFileInfos, StateFileSnapshot, Team } from '../types/buisness';

const ProjectPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const { isAdmin } = useAuth();
  const { showToast } = useToast();
  const [teamToRemove, setTeamToRemove] = useState<Team | null>(null);
  const [viewerModalOpen, setViewerModalOpen] = useState(false);
  const [compareModalOpen, setCompareModalOpen] = useState(false);
  const [teamsModalOpen, setTeamsModalOpen] = useState(false);
  const [projectEditModalOpen, setProjectEditModalOpen] = useState(false);
  const [selectedSnapshot, setSelectedSnapshot] = useState<StateFileSnapshot | null>(null);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [restoreConfirmationOpen, setRestoreConfirmationOpen] = useState(false);
  const [removeTeamConfirmationOpen, setRemoveTeamConfirmationOpen] = useState(false);
  const [stateFileToDelete, setStateFileToDelete] = useState<StateFileSnapshot | null>(null);
  const [stateFileToRestore, setStateFileToRestore] = useState<StateFileSnapshot | null>(null);

  const initialProject: Project | undefined = useMemo(
    () => sampleProjects.find((p) => p.id === id),
    [id],
  );
  const [project, setProject] = useState<Project | undefined>(initialProject);

  const teams = useMemo<Team[]>(
    () => (project ? sampleTeams.filter((t) => project.teamIds.includes(t.id)) : []),
    [project],
  );

  const { currentState, previousStates } = useMemo(() => {
    if (!project) return { currentState: undefined, previousStates: [] as StateFileSnapshot[] };

    const states = sampleStateFilesTerraform
      .filter((s) => s.projectId === project.id)
      .sort((a, b) => b.version - a.version);

    const [current, ...previous] = states;
    return { currentState: current, previousStates: previous };
  }, [project]);

  const currentStateCreatedByUser = useMemo(
    () => (currentState ? sampleUsers.find((u) => currentState?.createdBy === u.id) : undefined),
    [currentState],
  );

  const stateFileInfos: StateFileInfos = sampleStateFileInfos[0];

  const locked = stateFileInfos.status === 'locked';

  const stateFileLockedByUser = useMemo(
    () => (stateFileInfos ? sampleUsers.find((u) => stateFileInfos.lockedBy === u.id) : undefined),
    [stateFileInfos],
  );

  const handleOpenViewer = (s: StateFileSnapshot) => {
    setSelectedSnapshot(s);
    setViewerModalOpen(true);
  };

  const handleCloseViewer = () => {
    setSelectedSnapshot(null);
    setViewerModalOpen(false);
  };

  const handleOpenCompare = (s: StateFileSnapshot) => {
    setSelectedSnapshot(s);
    setCompareModalOpen(true);
  };

  const handleCloseCompare = () => {
    setCompareModalOpen(false);
    setSelectedSnapshot(null);
  };

  const openTeamsModal = () => setTeamsModalOpen(true);
  const closeTeamsModal = () => setTeamsModalOpen(false);

  const openProjectEditModal = () => setProjectEditModalOpen(true);
  const closeProjectEditModal = () => setProjectEditModalOpen(false);

  const handleSaveTeams = (selectedTeamIds: string[]) => {
    setProject((prev) => (prev ? { ...prev, teamIds: selectedTeamIds } : prev));
    showToast({ message: 'Équipes mises à jour.', severity: 'success' });
    closeTeamsModal();
  };

  const handleRemoveTeam = (team: Team) => {
    setTeamToRemove(team);
    setRemoveTeamConfirmationOpen(true);
  };

  const handleSaveProject = (values: ProjectFormOutput) => {
    setProject((prev) => {
      if (!prev) return prev;
      return { ...prev, name: values.name, description: values.description };
    });
    showToast({ message: 'Project updated successfully.', severity: 'success' });
    closeProjectEditModal();
  };

  const handleLockOrUnlock = () => {
    if (locked) {
      // Unlock -> TODO API call
    } else {
      // Lock -> TODO API call
    }
  };

  const handleDeleteStateFileSnapshot = (stateFileSnapshot: StateFileSnapshot) => {
    setStateFileToDelete(stateFileSnapshot);
    setDeleteConfirmationOpen(true);
  };

  const handleRestoreStateFileSnapshot = (stateFileSnapshot: StateFileSnapshot) => {
    setStateFileToRestore(stateFileSnapshot);
    setRestoreConfirmationOpen(true);
  };

  const confirmDeleteStateFile = () => {
    if (stateFileToDelete) {
      console.log('Delete v' + stateFileToDelete.version);
      // TODO: Call API
      showToast({
        message: `Version ${stateFileToDelete.version} deleted successfully.`,
        severity: 'success',
      });
      setStateFileToDelete(null);
    }
    setDeleteConfirmationOpen(false);
  };

  const confirmRestoreStateFile = () => {
    if (stateFileToRestore) {
      console.log('Restore v' + stateFileToRestore.version);
      // TODO: Call API
      showToast({
        message: `Version ${stateFileToRestore.version} restored successfully.`,
        severity: 'success',
      });
      setStateFileToRestore(null);
    }
    setRestoreConfirmationOpen(false);
  };

  const cancelDeleteStateFile = () => {
    setStateFileToDelete(null);
    setDeleteConfirmationOpen(false);
  };

  const cancelRestoreStateFile = () => {
    setStateFileToRestore(null);
    setRestoreConfirmationOpen(false);
  };

  const confirmRemoveTeam = () => {
    if (teamToRemove) {
      setProject((prev) => {
        if (!prev) return prev;
        if (!prev.teamIds.includes(teamToRemove.id)) return prev;
        return { ...prev, teamIds: prev.teamIds.filter((id) => id !== teamToRemove.id) };
      });
      showToast({ message: 'Team removed successfully.', severity: 'success' });
      setTeamToRemove(null);
    }
    setRemoveTeamConfirmationOpen(false);
  };

  const cancelRemoveTeam = () => {
    setTeamToRemove(null);
    setRemoveTeamConfirmationOpen(false);
  };

  if (!project) {
    return (
      <Stack spacing={2}>
        <PageHeader title="Projet introuvable" />
        <Alert severity="error">Impossible de trouver un projet avec l'id "{id}".</Alert>
      </Stack>
    );
  }

  return (
    <>
      <Stack spacing={4}>
        <PageHeader
          title={project.name}
          action={
            isAdmin
              ? {
                  label: 'Edit',
                  startIcon: <EditIcon />,
                  onClick: openProjectEditModal,
                }
              : undefined
          }
        />

        {project.description && <Typography variant="body2">{project.description}</Typography>}

        <Stack spacing={4}>
          <Stack direction="row" spacing={2}>
            <Stack spacing={1} sx={{ flex: 1 }}>
              <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography>Equipes</Typography>
                {isAdmin && (
                  <IconButton
                    color="primary"
                    onClick={openTeamsModal}
                    title="Ajouter une équipe"
                    sx={{ p: 0 }}
                  >
                    <EditIcon />
                  </IconButton>
                )}
              </Stack>

              {teams && teams.length > 0 ? (
                <Stack spacing={1}>
                  {...teams.map((team) => (
                    <TeamCard
                      key={team.id}
                      team={team}
                      onDelete={handleRemoveTeam}
                      displayActions
                    />
                  ))}
                </Stack>
              ) : (
                <Alert severity="info">Aucune équipe</Alert>
              )}
            </Stack>

            <Stack spacing={1} sx={{ flex: 1 }}>
              <Typography>Activités</Typography>
              <Stack
                height="100%"
                sx={{
                  bgcolor: 'neutral.white',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 2,
                }}
              >
                A compléter
              </Stack>
            </Stack>
          </Stack>

          <Stack direction="row" spacing={2}>
            <Stack spacing={1} sx={{ flex: 1 }}>
              <Typography>Versions précédentes</Typography>
              <Stack spacing={1} sx={{ maxHeight: '60vh' }}>
                {previousStates.length > 0 ? (
                  previousStates.map((s) => (
                    <StateFileCard
                      stateFile={s}
                      onCompare={handleOpenCompare}
                      onRestore={handleRestoreStateFileSnapshot}
                      onView={handleOpenViewer}
                      onDelete={handleDeleteStateFileSnapshot}
                    />
                  ))
                ) : (
                  <Alert severity="info">Aucune version précédente</Alert>
                )}
              </Stack>
            </Stack>

            <Stack spacing={1} sx={{ flex: 1 }}>
              <Typography>State File Terraform</Typography>

              {currentState ? (
                <Stack
                  sx={{
                    bgcolor: 'neutral.white',
                    borderRadius: 2,
                    p: 2,
                    overflow: 'auto',
                  }}
                >
                  <Stack spacing={2}>
                    <Stack
                      direction="row"
                      sx={{ justifyContent: 'space-between', alignItems: 'center' }}
                    >
                      <Typography variant="caption" color="text.secondary">
                        Actuel • v{currentState.version} •{' '}
                        {new Date(currentState.createdAt).toLocaleString()} • par{' '}
                        {currentStateCreatedByUser && currentStateCreatedByUser.username}
                      </Typography>

                      <Stack direction="row" spacing={1}>
                        <IconButton size="small" onClick={handleLockOrUnlock} sx={{ p: 0 }}>
                          <Tooltip title={locked ? 'Unlock' : 'Lock'}>
                            {locked ? (
                              <LockOpenIcon fontSize="small" />
                            ) : (
                              <LockIcon fontSize="small" />
                            )}
                          </Tooltip>
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleOpenViewer(currentState)}
                          sx={{ p: 0 }}
                        >
                          <Tooltip title="Open">
                            <VisibilityIcon fontSize="small" />
                          </Tooltip>
                        </IconButton>

                        {isAdmin && (
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteStateFileSnapshot(currentState)}
                            sx={{ p: 0 }}
                          >
                            <Tooltip title="Delete">
                              <DeleteIcon fontSize="small" color="error" />
                            </Tooltip>
                          </IconButton>
                        )}
                      </Stack>
                    </Stack>

                    {locked && (
                      <Stack
                        direction="row"
                        sx={{
                          border: '1px solid',
                          borderColor: 'divider',
                          borderRadius: 1.5,
                          alignItems: 'center',
                          px: 1,
                          py: 0.5,
                        }}
                      >
                        <LockIcon color="error" />
                        <Typography
                          variant="caption"
                          sx={{ ml: 2 }}
                        >{`Locked by ${stateFileLockedByUser?.username} the ${new Date(stateFileInfos.lockedAt!).toLocaleString()}`}</Typography>
                      </Stack>
                    )}

                    <JsonViewer value={currentState.content} />
                  </Stack>
                </Stack>
              ) : (
                <Alert severity="info">Aucun state file pour ce projet.</Alert>
              )}
            </Stack>
          </Stack>
        </Stack>
      </Stack>

      <StateFileViewerModal
        open={viewerModalOpen}
        onClose={handleCloseViewer}
        snapshot={selectedSnapshot}
      />

      {currentState && (
        <StateFileCompareModal
          open={compareModalOpen}
          onClose={handleCloseCompare}
          current={currentState}
          previousSnapshots={previousStates}
          initialCompareId={selectedSnapshot?.id}
        />
      )}

      <TeamsPickerModal
        open={teamsModalOpen}
        teams={sampleTeams}
        selectedTeamIds={project.teamIds}
        onClose={() => setTeamsModalOpen(false)}
        onSubmit={handleSaveTeams}
      />

      <ProjectModal
        open={projectEditModalOpen}
        mode="edit"
        initialValues={{ name: project.name, description: project.description }}
        onClose={closeProjectEditModal}
        onSubmit={handleSaveProject}
      />

      <ConfirmationModal
        open={deleteConfirmationOpen}
        title="Delete Version"
        message={
          stateFileToDelete
            ? `Are you sure you want to delete version ${stateFileToDelete.version}? This action is irreversible.`
            : 'Are you sure you want to delete this version? This action is irreversible.'
        }
        confirmLabel="Delete"
        confirmColor="error"
        onConfirm={confirmDeleteStateFile}
        onCancel={cancelDeleteStateFile}
      />

      <ConfirmationModal
        open={restoreConfirmationOpen}
        title="Restore Version"
        message={
          stateFileToRestore
            ? `Are you sure you want to restore version ${stateFileToRestore.version}? This will replace the current version.`
            : 'Are you sure you want to restore this version? This will replace the current version.'
        }
        confirmLabel="Restore"
        confirmColor="warning"
        onConfirm={confirmRestoreStateFile}
        onCancel={cancelRestoreStateFile}
      />

      <ConfirmationModal
        open={removeTeamConfirmationOpen}
        title="Remove Team"
        message="Are you sure you want to remove this team from the project?"
        confirmLabel="Remove"
        confirmColor="error"
        onConfirm={confirmRemoveTeam}
        onCancel={cancelRemoveTeam}
      />
    </>
  );
};

export default ProjectPage;
