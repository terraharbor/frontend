import { Add as AddIcon } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { FC } from 'react';
import { PageHeader } from '../components/PageHeader';
import { ProjectCard, ProjectData } from '../components/ProjectCard';

export interface ProjectsPageProps {
  projects?: ProjectData[];
  onCreateProject?: () => void;
  onOpenProject?: (project: ProjectData) => void;
}

export const ProjectsPage: FC<ProjectsPageProps> = ({
  projects = [],
  onCreateProject,
  onOpenProject,
}) => {


  const handleCreateProject = () => {
    if (onCreateProject) {
      onCreateProject();
    } else {
      console.log('Créer nouveau projet');
    }
  };

  const handleOpenProject = (project: ProjectData) => {
    if (onOpenProject) {
      onOpenProject(project);
    } else {
      console.log('Ouvrir projet:', project.name);
    }
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
          color: 'success',
        }}
      />

      {projects.length > 0 ? (
        <Grid container spacing={3}>
          {projects.map((project) => (
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={project.id}>
              <ProjectCard 
                project={project} 
                onOpen={handleOpenProject}
              />
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
          <Typography 
            variant="h6" 
            color="text.secondary"
            textAlign="center"
          >
            Aucun projet disponible
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default ProjectsPage;
