import EditIcon from '@mui/icons-material/Edit';
import { Alert, IconButton, Stack, Typography, Box, CircularProgress } from '@mui/material';
import Grid from '@mui/material/Grid';
import { FC, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ProjectCard from '../components/cards/ProjectCard';
import { TeamFormOutput } from '../components/forms/TeamForm';
import UsersList from '../components/lists/UsersList';
import ConfirmationModal from '../components/modals/ConfirmationModal';
import TeamModal from '../components/modals/TeamModal';
import UsersPickerModal from '../components/modals/UsersPickerModal';
import PageHeader from '../components/PageHeader';
import { useAuth } from '../components/providers/useAuth';
import { useToast } from '../components/providers/useToast';
import { TeamService } from '../api/teamService';
import { UserService } from '../api/userService';
// import { sampleProjects, sampleTeams, sampleUsers } from '../sampleData'; // Fallback sample data
import { Project, Team, User } from '../types/buisness';
import { getErrorMessage, logError } from '../utils/simpleErrorHandler';

const TeamPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const { isAdmin } = useAuth();
  const { showToast } = useToast();
  const [team, setTeam] = useState<Team | undefined>();
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [membersModalOpen, setMembersModalOpen] = useState(false);
  const [teamEditModalOpen, setTeamEditModalOpen] = useState(false);
  const [removeUserConfirmationOpen, setRemoveUserConfirmationOpen] = useState(false);
  const [userToRemove, setUserToRemove] = useState<string | null>(null);

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
      const [teamData, teamProjects, teamMembers, allUsersData] = await Promise.all([
        TeamService.getTeam(id),
        TeamService.getTeamProjects(id),
        TeamService.getTeamMembers(id),
        UserService.getUsers()
      ]);

      setTeam(teamData);
      setProjects(teamProjects);
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

    try {
      const currentMemberIds = users.map(u => u.id);
      const toAdd = selectedUserIds.filter(id => !currentMemberIds.includes(id));
      const toRemove = currentMemberIds.filter(id => !selectedUserIds.includes(id));

      for (const userId of toAdd) {
        await TeamService.addTeamMember(team.id, userId);
      }

      for (const userId of toRemove) {
        await TeamService.removeTeamMember(team.id, userId);
      }

      showToast({ message: 'Team members updated successfully', severity: 'success' });
      setMembersModalOpen(false);

      const updatedMembers = await TeamService.getTeamMembers(team.id);
      setUsers(updatedMembers);
      
      // Sample data fallback implementation (commented out):
      // setTeam((prev) => (prev ? { ...prev, userIds: selectedUserIds } : prev));
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      showToast({ message: `Error updating team members: ${errorMessage}`, severity: 'error' });
      logError('handleSaveMembers', err);
    }
  };

  const handleRemoveUser = (userId: string) => {
    setUserToRemove(userId);
    setRemoveUserConfirmationOpen(true);
  };

  const confirmRemoveUser = async () => {
    if (!userToRemove || !team) return;
    
    try {
      await TeamService.removeTeamMember(team.id, userToRemove);
      showToast({ message: 'User removed from team successfully', severity: 'success' });

      setUsers(prev => prev.filter(u => u.id !== userToRemove));
      
      // Sample data fallback implementation (commented out):
      // setTeam((prev) => {
      //   if (!prev) return prev;
      //   if (!prev.userIds.includes(userToRemove)) return prev;
      //   return { ...prev, userIds: prev.userIds.filter((id) => id !== userToRemove) };
      // });
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      showToast({ message: `Error removing user: ${errorMessage}`, severity: 'error' });
      logError('confirmRemoveUser', err);
    } finally {
      setRemoveUserConfirmationOpen(false);
      setUserToRemove(null);
    }
  };

  const cancelRemoveUser = () => {
    setUserToRemove(null);
    setRemoveUserConfirmationOpen(false);
  };

  const handleSaveTeam = async (values: TeamFormOutput) => {
    if (!team) return;
    
    try {
      await TeamService.updateTeam(team.id, {
        name: values.name,
        description: values.description,
      });
      
      setTeam(prev => prev ? { ...prev, name: values.name, description: values.description } : prev);
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

            <UsersList users={users} allowDelete onDelete={handleRemoveUser} />
          </Stack>

          <Stack spacing={2} sx={{ flex: 1 }}>
            <Typography>Projects</Typography>
            {projects && projects.length > 0 ? (
              <Grid container spacing={1}>
                {projects.map((project) => (
                  <Grid key={project.id} size={{ xs: 12, sm: 12, md: 12, lg: 6 }}>
                    <ProjectCard project={project} />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Alert severity="info">No project</Alert>
            )}
          </Stack>
        </Stack>
      </Stack>

      <UsersPickerModal
        open={membersModalOpen}
        users={allUsers}
        selectedUserIds={users.map(u => u.id)}
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

      <ConfirmationModal
        open={removeUserConfirmationOpen}
        title="Remove User"
        message="Are you sure you want to remove this user from the team?"
        confirmLabel="Remove"
        confirmColor="error"
        onConfirm={confirmRemoveUser}
        onCancel={cancelRemoveUser}
      />
    </>
  );
};

export default TeamPage;
