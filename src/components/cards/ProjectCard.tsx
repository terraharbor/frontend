import { FC } from 'react';
import { Project } from '../../types/buisness';
import { SummaryCard } from './SummaryCard';

export interface ProjectCardProps {
  project: Project;
  onOpen: (project: Project) => void;
  onCardClick?: (project: Project) => void;
}

export const ProjectCard: FC<ProjectCardProps> = ({ project, onOpen, onCardClick }) => {
  const metadata = [];

  metadata.push(`${project.teamIds.length} ${project.teamIds.length === 1 ? 'équipe' : 'équipes'}`);

  if (project.lastUpdated) {
    metadata.push(project.lastUpdated);
  }

  return (
    <SummaryCard
      title={project.name}
      description={project.description}
      metadata={metadata}
      action={{ onClick: () => onOpen(project) }}
      onClick={onCardClick ? () => onCardClick(project) : undefined}
    />
  );
};

export default ProjectCard;
