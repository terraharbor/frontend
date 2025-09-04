import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { Project } from '../../types/buisness';
import { useAuth } from '../providers/useAuth';
import { SummaryCard } from './SummaryCard';

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
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const metadata = [];

  metadata.push(`${project.teamIds.length} ${project.teamIds.length === 1 ? 'équipe' : 'équipes'}`);

  if (project.lastUpdated) {
    metadata.push(project.lastUpdated);
  }

  const openProject = () => {
    navigate(`/projects/${project.id}`);
  };

  const deleteProject = () => {
    if (onDelete) onDelete(project);
  };

  return (
    <SummaryCard
      title={project.name}
      description={project.description}
      metadata={metadata}
      actions={
        displayActions
          ? [
              ...(isAdmin && onDelete
                ? [
                    {
                      label: 'Delete',
                      onClick: deleteProject,
                      icon: <DeleteIcon fontSize="small" color="error" />,
                    },
                  ]
                : []),
              { label: 'Open', onClick: openProject, icon: <VisibilityIcon fontSize="small" /> },
            ]
          : undefined
      }
      onClick={openProject}
    />
  );
};

export default ProjectCard;
