import EditIcon from '@mui/icons-material/Edit';
import { Alert, IconButton, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { FC, useMemo, useState } from 'react';
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
import { sampleProjects, sampleTeams, sampleUsers } from '../sampleData';
import { Project, Team, User } from '../types/buisness';

const TeamPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const { isAdmin } = useAuth();
  const { showToast } = useToast();
  const [membersModalOpen, setMembersModalOpen] = useState(false);
  const [teamEditModalOpen, setTeamEditModalOpen] = useState(false);
  const [removeUserConfirmationOpen, setRemoveUserConfirmationOpen] = useState(false);
  const [userToRemove, setUserToRemove] = useState<string | null>(null);

  const initialTeam: Team | undefined = useMemo(() => sampleTeams.find((t) => t.id === id), [id]);
  const [team, setTeam] = useState<Team | undefined>(initialTeam);

  const projects = useMemo<Project[]>(
    () => (team ? sampleProjects.filter((p) => p.teamIds.includes(team.id)) : []),
    [team],
  );

  const users = useMemo<User[]>(
    () => (team ? sampleUsers.filter((u) => team.userIds.includes(u.id)) : []),
    [team],
  );

  const openMembersModal = () => setMembersModalOpen(true);
  const closeMembersModal = () => setMembersModalOpen(false);

  const openTeamEditModal = () => setTeamEditModalOpen(true);
  const closeTeamEditModal = () => setTeamEditModalOpen(false);

  const handleSaveMembers = (selectedUserIds: string[]) => {
    setTeam((prev) => (prev ? { ...prev, userIds: selectedUserIds } : prev));
    setMembersModalOpen(false);
  };

  const handleRemoveUser = (userId: string) => {
    setUserToRemove(userId);
    setRemoveUserConfirmationOpen(true);
  };

  const confirmRemoveUser = () => {
    if (userToRemove) {
      setTeam((prev) => {
        if (!prev) return prev;
        if (!prev.userIds.includes(userToRemove)) return prev;
        return { ...prev, userIds: prev.userIds.filter((id) => id !== userToRemove) };
      });
      showToast({ message: 'User removed successfully.', severity: 'success' });
      setUserToRemove(null);
    }
    setRemoveUserConfirmationOpen(false);
  };

  const cancelRemoveUser = () => {
    setUserToRemove(null);
    setRemoveUserConfirmationOpen(false);
  };

  const handleSaveTeam = (values: TeamFormOutput) => {
    setTeam((prev) => {
      if (!prev) return prev;
      return { ...prev, name: values.name, description: values.description };
    });

    showToast({ message: 'Team updated successfully.', severity: 'success' });
    closeTeamEditModal();
  };

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
        users={sampleUsers}
        selectedUserIds={team.userIds}
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
