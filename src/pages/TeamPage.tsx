import EditIcon from '@mui/icons-material/Edit';
import { Alert, CircularProgress, IconButton, Stack, Typography, Box } from '@mui/material';
import Grid from '@mui/material/Grid';
import { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ProjectCard from '../components/cards/ProjectCard';
import { TeamFormOutput } from '../components/forms/TeamForm';
import UsersList from '../components/lists/UsersList';
import UsersPickerModal from '../components/modals/UsersPickerModal';
import PageHeader from '../components/PageHeader';
import { useAuth } from '../components/providers/useAuth';
import { useToast } from '../components/providers/useToast';
import { TeamService } from '../api/teamService';
import { UserService } from '../api/userService';
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeamData();
  }, [id]);

  const openMembersModal = () => setMembersModalOpen(true);
  const closeMembersModal = () => setMembersModalOpen(false);

  const handleSaveMembers = async (selectedUserIds: string[]) => {
    if (!team) return;
    
    try {
      // Get current members and new members
      const currentMemberIds = users.map(u => u.id);
      const toAdd = selectedUserIds.filter(id => !currentMemberIds.includes(id));
      const toRemove = currentMemberIds.filter(id => !selectedUserIds.includes(id));
      
      // Add new members
      for (const userId of toAdd) {
        await TeamService.addTeamMember(team.id, userId);
      }
      
      // Remove members
      for (const userId of toRemove) {
        await TeamService.removeTeamMember(team.id, userId);
      }
      
      showToast({ message: 'Team members updated successfully', severity: 'success' });
      setMembersModalOpen(false);
      
      // Reload team members
      const updatedMembers = await TeamService.getTeamMembers(team.id);
      setUsers(updatedMembers);
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      showToast({ message: `Error updating team members: ${errorMessage}`, severity: 'error' });
      logError('handleSaveMembers', err);
    }
  };

  const handleRemoveUser = async (userId: string) => {
    if (!team) return;
    
    try {
      await TeamService.removeTeamMember(team.id, userId);
      showToast({ message: 'User removed from team successfully', severity: 'success' });
      
      // Update local state
      setUsers(prev => prev.filter(u => u.id !== userId));
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      showToast({ message: `Error removing user: ${errorMessage}`, severity: 'error' });
      logError('handleRemoveUser', err);
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
        <PageHeader title={team.name} />
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

            <UsersList users={users} allowDelete={isAdmin} onDelete={handleRemoveUser} />
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
    </>
  );
};

export default TeamPage;
