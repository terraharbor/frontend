import { Avatar, Button, Chip, Menu, Stack, Toolbar, Typography } from '@mui/material';
import { FC, MouseEvent, useState } from 'react';

export type UserInfo = {
  name: string;
  email: string;
  role: string;
  initials?: string;
};

type UserMenuProps = {
  user: UserInfo;
  onLogout: () => void;
};

const UserMenu: FC<UserMenuProps> = ({ user, onLogout }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Avatar
        sx={{ width: 32, height: 32, bgcolor: 'secondary.main', cursor: 'pointer' }}
        onMouseEnter={handleOpen}
      >
        {user.initials ?? 'A'}
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
              {user.initials ?? 'A'}
            </Avatar>
            <Stack>
              <Typography fontWeight="bold">{user.name}</Typography>
              <Typography variant="body2">{user.email}</Typography>
            </Stack>
          </Stack>

          <Chip size="small" label={user.role} />
          <Button variant="outlined" size="small" fullWidth onClick={onLogout}>
            Déconnexion
          </Button>
        </Stack>
      </Menu>
    </>
  );
};

const mockUser: UserInfo = {
  name: 'John Doe',
  email: 'john.doe@test.com',
  role: 'Administrateur',
  initials: 'JD',
};

const Topbar: FC = () => {
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
        <UserMenu user={mockUser} onLogout={() => console.log('logout')} />
      </Toolbar>
    </Stack>
  );
};

export default Topbar;
