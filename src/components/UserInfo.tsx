import React from 'react';
import { Box, Typography, Chip, Avatar, Stack } from '@mui/material';
import { Person, Login, Logout } from '@mui/icons-material';
import { useAuth } from './providers/useAuth';

interface UserInfoProps {
  showDetails?: boolean;
  variant?: 'compact' | 'detailed';
}

export const UserInfo: React.FC<UserInfoProps> = ({ 
  showDetails = true, 
  variant = 'compact' 
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Box display="flex" alignItems="center" gap={1}>
        <Avatar sx={{ width: 32, height: 32 }}>
          <Person />
        </Avatar>
        <Typography variant="body2" color="text.secondary">
          Loading...
        </Typography>
      </Box>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <Box display="flex" alignItems="center" gap={1}>
        <Chip 
          icon={<Login />} 
          label="Not authenticated" 
          color="default" 
          variant="outlined" 
          size="small"
        />
      </Box>
    );
  }

  if (variant === 'compact') {
    return (
      <Box display="flex" alignItems="center" gap={1}>
        <Avatar sx={{ width: 32, height: 32 }}>
          {user.username.charAt(0).toUpperCase()}
        </Avatar>
        <Typography variant="body2">
          {user.username}
        </Typography>
        <Chip 
          icon={<Logout />} 
          label="Authenticated" 
          color="success" 
          variant="outlined" 
          size="small"
        />
      </Box>
    );
  }

  return (
    <Stack spacing={2}>
      <Box display="flex" alignItems="center" gap={2}>
        <Avatar sx={{ width: 48, height: 48 }}>
          {user.username.charAt(0).toUpperCase()}
        </Avatar>
        <Box>
          <Typography variant="h6">
            {user.username}
          </Typography>
          <Chip 
            icon={<Logout />} 
            label="Authenticated" 
            color="success" 
            variant="outlined" 
            size="small"
          />
        </Box>
      </Box>
      
      {showDetails && (
        <Box>
          <Typography variant="body2" color="text.secondary">
            Status: {user.disabled ? 'Disabled' : 'Active'}
          </Typography>
          {user.token_validity && (
            <Typography variant="body2" color="text.secondary">
              Token validity: {user.token_validity}s
            </Typography>
          )}
        </Box>
      )}
    </Stack>
  );
};
