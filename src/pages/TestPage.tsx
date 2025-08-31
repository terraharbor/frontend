import { Add as AddIcon, Login, Logout } from '@mui/icons-material';
import { Box, Stack, Typography, Button, TextField, Card, CardContent, Divider, Alert } from '@mui/material';
import Grid from '@mui/material/Grid';
import React, { FC, useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { ProjectCard } from '../components/cards/ProjectCard';
import { useToast } from '../components/providers/useToast';
import { TeamCard} from '../components/cards/TeamCard';
import { sampleProjects, sampleTeams } from '../sampleData';
import { AuthService } from '../api/authService';
import { getAuthToken } from '../api/client';
import { User, Project, Team } from '../types/buisness';

const TestPage: FC = () => {
  const { showToast } = useToast();

  // API Testing State
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(!!getAuthToken());
  const [loading, setLoading] = useState(false);

  // Event handlers
  const handleCreateProject = () => {
    console.log('Créer new project clicked');
  };

  const handleProjectOpen = (project: Project) => {
    console.log('Ouvrir project:', project.name);
  };

  const handleTeamOpen = (team: Team) => {
    console.log('Ouvrir team:', team.name);
  };

  // API Test Functions
  const handleRegister = async () => {
    if (!username || !password) {
      showToast({ message: 'Username and password required', severity: 'error' });
      return;
    }
    
    setLoading(true);
    try {
      const result = await AuthService.register({ username, password });
      showToast({ message: `User registered: ${result.user.username}`, severity: 'success' });
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || error.message || 'Unknown error';
      const status = error.response?.status || 'No status';
      console.error('Register error:', error);
      showToast({ 
        message: `Register failed (${status}): ${errorMessage}`, 
        severity: 'error' 
      });
    }
    setLoading(false);
  };

  const handleLogin = async () => {
    if (!username || !password) {
      showToast({ message: 'Username and password required', severity: 'error' });
      return;
    }
    
    setLoading(true);
    try {
      const result = await AuthService.login({ username, password });
      setIsLoggedIn(true);
      showToast({ message: `Login successful! Token: ${result.access_token.substring(0, 10)}...`, severity: 'success' });
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || error.message || 'Unknown error';
      const status = error.response?.status || 'No status';
      console.error('Login error:', error);
      showToast({ 
        message: `Login failed (${status}): ${errorMessage}`, 
        severity: 'error' 
      });
    }
    setLoading(false);
  };

  const handleGetCurrentUser = async () => {
    setLoading(true);
    try {
      const user = await AuthService.getCurrentUser();
      setCurrentUser(user);
      showToast({ message: `Current user: ${user.username}`, severity: 'success' });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      showToast({ message: `Get user failed: ${errorMessage}`, severity: 'error' });
    }
    setLoading(false);
  };

  const handleLogout = () => {
    AuthService.logout();
    setIsLoggedIn(false);
    setCurrentUser(null);
    showToast({ message: 'Logged out successfully', severity: 'info' });
  };

  return (
    <Stack spacing={4}>
      {/* API Testing*/}
      <PageHeader title="API Client Testing" />
      
      <Alert severity={isLoggedIn ? 'success' : 'info'}>
        {isLoggedIn ? `Logged in with token: ${getAuthToken()?.substring(0, 20)}...` : 'Not logged in'}
        {currentUser && ` | Current user: ${currentUser.username}`}
      </Alert>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Authentication Testing</Typography>
              
              <Stack spacing={2}>
                <TextField
                  label="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  size="small"
                />
                <TextField
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  size="small"
                />
                
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  <Button
                    variant="outlined"
                    onClick={handleRegister}
                    disabled={loading}
                    size="small"
                  >
                    Register
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleLogin}
                    disabled={loading}
                    startIcon={<Login />}
                    size="small"
                  >
                    Login
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={handleGetCurrentUser}
                    disabled={loading || !isLoggedIn}
                    size="small"
                  >
                    Get User
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={handleLogout}
                    disabled={!isLoggedIn}
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
                <TeamCard key={team.id} team={team} onOpen={handleTeamOpen} />
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
            <TeamCard team={team} onOpen={handleTeamOpen} />
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
