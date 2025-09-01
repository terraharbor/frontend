import { Avatar, Button, Chip, Menu, Stack, Toolbar, Typography, MenuItem, Divider, ListItemIcon } from '@mui/material';
import { FC, MouseEvent, useState } from 'react';
import { Logout as LogoutIcon, Person as PersonIcon } from '@mui/icons-material';
import { useAuth } from '../providers/useAuth';
import { useToast } from '../providers/useToast';

const UserMenu: FC = () => {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
    showToast({ 
      message: 'Successfully logged out', 
      severity: 'info' 
    });
  };

  if (!user) {
    return null;
  }

  const initials = user.firstName && user.lastName 
    ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase()
    : user.username.charAt(0).toUpperCase();

  const displayName = user.firstName && user.lastName 
    ? `${user.firstName} ${user.lastName}`
    : user.username;

  return (
    <>
      <Button
        onMouseEnter={handleOpen}
        sx={{ 
          minWidth: 'auto',
          p: 0,
          borderRadius: '50%',
          '&:hover': {
            bgcolor: 'action.hover',
          }
        }}
      >
        <Avatar
          sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}
        >
          {initials}
        </Avatar>
      </Button>
      
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          paper: {
            sx: { minWidth: 280, mt: 1 }
          }
        }}
      >
        <Stack sx={{ p: 2, pb: 1 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar sx={{ width: 40, height: 40, bgcolor: 'primary.main' }}>
              {initials}
            </Avatar>
            <Stack spacing={0}>
              <Typography variant="subtitle1" fontWeight="bold">
                {displayName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                @{user.username}
              </Typography>
              {user.email && (
                <Typography variant="body2" color="text.secondary">
                  {user.email}
                </Typography>
              )}
            </Stack>
          </Stack>
          
          <Chip 
            size="small" 
            label={user.disabled ? 'Inactive' : 'Active'} 
            color={user.disabled ? 'error' : 'success'}
            variant="outlined"
            sx={{ alignSelf: 'flex-start', mt: 1 }}
          />
        </Stack>

        <Divider />

        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          Profile Settings
        </MenuItem>
        
        <Divider />
        
        <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" color="error" />
          </ListItemIcon>
          Logout
        </MenuItem>
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
