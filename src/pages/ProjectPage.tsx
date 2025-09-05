import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {
  Alert,
  Box,
  CircularProgress,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ProjectService } from '../api/projectService';
import { StateService } from '../api/stateService';
import { TeamService } from '../api/teamService';
import { UserService } from '../api/userService';
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
// Sample data fallbacks (commented out):
// import {
//   sampleProjects,
//   sampleStateFileInfos,
//   sampleStateFilesTerraform,
//   sampleTeams,
//   sampleUsers,
// } from '../sampleData';
import { sampleStateFileInfos, sampleStateFilesTerraform } from '../sampleData'; // Temporary for state files
import { Project, StateFileInfos, StateFileSnapshot, Team, User } from '../types/buisness';
import { getErrorMessage, logError } from '../utils/simpleErrorHandler';

const ProjectPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const { isAdmin, user: currentUser } = useAuth();
  const { showToast } = useToast();

  const [project, setProject] = useState<Project | undefined>();
  const [teams, setTeams] = useState<Team[]>([]);
  const [allTeams, setAllTeams] = useState<Team[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

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

  // For now, using sample state files until StateService is properly implemented
  const [stateData, setStateData] = useState<{
    currentState: StateFileSnapshot | undefined;
    previousStates: StateFileSnapshot[];
  }>({ currentState: undefined, previousStates: [] });

  // Sample data implementation (commented out):
  // const initialProject: Project | undefined = useMemo(
  //   () => sampleProjects.find((p) => p.id === id),
  //   [id],
  // );
  // const [project, setProject] = useState<Project | undefined>(initialProject);
  // const teams = useMemo<Team[]>(
  //   () => (project ? sampleTeams.filter((t) => project.teamIds.includes(t.id)) : []),
  //   [project],
  // );
  // const { currentState, previousStates } = useMemo(() => {
  //   if (!project) return { currentState: undefined, previousStates: [] as StateFileSnapshot[] };
  //   const states = sampleStateFilesTerraform
  //     .filter((s) => s.projectId === project.id)
  //     .sort((a, b) => b.version - a.version);
  //   const [current, ...previous] = states;
  //   return { currentState: current, previousStates: previous };
  // }, [project]);

  const loadProjectData = async () => {
    if (!id) return;

    setLoading(true);
    try {
      const [projectData, allTeamsData, usersData] = await Promise.all([
        ProjectService.getProject(id),
        TeamService.getTeams(),
        UserService.getUsers(),
      ]);

      setProject(projectData);
      setAllTeams(allTeamsData);
      setUsers(usersData);

      const projectTeams = allTeamsData.filter((team) => projectData.teamIds.includes(team.id));
      setTeams(projectTeams);

      // Load state files (using sample data for now)
      const states = sampleStateFilesTerraform
        .filter((s) => s.projectId === id)
        .sort((a, b) => b.version - a.version);

      setStateData({
        currentState: states[0],
        previousStates: states.slice(1),
      });

      // Sample data fallback implementation (commented out):
      // const initialProject = sampleProjects.find((p) => p.id === id);
      // setProject(initialProject);
      // setTeams(sampleTeams.filter((t) => initialProject?.teamIds.includes(t.id) || false));
      // setAllTeams(sampleTeams);
      // setUsers(sampleUsers);
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      showToast({ message: `Error loading project: ${errorMessage}`, severity: 'error' });
      logError('loadProjectData', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjectData();
  }, [id]);

  const currentStateCreatedByUser = users.find((u) => stateData.currentState?.createdBy === u.id);

  const stateFileInfos: StateFileInfos = sampleStateFileInfos[0];

  const locked = stateFileInfos.status === 'locked';

  const stateFileLockedByUser = stateFileInfos
    ? users.find((u) => stateFileInfos.lockedBy === u.id)
    : undefined;

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

  const handleSaveTeams = async (selectedTeamIds: string[]) => {
    if (!project) return;

    try {
      await ProjectService.updateProject(project.id, { teamIds: selectedTeamIds });

      setProject((prev) => (prev ? { ...prev, teamIds: selectedTeamIds } : prev));

      const updatedTeams = allTeams.filter((team) => selectedTeamIds.includes(team.id));
      setTeams(updatedTeams);

      showToast({ message: 'Project teams updated successfully', severity: 'success' });
      closeTeamsModal();

      // Sample data fallback implementation (commented out):
      // setProject((prev) => (prev ? { ...prev, teamIds: selectedTeamIds } : prev));
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      showToast({ message: `Error updating teams: ${errorMessage}`, severity: 'error' });
      logError('handleSaveTeams', err);
    }
  };

  const handleRemoveTeam = (team: Team) => {
    setTeamToRemove(team);
    setRemoveTeamConfirmationOpen(true);
  };

  const handleSaveProject = async (values: ProjectFormOutput) => {
    if (!project) return;

    try {
      await ProjectService.updateProject(project.id, {
        name: values.name,
        description: values.description,
      });

      setProject((prev) =>
        prev ? { ...prev, name: values.name, description: values.description } : prev,
      );
      showToast({ message: 'Project updated successfully', severity: 'success' });
      closeProjectEditModal();

      // Sample data fallback implementation (commented out):
      // setProject((prev) => {
      //   if (!prev) return prev;
      //   return { ...prev, name: values.name, description: values.description };
      // });
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      showToast({ message: `Error updating project: ${errorMessage}`, severity: 'error' });
      logError('handleSaveProject', err);
    }
  };

  const handleLockOrUnlock = async () => {
    if (!project) return;

    const stateName = 'main'; // Default state name

    const lockInfo = {
      ID: `lock-${Date.now()}`,
      user: currentUser?.username || 'unknown-user',
      timestamp: new Date().toISOString(),
    };

    try {
      if (locked) {
        // Unlock state
        await StateService.unlockState(project.id, stateName, lockInfo);
        showToast({ message: 'State unlocked successfully', severity: 'success' });
      } else {
        // Lock state
        await StateService.lockState(project.id, stateName, lockInfo);
        showToast({ message: 'State locked successfully', severity: 'success' });
      }
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      const action = locked ? 'unlock' : 'lock';
      showToast({ message: `Error ${action}ing state: ${errorMessage}`, severity: 'error' });
      logError(`handleLockOrUnlock-${action}`, err);
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

  const confirmDeleteStateFile = async () => {
    if (!stateFileToDelete) return;

    try {
      // TODO: Implement StateService.deleteSnapshot when available
      // await StateService.deleteState(project?.id, 'main', stateFileToDelete.version);
      showToast({
        message: `Version ${stateFileToDelete.version} deleted successfully`,
        severity: 'success',
      });

      setStateData((prev) => ({
        currentState:
          prev.currentState?.id === stateFileToDelete.id
            ? prev.previousStates[0]
            : prev.currentState,
        previousStates: prev.previousStates.filter((s) => s.id !== stateFileToDelete.id),
      }));
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      showToast({ message: `Error deleting state file: ${errorMessage}`, severity: 'error' });
      logError('confirmDeleteStateFile', err);
    } finally {
      setDeleteConfirmationOpen(false);
      setStateFileToDelete(null);
    }
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

  const confirmRemoveTeam = async () => {
    if (!teamToRemove || !project) return;

    try {
      const updatedTeamIds = project.teamIds.filter((id) => id !== teamToRemove.id);
      await ProjectService.updateProject(project.id, { teamIds: updatedTeamIds });

      setProject((prev) => (prev ? { ...prev, teamIds: updatedTeamIds } : prev));
      setTeams((prev) => prev.filter((t) => t.id !== teamToRemove.id));

      showToast({ message: 'Team removed from project successfully', severity: 'success' });

      // Sample data fallback implementation (commented out):
      // setProject((prev) => {
      //   if (!prev) return prev;
      //   if (!prev.teamIds.includes(teamToRemove.id)) return prev;
      //   return { ...prev, teamIds: prev.teamIds.filter((id) => id !== teamToRemove.id) };
      // });
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      showToast({ message: `Error removing team: ${errorMessage}`, severity: 'error' });
      logError('confirmRemoveTeam', err);
    } finally {
      setRemoveTeamConfirmationOpen(false);
      setTeamToRemove(null);
    }
  };

  const cancelRemoveTeam = () => {
    setTeamToRemove(null);
    setRemoveTeamConfirmationOpen(false);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (!project) {
    return <Alert severity="error">No project found with the id: "{id}".</Alert>;
  }

  console.log('TEST', project);

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
                <Typography>Teams</Typography>
                {isAdmin && (
                  <IconButton
                    color="primary"
                    onClick={openTeamsModal}
                    title="Edit the team"
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
                <Alert severity="info">No team</Alert>
              )}
            </Stack>

            <Stack spacing={1} sx={{ flex: 1 }}>
              <Typography>Activities</Typography>
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
              <Typography>Previous versions</Typography>
              <Stack spacing={1} sx={{ maxHeight: '60vh' }}>
                {stateData.previousStates.length > 0 ? (
                  stateData.previousStates.map((s) => (
                    <StateFileCard
                      stateFile={s}
                      onCompare={handleOpenCompare}
                      onRestore={handleRestoreStateFileSnapshot}
                      onView={handleOpenViewer}
                      onDelete={handleDeleteStateFileSnapshot}
                    />
                  ))
                ) : (
                  <Alert severity="info">No previous version</Alert>
                )}
              </Stack>
            </Stack>

            <Stack spacing={1} sx={{ flex: 1 }}>
              <Typography>State File Terraform</Typography>

              {stateData.currentState ? (
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
                        Actual • v{stateData.currentState.version} •{' '}
                        {new Date(stateData.currentState.createdAt).toLocaleString()} • by{' '}
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
                          onClick={() => handleOpenViewer(stateData.currentState!)}
                          sx={{ p: 0 }}
                        >
                          <Tooltip title="Open">
                            <VisibilityIcon fontSize="small" />
                          </Tooltip>
                        </IconButton>

                        {isAdmin && (
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteStateFileSnapshot(stateData.currentState!)}
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

                    <JsonViewer value={stateData.currentState.content} />
                  </Stack>
                </Stack>
              ) : (
                <Alert severity="info">No state file</Alert>
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

      {stateData.currentState && (
        <StateFileCompareModal
          open={compareModalOpen}
          onClose={handleCloseCompare}
          current={stateData.currentState}
          previousSnapshots={stateData.previousStates}
          initialCompareId={selectedSnapshot?.id}
        />
      )}

      <TeamsPickerModal
        open={teamsModalOpen}
        teams={allTeams}
        selectedTeamIds={project.teamIds || []}
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
