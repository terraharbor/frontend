import VisibilityIcon from '@mui/icons-material/Visibility';
import { Alert, IconButton, Stack, Typography } from '@mui/material';
import { FC, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import StateFileCard from '../components/cards/StateFileCard';
import TeamCard from '../components/cards/TeamCard';
import JsonViewer from '../components/JSONViewer';
import StateFileViewerModal from '../components/modals/StateFileViewerModal';
import PageHeader from '../components/PageHeader';
import { sampleProjects, sampleStateFilesTerraform, sampleTeams, sampleUsers } from '../sampleData';
import { Project, StateFileSnapshot, Team } from '../types/buisness';

const ProjectPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const [viewerOpen, setViewerOpen] = useState(false);
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

  const handleOpenSnapshot = (s: StateFileSnapshot) => {
    setSelectedSnapshot(s);
    setViewerOpen(true);
  };

  const handleCloseSnapshot = () => {
    setSelectedSnapshot(null);
    setViewerOpen(false);
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
        <PageHeader title={project.name} />
        {project.description && <Typography variant="body2">{project.description}</Typography>}

        <Stack spacing={4}>
          <Stack direction="row" spacing={2}>
            <Stack spacing={1} sx={{ flex: 1 }}>
              <Typography>Equipes</Typography>
              {teams && teams.length > 0 ? (
                <Stack spacing={1}>
                  {...teams.map((team) => <TeamCard key={team.id} team={team} onOpen={() => {}} />)}
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
              <Typography>State File Terraform</Typography>
              <Stack
                sx={{
                  bgcolor: 'neutral.white',
                  borderRadius: 2,
                  p: 2,
                  maxHeight: 400,
                  overflow: 'auto',
                }}
              >
                {currentState ? (
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
                      <IconButton
                        size="small"
                        onClick={() => handleOpenSnapshot(currentState)}
                        sx={{ p: 0 }}
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                    <JsonViewer value={currentState.content} />
                  </Stack>
                ) : (
                  <Alert severity="info">Aucun state file pour ce projet.</Alert>
                )}
              </Stack>
            </Stack>

            <Stack spacing={1} sx={{ flex: 1 }}>
              <Typography>Versions précédentes</Typography>
              <Stack spacing={1} sx={{ maxHeight: 400 }}>
                {previousStates.length > 0 ? (
                  previousStates.map((s) => (
                    <StateFileCard
                      stateFile={s}
                      onCompare={() => {}}
                      onRestore={() => {}}
                      onView={handleOpenSnapshot}
                    />
                  ))
                ) : (
                  <Alert severity="info">Aucune version précédente</Alert>
                )}
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      </Stack>

      <StateFileViewerModal
        open={viewerOpen}
        onClose={handleCloseSnapshot}
        snapshot={selectedSnapshot}
      />
    </>
  );
};

export default ProjectPage;
