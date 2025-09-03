import { ModalMode } from '@/types';
import { Add as AddIcon } from '@mui/icons-material';
import { Box } from '@mui/material';
import { FC, useState } from 'react';
import { UserFormOutput } from '../components/forms/UserForm';
import UsersList from '../components/lists/UsersList';
import ConfirmationModal from '../components/modals/ConfirmationModal';
import UserModal from '../components/modals/UserModal';
import { PageHeader } from '../components/PageHeader';
import { useAuth } from '../components/providers/useAuth';
import { useToast } from '../components/providers/useToast';
import { sampleUsers } from '../sampleData';
import { User } from '../types/buisness';

export const UsersPage: FC = () => {
  const { isAdmin } = useAuth();
  const [users, setUsers] = useState<User[]>(sampleUsers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mode, setMode] = useState<ModalMode>('create');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const { showToast } = useToast();

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

  const handleSubmitUser = (values: UserFormOutput) => {
    if (mode === 'create') {
      const newUser: User = {
        id: '0', // TODO: géré par le backend plus tard
        username: values.username,
        email: values.email,
        isAdmin: values.isAdmin,
      };
      setUsers((prev) => [newUser, ...prev]);
      showToast({ message: 'User created', severity: 'success' });
    } else if (mode === 'edit' && editingUser) {
      setUsers((prev) => prev.map((u) => (u.id === editingUser.id ? { ...u, ...values } : u)));
      showToast({ message: 'User updated', severity: 'success' });
    }
    setIsModalOpen(false);
  };

  const handleDeleteUser = (id: string) => {
    const user = users.find((u) => u.id === id);
    if (user) {
      setUserToDelete(user);
      setDeleteConfirmationOpen(true);
    }
  };

  const confirmDeleteUser = () => {
    if (userToDelete) {
      // TODO: appeler l'API
      setUsers((prev) => prev.filter((u) => u.id !== userToDelete.id));
      showToast({ message: 'User deleted successfully.', severity: 'success' });
      setUserToDelete(null);
    }
    setDeleteConfirmationOpen(false);
  };

  const cancelDeleteUser = () => {
    setUserToDelete(null);
    setDeleteConfirmationOpen(false);
  };

  return (
    <Box>
      <PageHeader
        title="Users"
        action={
          isAdmin
            ? {
                label: 'New',
                onClick: openCreateModal,
                startIcon: <AddIcon />,
                variant: 'contained',
                color: 'primary',
              }
            : undefined
        }
      />

      <UsersList
        users={users}
        allowUpdate
        allowDelete
        onUpdate={openEditModal}
        onDelete={handleDeleteUser}
      />

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
