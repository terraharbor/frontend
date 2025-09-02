import { Alert, Box, Stack, Typography } from '@mui/material';
import { FC, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import StateFileCard from '../components/cards/StateFileCard';
import TeamCard from '../components/cards/TeamCard';
import PageHeader from '../components/PageHeader';
import { sampleProjects, sampleStateFilesTerraform, sampleTeams, sampleUsers } from '../sampleData';
import { Project, StateFileSnapshot, Team } from '../types/buisness';

const ProjectPage: FC = () => {
  const { id } = useParams<{ id: string }>();

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

  if (!project) {
    return (
      <Stack spacing={2}>
        <PageHeader title="Projet introuvable" />
        <Alert severity="error">Impossible de trouver un projet avec l'id "{id}".</Alert>
      </Stack>
    );
  }

  return (
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
                maxHeight: 360,
                overflow: 'auto',
              }}
            >
              {currentState ? (
                <>
                  <Typography variant="caption" color="text.secondary" sx={{ mb: 1 }}>
                    Actuel • v{currentState.version} •{' '}
                    {new Date(currentState.createdAt).toLocaleString()} • par{' '}
                    {currentStateCreatedByUser && currentStateCreatedByUser.username}
                  </Typography>
                  <Box
                    component="pre"
                    sx={{
                      m: 0,
                      fontFamily:
                        'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                      fontSize: 12,
                      whiteSpace: 'pre',
                    }}
                  >
                    {currentState.content}
                  </Box>
                </>
              ) : (
                <Alert severity="info">Aucun state file pour ce projet.</Alert>
              )}
            </Stack>
          </Stack>

          <Stack spacing={1} sx={{ flex: 1 }}>
            <Typography>Versions précédentes</Typography>
            <Stack spacing={1} sx={{ maxHeight: 360 }}>
              {previousStates.length > 0 ? (
                previousStates.map((s) => (
                  <StateFileCard
                    stateFile={s}
                    onCompare={() => {}}
                    onRestore={() => {}}
                    onView={() => {}}
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
  );
};

export default ProjectPage;
