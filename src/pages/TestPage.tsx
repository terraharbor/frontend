import { Add as AddIcon, Login, Logout } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { FC, useState } from 'react';
import { getAuthToken } from '../api/client';
import { PageHeader } from '../components/PageHeader';
import { ProjectCard } from '../components/cards/ProjectCard';
import { TeamCard } from '../components/cards/TeamCard';
import { useAuth } from '../components/providers/useAuth';
import { useToast } from '../components/providers/useToast';
import { sampleProjects, sampleTeams } from '../sampleData';
import { Project } from '../types/buisness';

const TestPage: FC = () => {
  const { showToast } = useToast();
  const { user, isAuthenticated, isLoading, login, register, logout, getCurrentUser } = useAuth();

  // API Testing State
  const [loginData, setLoginData] = useState({
    username: '',
    password: '',
  });

  const [registerData, setRegisterData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
  });

  // Event handlers
  const handleCreateProject = () => {
    console.log('Créer new project clicked');
  };

  const handleProjectOpen = (project: Project) => {
    console.log('Ouvrir project:', project.name);
  };

  // API Test Functions
  const handleRegister = async () => {
    if (
      !registerData.username ||
      !registerData.password ||
      !registerData.email ||
      !registerData.firstName ||
      !registerData.lastName
    ) {
      showToast({ message: 'All fields are required for registration', severity: 'error' });
      return;
    }

    try {
      const result = await register(registerData);
      showToast({ message: `User registered: ${result.user.username}`, severity: 'success' });
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || error.message || 'Unknown error';
      const status = error.response?.status || 'No status';
      console.error('Register error:', error);
      showToast({
        message: `Register failed (${status}): ${errorMessage}`,
        severity: 'error',
      });
    }
  };

  const handleLogin = async () => {
    if (!loginData.username || !loginData.password) {
      showToast({ message: 'Username and password required', severity: 'error' });
      return;
    }

    try {
      const result = await login(loginData);
      showToast({
        message: `Login successful! Token: ${result.access_token.substring(0, 10)}...`,
        severity: 'success',
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || error.message || 'Unknown error';
      const status = error.response?.status || 'No status';
      console.error('Login error:', error);
      showToast({
        message: `Login failed (${status}): ${errorMessage}`,
        severity: 'error',
      });
    }
  };

  const handleGetCurrentUser = async () => {
    try {
      const currentUser = await getCurrentUser();
      showToast({ message: `Current user: ${currentUser.username}`, severity: 'success' });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      showToast({ message: `Get user failed: ${errorMessage}`, severity: 'error' });
    }
  };

  const handleLogout = () => {
    logout();
    showToast({ message: 'Logged out successfully', severity: 'info' });
  };

  return (
    <Stack spacing={4}>
      {/* API Testing*/}
      <PageHeader title="API Client Testing" />

      <Alert severity={isAuthenticated ? 'success' : 'info'}>
        {isAuthenticated
          ? `Logged in with token: ${getAuthToken()?.substring(0, 20)}...`
          : 'Not logged in'}
        {user && ` | Current user: ${user.username}`}
      </Alert>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Authentication Testing
              </Typography>

              <Stack spacing={2}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Login Test
                </Typography>
                <TextField
                  label="Username"
                  value={loginData.username}
                  onChange={(e) => setLoginData((prev) => ({ ...prev, username: e.target.value }))}
                  size="small"
                />
                <TextField
                  label="Password"
                  type="password"
                  value={loginData.password}
                  onChange={(e) => setLoginData((prev) => ({ ...prev, password: e.target.value }))}
                  size="small"
                />

                <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
                  Registration Test
                </Typography>
                <TextField
                  label="First Name"
                  value={registerData.firstName}
                  onChange={(e) =>
                    setRegisterData((prev) => ({ ...prev, firstName: e.target.value }))
                  }
                  size="small"
                />
                <TextField
                  label="Last Name"
                  value={registerData.lastName}
                  onChange={(e) =>
                    setRegisterData((prev) => ({ ...prev, lastName: e.target.value }))
                  }
                  size="small"
                />
                <TextField
                  label="Username"
                  value={registerData.username}
                  onChange={(e) =>
                    setRegisterData((prev) => ({ ...prev, username: e.target.value }))
                  }
                  size="small"
                />
                <TextField
                  label="Email"
                  type="email"
                  value={registerData.email}
                  onChange={(e) => setRegisterData((prev) => ({ ...prev, email: e.target.value }))}
                  size="small"
                />
                <TextField
                  label="Password"
                  type="password"
                  value={registerData.password}
                  onChange={(e) =>
                    setRegisterData((prev) => ({ ...prev, password: e.target.value }))
                  }
                  size="small"
                />

                <Stack direction="row" spacing={1} flexWrap="wrap">
                  <Button
                    variant="outlined"
                    onClick={handleRegister}
                    disabled={isLoading}
                    size="small"
                  >
                    Register
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleLogin}
                    disabled={isLoading}
                    startIcon={<Login />}
                    size="small"
                  >
                    Login
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={handleGetCurrentUser}
                    disabled={isLoading || !isAuthenticated}
                    size="small"
                  >
                    Get User
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={handleLogout}
                    disabled={!isAuthenticated}
                    startIcon={<Logout />}
                    size="small"
                  >
                    Logout
                  </Button>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Divider />

      {/* Original Dashboard Content */}
      <PageHeader
        title="Dashboard"
        action={{
          label: 'CRÉER',
          onClick: handleCreateProject,
          startIcon: <AddIcon />,
          variant: 'contained',
          color: 'primary',
        }}
      />

      {/* Projects and Teams Side by Side */}
      <Grid container spacing={4}>
        {/* Projects Section */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Box
            sx={{
              border: '1px solid',
              borderColor: 'grey.300',
              borderRadius: 1, // theme.shape.borderRadius
              p: 3,
              backgroundColor: 'background.paper',
            }}
          >
            <Typography variant="h6" sx={{ mb: 3 }}>
              Mes projets
            </Typography>
            <Stack spacing={2}>
              {sampleProjects.map((project) => (
                <ProjectCard key={project.id} project={project} onOpen={handleProjectOpen} />
              ))}
            </Stack>
          </Box>
        </Grid>

        {/* Teams Section */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Box
            sx={{
              border: '1px solid',
              borderColor: 'grey.300',
              borderRadius: 1, // theme.shape.borderRadius
              p: 3,
              backgroundColor: 'background.paper',
            }}
          >
            <Typography variant="h6" sx={{ mb: 3 }}>
              Mes équipes
            </Typography>
            <Stack spacing={2}>
              {sampleTeams.map((team) => (
                <TeamCard key={team.id} team={team} />
              ))}
            </Stack>
          </Box>
        </Grid>
      </Grid>

      {/* Projects Page Header */}
      <PageHeader
        title="Projects"
        action={{
          label: 'CRÉER',
          onClick: handleCreateProject,
          variant: 'contained',
          color: 'primary',
        }}
      />

      {/* Projects Grid View */}
      <Grid container spacing={3}>
        {sampleProjects.map((project) => (
          <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={`grid-${project.id}`}>
            <ProjectCard project={project} onOpen={handleProjectOpen} />
          </Grid>
        ))}
      </Grid>

      {/* Teams Page Header */}
      <PageHeader
        title="Equipes"
        action={{
          label: 'CRÉER',
          onClick: handleCreateProject,
          variant: 'contained',
          color: 'primary',
        }}
      />

      {/* Teams Grid View */}
      <Grid container spacing={3}>
        {sampleTeams.map((team) => (
          <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={`grid-${team.id}`}>
            <TeamCard team={team} />
          </Grid>
        ))}
      </Grid>

      <PageHeader
        title="Test notification"
        action={{
          label: 'NOTIFIER',
          onClick: () => {
            showToast({ message: 'Ceci est une notification de test', severity: 'error' });
          },
        }}
      />
    </Stack>
  );
};

export default TestPage;
