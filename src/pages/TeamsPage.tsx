import { Add as AddIcon } from '@mui/icons-material';
import { Box, Stack, Typography } from '@mui/material';
import { FC, useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import TeamCard from '../components/cards/TeamCard';
import { TeamFormOutput } from '../components/forms/TeamForm';
import TeamModal from '../components/modals/TeamModal';
import { sampleTeams } from '../sampleData';
import { Team } from '../types/buisness';

export const TeamsPage: FC = () => {
  const [teams, setTeams] = useState<Team[]>(sampleTeams);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  return (
    <Box>
      <PageHeader
        title="Equipes"
        action={{
          label: 'CRÉER',
          onClick: handleOpenCreateModal,
          startIcon: <AddIcon />,
          variant: 'contained',
          color: 'primary',
        }}
      />

      {teams.length > 0 ? (
        <Stack spacing={1}>{...teams.map((team) => <TeamCard key={team.id} team={team} />)}</Stack>
      ) : (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="200px"
          sx={{ mt: 4 }}
        >
          <Typography variant="h6" color="text.secondary" textAlign="center">
            Aucune équipe disponible
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
    </Box>
  );
};

export default TeamsPage;
