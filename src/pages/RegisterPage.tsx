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
import Grid from '@mui/material/Grid';
import { Link, useNavigate } from 'react-router-dom';
import { PersonAdd as RegisterIcon } from '@mui/icons-material';
import { AuthLayout } from '../components/layout/AuthLayout';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../components/providers/useToast';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { register, isAuthenticated, isLoading } = useAuth();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  const handleChange = (field: keyof typeof formData) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value,
    }));
    // Clear error when user starts typing
    if (error) setError(null);
  };

  const validateForm = () => {
    if (!formData.firstName.trim()) {
      return 'First name is required';
    }
    if (!formData.lastName.trim()) {
      return 'Last name is required';
    }
    if (!formData.username.trim()) {
      return 'Username is required';
    }
    if (!formData.email.trim()) {
      return 'Email is required';
    }
    if (!formData.email.includes('@')) {
      return 'Please enter a valid email address';
    }
    if (!formData.password.trim()) {
      return 'Password is required';
    }
    if (formData.password.length < 6) {
      return 'Password must be at least 6 characters long';
    }
    if (formData.password !== formData.confirmPassword) {
      return 'Passwords do not match';
    }
    return null;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setFormLoading(true);
    setError(null);

    try {
      const result = await register({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        username: formData.username.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });

      showToast({ 
        message: `Account created successfully! Welcome ${result.user.username}`, 
        severity: 'success' 
      });
      
      // Redirect to login page after successful registration
      navigate('/login', { 
        state: { 
          message: 'Registration successful! Please sign in with your new account.' 
        }
      });
    } catch (err: any) {
      const errorMessage = 
        err.response?.data?.detail || 
        err.message || 
        'Registration failed. Please try again.';
      
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
      title="Create Account" 
      subtitle="Join us and start managing your projects"
    >
      <form onSubmit={handleSubmit}>
        <Stack spacing={3}>
          {error && (
            <Alert severity="error">
              {error}
            </Alert>
          )}

          <Grid container spacing={2}>
            <Grid size={6}>
              <TextField
                label="First Name"
                value={formData.firstName}
                onChange={handleChange('firstName')}
                fullWidth
                required
                autoComplete="given-name"
                autoFocus
                disabled={formLoading}
              />
            </Grid>
            <Grid size={6}>
              <TextField
                label="Last Name"
                value={formData.lastName}
                onChange={handleChange('lastName')}
                fullWidth
                required
                autoComplete="family-name"
                disabled={formLoading}
              />
            </Grid>
          </Grid>

          <TextField
            label="Username"
            value={formData.username}
            onChange={handleChange('username')}
            fullWidth
            required
            autoComplete="username"
            disabled={formLoading}
            helperText="Choose a unique username"
          />

          <TextField
            label="Email"
            type="email"
            value={formData.email}
            onChange={handleChange('email')}
            fullWidth
            required
            autoComplete="email"
            disabled={formLoading}
          />

          <TextField
            label="Password"
            type="password"
            value={formData.password}
            onChange={handleChange('password')}
            fullWidth
            required
            autoComplete="new-password"
            disabled={formLoading}
            helperText="Minimum 6 characters"
          />

          <TextField
            label="Confirm Password"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange('confirmPassword')}
            fullWidth
            required
            autoComplete="new-password"
            disabled={formLoading}
          />

          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            disabled={formLoading}
            startIcon={formLoading ? <CircularProgress size={20} /> : <RegisterIcon />}
            sx={{ py: 1.5 }}
          >
            {formLoading ? 'Creating Account...' : 'Create Account'}
          </Button>

          <Stack direction="row" justifyContent="center" spacing={1}>
            <Typography variant="body2" color="text.secondary">
              Already have an account?
            </Typography>
            <MuiLink
              component={Link}
              to="/login"
              variant="body2"
              sx={{ fontWeight: 'medium' }}
            >
              Sign in
            </MuiLink>
          </Stack>
        </Stack>
      </form>
    </AuthLayout>
  );
};

export default RegisterPage;
