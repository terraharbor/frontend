import { 
  Add as AddIcon,
  Login, 
  Logout, 
  Upload, 
  Download, 
  Lock, 
  LockOpen, 
  Delete,
  Refresh
} from '@mui/icons-material';
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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Paper,
} from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import Grid from '@mui/material/Grid';
import { FC, useState } from 'react';
import { getAuthToken } from '../api/client';
import { StateService } from '../api/stateService';
import { PageHeader } from '../components/PageHeader';
import { ProjectCard } from '../components/cards/ProjectCard';
import { TeamCard } from '../components/cards/TeamCard';
import { useAuth } from '../components/providers/useAuth';
import { useToast } from '../components/providers/useToast';
import { sampleProjects, sampleTeams } from '../sampleData';

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

  // State Management Testing
  const [stateTestData, setStateTestData] = useState({
    project: 'test-project',
    stateName: 'main',
    version: 1,
    lockInfo: '{"ID": "test-lock-123", "user": "test-user"}',
  });
  
  const [stateContent, setStateContent] = useState('');
  const [testResults, setTestResults] = useState<Record<string, any>>({});

  // Event handlers
  const handleCreateProject = () => {
    console.log('Créer new project clicked');
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

  // State Management Test Functions
  const testUploadState = async () => {
    if (!isAuthenticated) {
      showToast({ message: 'Please login first', severity: 'warning' });
      return;
    }

    try {
      const testStateContent = JSON.stringify({
        version: stateTestData.version,
        terraform_version: "1.0.0",
        serial: 1,
        lineage: "test-lineage",
        outputs: {},
        resources: []
      }, null, 2);

      await StateService.putState(
        stateTestData.project, 
        stateTestData.stateName, 
        testStateContent, 
        stateTestData.version
      );
      
      setTestResults(prev => ({
        ...prev,
        uploadState: { success: true, timestamp: new Date().toISOString() }
      }));
      showToast({ message: 'State uploaded successfully', severity: 'success' });
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || error.message || 'Unknown error';
      const status = error.response?.status || 'No status';
      setTestResults(prev => ({
        ...prev,
        uploadState: { success: false, error: errorMessage, timestamp: new Date().toISOString() }
      }));
      showToast({ message: `Upload failed (${status}): ${errorMessage}`, severity: 'error' });
    }
  };

  const testDownloadState = async () => {
    if (!isAuthenticated) {
      showToast({ message: 'Please login first', severity: 'warning' });
      return;
    }

    try {
      const stateBlob = await StateService.getState(
        stateTestData.project, 
        stateTestData.stateName, 
        stateTestData.version
      );
      
      const text = await stateBlob.text();
      setStateContent(text);
      
      setTestResults(prev => ({
        ...prev,
        downloadState: { success: true, timestamp: new Date().toISOString() }
      }));
      showToast({ message: 'State downloaded successfully', severity: 'success' });
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || error.message || 'Unknown error';
      const status = error.response?.status || 'No status';
      setTestResults(prev => ({
        ...prev,
        downloadState: { success: false, error: errorMessage, timestamp: new Date().toISOString() }
      }));
      showToast({ message: `Download failed (${status}): ${errorMessage}`, severity: 'error' });
    }
  };

  const testLockState = async () => {
    if (!isAuthenticated) {
      showToast({ message: 'Please login first', severity: 'warning' });
      return;
    }

    try {
      await StateService.lockState(
        stateTestData.project, 
        stateTestData.stateName, 
        JSON.parse(stateTestData.lockInfo)
      );
      
      setTestResults(prev => ({
        ...prev,
        lockState: { success: true, timestamp: new Date().toISOString() }
      }));
      showToast({ message: 'State locked successfully', severity: 'success' });
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || error.message || 'Unknown error';
      const status = error.response?.status || 'No status';
      setTestResults(prev => ({
        ...prev,
        lockState: { success: false, error: errorMessage, timestamp: new Date().toISOString() }
      }));
      showToast({ message: `Lock failed (${status}): ${errorMessage}`, severity: 'error' });
    }
  };

  const testUnlockState = async () => {
    if (!isAuthenticated) {
      showToast({ message: 'Please login first', severity: 'warning' });
      return;
    }

    try {
      await StateService.unlockState(
        stateTestData.project, 
        stateTestData.stateName, 
        JSON.parse(stateTestData.lockInfo)
      );
      
      setTestResults(prev => ({
        ...prev,
        unlockState: { success: true, timestamp: new Date().toISOString() }
      }));
      showToast({ message: 'State unlocked successfully', severity: 'success' });
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || error.message || 'Unknown error';
      const status = error.response?.status || 'No status';
      setTestResults(prev => ({
        ...prev,
        unlockState: { success: false, error: errorMessage, timestamp: new Date().toISOString() }
      }));
      showToast({ message: `Unlock failed (${status}): ${errorMessage}`, severity: 'error' });
    }
  };

  const testDeleteState = async () => {
    if (!isAuthenticated) {
      showToast({ message: 'Please login first', severity: 'warning' });
      return;
    }

    try {
      await StateService.deleteState(
        stateTestData.project, 
        stateTestData.stateName, 
        stateTestData.version
      );
      
      setTestResults(prev => ({
        ...prev,
        deleteState: { success: true, timestamp: new Date().toISOString() }
      }));
      showToast({ message: 'State deleted successfully', severity: 'success' });
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || error.message || 'Unknown error';
      const status = error.response?.status || 'No status';
      setTestResults(prev => ({
        ...prev,
        deleteState: { success: false, error: errorMessage, timestamp: new Date().toISOString() }
      }));
      showToast({ message: `Delete failed (${status}): ${errorMessage}`, severity: 'error' });
    }
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
                <ProjectCard key={project.id} project={project} />
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
            <ProjectCard project={project} />
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

      {/* State Management Testing */}
      <PageHeader title="State Management Testing" />
      
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="h6">Terraform State Operations</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={3}>
            {/* State Test Configuration */}
            <Paper sx={{ p: 2 }}>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>Configuration</Typography>
              <Stack spacing={2}>
                <TextField
                  label="Project"
                  value={stateTestData.project}
                  onChange={(e) => setStateTestData(prev => ({ ...prev, project: e.target.value }))}
                  size="small"
                />
                <TextField
                  label="State Name"
                  value={stateTestData.stateName}
                  onChange={(e) => setStateTestData(prev => ({ ...prev, stateName: e.target.value }))}
                  size="small"
                />
                <TextField
                  label="Version"
                  type="number"
                  value={stateTestData.version}
                  onChange={(e) => setStateTestData(prev => ({ ...prev, version: parseInt(e.target.value) }))}
                  size="small"
                />
                <TextField
                  label="Lock Info (JSON)"
                  value={stateTestData.lockInfo}
                  onChange={(e) => setStateTestData(prev => ({ ...prev, lockInfo: e.target.value }))}
                  multiline
                  rows={2}
                  size="small"
                />
              </Stack>
            </Paper>

            {/* State Operations */}
            <Paper sx={{ p: 2 }}>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>Operations</Typography>
              <Stack direction="row" spacing={2} flexWrap="wrap">
                <Button
                  startIcon={<Upload />}
                  onClick={testUploadState}
                  variant="outlined"
                  size="small"
                >
                  Upload State
                </Button>
                <Button
                  startIcon={<Download />}
                  onClick={testDownloadState}
                  variant="outlined"
                  size="small"
                >
                  Download State
                </Button>
                <Button
                  startIcon={<Lock />}
                  onClick={testLockState}
                  variant="outlined"
                  size="small"
                >
                  Lock State
                </Button>
                <Button
                  startIcon={<LockOpen />}
                  onClick={testUnlockState}
                  variant="outlined"
                  size="small"
                >
                  Unlock State
                </Button>
                <Button
                  startIcon={<Delete />}
                  onClick={testDeleteState}
                  variant="outlined"
                  color="error"
                  size="small"
                >
                  Delete State
                </Button>
              </Stack>
            </Paper>

            {/* Test Results */}
            <Paper sx={{ p: 2 }}>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>Test Results</Typography>
              <Stack spacing={1}>
                {Object.entries(testResults).map(([operation, result]) => (
                  <Box key={operation} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" sx={{ minWidth: 120 }}>
                      {operation}:
                    </Typography>
                    <Chip
                      size="small"
                      label={result.success ? 'Success' : 'Failed'}
                      color={result.success ? 'success' : 'error'}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {result.timestamp}
                    </Typography>
                    {result.error && (
                      <Typography variant="caption" color="error">
                        {result.error}
                      </Typography>
                    )}
                  </Box>
                ))}
              </Stack>
            </Paper>

            {/* Downloaded State Content */}
            {stateContent && (
              <Paper sx={{ p: 2 }}>
                <Typography variant="subtitle1" sx={{ mb: 2 }}>Downloaded State Content</Typography>
                <TextField
                  multiline
                  rows={10}
                  value={stateContent}
                  fullWidth
                  variant="outlined"
                  size="small"
                  InputProps={{ readOnly: true }}
                />
              </Paper>
            )}
          </Stack>
        </AccordionDetails>
      </Accordion>

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
