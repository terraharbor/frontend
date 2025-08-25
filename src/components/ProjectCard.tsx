import { FC } from 'react';
import { SummaryCard } from './SummaryCard';

export interface ProjectData {
  id: string;
  name: string;
  description?: string;
  teamCount?: number;
  lastUpdated?: string;
}

export interface ProjectCardProps {
  project: ProjectData;
  onOpen: (project: ProjectData) => void;
  onCardClick?: (project: ProjectData) => void;
}

export const ProjectCard: FC<ProjectCardProps> = ({ project, onOpen, onCardClick }) => {
  const metadata = [];
  
  if (project.teamCount !== undefined) {
    metadata.push(`${project.teamCount} ${project.teamCount === 1 ? 'équipe' : 'équipes'}`);
  }
  
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
