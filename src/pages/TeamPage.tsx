import ProjectCard from '@/components/cards/ProjectCard';
import AddIcon from '@mui/icons-material/Add';
import { Alert, IconButton, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { FC, useMemo, useState } from 'react';
import PageHeader from '../components/PageHeader';
import { sampleProjects, sampleTeams, sampleUsers } from '../sampleData';
import { Project, Team } from '../types/buisness';

const TeamPage: FC = () => {
  const [team] = useState<Team>(sampleTeams[0]);

  const projects = useMemo<Project[]>(
    () => sampleProjects.filter((p) => p.teamIds.includes(team.id)),
    [team.id],
  );

  const users = useMemo<User[]>(
    () => sampleUsers.filter((u) => team.userIds.includes(u.id)),
    [team.userIds, team.id],
  );

  return (
    <Stack>
      <PageHeader title={team.name} />
      {team.description && <Typography variant="body2">{team.description}</Typography>}

      <Stack direction="row" spacing={2}>
        <Stack sx={{ bgcolor: 'neutral.white', borderRadius: 2 }} spacing={2}>
          <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
            <Typography>Membres</Typography>
            <IconButton color="primary" onClick={() => {}} title="Ajouter un membre">
              <AddIcon />
            </IconButton>
          </Stack>

          <UsersList />
        </Stack>

        <Stack spacing={2}>
          <Typography>Projets</Typography>
          {projects && projects.length > 0 ? (
            <Grid container spacing={1}>
              {projects.map((project) => (
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
      </Stack>
    </Stack>
  );
};

export default TeamPage;
