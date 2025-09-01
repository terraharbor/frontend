import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Box, IconButton } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../../types/buisness';
import { useToast } from '../providers/useToast';

type UsersListProps = {
  users: User[];
  allowDelete?: boolean;
};

const UsersList: FC<UsersListProps> = ({ users, allowDelete = false }) => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const onView = (userId: string) => {
    navigate(`/users/${userId}`);
  };

  const onDelete = async (userId: string) => {
    try {
      // Call API
      console.log('Delete ' + userId);
    } catch (error) {
      // Call API
      showToast({ message: "Erreur lors de la suppression de l'utilisateur.", severity: 'error' });
      console.error(error);
    }
  };

  const columns: GridColDef<User>[] = [
    { field: 'id', headerName: 'ID', flex: 1 },
    { field: 'username', headerName: 'Nom', flex: 1 },
    { field: 'email', headerName: 'E-mail', flex: 1 },
    { field: 'role', headerName: 'Rôle', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      sortable: false,
      renderCell: (params: { row: { id: string } }) => (
        <Box>
          <IconButton
            color="primary"
            onClick={() => onView(params.row.id)}
            title="Voir l'utilisateur"
          >
            <VisibilityIcon />
          </IconButton>

          {allowDelete ? (
            <IconButton
              color="error"
              onClick={() => onDelete(params.row.id)}
              title="Supprimer l'utilisateur"
            >
              <DeleteIcon />
            </IconButton>
          ) : null}
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ borderRadius: 2 }}>
      <DataGrid
        rows={users}
        columns={columns}
        initialState={{
          pagination: { paginationModel: { pageSize: 5, page: 0 } },
        }}
        pageSizeOptions={[5, 10, 20]}
        disableRowSelectionOnClick
        getRowId={(row) => row.id}
        sx={{
          bgcolor: 'neutral.white',
          border: 'none',
        }}
      />
    </Box>
  );
};

export default UsersList;
