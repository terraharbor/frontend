import React, { ReactNode } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Stack,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Link } from 'react-router-dom';
import logoImage from '../../assets/logob.png';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  subtitle,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
        py: 3,
      }}
    >
      <Container maxWidth="sm">
        <Stack spacing={4} alignItems="center">
          {/* Logo/Brand */}
          <Box
            component={Link}
            to="/"
            sx={{
              textDecoration: 'none',
              color: theme.palette.primary.dark,
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <Stack direction="row" alignItems="center" spacing={2}>
              <Box
                component="img"
                src={logoImage}
                alt="TerraHarbor Logo"
                sx={{
                  height: 72,
                  width: 'auto',
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
                }}
              />
              <Typography
                variant="h1"
                component="h1"
                sx={{
                  fontWeight: 'bold',
                  color: theme.palette.primary.dark,
                  textShadow: '0 1px 2px rgba(0,0,0,0.1)',
                }}
              >
                TerraHarbor
              </Typography>
            </Stack>
          </Box>

          {/* Auth Form Container */}
          <Paper
            elevation={8}
            sx={{
              width: '100%',
              p: isMobile ? 3 : 4,
              borderRadius: 2,
            }}
          >
            <Stack spacing={3}>
              {/* Form Header */}
              <Box textAlign="center">
                <Typography
                  variant="h4"
                  component="h2"
                  sx={{
                    fontWeight: 'bold',
                    color: 'text.primary',
                    mb: 1,
                  }}
                >
                  {title}
                </Typography>
                {subtitle && (
                  <Typography
                    variant="body1"
                    color="text.secondary"
                  >
                    {subtitle}
                  </Typography>
                )}
              </Box>

              {/* Form Content */}
              {children}
            </Stack>
          </Paper>

          {/* Footer */}
          <Typography
            variant="body2"
            sx={{
              color: theme.palette.primary.dark,
              opacity: 0.7,
              textAlign: 'center',
            }}
          >
            © 2025 TerraHarbor. All rights reserved.
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
};
