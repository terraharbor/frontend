import { Alert, Box, CircularProgress, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { FC, useEffect, useState } from 'react';
import { UserService } from '../api/userService';
import { PageHeader } from '../components/PageHeader';
import ProjectCard from '../components/cards/ProjectCard';
import TeamCard from '../components/cards/TeamCard';
import { useAuth } from '../components/providers/useAuth';
import { useToast } from '../components/providers/useToast';
import { Project, Team } from '../types/buisness';
import { getErrorMessage, logError } from '../utils/simpleErrorHandler';

const DashboardPage: FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [myProjects, setMyProjects] = useState<Project[]>([]);
  const [myTeams, setMyTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [myProjectsData, myTeamsData] = await Promise.all([
        UserService.getUserProjects(user!.id),
        UserService.getUserTeams(user!.id),
      ]);

      setMyProjects(myProjectsData);
      setMyTeams(myTeamsData);
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      showToast({ message: `Error loading dashboard data: ${errorMessage}`, severity: 'error' });
      logError('loadDashboardData', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  return (
    <Stack>
      <PageHeader title="Dashboard" />

      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="200px"
          sx={{ mt: 4 }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <Stack spacing={2}>
          <Stack direction="row" spacing={2}>
            <Stack sx={{ flex: 1 }}>
              <Typography sx={{ mb: 1 }}>My projects</Typography>
              {myProjects && myProjects.length > 0 ? (
                <Grid container spacing={1}>
                  {myProjects.map((project: Project) => (
                    <Grid key={project.id} size={{ xs: 12, sm: 12, md: 12, lg: 6 }}>
                      <ProjectCard project={project} />
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Alert severity="info">No project</Alert>
              )}
            </Stack>
            <Stack sx={{ flex: 1 }}>
              <Typography sx={{ mb: 1 }}>My teams</Typography>
              {myTeams && myTeams.length > 0 ? (
                <Stack spacing={1}>
                  {myTeams.map((team: Team) => (
                    <TeamCard key={team.id} team={team} />
                  ))}
                </Stack>
              ) : (
                <Alert severity="info">No team</Alert>
              )}
            </Stack>
          </Stack>

          <Stack>
            <Typography sx={{ mb: 1 }}>My activties</Typography>
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
      )}
    </Stack>
  );
};

export default DashboardPage;
