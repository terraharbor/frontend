import { Add as AddIcon } from '@mui/icons-material';
import { Box, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { FC } from 'react';
import { PageHeader } from '../components/PageHeader';
import { ProjectCard, ProjectData } from '../components/ProjectCard';
import { TeamCard, TeamData } from '../components/TeamCard';
import { sampleProjects, sampleTeams } from '../sampleData';

const TestPage: FC = () => {
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

export default TestPage;
