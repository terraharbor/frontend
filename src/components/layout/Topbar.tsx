import { Avatar, Button, Chip, Menu, Stack, Toolbar, Typography } from '@mui/material';
import { FC, MouseEvent, useState } from 'react';
import { useAuth } from '../providers/useAuth';
import { useToast } from '../providers/useToast';

const UserMenu: FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { user, isAdmin, logout } = useAuth();
  const { showToast } = useToast();
  const open = Boolean(anchorEl);

  const handleOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    showToast({
      message: 'Successfully logged out',
      severity: 'info',
    });
  };

  return (
    <>
      <Avatar
        sx={{ width: 32, height: 32, bgcolor: 'secondary.main', cursor: 'pointer' }}
        onMouseEnter={handleOpen}
      >
        {user?.username.charAt(0) ?? 'A'}
      </Avatar>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Stack spacing={1} sx={{ p: 1, minWidth: 300 }}>
          <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
            <Avatar sx={{ width: 48, height: 48, bgcolor: 'secondary.main' }}>
              {user?.username.charAt(0) ?? 'A'}
            </Avatar>
            <Stack>
              <Typography fontWeight="bold">Name</Typography>
              <Typography variant="body2">E-mail</Typography>
            </Stack>
          </Stack>

          {isAdmin && <Chip size="small" label="Administrator" />}
          <Button variant="outlined" size="small" fullWidth onClick={handleLogout}>
            Déconnexion
          </Button>
        </Stack>
      </Menu>
    </>
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
        {isAuthenticated && <UserMenu />}
      </Toolbar>
    </Stack>
  );
};

export default Topbar;
