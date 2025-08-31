import { FC } from 'react';
import { Team } from '../../types/buisness';
import { SummaryCard } from './SummaryCard';

export interface TeamCardProps {
  team: Team;
  onOpen: (team: Team) => void;
  onCardClick?: (team: Team) => void;
}

export const TeamCard: FC<TeamCardProps> = ({ team, onOpen, onCardClick }) => (
  <SummaryCard
    title={team.name}
    description={team.description}
    metadata={[`${team.userIds.length} ${team.userIds.length === 1 ? 'membre' : 'membres'}`]}
    action={{ onClick: () => onOpen(team) }}
    onClick={onCardClick ? () => onCardClick(team) : undefined}
  />
);

export default TeamCard;
