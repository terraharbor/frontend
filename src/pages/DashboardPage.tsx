import { Alert, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { FC } from 'react';
import { PageHeader } from '../components/PageHeader';
import ProjectCard, { ProjectData } from '../components/ProjectCard';
import TeamCard, { TeamData } from '../components/TeamCard';

const DashboardPage: FC = () => {
  const myProjects: ProjectData[] = [];
  const myTeams: TeamData[] = [];

  return (
    <Stack>
      <PageHeader title="Dashboard" />

      <Stack spacing={2}>
        <Stack direction="row" spacing={2}>
          <Stack sx={{ flex: 1 }}>
            <Typography sx={{ mb: 1 }}>Mes projets</Typography>
            {myProjects && myProjects.length > 0 ? (
              <Grid container spacing={1}>
                {myProjects.map((project) => (
                  <Grid key={project.id} size={{ xs: 12, sm: 12, md: 12, lg: 6 }}>
                    <ProjectCard
                      project={project}
                      onOpen={() => console.log('Open project: ' + project.id)}
                    />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Alert severity="info">Aucun projet</Alert>
            )}
          </Stack>
          <Stack sx={{ flex: 1 }}>
            <Typography sx={{ mb: 1 }}>Mes équipes</Typography>
            {myTeams && myTeams.length > 0 ? (
              <Stack spacing={1}>
                {...myTeams.map((team) => (
                  <TeamCard
                    key={team.id}
                    team={team}
                    onOpen={() => console.log('Open team: ' + team.id)}
                  />
                ))}
              </Stack>
            ) : (
              <Alert severity="info">Aucune équipe</Alert>
            )}
          </Stack>
        </Stack>

        <Stack>
          <Typography sx={{ mb: 1 }}>Mes activités</Typography>
          <Stack
            sx={{
              height: 200,
              bgcolor: 'neutral.white',
              borderRadius: 2,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            A compléter
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default DashboardPage;
