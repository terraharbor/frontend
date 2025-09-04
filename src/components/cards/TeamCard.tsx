import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { Team } from '../../types/buisness';
import { SummaryCard } from './SummaryCard';

export interface TeamCardProps {
  team: Team;
  displayActions?: boolean;
  onDelete?: (team: Team) => void;
}

export const TeamCard: FC<TeamCardProps> = ({ team, displayActions = false, onDelete }) => {
  const navigate = useNavigate();

  const openTeam = () => {
    navigate(`/teams/${team.id}`);
  };

  const deleteTeam = () => {
    if (onDelete) {
      onDelete(team);
    }
  };

  return (
    <SummaryCard
      title={team.name}
      description={team.description}
      metadata={[`${team.userIds.length} ${team.userIds.length === 1 ? 'member' : 'members'}`]}
      actions={
        displayActions
          ? [
              { label: 'Open', onClick: openTeam, icon: <VisibilityIcon fontSize="small" /> },
              ...(onDelete
                ? [
                    {
                      label: 'Delete',
                      onClick: deleteTeam,
                      icon: <DeleteIcon fontSize="small" color="error" />,
                    },
                  ]
                : []),
            ]
          : undefined
      }
      actionsPlacement="right"
      onClick={openTeam}
    />
  );
};

export default TeamCard;
