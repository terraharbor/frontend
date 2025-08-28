import { Stack } from '@mui/material';
import { FC, PropsWithChildren } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const AppShell: FC<PropsWithChildren> = ({ children }) => {
  return (
    <Stack
      direction="row"
      sx={{
        height: '100vh',
        width: '100%',
        bgcolor: 'background.default',
      }}
    >
      <Sidebar />
      <Stack>
        <Topbar />
        <Stack sx={{ p: 2, overflowY: 'auto' }}>{children}</Stack>
      </Stack>
    </Stack>
  );
};

export default AppShell;
