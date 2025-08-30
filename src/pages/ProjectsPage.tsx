import { Add as AddIcon } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { FC, useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { ProjectCard, ProjectData } from '../components/ProjectCard';
import { CreateProjectModal } from '../components/CreateProjectModal';
import { sampleProjects } from '../sampleData';
export const ProjectsPage: FC = () => {
  const [projects, setProjects] = useState<ProjectData[]>(sampleProjects);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateProject = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmitProject = (
    projectData: Omit<ProjectData, 'id' | 'teamCount' | 'lastUpdated'>,
  ) => {
    const newProject: ProjectData = {
      id: '0', //todo generate unique id? or in backend?
      name: projectData.name,
      description: projectData.description,
      teamCount: 0,
      lastUpdated: new Date().toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    setProjects([newProject, ...projects]);
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

      <CreateProjectModal
        open={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitProject}
      />
    </Box>
  );
};

export default ProjectsPage;
