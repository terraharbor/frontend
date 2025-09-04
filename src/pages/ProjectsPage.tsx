import { Add as AddIcon } from '@mui/icons-material';
import { Box, Typography, CircularProgress } from '@mui/material';
import Grid from '@mui/material/Grid';
import { FC, useState, useEffect } from 'react';
import { ProjectCard } from '../components/cards/ProjectCard';
import { ProjectFormOutput } from '../components/forms/ProjectForm';
import ProjectModal from '../components/modals/ProjectModal';
import { PageHeader } from '../components/PageHeader';
import { useToast } from '../components/providers/useToast';
import { useAuth } from '../components/providers/useAuth';
import { ProjectService } from '../api/projectService';
import { Project } from '../types/buisness';
import { getErrorMessage, logError } from '../utils/simpleErrorHandler';

export const ProjectsPage: FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();
  const { isAdmin } = useAuth();

  const loadProjects = async () => {
    setLoading(true);
    try {
      const data = await ProjectService.getProjects();
      setProjects(data);
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      showToast({ message: `Error loading projects: ${errorMessage}`, severity: 'error' });
      logError('loadProjects', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleCreateProject = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmitProject = async (values: ProjectFormOutput) => {
    setIsSubmitting(true);
    try {
      await ProjectService.createProject({
        name: values.name,
        description: values.description,
        teamIds: [],
        lastUpdated: new Date().toISOString(),
      });
      
      showToast({ message: 'Project created successfully', severity: 'success' });
      await loadProjects();
      setIsModalOpen(false);
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      showToast({ message: `Error creating project: ${errorMessage}`, severity: 'error' });
      logError('createProject', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProject = async (project: Project) => {
    try {
      await ProjectService.deleteProject(project.id);
      showToast({ message: 'Project deleted successfully', severity: 'success' });
      await loadProjects();
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      showToast({ message: `Error deleting project: ${errorMessage}`, severity: 'error' });
      logError('deleteProject', err);
    }
  };

  return (
    <Box>
      <PageHeader
        title="Projects"
        action={isAdmin ? {
          label: 'New',
          onClick: handleCreateProject,
          startIcon: <AddIcon />,
          variant: 'contained',
          color: 'primary',
        } : undefined}
      />

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      )}


      {!loading && (
        <>
          {projects.length === 0 ? (
            <Typography variant="body1" sx={{ mt: 2, textAlign: 'center', color: 'text.secondary' }}>
              No projects found. Create your first project!
            </Typography>
          ) : (
            <Grid container spacing={3} sx={{ mt: 2 }}>
              {projects.map((project) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={project.id}>
                  <ProjectCard 
                    project={project} 
                    displayActions={isAdmin}
                    onDelete={handleDeleteProject}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </>
      )}

      <ProjectModal
        open={isModalOpen}
        mode="create"
        onClose={handleCloseModal}
        onSubmit={handleSubmitProject}
        loading={isSubmitting}
      />
    </Box>
  );
};