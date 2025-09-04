import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Project } from '../../types/buisness';
import { SummaryCard } from './SummaryCard';
import { useToast } from '../providers/useToast';

export interface ProjectCardProps {
  project: Project;
  displayActions?: boolean;
  onDelete?: (project: Project) => void;
}

export const ProjectCard: FC<ProjectCardProps> = ({
  project,
  displayActions = false,
  onDelete,
}) => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  const metadata = [];

  metadata.push(`${project.teamIds.length} ${project.teamIds.length === 1 ? 'team' : 'teams'}`);

  if (project.lastUpdated) {
    metadata.push(project.lastUpdated);
  }

  const openProject = () => {
    try {
      navigate(`/projects/${project.id}`);
    } catch (err) {
      console.error('Failed to navigate to project:', err);
      showToast({ message: 'Error navigating to project', severity: 'error' });
    }
  };

  const deleteProject = async () => {
    if (!onDelete || isDeleting) return;
    
    setIsDeleting(true);
    try {
      await onDelete(project);
    } catch (err) {
      console.error('Failed to delete project:', err);
      // Error toast is already handled in the hook
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <SummaryCard
      title={project.name}
      description={project.description}
      metadata={metadata}
      actions={
        displayActions
          ? [
              {
                label: 'Delete',
                onClick: deleteProject,
                icon: <DeleteIcon fontSize="small" color="error" />,
                disabled: isDeleting,
              },
              { label: 'Open', onClick: openProject, icon: <VisibilityIcon fontSize="small" /> },
            ]
          : undefined
      }
      onClick={openProject}
    />
  );
};

export default ProjectCard;
