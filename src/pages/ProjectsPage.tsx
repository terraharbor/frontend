import { Add as AddIcon } from '@mui/icons-material';
import { Box, Typography, CircularProgress } from '@mui/material';
import Grid from '@mui/material/Grid';
import { FC, useState, useEffect } from 'react';
import { ProjectCard } from '../components/cards/ProjectCard';
import { ProjectFormOutput } from '../components/forms/ProjectForm';
import ConfirmationModal from '../components/modals/ConfirmationModal';
import ProjectModal from '../components/modals/ProjectModal';
import { PageHeader } from '../components/PageHeader';
import { useAuth } from '../components/providers/useAuth';
import { useToast } from '../components/providers/useToast';
import { ProjectService } from '../api/projectService';
// import { sampleProjects } from '../sampleData'; // Fallback sample data
import { Project } from '../types/buisness';
import { getErrorMessage, logError } from '../utils/simpleErrorHandler';

export const ProjectsPage: FC = () => {
  const { isAdmin } = useAuth();
  const { showToast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  // const [projects, setProjects] = useState<Project[]>(sampleProjects); // Fallback to sample data
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const data = await ProjectService.getProjects();
      setProjects(data);
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      showToast({ message: `Error loading projects: ${errorMessage}`, severity: 'error' });
      logError('loadProjects', err);
      // Fallback to sample data if API fails
      // setProjects(sampleProjects);
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
        teamIds: values.teamIds || [],
      });
      showToast({ message: 'Project created successfully', severity: 'success' });
      setIsModalOpen(false);
      await loadProjects(); // Reload data from API
      
      // Sample data fallback implementation (commented out):
      // const newProject: Project = {
      //   id: String(Date.now()), // Temporary ID for sample data
      //   name: values.name,
      //   description: values.description,
      //   teamIds: [],
      //   lastUpdated: new Date().toLocaleString('fr-FR', {
      //     day: '2-digit',
      //     month: '2-digit',
      //     year: 'numeric',
      //     hour: '2-digit',
      //     minute: '2-digit',
      //   }),
      // };
      // setProjects((prev) => [newProject, ...prev]);
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      showToast({ message: `Error creating project: ${errorMessage}`, severity: 'error' });
      logError('createProject', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProject = (project: Project) => {
    setProjectToDelete(project);
    setDeleteConfirmationOpen(true);
  };

  const confirmDeleteProject = async () => {
    if (!projectToDelete) return;
    
    try {
      await ProjectService.deleteProject(projectToDelete.id);
      showToast({ message: 'Project deleted successfully', severity: 'success' });
      await loadProjects(); // Reload data from API
      
      // Sample data fallback implementation (commented out):
      // setProjects((prev) => prev.filter((p) => p.id !== projectToDelete.id));
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      showToast({ message: `Error deleting project: ${errorMessage}`, severity: 'error' });
      logError('deleteProject', err);
    } finally {
      setDeleteConfirmationOpen(false);
      setProjectToDelete(null);
    }
  };

  const cancelDeleteProject = () => {
    setProjectToDelete(null);
    setDeleteConfirmationOpen(false);
  };

  return (
    <Box>
      <PageHeader
        title="Projects"
        action={
          isAdmin
            ? {
                label: 'New',
                onClick: handleCreateProject,
                startIcon: <AddIcon />,
                variant: 'contained',
                color: 'primary',
              }
            : undefined
        }
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
