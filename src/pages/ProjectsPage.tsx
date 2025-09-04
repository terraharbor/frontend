import { Add as AddIcon } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { FC, useState } from 'react';
import { ProjectCard } from '../components/cards/ProjectCard';
import { ProjectFormOutput } from '../components/forms/ProjectForm';
import ConfirmationModal from '../components/modals/ConfirmationModal';
import ProjectModal from '../components/modals/ProjectModal';
import { PageHeader } from '../components/PageHeader';
import { useAuth } from '../components/providers/useAuth';
import { useToast } from '../components/providers/useToast';
import { sampleProjects } from '../sampleData';
import { Project } from '../types/buisness';

export const ProjectsPage: FC = () => {
  const { isAdmin } = useAuth();
  const { showToast } = useToast();
  const [projects, setProjects] = useState<Project[]>(sampleProjects);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

  const handleCreateProject = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmitProject = (values: ProjectFormOutput) => {
    const newProject: Project = {
      id: '0' /* TODO: A gérer avec backend */,
      name: values.name,
      description: values.description,
      teamIds: [],
      lastUpdated: new Date().toLocaleString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    setProjects((prev) => [newProject, ...prev]);
    setIsModalOpen(false);
  };

  const handleDeleteProject = (project: Project) => {
    setProjectToDelete(project);
    setDeleteConfirmationOpen(true);
  };

  const confirmDeleteProject = () => {
    if (projectToDelete) {
      setProjects((prev) => prev.filter((p) => p.id !== projectToDelete.id));
      showToast({ message: 'Project deleted successfully.', severity: 'success' });
      setProjectToDelete(null);
    }
    setDeleteConfirmationOpen(false);
  };

  const cancelDeleteProject = () => {
    setProjectToDelete(null);
    setDeleteConfirmationOpen(false);
  };

  return (
    <Box>
      <PageHeader
        title="Projets"
        action={
          isAdmin
            ? {
                label: 'CRÉER',
                onClick: handleCreateProject,
                startIcon: <AddIcon />,
                variant: 'contained',
                color: 'primary',
              }
            : undefined
        }
      />

      {projects.length > 0 ? (
        <Grid container spacing={3}>
          {projects.map((project) => (
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={project.id}>
              <ProjectCard project={project} displayActions onDelete={handleDeleteProject} />
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

      <ProjectModal
        open={isModalOpen}
        mode="create"
        initialValues={{}}
        onClose={handleCloseModal}
        onSubmit={handleSubmitProject}
      />

      <ConfirmationModal
        open={deleteConfirmationOpen}
        title="Delete Project"
        message={
          projectToDelete
            ? `Are you sure you want to delete the project "${projectToDelete.name}"? This action is irreversible.`
            : "Are you sure you want to delete this project? This action is irreversible."
        }
        confirmLabel="Delete"
        confirmColor="error"
        onConfirm={confirmDeleteProject}
        onCancel={cancelDeleteProject}
      />
    </Box>
  );
};

export default ProjectsPage;
