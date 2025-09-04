import { Add as AddIcon } from '@mui/icons-material';
import { Box, Stack, Typography, CircularProgress } from '@mui/material';
import { FC, useState, useEffect } from 'react';
import { PageHeader } from '../components/PageHeader';
import TeamCard from '../components/cards/TeamCard';
import { TeamFormOutput } from '../components/forms/TeamForm';
import TeamModal from '../components/modals/TeamModal';
import { useToast } from '../components/providers/useToast';
import { TeamService } from '../api/teamService';
import { Team } from '../types/buisness';
import { getErrorMessage, logError } from '../utils/simpleErrorHandler';

export const TeamsPage: FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();

  const loadTeams = async () => {
    setLoading(true);
    try {
      const data = await TeamService.getTeams();
      setTeams(data);
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      showToast({ message: `Error loading teams: ${errorMessage}`, severity: 'error' });
      logError('loadTeams', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeams();
  }, []);

  const handleOpenCreateModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmitTeam = async (values: TeamFormOutput) => {
    setIsSubmitting(true);
    try {
      await TeamService.createTeam({
        name: values.name,
        description: values.description,
        userIds: values.userIds,
      });
      
      showToast({ message: 'Team created successfully', severity: 'success' });
      await loadTeams();
      setIsModalOpen(false);
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      showToast({ message: `Error creating team: ${errorMessage}`, severity: 'error' });
      logError('createTeam', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box>
      <PageHeader
        title="Teams"
        action={{
          label: 'New',
          onClick: handleOpenCreateModal,
          startIcon: <AddIcon />,
          variant: 'contained',
          color: 'primary',
        }}
      />

      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="200px"
          sx={{ mt: 4 }}
        >
          <CircularProgress />
        </Box>
      ) : teams.length > 0 ? (
        <Stack spacing={1}>{teams.map((team) => <TeamCard key={team.id} team={team} />)}</Stack>
      ) : (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="200px"
          sx={{ mt: 4 }}
        >
          <Typography variant="h6" color="text.secondary" textAlign="center">
            No teams available
          </Typography>
        </Box>
      )}

      <TeamModal
        open={isModalOpen}
        mode="create"
        initialValues={{}}
        onClose={handleCloseModal}
        onSubmit={handleSubmitTeam}
        loading={isSubmitting}
      />
    </Box>
  );
};

export default TeamsPage;