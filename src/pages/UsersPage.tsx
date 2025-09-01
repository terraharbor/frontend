import { Add as AddIcon } from '@mui/icons-material';
import { Box } from '@mui/material';
import { FC, useState } from 'react';
import { UserFormOutput } from '../components/forms/UserForm';
import UsersList from '../components/lists/UsersList';
import UserModal from '../components/modals/UserModal';
import { PageHeader } from '../components/PageHeader';
import { sampleUsers } from '../sampleData';
import { User } from '../types/buisness';

export const UsersPage: FC = () => {
  const [users, setUsers] = useState<User[]>(sampleUsers);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenCreateModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmitUser = (values: UserFormOutput) => {
    const newUser: User = {
      id: '0' /* TODO: A gérer avec backend */,
      username: values.username,
      email: values.email,
      role: values.role,
    };

    setUsers((prev) => [newUser, ...prev]);
    setIsModalOpen(false);
  };

  return (
    <Box>
      <PageHeader
        title="Utilisateurs"
        action={{
          label: 'CRÉER',
          onClick: handleOpenCreateModal,
          startIcon: <AddIcon />,
          variant: 'contained',
          color: 'primary',
        }}
      />

      <UsersList users={users} allowDelete={true} />

      <UserModal
        open={isModalOpen}
        mode="create"
        initialValues={{}}
        onClose={handleCloseModal}
        onSubmit={handleSubmitUser}
      />
    </Box>
  );
};

export default UsersPage;
