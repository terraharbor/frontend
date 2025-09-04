import {
  FactCheck as AuditIcon,
  Dashboard as DashboardIcon,
  Folder as ProjectsIcon,
  Groups as TeamsIcon,
  VpnKey as TokensIcon,
  People as UsersIcon,
} from '@mui/icons-material';
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { FC, JSX } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import theme from '../../theme';
import { useAuth } from '../providers/useAuth';

type NavItem = { label: string; to: string; icon: JSX.Element; adminOnly?: boolean };

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', to: '/', icon: <DashboardIcon /> },
  { label: 'Projects', to: '/projects', icon: <ProjectsIcon /> },
  { label: 'Teams', to: '/teams', icon: <TeamsIcon /> },
  { label: 'Users', to: '/users', icon: <UsersIcon /> },
  { label: 'Tokens', to: '/tokens', icon: <TokensIcon />, adminOnly: true },
  { label: 'Audit (logs)', to: '/audit', icon: <AuditIcon />, adminOnly: true },
];

const Sidebar: FC = () => {
  const { isAdmin } = useAuth();
  const { pathname } = useLocation();

  const visibleItems = NAV_ITEMS.filter((item) => !item.adminOnly || isAdmin);

  return (
    <Stack sx={{ height: '100%', width: '300px', bgcolor: 'secondary.main' }}>
      <Stack direction="row" alignItems="center" spacing={2} sx={{ height: 64, p: 2 }}>
        <Box
          component="img"
          src="/logob.png"
          alt="TerraHarbor Logo"
          sx={{
            height: 48,
            width: 'auto',
            filter: 'brightness(0) invert(1)',
          }}
        />
        <Typography variant="h3" sx={{ color: 'neutral.white', fontWeight: 'bold' }}>
          TerraHarbor
        </Typography>
      </Stack>

      <List>
        {visibleItems.map((item) => {
          const selected = item.to === '/' ? pathname === '/' : pathname.startsWith(item.to);
          return (
            <ListItemButton
              key={item.to}
              component={NavLink}
              to={item.to}
              selected={selected}
              sx={{
                '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.1) },
                '&.Mui-selected': { bgcolor: 'primary.main' },
                '&.Mui-selected:hover': { bgcolor: 'primary.main' },
              }}
            >
              <ListItemIcon color="neutral.white" sx={{ minWidth: 32, color: 'neutral.white' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText color="neutral.white" sx={{ ml: 2 }}>
                <Typography color="neutral.white">{item.label}</Typography>
              </ListItemText>
            </ListItemButton>
          );
        })}
      </List>
    </Stack>
  );
};

export default Sidebar;
