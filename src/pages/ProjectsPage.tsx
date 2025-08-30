import { Add as AddIcon } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { FC } from 'react';
import { PageHeader } from '../components/PageHeader';
import { ProjectCard, ProjectData } from '../components/ProjectCard';
import { sampleProjects } from '../sampleData';

export const ProjectsPage: FC = () => {
  const projects: ProjectData[] = sampleProjects;

  const handleCreateProject = () => {
    console.log('Créer nouveau projet');
  };

  const handleOpenProject = (project: ProjectData) => {
    console.log('Ouvrir projet:', project.name);
  };

  return (
    <Box>
      <PageHeader
        title="Projets"
        action={{
          label: 'CRÉER',
          onClick: handleCreateProject,
          startIcon: <AddIcon />,
          variant: 'contained',
          color: 'primary',
        }}
      />

      {projects.length > 0 ? (
        <Grid container spacing={3}>
          {projects.map((project) => (
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={project.id}>
              <ProjectCard project={project} onOpen={handleOpenProject} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="200px"
          sx={{ mt: 4 }}
        >
          <Typography variant="h6" color="text.secondary" textAlign="center">
            Aucun projet disponible
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default ProjectsPage;
