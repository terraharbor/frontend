import { Box, CircularProgress, Typography } from '@mui/material';
import { FC, useEffect, useState } from 'react';
import { UserService } from '../api/userService';
import { UserFormOutput } from '../components/forms/UserForm';
import UsersList from '../components/lists/UsersList';
import ConfirmationModal from '../components/modals/ConfirmationModal';
import UserModal from '../components/modals/UserModal';
import { PageHeader } from '../components/PageHeader';
import { useAuth } from '../components/providers/useAuth';
import { useToast } from '../components/providers/useToast';
import { ModalMode } from '../types';
// import { sampleUsers } from '../sampleData'; // Fallback sample data
import { User } from '../types/buisness';
import { getErrorMessage, logError } from '../utils/simpleErrorHandler';

export const UsersPage: FC = () => {
  const { isAdmin } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  // const [users, setUsers] = useState<User[]>(sampleUsers); // Fallback to sample data
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mode, setMode] = useState<ModalMode>('create');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const { showToast } = useToast();

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await UserService.getUsers();
      setUsers(data);
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      showToast({ message: `Error loading users: ${errorMessage}`, severity: 'error' });
      logError('loadUsers', err);
      // Fallback to sample data if API fails
      // setUsers(sampleUsers);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

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
          isAdmin: values.isAdmin,
        });
        showToast({ message: 'User created successfully', severity: 'success' });

        // Sample data fallback implementation (commented out):
        // const newUser: User = {
        //   id: String(Date.now()), // Temporary ID for sample data
        //   username: values.username,
        //   email: values.email,
        //   firstName: values.firstName,
        //   lastName: values.lastName,
        //   isAdmin: values.isAdmin,
        // };
        // setUsers((prev) => [newUser, ...prev]);
      } else if (mode === 'edit' && editingUser) {
        await UserService.updateUser(editingUser.id, {
          username: values.username,
          isAdmin: values.isAdmin,
        });
        showToast({ message: 'User updated successfully', severity: 'success' });

        // Sample data fallback implementation (commented out):
        // setUsers((prev) => prev.map((u) => (u.id === editingUser.id ? { ...u, ...values } : u)));
      }
      setIsModalOpen(false);
      await loadUsers(); // Reload data from API
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      showToast({ message: `Error saving user: ${errorMessage}`, severity: 'error' });
      logError('handleSubmitUser', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = (user: User) => {
    setUserToDelete(user);
    setDeleteConfirmationOpen(true);
  };

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      await UserService.deleteUser(userToDelete.id);
      showToast({ message: 'User deleted successfully', severity: 'success' });
      await loadUsers(); // Reload data from API

      // Sample data fallback implementation (commented out):
      // setUsers((prev) => prev.filter((u) => u.id !== userToDelete.id));
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      showToast({ message: `Error deleting user: ${errorMessage}`, severity: 'error' });
      logError('deleteUser', err);
    } finally {
      setDeleteConfirmationOpen(false);
      setUserToDelete(null);
    }
  };

  const cancelDeleteUser = () => {
    setUserToDelete(null);
    setDeleteConfirmationOpen(false);
  };

  return (
    <Box>
      <PageHeader title="Users" />

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
      ) : users.length > 0 ? (
        <UsersList
          users={users}
          allowUpdate={isAdmin}
          allowDelete={isAdmin}
          onUpdate={openEditModal}
          onDelete={handleDeleteUser}
        />
      ) : (
        <Typography variant="body1" sx={{ mt: 2, textAlign: 'center', color: 'text.secondary' }}>
          No users found.
        </Typography>
      )}

      <UserModal
        open={isModalOpen}
        mode={mode}
        initialValues={editingUser ?? undefined}
        onClose={closeModal}
        onSubmit={handleSubmitUser}
      />

      <ConfirmationModal
        open={deleteConfirmationOpen}
        title="Delete User"
        message={
          userToDelete
            ? `Are you sure you want to delete the user "${userToDelete.username}"? This action is irreversible.`
            : 'Are you sure you want to delete this user? This action is irreversible.'
        }
        confirmLabel="Delete"
        confirmColor="error"
        onConfirm={confirmDeleteUser}
        onCancel={cancelDeleteUser}
      />
    </Box>
  );
};

export default UsersPage;
