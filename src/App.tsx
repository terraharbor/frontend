import { Add as AddIcon } from '@mui/icons-material';
import { Box, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { FC } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { PageHeader } from './components/PageHeader';
import { ProjectCard, ProjectData } from './components/ProjectCard';
import { TeamCard, TeamData } from './components/TeamCard';
import AppShell from './components/layout/AppShell';
import { ProjectsPage } from './pages/ProjectsPage';

const Dashboard: FC = () => {
  // Sample project data matching TerraHarbor mockup
  const sampleProjects: ProjectData[] = [
    {
      id: '1',
      name: 'Project A',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      teamCount: 2,
      lastUpdated: '21.04.2025 17:12',
    },
    {
      id: '2',
      name: 'Project B',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      teamCount: 1,
      lastUpdated: '19.04.2025 13:10',
    },
    {
      id: '3',
      name: 'Project C',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      teamCount: 3,
      lastUpdated: '15.04.2025 12:02',
    },
  ];

  // Sample team data matching TerraHarbor mockup
  const sampleTeams: TeamData[] = [
    {
      id: '1',
      name: 'Dev Team',
      memberCount: 5,
    },
    {
      id: '2',
      name: 'Security Team',
      memberCount: 4,
    },
  ];

  // Event handlers
  const handleCreateProject = () => {
    console.log('Créer new project clicked');
  };

  const handleProjectOpen = (project: ProjectData) => {
    console.log('Ouvrir project:', project.name);
  };

  const handleTeamOpen = (team: TeamData) => {
    console.log('Ouvrir team:', team.name);
  };

  return (
    <Stack>
      {/* Dashboard Page Header */}
      <PageHeader
        title="Dashboard"
        action={{
          label: 'CRÉER',
          onClick: handleCreateProject,
          startIcon: <AddIcon />,
          variant: 'contained',
          color: 'primary',
        }}
      />

      {/* Projects and Teams Side by Side */}
      <Grid container spacing={4}>
        {/* Projects Section */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Box
            sx={{
              border: '1px solid',
              borderColor: 'grey.300',
              borderRadius: 1, // theme.shape.borderRadius
              p: 3,
              backgroundColor: 'background.paper',
            }}
          >
            <Typography variant="h6" sx={{ mb: 3 }}>
              Mes projets
            </Typography>
            <Stack spacing={2}>
              {sampleProjects.map((project) => (
                <ProjectCard key={project.id} project={project} onOpen={handleProjectOpen} />
              ))}
            </Stack>
          </Box>
        </Grid>

        {/* Teams Section */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Box
            sx={{
              border: '1px solid',
              borderColor: 'grey.300',
              borderRadius: 1, // theme.shape.borderRadius
              p: 3,
              backgroundColor: 'background.paper',
            }}
          >
            <Typography variant="h6" sx={{ mb: 3 }}>
              Mes équipes
            </Typography>
            <Stack spacing={2}>
              {sampleTeams.map((team) => (
                <TeamCard key={team.id} team={team} onOpen={handleTeamOpen} />
              ))}
            </Stack>
          </Box>
        </Grid>
      </Grid>

      {/* Projects Page Header */}
      <PageHeader
        title="Projects"
        action={{
          label: 'CRÉER',
          onClick: handleCreateProject,
          variant: 'contained',
          color: 'primary',
        }}
      />

      {/* Projects Grid View */}
      <Grid container spacing={3}>
        {sampleProjects.map((project) => (
          <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={`grid-${project.id}`}>
            <ProjectCard project={project} onOpen={handleProjectOpen} />
          </Grid>
        ))}
      </Grid>

      {/* Teams Page Header */}
      <PageHeader
        title="Equipes"
        action={{
          label: 'CRÉER',
          onClick: handleCreateProject,
          variant: 'contained',
          color: 'primary',
        }}
      />

      {/* Teams Grid View */}
      <Grid container spacing={3}>
        {sampleTeams.map((team) => (
          <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={`grid-${team.id}`}>
            <TeamCard team={team} onOpen={handleTeamOpen} />
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
};
const Projects: FC = () => {
  // Empty array to test "no projects available"
  // const projects: ProjectData[] = [];

  const projects: ProjectData[] = [
    {
      id: '1',
      name: 'Project A',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      teamCount: 2,
      lastUpdated: '21.04.2025 17:12',
    },
    {
      id: '2',
      name: 'Project B',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      teamCount: 1,
      lastUpdated: '19.04.2025 13:10',
    },
    {
      id: '3',
      name: 'Project C',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      teamCount: 3,
      lastUpdated: '15.04.2025 12:02',
    },
  ];
  
  const handleCreateProject = () => {
    console.log('Create new project clicked from projects page');
  };

  const handleOpenProject = (project: ProjectData) => {
    console.log('Open project:', project.name);
  };

  return (
    <ProjectsPage 
      projects={projects}
      onCreateProject={handleCreateProject}
      onOpenProject={handleOpenProject}
    />
  );
};
const Teams: FC = () => <Stack>Teams</Stack>;
const Users: FC = () => <Stack>Users</Stack>;
const Tokens: FC = () => <Stack>Tokens</Stack>;
const Audit: FC = () => <Stack>Audit logs</Stack>;
const Settings: FC = () => <Stack>Settings</Stack>;

const App: FC = () => {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/teams" element={<Teams />} />
        <Route path="/users" element={<Users />} />
        <Route path="/tokens" element={<Tokens />} />
        <Route path="/audit" element={<Audit />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppShell>
  );
};

export default App;
