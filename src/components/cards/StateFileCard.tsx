import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import RestoreIcon from '@mui/icons-material/Restore';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { IconButton, Stack, Tooltip, Typography } from '@mui/material';
import { FC, useMemo } from 'react';
import { sampleUsers } from '../../sampleData';
import { StateFileSnapshot } from '../../types/buisness';

type StateFileCardProps = {
  stateFile: StateFileSnapshot;
  onCompare: (state: StateFileSnapshot) => void;
  onRestore: (state: StateFileSnapshot) => void;
  onView: (state: StateFileSnapshot) => void;
};

const StateFileCard: FC<StateFileCardProps> = ({ stateFile, onCompare, onRestore, onView }) => {
  const createdByUser = useMemo(
    () => sampleUsers.find((u) => u.id === stateFile.createdBy),
    [stateFile],
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
        <Tooltip title="Restore">
          <IconButton size="small" onClick={() => onRestore(stateFile)}>
            <RestoreIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="View">
          <IconButton size="small" onClick={() => onView(stateFile)}>
            <VisibilityIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Stack>
    </Stack>
  );
};

export default StateFileCard;
