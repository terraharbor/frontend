import { Add as AddIcon } from '@mui/icons-material';
import { Alert, Box, CircularProgress, Stack } from '@mui/material';
import { FC, useEffect, useState } from 'react';
import { TeamService } from '../api/teamService';
import { PageHeader } from '../components/PageHeader';
import TeamCard from '../components/cards/TeamCard';
import { TeamFormOutput } from '../components/forms/TeamForm';
import ConfirmationModal from '../components/modals/ConfirmationModal';
import TeamModal from '../components/modals/TeamModal';
import { useAuth } from '../components/providers/useAuth';
import { useToast } from '../components/providers/useToast';
// import { sampleTeams } from '../sampleData'; // Fallback sample data
import { Team } from '../types/buisness';
import { getErrorMessage, logError } from '../utils/simpleErrorHandler';

export const TeamsPage: FC = () => {
  const { isAdmin } = useAuth();
  const { showToast } = useToast();
  const [teams, setTeams] = useState<Team[]>([]);
  // const [teams, setTeams] = useState<Team[]>(sampleTeams); // Fallback to sample data
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [teamToDelete, setTeamToDelete] = useState<Team | null>(null);

  const loadTeams = async () => {
    setLoading(true);
    try {
      const data = await TeamService.getTeams();
      setTeams(data);
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      showToast({ message: `Error loading teams: ${errorMessage}`, severity: 'error' });
      logError('loadTeams', err);
      // Fallback to sample data if API fails
      // setTeams(sampleTeams);
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
        userIds: values.userIds || [],
      });
      showToast({ message: 'Team created successfully', severity: 'success' });
      setIsModalOpen(false);
      await loadTeams(); // Reload data from API

      // Sample data fallback implementation (commented out):
      // const newTeam: Team = {
      //   id: String(Date.now()), // Temporary ID for sample data
      //   name: values.name,
      //   description: values.description,
      //   userIds: values.userIds || [],
      // };
      // setTeams((prev) => [newTeam, ...prev]);
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      showToast({ message: `Error creating team: ${errorMessage}`, severity: 'error' });
      logError('createTeam', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTeam = (team: Team) => {
    setTeamToDelete(team);
    setDeleteConfirmationOpen(true);
  };

  const confirmDeleteTeam = async () => {
    if (!teamToDelete) return;

    try {
      await TeamService.deleteTeam(teamToDelete.id);
      showToast({ message: 'Team deleted successfully', severity: 'success' });
      await loadTeams(); // Reload data from API

      // Sample data fallback implementation (commented out):
      // setTeams((prev) => prev.filter((t) => t.id !== teamToDelete.id));
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      showToast({ message: `Error deleting team: ${errorMessage}`, severity: 'error' });
      logError('deleteTeam', err);
    } finally {
      setDeleteConfirmationOpen(false);
      setTeamToDelete(null);
    }
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
        <Stack spacing={1}>
          {teams.map((team) => (
            <TeamCard
              key={team.id}
              team={team}
              onDelete={handleDeleteTeam}
              displayActions={isAdmin}
            />
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
          <Alert severity="info">No teams found. Create your first team!</Alert>
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
