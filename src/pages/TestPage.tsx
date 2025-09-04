import { 
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
import { useAuth } from '../components/providers/useAuth';
import { useToast } from '../components/providers/useToast';

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
      showToast({ message: `State uploaded successfully to ${stateTestData.project}/${stateTestData.stateName}`, severity: 'success' });
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || error.message || 'Unknown error';
      setTestResults(prev => ({
        ...prev,
        uploadState: { success: false, error: errorMessage, timestamp: new Date().toISOString() }
      }));
      showToast({ message: `Upload failed: ${errorMessage}`, severity: 'error' });
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
        downloadState: { success: true, size: stateBlob.size, timestamp: new Date().toISOString() }
      }));
      showToast({ message: `State downloaded successfully (${stateBlob.size} bytes)`, severity: 'success' });
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || error.message || 'Unknown error';
      setTestResults(prev => ({
        ...prev,
        downloadState: { success: false, error: errorMessage, timestamp: new Date().toISOString() }
      }));
      showToast({ message: `Download failed: ${errorMessage}`, severity: 'error' });
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
      setTestResults(prev => ({
        ...prev,
        lockState: { success: false, error: errorMessage, timestamp: new Date().toISOString() }
      }));
      showToast({ message: `Lock failed: ${errorMessage}`, severity: 'error' });
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
      setTestResults(prev => ({
        ...prev,
        unlockState: { success: false, error: errorMessage, timestamp: new Date().toISOString() }
      }));
      showToast({ message: `Unlock failed: ${errorMessage}`, severity: 'error' });
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
      setTestResults(prev => ({
        ...prev,
        deleteState: { success: false, error: errorMessage, timestamp: new Date().toISOString() }
      }));
      showToast({ message: `Delete failed: ${errorMessage}`, severity: 'error' });
    }
  };



  const clearTestResults = () => {
    setTestResults({});
    showToast({ message: 'Test results cleared', severity: 'info' });
  };

  return (
    <Stack spacing={4}>
      <PageHeader 
        title="Backend Integration Testing" 
        action={{
          label: 'CLEAR RESULTS',
          onClick: clearTestResults,
          startIcon: <Refresh />,
          variant: 'outlined',
          color: 'secondary',
        }}
      />

      <Alert severity={isAuthenticated ? 'success' : 'warning'}>
        {isAuthenticated
          ? `Authenticated | Token: ${getAuthToken()?.substring(0, 20)}... | User: ${user?.username || 'Unknown'}`
          : 'Not authenticated - Login required for API testing'}
      </Alert>

      {/* Test Results Summary */}
      {Object.keys(testResults).length > 0 && (
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Test Results Summary</Typography>
          <Grid container spacing={2}>
            {Object.entries(testResults).map(([test, result]) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={test}>
                <Chip 
                  label={`${test}: ${result.success ? 'SUCCESS' : 'FAILED'}`}
                  color={result.success ? 'success' : 'error'}
                  variant="outlined"
                  size="small"
                />
                {!result.success && result.error && (
                  <Typography variant="caption" sx={{ display: 'block', mt: 0.5, color: 'error.main' }}>
                    {result.error}
                  </Typography>
                )}
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}

      {/* Authentication Testing */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="h6">Authentication Testing</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Stack spacing={2}>
                <Typography variant="subtitle1" color="primary">Register New User</Typography>
                <TextField
                  label="First Name"
                  value={registerData.firstName}
                  onChange={(e) => setRegisterData(prev => ({ ...prev, firstName: e.target.value }))}
                  size="small"
                />
                <TextField
                  label="Last Name"
                  value={registerData.lastName}
                  onChange={(e) => setRegisterData(prev => ({ ...prev, lastName: e.target.value }))}
                  size="small"
                />
                <TextField
                  label="Username"
                  value={registerData.username}
                  onChange={(e) => setRegisterData(prev => ({ ...prev, username: e.target.value }))}
                  size="small"
                />
                <TextField
                  label="Email"
                  type="email"
                  value={registerData.email}
                  onChange={(e) => setRegisterData(prev => ({ ...prev, email: e.target.value }))}
                  size="small"
                />
                <TextField
                  label="Password"
                  type="password"
                  value={registerData.password}
                  onChange={(e) => setRegisterData(prev => ({ ...prev, password: e.target.value }))}
                  size="small"
                />
                <Button
                  variant="contained"
                  onClick={handleRegister}
                  disabled={isLoading}
                  fullWidth
                >
                  Register User
                </Button>
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Stack spacing={2}>
                <Typography variant="subtitle1" color="primary">Login & User Operations</Typography>
                <TextField
                  label="Username"
                  value={loginData.username}
                  onChange={(e) => setLoginData(prev => ({ ...prev, username: e.target.value }))}
                  size="small"
                />
                <TextField
                  label="Password"
                  type="password"
                  value={loginData.password}
                  onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                  size="small"
                />
                <Stack direction="row" spacing={1}>
                  <Button
                    variant="contained"
                    onClick={handleLogin}
                    disabled={isLoading}
                    startIcon={<Login />}
                    fullWidth
                  >
                    Login
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={handleGetCurrentUser}
                    disabled={isLoading || !isAuthenticated}
                    fullWidth
                  >
                    Get User Info
                  </Button>
                </Stack>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={handleLogout}
                  disabled={!isAuthenticated}
                  startIcon={<Logout />}
                  fullWidth
                >
                  Logout
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* State Management Testing */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="h6">Terraform State Management</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Stack spacing={2}>
                <Typography variant="subtitle1" color="primary">State Configuration</Typography>
                <TextField
                  label="Project Name"
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
                  onChange={(e) => setStateTestData(prev => ({ ...prev, version: parseInt(e.target.value) || 1 }))}
                  size="small"
                />
                <TextField
                  label="Lock Info (JSON)"
                  value={stateTestData.lockInfo}
                  onChange={(e) => setStateTestData(prev => ({ ...prev, lockInfo: e.target.value }))}
                  multiline
                  rows={3}
                  size="small"
                />
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Stack spacing={2}>
                <Typography variant="subtitle1" color="primary">State Operations</Typography>
                <Button
                  variant="contained"
                  onClick={testUploadState}
                  disabled={!isAuthenticated}
                  startIcon={<Upload />}
                  fullWidth
                >
                  Upload Test State
                </Button>
                <Button
                  variant="outlined"
                  onClick={testDownloadState}
                  disabled={!isAuthenticated}
                  startIcon={<Download />}
                  fullWidth
                >
                  Download State
                </Button>
                <Stack direction="row" spacing={1}>
                  <Button
                    variant="outlined"
                    onClick={testLockState}
                    disabled={!isAuthenticated}
                    startIcon={<Lock />}
                    fullWidth
                  >
                    Lock State
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={testUnlockState}
                    disabled={!isAuthenticated}
                    startIcon={<LockOpen />}
                    fullWidth
                  >
                    Unlock State
                  </Button>
                </Stack>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={testDeleteState}
                  disabled={!isAuthenticated}
                  startIcon={<Delete />}
                  fullWidth
                >
                  Delete State Version
                </Button>
              </Stack>
            </Grid>
            {stateContent && (
              <Grid size={{ xs: 12 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>Downloaded State Content:</Typography>
                <TextField
                  value={stateContent}
                  multiline
                  rows={10}
                  fullWidth
                  InputProps={{ readOnly: true }}
                  sx={{ fontFamily: 'monospace' }}
                />
              </Grid>
            )}
          </Grid>
        </AccordionDetails>
      </Accordion>


    </Stack>
  );
};

export default TestPage;