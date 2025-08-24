import { FC } from 'react';
import { SummaryCard } from './SummaryCard';

export interface TeamData {
  id: string;
  name: string;
  description?: string;
  memberCount: number;
}

export interface TeamCardProps {
  team: TeamData;
  onOpen: (team: TeamData) => void;
  onCardClick?: (team: TeamData) => void;
}

export const TeamCard: FC<TeamCardProps> = ({ team, onOpen, onCardClick }) => (
  <SummaryCard
    title={team.name}
    description={team.description}
    metadata={[`${team.memberCount} ${team.memberCount === 1 ? 'membre' : 'membres'}`]}
    action={{ onClick: () => onOpen(team) }}
    onClick={onCardClick ? () => onCardClick(team) : undefined}
  />
);

export default TeamCard;
