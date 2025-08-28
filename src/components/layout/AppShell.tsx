import { Stack } from '@mui/material';
import { FC, PropsWithChildren } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const AppShell: FC<PropsWithChildren> = ({ children }) => {
  return (
    <Stack
      direction="row"
      sx={{
        minHeight: '100vh',
        minWidth: '100vh',
        bgcolor: 'background.default',
      }}
    >
      <Sidebar />
      <Stack sx={{ width: '100%' }}>
        <Topbar />
        <Stack sx={{ p: 2 }}>{children}</Stack>
      </Stack>
    </Stack>
  );
};

export default AppShell;
