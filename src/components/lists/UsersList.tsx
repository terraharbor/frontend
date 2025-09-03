import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Box, IconButton } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { FC } from 'react';
import { User } from '../../types/buisness';

type UsersListProps = {
  users: User[];
  allowUpdate?: boolean;
  allowDelete?: boolean;
  onUpdate?: (user: User) => void;
  onDelete?: (id: string) => void;
};

const UsersList: FC<UsersListProps> = ({
  users,
  allowUpdate = false,
  allowDelete = false,
  onUpdate,
  onDelete,
}) => {
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
      renderCell: (params: { row: User }) => (
        <Box>
          {allowUpdate && (
            <IconButton
              color="primary"
              onClick={() => onUpdate?.(params.row)}
              title="Modifier l'utilisateur"
            >
              <EditIcon />
            </IconButton>
          )}

          {allowDelete ? (
            <IconButton
              color="error"
              onClick={() => onDelete?.(params.row.id)}
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
    <>
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
    </>
  );
};

export default UsersList;
