import EditIcon from '@mui/icons-material/Edit';
import { Alert, Box, CircularProgress, IconButton, Stack, Typography } from '@mui/material';
import { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { TeamService } from '../api/teamService';
import { UserService } from '../api/userService';
import { TeamFormOutput } from '../components/forms/TeamForm';
import UsersList from '../components/lists/UsersList';
import TeamModal from '../components/modals/TeamModal';
import UsersPickerModal from '../components/modals/UsersPickerModal';
import PageHeader from '../components/PageHeader';
import { useAuth } from '../components/providers/useAuth';
import { useToast } from '../components/providers/useToast';
// import { sampleProjects, sampleTeams, sampleUsers } from '../sampleData'; // Fallback sample data
import { Team, User } from '../types/buisness';
import { getErrorMessage, logError } from '../utils/simpleErrorHandler';

const TeamPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const { isAdmin } = useAuth();
  const { showToast } = useToast();
  const [team, setTeam] = useState<Team | undefined>();
  const [users, setUsers] = useState<User[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const [membersModalOpen, setMembersModalOpen] = useState(false);
  const [teamEditModalOpen, setTeamEditModalOpen] = useState(false);

  // Sample data implementation (commented out):
  // const initialTeam: Team | undefined = useMemo(() => sampleTeams.find((t) => t.id === id), [id]);
  // const [team, setTeam] = useState<Team | undefined>(initialTeam);
  // const projects = useMemo<Project[]>(
  //   () => (team ? sampleProjects.filter((p) => p.teamIds.includes(team.id)) : []),
  //   [team],
  // );
  // const users = useMemo<User[]>(
  //   () => (team ? sampleUsers.filter((u) => team.userIds.includes(u.id)) : []),
  //   [team],
  // );

  const loadTeamData = async () => {
    if (!id) return;

    setLoading(true);
    try {
      const [teamData, teamMembers, allUsersData] = await Promise.all([
        TeamService.getTeam(id),

        TeamService.getTeamMembers(id),
        UserService.getUsers(),
      ]);

      setTeam(teamData);
      setUsers(teamMembers);
      setAllUsers(allUsersData);
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      showToast({ message: `Error loading team: ${errorMessage}`, severity: 'error' });
      logError('loadTeamData', err);
      // Fallback to sample data if API fails
      // const initialTeam = sampleTeams.find((t) => t.id === id);
      // setTeam(initialTeam);
      // setProjects(sampleProjects.filter((p) => p.teamIds.includes(id || '')));
      // setUsers(sampleUsers.filter((u) => initialTeam?.userIds.includes(u.id) || false));
      // setAllUsers(sampleUsers);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeamData();
  }, [id]);

  const openMembersModal = () => setMembersModalOpen(true);
  const closeMembersModal = () => setMembersModalOpen(false);

  const openTeamEditModal = () => setTeamEditModalOpen(true);
  const closeTeamEditModal = () => setTeamEditModalOpen(false);

  const handleSaveMembers = async (selectedUserIds: string[]) => {
    if (!team) return;

    await handleSaveTeam({
      name: team.name,
      description: team.description,
      userIds: selectedUserIds,
    });
    closeMembersModal();
    loadTeamData();
  };

  const handleSaveTeam = async (values: TeamFormOutput) => {
    if (!team) return;

    try {
      await TeamService.updateTeam(team.id, {
        name: values.name,
        description: values.description,
        userIds: values.userIds || [],
      });

      setTeam((prev) =>
        prev ? { ...prev, name: values.name, description: values.description } : prev,
      );
      showToast({ message: 'Team updated successfully', severity: 'success' });
      closeTeamEditModal();

      // Sample data fallback implementation (commented out):
      // setTeam((prev) => {
      //   if (!prev) return prev;
      //   return { ...prev, name: values.name, description: values.description };
      // });
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      showToast({ message: `Error updating team: ${errorMessage}`, severity: 'error' });
      logError('handleSaveTeam', err);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (!team) {
    return <Alert severity="error">No team found with the id: "{id}".</Alert>;
  }

  return (
    <>
      <Stack spacing={4}>
        <PageHeader
          title={team.name}
          action={
            isAdmin
              ? {
                  label: 'Edit',
                  startIcon: <EditIcon />,
                  onClick: openTeamEditModal,
                }
              : undefined
          }
        />

        {team.description && <Typography variant="body2">{team.description}</Typography>}

        <Stack direction="row" spacing={2}>
          <Stack sx={{ flex: 1 }} spacing={2}>
            <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography>Members</Typography>
              {isAdmin && (
                <IconButton
                  color="primary"
                  onClick={openMembersModal}
                  title="Edit members"
                  sx={{ p: 0 }}
                >
                  <EditIcon />
                </IconButton>
              )}
            </Stack>

            <UsersList users={users} />
          </Stack>
        </Stack>
      </Stack>

      <UsersPickerModal
        open={membersModalOpen}
        users={allUsers}
        selectedUserIds={users.map((u) => u.id)}
        onClose={closeMembersModal}
        onSubmit={handleSaveMembers}
      />

      <TeamModal
        open={teamEditModalOpen}
        mode="edit"
        initialValues={{ name: team.name, description: team.description }}
        onClose={closeTeamEditModal}
        onSubmit={handleSaveTeam}
      />
    </>
  );
};

export default TeamPage;
