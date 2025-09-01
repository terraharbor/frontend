import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Stack,
  Alert,
  Typography,
  Link as MuiLink,
  CircularProgress,
} from '@mui/material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Login as LoginIcon } from '@mui/icons-material';
import { AuthLayout } from '../components/layout/AuthLayout';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../components/providers/useToast';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();
  const { login, isAuthenticated, isLoading } = useAuth();

  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate, location.state]);

  const handleChange = (field: keyof typeof credentials) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCredentials(prev => ({
      ...prev,
      [field]: event.target.value,
    }));
    // Clear error when user starts typing
    if (error) setError(null);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!credentials.username.trim() || !credentials.password.trim()) {
      setError('Please fill in all fields');
      return;
    }

    setFormLoading(true);
    setError(null);

    try {
      await login(credentials);
      showToast({ 
        message: 'Login successful! Welcome back.', 
        severity: 'success' 
      });
      
      // Navigation will be handled by useEffect above
    } catch (err: any) {
      const errorMessage = 
        err.response?.data?.detail || 
        err.message || 
        'Login failed. Please check your credentials.';
      
      setError(errorMessage);
      showToast({ 
        message: errorMessage, 
        severity: 'error' 
      });
    } finally {
      setFormLoading(false);
    }
  };

  // Show loading spinner while checking auth state
  if (isLoading) {
    return (
      <AuthLayout title="Loading...">
        <Stack alignItems="center" spacing={2}>
          <CircularProgress />
          <Typography variant="body2" color="text.secondary">
            Checking authentication...
          </Typography>
        </Stack>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout 
      title="Welcome Back" 
      subtitle="Sign in to your account to continue"
    >
      <form onSubmit={handleSubmit}>
        <Stack spacing={3}>
          {error && (
            <Alert severity="error">
              {error}
            </Alert>
          )}

          <TextField
            label="Username"
            type="text"
            value={credentials.username}
            onChange={handleChange('username')}
            fullWidth
            required
            autoComplete="username"
            autoFocus
            disabled={formLoading}
          />

          <TextField
            label="Password"
            type="password"
            value={credentials.password}
            onChange={handleChange('password')}
            fullWidth
            required
            autoComplete="current-password"
            disabled={formLoading}
          />

          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            disabled={formLoading}
            startIcon={formLoading ? <CircularProgress size={20} /> : <LoginIcon />}
            sx={{ py: 1.5 }}
          >
            {formLoading ? 'Signing In...' : 'Sign In'}
          </Button>

          <Stack direction="row" justifyContent="center" spacing={1}>
            <Typography variant="body2" color="text.secondary">
              Don't have an account?
            </Typography>
            <MuiLink
              component={Link}
              to="/register"
              variant="body2"
              sx={{ fontWeight: 'medium' }}
            >
              Sign up
            </MuiLink>
          </Stack>
        </Stack>
      </form>
    </AuthLayout>
  );
};

export default LoginPage;
