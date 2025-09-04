import CloseIcon from '@mui/icons-material/Close';
import {
  Alert,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import { FC } from 'react';
import { sampleUsers } from '../../sampleData';
import { StateFileSnapshot } from '../../types/buisness';
import JsonViewer from '../JsonViewer';

type StateFileViewerModalProps = {
  open: boolean;
  onClose: () => void;
  snapshot?: StateFileSnapshot | null;
};

const StateFileViewerModal: FC<StateFileViewerModalProps> = ({ open, onClose, snapshot }) => {
  const createdByUser = snapshot ? sampleUsers.find((u) => u.id === snapshot.createdBy) : undefined;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="h6">State File Terraform • v{snapshot?.version}</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent dividers>
        {snapshot ? (
          <Stack spacing={2}>
            <Typography variant="caption" color="text.secondary">
              {new Date(snapshot.createdAt).toLocaleString()}
              {' • '}
              by {createdByUser?.username ?? snapshot.createdBy}
            </Typography>

            <JsonViewer value={snapshot.content} />
          </Stack>
        ) : (
          <Alert severity="info">No version selected</Alert>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default StateFileViewerModal;
