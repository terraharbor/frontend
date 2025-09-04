import { Logout as LogoutIcon } from '@mui/icons-material';
import {
  Button,
  Stack,
  Toolbar,
} from '@mui/material';
import { FC } from 'react';
import { useAuth } from '../providers/useAuth';
import { useToast } from '../providers/useToast';
import { UserInfo } from '../UserInfo';

const UserSection: FC = () => {
  const { logout } = useAuth();
  const { showToast } = useToast();

  const handleLogout = () => {
    logout();
    showToast({
      message: 'Successfully logged out',
      severity: 'info',
    });
  };

  return (
    <Stack direction="row" spacing={2} alignItems="center">
      <UserInfo variant="compact" />
      <Button
        onClick={handleLogout}
        startIcon={<LogoutIcon />}
        color="inherit"
        size="small"
      >
        Logout
      </Button>
    </Stack>
  );
};

const Topbar: FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Stack
      sx={{
        height: 64,
        bgcolor: 'neutral.white',
        borderBottom: '1px solid',
        borderColor: '#e0e0e0',
      }}
    >
      <Toolbar sx={{ justifyContent: 'flex-end', gap: 2 }}>
        {isAuthenticated && <UserSection />}
      </Toolbar>
    </Stack>
  );
};

export default Topbar;
