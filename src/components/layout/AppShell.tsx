import {
  FactCheck as AuditIcon,
  Dashboard as DashboardIcon,
  Folder as ProjectsIcon,
  Settings as SettingsIcon,
  Groups as TeamsIcon,
  VpnKey as TokensIcon,
  People as UsersIcon,
} from '@mui/icons-material';
import {
  AppBar,
  Avatar,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import { FC, JSX, PropsWithChildren } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

type Item = { label: string; to: string; icon: JSX.Element };

const NAV_ITEMS: Item[] = [
  { label: 'Dashboard', to: '/', icon: <DashboardIcon /> },
  { label: 'Projects', to: '/projects', icon: <ProjectsIcon /> },
  { label: 'Teams', to: '/teams', icon: <TeamsIcon /> },
  { label: 'Users', to: '/users', icon: <UsersIcon /> },
  { label: 'Tokens', to: '/tokens', icon: <TokensIcon /> },
  { label: 'Audit (logs)', to: '/audit', icon: <AuditIcon /> },
  { label: 'Settings', to: '/settings', icon: <SettingsIcon /> },
];

const DrawerContent: FC = () => {
  const { pathname } = useLocation();

  return (
    <Stack sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Stack sx={{ px: 2, py: 3 }}>
        <Typography variant="h6" fontWeight={800} color="secondary.main">
          TerraHarbor
        </Typography>
      </Stack>
      <Divider />
      <List sx={{ flex: 1, mt: 1 }}>
        {NAV_ITEMS.map((item) => {
          const selected = item.to === '/' ? pathname === '/' : pathname.startsWith(item.to);
          return (
            <ListItemButton
              key={item.to}
              component={NavLink}
              to={item.to}
              selected={selected}
              sx={{
                mx: 1,
                mb: 0.5,
                borderRadius: 1.5,
                '&.Mui-selected': {
                  bgcolor: 'rgba(40,203,139,0.12)',
                  '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
                    color: 'primary.main',
                  },
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 36 }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          );
        })}
      </List>
      <Stack sx={{ px: 2, py: 2, color: 'text.secondary', fontSize: 12 }}>
        © {new Date().getFullYear()} TerraHarbor
      </Stack>
    </Stack>
  );
};

const AppShell: FC<PropsWithChildren> = ({ children }) => {
  return (
    <Stack sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Drawer
        variant="permanent"
        open
        sx={{
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            StackSizing: 'border-box',
            borderRight: 0,
            bgcolor: 'background.paper',
          },
        }}
      >
        <DrawerContent />
      </Drawer>

      <Stack sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Topbar simple */}
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

        <Stack sx={{ flex: 1, display: 'flex', justifyContent: 'center', px: 2, py: 4 }}>
          {children}
        </Stack>
      </Stack>
    </Stack>
  );
};

export default AppShell;
