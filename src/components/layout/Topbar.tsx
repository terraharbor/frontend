import { AppBar, Avatar, Toolbar, Typography } from '@mui/material';
import { FC } from 'react';

const Topbar: FC = () => {
  return (
    <AppBar
      position="sticky"
      elevation={0}
      color="inherit"
      sx={{
        borderBottom: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.default',
      }}
    >
      <Toolbar sx={{ justifyContent: 'flex-end', gap: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Administrator
        </Typography>
        <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>A</Avatar>
        <Typography variant="body2" fontWeight={600}>
          My profile
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;
