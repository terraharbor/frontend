import { ModalMode } from '../types';
import { Add as AddIcon } from '@mui/icons-material';
import { Box, CircularProgress, Typography } from '@mui/material';
import { FC, useState, useEffect } from 'react';
import { UserFormOutput } from '../components/forms/UserForm';
import UsersList from '../components/lists/UsersList';
import UserModal from '../components/modals/UserModal';
import { PageHeader } from '../components/PageHeader';
import { useToast } from '../components/providers/useToast';
import { useAuth } from '../components/providers/useAuth';
import { UserService } from '../api/userService';
import { User } from '../types/buisness';
import { getErrorMessage, logError } from '../utils/simpleErrorHandler';

export const UsersPage: FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mode, setMode] = useState<ModalMode>('create');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();
  const { isAdmin } = useAuth();

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await UserService.getUsers();
      setUsers(data);
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      showToast({ message: `Error loading users: ${errorMessage}`, severity: 'error' });
      logError('loadUsers', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const openCreateModal = () => {
    setMode('create');
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const openEditModal = (user: User) => {
    setMode('edit');
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleSubmitUser = async (values: UserFormOutput) => {
    setIsSubmitting(true);
    try {
      if (mode === 'create') {
        await UserService.createUser({
          username: values.username,
          email: values.email,
          isAdmin: values.isAdmin,
        });
        showToast({ message: 'User created successfully', severity: 'success' });
      } else if (mode === 'edit' && editingUser) {
        await UserService.updateUser(editingUser.id, {
          username: values.username,
          email: values.email,
          isAdmin: values.isAdmin,
        });
        showToast({ message: 'User updated successfully', severity: 'success' });
      }
      
      await loadUsers();
      setIsModalOpen(false);
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      showToast({ message: `Error saving user: ${errorMessage}`, severity: 'error' });
      logError('saveUser', err);
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <Box>
      <PageHeader
        title="Users"
        action={isAdmin ? {
          label: 'New',
          onClick: openCreateModal,
          startIcon: <AddIcon />,
          variant: 'contained',
          color: 'primary',
        } : undefined}
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
      ) : (
        <UsersList
          users={users}
          allowUpdate={isAdmin}
          allowDelete={isAdmin}
          onUpdate={openEditModal}
          onDelete={async (id: string) => {
            try {
              await UserService.deleteUser(id);
              showToast({ message: 'User deleted successfully', severity: 'success' });
              await loadUsers();
            } catch (err) {
              const errorMessage = getErrorMessage(err);
              showToast({ message: `Error deleting user: ${errorMessage}`, severity: 'error' });
              logError('deleteUser', err);
            }
          }}
        />
      )}

      <UserModal
        open={isModalOpen}
        mode={mode}
        initialValues={editingUser ?? undefined}
        onClose={closeModal}
        onSubmit={handleSubmitUser}
        loading={isSubmitting}
      />
    </Box>
  );
};

export default UsersPage;