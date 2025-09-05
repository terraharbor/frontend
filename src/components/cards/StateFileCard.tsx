import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import DeleteIcon from '@mui/icons-material/Delete';
import RestoreIcon from '@mui/icons-material/Restore';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { IconButton, Stack, Tooltip, Typography } from '@mui/material';
import { FC, useMemo } from 'react';
import { StateFileSnapshot, User } from '../../types/buisness';
import { useAuth } from '../providers/useAuth';

type StateFileCardProps = {
  stateFile: StateFileSnapshot;
  users: User[];
  onCompare: (state: StateFileSnapshot) => void;
  onRestore: (state: StateFileSnapshot) => void;
  onView: (state: StateFileSnapshot) => void;
  onDelete: (state: StateFileSnapshot) => void;
};

const StateFileCard: FC<StateFileCardProps> = ({
  stateFile,
  users,
  onCompare,
  onRestore,
  onView,
  onDelete,
}) => {
  const { isAdmin } = useAuth();
  const createdByUser = useMemo(
    () => users.find((u) => u.username === stateFile.createdBy),
    [stateFile, users],
  );

  return (
    <Stack
      direction="row"
      sx={{
        justifyContent: 'space-between',
        alignItems: 'center',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        p: 2,
        bgcolor: 'neutral.white',
      }}
    >
      <Stack>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          v{stateFile.version}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {new Date(stateFile.createdAt).toLocaleString()} • by {createdByUser?.username}
        </Typography>
      </Stack>

      <Stack direction="row" spacing={1}>
        <Tooltip title="Compare">
          <IconButton size="small" onClick={() => onCompare(stateFile)}>
            <CompareArrowsIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        {isAdmin && (
          <Tooltip title="Restore">
            <IconButton size="small" onClick={() => onRestore(stateFile)}>
              <RestoreIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
        <Tooltip title="Open">
          <IconButton size="small" onClick={() => onView(stateFile)}>
            <VisibilityIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        {isAdmin && (
          <Tooltip title="Delete">
            <IconButton size="small" color="error" onClick={() => onDelete(stateFile)}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </Stack>
    </Stack>
  );
};

export default StateFileCard;
