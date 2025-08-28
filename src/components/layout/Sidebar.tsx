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
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import { FC, JSX } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

type NavItem = { label: string; to: string; icon: JSX.Element };

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', to: '/', icon: <DashboardIcon /> },
  { label: 'Projects', to: '/projects', icon: <ProjectsIcon /> },
  { label: 'Teams', to: '/teams', icon: <TeamsIcon /> },
  { label: 'Users', to: '/users', icon: <UsersIcon /> },
  { label: 'Tokens', to: '/tokens', icon: <TokensIcon /> },
  { label: 'Audit (logs)', to: '/audit', icon: <AuditIcon /> },
  { label: 'Settings', to: '/settings', icon: <SettingsIcon /> },
];

const Sidebar: FC = () => {
  const { pathname } = useLocation();

  return (
    <Stack
      sx={{ height: '100%', display: 'flex', flexDirection: 'column', border: '1px solid red' }}
    >
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

export default Sidebar;
