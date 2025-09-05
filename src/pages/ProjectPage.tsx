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
import { sampleStateFileInfos } from '../sampleData'; // Temporary for state files
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
  const [lockStatus, setLockStatus] = useState<{
    status: 'locked' | 'unlocked';
    locker?: string;
    timestamp?: string;
  }>({ status: 'unlocked' });

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

  const loadLockStatus = async (projectId: string) => {
    try {
      const status = await StateService.getStateStatus(projectId, 'main');
      setLockStatus(status);
      console.log('Lock status loaded:', status);
    } catch (error) {
      console.error('Failed to load lock status:', error);
      setLockStatus({ status: 'unlocked' });
    }
  };

  const loadRealStateFiles = async (projectId: string) => {
    try {
      console.log('Loading real state files for project:', projectId);

      // For now, assume all state files are named "main"
      const stateName = 'main';

      // Get all versions of the state file directly
      const versions = await StateService.getStates(projectId, stateName);
      console.log('State versions received:', versions);

      if (versions && Array.isArray(versions) && versions.length > 0) {
        // Convert to StateFileSnapshot format with safe null handling
        const snapshots: StateFileSnapshot[] = versions.map((version) => {
          // Handle null values safely
          const createdBy = version['created by'] || '-';
          const uploadDate = version['upload date'];

          // Safe date parsing
          let createdAt: Date;
          try {
            if (uploadDate && uploadDate !== null) {
              createdAt = new Date(uploadDate);
              // Check if date is valid
              if (isNaN(createdAt.getTime())) {
                createdAt = new Date();
              }
            } else {
              createdAt = new Date();
            }
          } catch (dateError) {
            console.warn('Error parsing date:', dateError);
            createdAt = new Date();
          }

          return {
            id: `${projectId}-${stateName}-${version.version}`,
            projectId: projectId,
            version: parseInt(version.version) || 1,
            content: '', // Will be loaded when needed
            createdAt: createdAt,
            createdBy: createdBy,
          };
        });

        // Sort by version descending (latest first)
        snapshots.sort((a, b) => b.version - a.version);

        console.log('Created snapshots:', snapshots);

                 // Load content for ALL versions immediately (current + previous)
         const snapshotsWithContent = await Promise.all(
           snapshots.map(async (snapshot) => {
             try {
               const content = await loadStateContent(snapshot);
               return { ...snapshot, content };
             } catch (error) {
               console.error(`Failed to load content for version ${snapshot.version}:`, error);
               return snapshot; // Return without content if failed
             }
           })
         );

         console.log('All version content loaded on initial load');

         setStateData({
           currentState: snapshotsWithContent[0],
           previousStates: snapshotsWithContent.slice(1),
         });
      } else {
        console.log('No versions found or invalid response');
        // No versions found
        setStateData({
          currentState: undefined,
          previousStates: [],
        });
      }
    } catch (error) {
      console.error('Failed to load state files:', error);
      // Fallback to empty state
      setStateData({
        currentState: undefined,
        previousStates: [],
      });
    }
  };

  const loadProjectData = async () => {
    if (!id) return;

    console.log('Starting to load project data for ID:', id);
    setLoading(true);
    try {
      console.log('Fetching project, teams, and users data...');
      const [projectData, allTeamsData, usersData] = await Promise.all([
        ProjectService.getProject(id),
        TeamService.getTeams(),
        UserService.getUsers(),
      ]);

      console.log('Project data received:', projectData);
      console.log('Teams data received:', allTeamsData);
      console.log('Users data received:', usersData);

      // Handle case where backend returns array instead of single object
      const project = Array.isArray(projectData) ? projectData[0] : projectData;
      console.log('Processed project:', project);
      console.log('Project name:', project?.name);
      console.log('Project teamIds:', project?.teamIds);

      setProject(project);
      setAllTeams(allTeamsData);
      setUsers(usersData);

      const projectTeams = allTeamsData.filter(
        (team) =>
          project?.teamIds && Array.isArray(project.teamIds) && project.teamIds.includes(team.id),
      );
      setTeams(projectTeams);

      console.log('About to load real state files...');
      // Load real state files from backend - don't let this break the page
      try {
        await loadRealStateFiles(id);
        console.log('State files loaded successfully');
      } catch (stateError) {
        console.error('Failed to load state files, continuing without them:', stateError);
        // Set empty state so page still loads
        setStateData({
          currentState: undefined,
          previousStates: [],
        });
      }

      // Load lock status
      await loadLockStatus(id);

      // Sample data fallback implementation (commented out):
      // const initialProject = sampleProjects.find((p) => p.id === id);
      // setProject(initialProject);
      // setTeams(sampleTeams.filter((t) => initialProject?.teamIds.includes(t.id) || false));
      // setAllTeams(sampleTeams);
      // setUsers(sampleUsers);
    } catch (err) {
      console.error('Error in loadProjectData:', err);
      const errorMessage = getErrorMessage(err);
      showToast({ message: `Error loading project: ${errorMessage}`, severity: 'error' });
      logError('loadProjectData', err);
    } finally {
      console.log('loadProjectData finished, setting loading to false');
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjectData();
  }, [id]);

  const currentStateCreatedByUser = users.find((u) => stateData.currentState?.createdBy === u.id);

  // Using real lock status now instead of sample data
  const stateFileInfos: StateFileInfos = sampleStateFileInfos[0];

  const loadStateContent = async (snapshot: StateFileSnapshot): Promise<string> => {
    try {
      if (!id) return '{}';

      // Extract state name from snapshot id (format: projectId-stateName-version)
      const parts = snapshot.id.split('-');
      const stateName = parts.slice(1, -1).join('-'); // Handle state names with dashes

      const stateJson = await StateService.getStateAsJson(id, stateName, snapshot.version);
      return JSON.stringify(stateJson, null, 2);
    } catch (error) {
      console.error('Failed to load state content:', error);
      return JSON.stringify({ error: 'Failed to load state content' }, null, 2);
    }
  };

  const handleOpenViewer = async (s: StateFileSnapshot) => {
    // Load content if not already loaded
    if (!s.content) {
      const content = await loadStateContent(s);
      s.content = content;
    }
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

    await handleSaveProject({
      name: project.name,
      description: project.description,
      teamIds: selectedTeamIds,
    });

    closeTeamsModal();
    loadProjectData();
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
        teamIds: values.teamIds,
      });

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

  const locked = lockStatus.status === 'locked';

  const handleLockOrUnlock = async () => {
    await handleLockToggle();
  };

  const handleDeleteStateFileSnapshot = (stateFileSnapshot: StateFileSnapshot) => {
    setStateFileToDelete(stateFileSnapshot);
    setDeleteConfirmationOpen(true);
  };

  const handleRestoreStateFileSnapshot = (stateFileSnapshot: StateFileSnapshot) => {
    setStateFileToRestore(stateFileSnapshot);
    setRestoreConfirmationOpen(true);
  };

  const loadContentForAllVersions = async () => {
    if (!id) return;

    try {
      // Use the callback form of setState to get the current state
      setStateData((currentStateData) => {
        // Async function to load content for all versions
        const loadAllContent = async () => {
          try {
            let updatedCurrentState = currentStateData.currentState;
            
            // Load content for current state if not already loaded
            if (updatedCurrentState && !updatedCurrentState.content) {
              const content = await loadStateContent(updatedCurrentState);
              updatedCurrentState = { ...updatedCurrentState, content };
            }

            // Load content for all previous versions
            const updatedPreviousStates = await Promise.all(
              currentStateData.previousStates.map(async (state) => {
                if (!state.content) {
                  try {
                    const content = await loadStateContent(state);
                    return { ...state, content };
                  } catch (error) {
                    console.error(`Failed to load content for version ${state.version}:`, error);
                    return state; // Return without content if failed
                  }
                }
                return state;
              }),
            );

            // Update state with all loaded content
            setStateData({
              currentState: updatedCurrentState,
              previousStates: updatedPreviousStates,
            });

            console.log('All version content reloaded successfully');
          } catch (error) {
            console.error('Failed to reload content for all versions:', error);
          }
        };

        // Execute the async loading
        loadAllContent();
        
        // Return current state unchanged for now
        return currentStateData;
      });
    } catch (error) {
      console.error('Failed to reload content for all versions:', error);
    }
  };

  const confirmRestoreStateFileSnapshot = async () => {
    if (!stateFileToRestore || !id) return;

    try {
      // Load the content of the version we want to restore if not already loaded
      let contentToRestore = stateFileToRestore.content;
      if (!contentToRestore) {
        contentToRestore = await loadStateContent(stateFileToRestore);
      }

      // Parse the content to get the version number and increment it
      let stateJson;
      try {
        stateJson = JSON.parse(contentToRestore);
      } catch (error) {
        console.error('Failed to parse state content:', error);
        showToast({ message: 'Failed to parse state content', severity: 'error' });
        return;
      }

      // Create new version number (find the highest version and add 1)
      const allVersions = [stateData.currentState, ...stateData.previousStates]
        .filter((s) => s !== undefined)
        .map((s) => s!.version);
      const newVersion = Math.max(...allVersions, 0) + 1;

      // Update the version in the state content
      stateJson.version = newVersion;
      const updatedContent = JSON.stringify(stateJson, null, 2);

      // POST the restored content as a new version
      await StateService.putState(id, 'main', updatedContent);

      showToast({
        message: `Successfully restored version ${stateFileToRestore.version} as version ${newVersion}`,
        severity: 'success',
      });

      // Reload the state files to show the new version
      await loadRealStateFiles(id);
      
      // Load content for all versions (including the new restored version)
      await loadContentForAllVersions();
    } catch (error) {
      console.error('Failed to restore state version:', error);
      const errorMessage = getErrorMessage(error);
      showToast({ message: `Failed to restore version: ${errorMessage}`, severity: 'error' });
    } finally {
      setRestoreConfirmationOpen(false);
      setStateFileToRestore(null);
    }
  };

  const handleLockToggle = async () => {
    if (!id) return;

    try {
      if (lockStatus.status === 'locked') {
        // Unlock the state
        await StateService.unlockState(id, 'main', {});
        showToast({ message: 'State unlocked successfully', severity: 'success' });
      } else {
        // Lock the state
        await StateService.lockState(id, 'main', { ID: Date.now().toString() });
        showToast({ message: 'State locked successfully', severity: 'success' });
      }

      // Reload lock status
      await loadLockStatus(id);
    } catch (error) {
      console.error('Failed to toggle lock:', error);
      const errorMessage = getErrorMessage(error);
      showToast({
        message: `Failed to ${lockStatus.status === 'locked' ? 'unlock' : 'lock'} state: ${errorMessage}`,
        severity: 'error',
      });
    }
  };

  const confirmDeleteStateFile = async () => {
    if (!stateFileToDelete || !id) return;

    try {
      // Extract state name from snapshot id (format: projectId-stateName-version)
      const parts = stateFileToDelete.id.split('-');
      const stateName = parts.slice(1, -1).join('-'); // Handle state names with dashes

      // Delete the specific version using the backend API
      await StateService.deleteState(id, stateName, stateFileToDelete.version);

      showToast({
        message: `Version ${stateFileToDelete.version} deleted successfully`,
        severity: 'success',
      });

      // Reload the state files to refresh the UI after deletion
      await loadRealStateFiles(id);

      // Note: loadRealStateFiles already loads content for the current state
      // We don't need to call loadContentForAllVersions here as it would use stale data
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

  console.log(
    'ProjectPage render - loading:',
    loading,
    'project:',
    project,
    'stateData:',
    stateData,
  );

  if (loading) {
    console.log('Showing loading spinner');
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (!project) {
    console.log('No project found, showing error');
    return <Alert severity="error">No project found with the id: "{id}".</Alert>;
  }

  console.log('Rendering project page for:', project.name);

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
                  {...teams.map((team) => <TeamCard key={team.id} team={team} displayActions />)}
                </Stack>
              ) : (
                <Alert severity="info">No team</Alert>
              )}
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
                        >{`Locked by ${lockStatus.locker || 'unknown'} ${lockStatus.timestamp ? `at ${lockStatus.timestamp}` : ''}`}</Typography>
                      </Stack>
                    )}

                    <JsonViewer value={stateData.currentState.content || '{}'} />
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

      {stateData.currentState && compareModalOpen && (
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
            ? `Are you sure you want to restore version ${stateFileToRestore.version}? This will create a new version with the content from version ${stateFileToRestore.version}.`
            : 'Are you sure you want to restore this version? This will create a new version with the restored content.'
        }
        confirmLabel="Restore"
        confirmColor="warning"
        onConfirm={confirmRestoreStateFileSnapshot}
        onCancel={() => {
          setRestoreConfirmationOpen(false);
          setStateFileToRestore(null);
        }}
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
