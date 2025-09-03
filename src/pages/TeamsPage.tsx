import { Add as AddIcon } from '@mui/icons-material';
import { Box, Stack, Typography } from '@mui/material';
import { FC, useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import TeamCard from '../components/cards/TeamCard';
import { TeamFormOutput } from '../components/forms/TeamForm';
import ConfirmationModal from '../components/modals/ConfirmationModal';
import TeamModal from '../components/modals/TeamModal';
import { useAuth } from '../components/providers/useAuth';
import { useToast } from '../components/providers/useToast';
import { sampleTeams } from '../sampleData';
import { Team } from '../types/buisness';

export const TeamsPage: FC = () => {
  const { isAdmin } = useAuth();
  const { showToast } = useToast();
  const [teams, setTeams] = useState<Team[]>(sampleTeams);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [teamToDelete, setTeamToDelete] = useState<Team | null>(null);

  const handleOpenCreateModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmitTeam = (values: TeamFormOutput) => {
    const newTeam: Team = {
      id: '0' /* TODO: A gérer avec backend */,
      name: values.name,
      description: values.description,
      userIds: values.userIds,
    };

    setTeams((prev) => [newTeam, ...prev]);
    setIsModalOpen(false);
  };

  const handleDeleteTeam = (team: Team) => {
    setTeamToDelete(team);
    setDeleteConfirmationOpen(true);
  };

  const confirmDeleteTeam = () => {
    if (teamToDelete) {
      setTeams((prev) => prev.filter((t) => t.id !== teamToDelete.id));
      showToast({ message: 'Team deleted successfully.', severity: 'success' });
      setTeamToDelete(null);
    }
    setDeleteConfirmationOpen(false);
  };

  const cancelDeleteTeam = () => {
    setTeamToDelete(null);
    setDeleteConfirmationOpen(false);
  };

  return (
    <Box>
      <PageHeader
        title="Teams"
        action={
          isAdmin
            ? {
                label: 'New',
                onClick: handleOpenCreateModal,
                startIcon: <AddIcon />,
                variant: 'contained',
                color: 'primary',
              }
            : undefined
        }
      />

      {teams.length > 0 ? (
        <Stack spacing={1}>
          {...teams.map((team) => (
            <TeamCard key={team.id} team={team} onDelete={handleDeleteTeam} displayActions />
          ))}
        </Stack>
      ) : (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="200px"
          sx={{ mt: 4 }}
        >
          <Typography variant="h6" color="text.secondary" textAlign="center">
            No team
          </Typography>
        </Box>
      )}

      <TeamModal
        open={isModalOpen}
        mode="create"
        initialValues={{}}
        onClose={handleCloseModal}
        onSubmit={handleSubmitTeam}
      />

      <ConfirmationModal
        open={deleteConfirmationOpen}
        title="Delete Team"
        message={
          teamToDelete
            ? `Are you sure you want to delete the team "${teamToDelete.name}"? This action is irreversible.`
            : 'Are you sure you want to delete this team? This action is irreversible.'
        }
        confirmLabel="Delete"
        confirmColor="error"
        onConfirm={confirmDeleteTeam}
        onCancel={cancelDeleteTeam}
      />
    </Box>
  );
};

export default TeamsPage;
