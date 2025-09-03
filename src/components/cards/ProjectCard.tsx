import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { Project } from '../../types/buisness';
import { SummaryCard } from './SummaryCard';

export interface ProjectCardProps {
  project: Project;
}

export const ProjectCard: FC<ProjectCardProps> = ({ project }) => {
  const navigate = useNavigate();
  const metadata = [];

  metadata.push(`${project.teamIds.length} ${project.teamIds.length === 1 ? 'équipe' : 'équipes'}`);

  if (project.lastUpdated) {
    metadata.push(project.lastUpdated);
  }

  const openProject = () => {
    navigate(`/projects/${project.id}`);
  };

  return (
    <SummaryCard
      title={project.name}
      description={project.description}
      metadata={metadata}
      action={{ onClick: openProject }}
      onClick={openProject}
    />
  );
};

export default ProjectCard;
