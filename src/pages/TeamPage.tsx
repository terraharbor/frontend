import AddIcon from '@mui/icons-material/Add';
import { Alert, IconButton, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { FC, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import ProjectCard from '../components/cards/ProjectCard';
import UsersList from '../components/lists/UsersList';
import PageHeader from '../components/PageHeader';
import { sampleProjects, sampleTeams, sampleUsers } from '../sampleData';
import { Project, Team, User } from '../types/buisness';

const TeamPage: FC = () => {
  const { id } = useParams<{ id: string }>();

  const team: Team | undefined = useMemo(() => sampleTeams.find((t) => t.id === id), [id]);

  const projects = useMemo<Project[]>(
    () => (team ? sampleProjects.filter((p) => p.teamIds.includes(team.id)) : []),
    [team],
  );

  const users = useMemo<User[]>(
    () => (team ? sampleUsers.filter((u) => team.userIds.includes(u.id)) : []),
    [team],
  );

  if (!team) {
    return (
      <Stack spacing={2}>
        <PageHeader title="Équipe introuvable" />
        <Alert severity="error">Impossible de trouver une équipe avec l'id "{id}".</Alert>
      </Stack>
    );
  }

  return (
    <Stack>
      <PageHeader title={team.name} />
      {team.description && <Typography variant="body2">{team.description}</Typography>}

      <Stack direction="row" spacing={2}>
        <Stack sx={{ flex: 1 }} spacing={2}>
          <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography>Membres</Typography>
            <IconButton color="primary" onClick={() => {}} title="Ajouter un membre" sx={{ p: 0 }}>
              <AddIcon />
            </IconButton>
          </Stack>

          <UsersList users={users} allowDelete={true} />
        </Stack>

        <Stack spacing={2} sx={{ flex: 1 }}>
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
