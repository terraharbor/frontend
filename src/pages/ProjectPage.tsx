import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import { Alert, IconButton, Stack, Typography, Box, CircularProgress, Tooltip } from '@mui/material';
import { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import StateFileCard from '../components/cards/StateFileCard';
import TeamCard from '../components/cards/TeamCard';
import { ProjectFormOutput } from '../components/forms/ProjectForm';
import JsonViewer from '../components/JsonViewer';
import StateFileCompareModal from '../components/modals/StateFileCompareModal';
import StateFileViewerModal from '../components/modals/StateFileViewerModal';
import TeamsPickerModal from '../components/modals/TeamsPickerModal';
import PageHeader from '../components/PageHeader';
import { useToast } from '../components/providers/useToast';
import { useAuth } from '../components/providers/useAuth';
import { ProjectService } from '../api/projectService';
import { TeamService } from '../api/teamService';
import { UserService } from '../api/userService';
import { sampleStateFilesTerraform } from '../sampleData';
import { Project, StateFileSnapshot, Team, User } from '../types/buisness';
import { getErrorMessage, logError } from '../utils/simpleErrorHandler';

const ProjectPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const { showToast } = useToast();
  const { isAdmin } = useAuth();
  
  const [project, setProject] = useState<Project | undefined>();
  const [teams, setTeams] = useState<Team[]>([]);
  const [allTeams, setAllTeams] = useState<Team[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [teamToRemove, setTeamToRemove] = useState<Team | null>(null);
  const [viewerModalOpen, setViewerModalOpen] = useState(false);
  const [compareModalOpen, setCompareModalOpen] = useState(false);
  const [teamsModalOpen, setTeamsModalOpen] = useState(false);
  const [selectedSnapshot, setSelectedSnapshot] = useState<StateFileSnapshot | null>(null);

  // For now, using sample state files until StateService is properly implemented
  const [stateData, setStateData] = useState<{
    currentState: StateFileSnapshot | undefined;
    previousStates: StateFileSnapshot[];
  }>({ currentState: undefined, previousStates: [] });

  const loadProjectData = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      const [projectData, allTeamsData, usersData] = await Promise.all([
        ProjectService.getProject(id),
        TeamService.getTeams(),
        UserService.getUsers()
      ]);
      
      setProject(projectData);
      setAllTeams(allTeamsData);
      setUsers(usersData);
      
      // Get teams associated with this project
      const projectTeams = allTeamsData.filter(team => 
        projectData.teamIds.includes(team.id)
      );
      setTeams(projectTeams);
      
      // Load state files (using sample data for now)
      const states = sampleStateFilesTerraform
        .filter((s) => s.projectId === id)
        .sort((a, b) => b.version - a.version);
      
      setStateData({
        currentState: states[0],
        previousStates: states.slice(1)
      });
      
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

  const handleSaveTeams = async (selectedTeamIds: string[]) => {
    if (!project) return;
    
    try {
      await ProjectService.updateProject(project.id, { teamIds: selectedTeamIds });
      
      // Update local state
      setProject(prev => prev ? { ...prev, teamIds: selectedTeamIds } : prev);
      
      // Update teams list
      const updatedTeams = allTeams.filter(team => selectedTeamIds.includes(team.id));
      setTeams(updatedTeams);
      
      showToast({ message: 'Project teams updated successfully', severity: 'success' });
      closeTeamsModal();
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      showToast({ message: `Error updating teams: ${errorMessage}`, severity: 'error' });
      logError('handleSaveTeams', err);
    }
  };

  const handleRemoveTeam = async (team: Team) => {
    if (!project) return;
    
    try {
      const updatedTeamIds = project.teamIds.filter(id => id !== team.id);
      await ProjectService.updateProject(project.id, { teamIds: updatedTeamIds });
      
      // Update local state
      setProject(prev => prev ? { ...prev, teamIds: updatedTeamIds } : prev);
      setTeams(prev => prev.filter(t => t.id !== team.id));
      
      showToast({ message: 'Team removed from project successfully', severity: 'success' });
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      showToast({ message: `Error removing team: ${errorMessage}`, severity: 'error' });
      logError('handleRemoveTeam', err);
    }
  };

  const handleDeleteStateFileSnapshot = async (snapshot: StateFileSnapshot) => {
    try {
      // TODO: Implement StateService.deleteSnapshot when available
      showToast({ message: 'State file deleted successfully', severity: 'success' });
      
      // Remove from local state
      setStateData(prev => ({
        currentState: prev.currentState?.id === snapshot.id ? prev.previousStates[0] : prev.currentState,
        previousStates: prev.previousStates.filter(s => s.id !== snapshot.id)
      }));
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      showToast({ message: `Error deleting state file: ${errorMessage}`, severity: 'error' });
      logError('handleDeleteStateFileSnapshot', err);
    }
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

  return (
    <>
      <Stack spacing={4}>
        <PageHeader title={project.name} />
        {project.description && <Typography variant="body2">{project.description}</Typography>}

        <Stack spacing={4}>
          <Stack direction="row" spacing={2}>
            <Stack spacing={1} sx={{ flex: 1 }}>
              <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography>Teams</Typography>
                <IconButton
                  color="primary"
                  onClick={openTeamsModal}
                  title="Edit teams"
                  sx={{ p: 0 }}
                >
                  <EditIcon />
                </IconButton>
              </Stack>

              {teams && teams.length > 0 ? (
                <Stack spacing={1}>
                  {...teams.map((team) => (
                    <TeamCard
                      key={team.id}
                      team={team}
                      onDelete={handleRemoveTeam}
                      displayActions={isAdmin}
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
                        key={s.id}
                        stateFile={s}
                        onCompare={handleOpenCompare}
                        onRestore={() => {}}
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
                      <IconButton
                        size="small"
                        onClick={() => handleOpenViewer(stateData.currentState!)}
                        sx={{ p: 0 }}
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Stack>
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
        selectedTeamIds={project.teamIds}
        onClose={closeTeamsModal}
        onSubmit={handleSaveTeams}
      />
    </>
  );
};

export default ProjectPage;
