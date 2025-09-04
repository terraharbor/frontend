import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Alert, IconButton, Stack, Typography } from '@mui/material';
import { FC, useMemo, useState } from 'react';
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
import {
  sampleProjects,
  sampleStateFilesTerraform,
  sampleTeams,
  sampleUsers,
} from '../sampleData';
import { Project, StateFileSnapshot, Team } from '../types/buisness';

const ProjectPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const { showToast } = useToast();
  const [teamToRemove, setTeamToRemove] = useState<Team | null>(null);
  const [viewerModalOpen, setViewerModalOpen] = useState(false);
  const [compareModalOpen, setCompareModalOpen] = useState(false);
  const [teamsModalOpen, setTeamsModalOpen] = useState(false);
  const [selectedSnapshot, setSelectedSnapshot] = useState<StateFileSnapshot | null>(null);

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

  const handleSaveTeams = (selectedTeamIds: string[]) => {
    setProject((prev) => (prev ? { ...prev, teamIds: selectedTeamIds } : prev));
    showToast({ message: 'Teams updated', severity: 'success' });
    closeTeamsModal();
  };

  const handleRemoveTeam = (team: Team) => {
    if (teamToRemove) {
      setProject((prev) => {
        if (!prev) return prev;
        if (!prev.teamIds.includes(team.id)) return prev;
        return { ...prev, teamIds: prev.teamIds.filter((id) => id !== team.id) };
      });
      showToast({ message: 'Team removed successfully.', severity: 'success' });
    }
  };
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
                {previousStates.length > 0 ? (
                  previousStates.map((s) => (
                    <StateFileCard
                      stateFile={s}
                      onCompare={handleOpenCompare}
                      onRestore={() => {}}
                      onView={handleOpenViewer}
                    />
                  ))
                ) : (
                  <Alert severity="info">No previous version</Alert>
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
                        Actual • v{currentState.version} •{' '}
                        {new Date(currentState.createdAt).toLocaleString()} • by{' '}
                        {currentStateCreatedByUser && currentStateCreatedByUser.username}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => handleOpenViewer(currentState)}
                        sx={{ p: 0 }}
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                    <JsonViewer value={currentState.content} />
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
    </>
  );
};

export default ProjectPage;
