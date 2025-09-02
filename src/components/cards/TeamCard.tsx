import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { Team } from '../../types/buisness';
import { SummaryCard } from './SummaryCard';

export interface TeamCardProps {
  team: Team;
}

export const TeamCard: FC<TeamCardProps> = ({ team }) => {
  const navigate = useNavigate();

  const openTeam = () => {
    navigate(`/teams/${team.id}`);
  };

  return (
    <SummaryCard
      title={team.name}
      description={team.description}
      metadata={[`${team.userIds.length} ${team.userIds.length === 1 ? 'membre' : 'membres'}`]}
      action={{ onClick: openTeam }}
      onClick={openTeam}
    />
  );
};

export default TeamCard;
