import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';
import { FC } from 'react';
import { Project, User } from '../../types/buisness';

type TerraformModalProps = {
  open: boolean;
  onClose: () => void;
  project: Project;
  user: User;
};

const TerraformModal: FC<TerraformModalProps> = ({ open, onClose, project, user }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Terraform Backend configuration</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Run these commands to configure Terraform with your TerraHarbor backend:
        </Typography>
        <Box
          component="pre"
          sx={{
            bgcolor: 'grey.100',
            p: 2,
            borderRadius: 2,
            fontFamily: 'monospace',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            fontSize: 13,
          }}
        >
          {`export TERRAHARBOR_PASSWORD=<your-password-here>
export DOMAIN=<domain-here>
export PROTOCOL=<protocol>
terraform init \\
  -backend-config="address=$PROTOCOL://$DOMAIN/state/${project.id}/main" \\
  -backend-config="lock_address=$PROTOCOL://$DOMAIN/state/${project.id}/main" \\
  -backend-config="unlock_address=$PROTOCOL://$DOMAIN/state/${project.id}/main" \\
  -backend-config="username=${user.username}" \\
  -backend-config="password=$TERRAHARBOR_PASSWORD" \\
  -backend-config="lock_method=LOCK" \\
  -backend-config="unlock_method=UNLOCK" \\
  -backend-config="retry_wait_min=5"`}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TerraformModal;
