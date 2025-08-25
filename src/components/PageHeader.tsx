import React, { FC } from 'react';
import {
  Box,
  Typography,
  Button,
  Stack,
} from '@mui/material';

export interface PageHeaderProps {
  title: string;
  
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'contained' | 'outlined' | 'text';
    color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
    startIcon?: React.ReactNode;
    endIcon?: React.ReactNode;
    disabled?: boolean;
  };
}


export const PageHeader: FC<PageHeaderProps> = ({
  title,
  action,
}) => {
  return (
    <Box
      sx={{
        mb: 3,
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
      >
        <Typography
          variant="h4"
          component="h1"
        >
          {title}
        </Typography>
        
        {action && (
          <Box sx={{ flexShrink: 0 }}>
            <Button
              variant={action.variant || 'contained'}
              color={action.color || 'primary'}
              onClick={action.onClick}
              startIcon={action.startIcon}
              endIcon={action.endIcon}
              disabled={action.disabled}
              sx={{
                minWidth: 'auto',
                whiteSpace: 'nowrap',
                px: 3,
                py: 1,
              }}
            >
              {action.label}
            </Button>
          </Box>
        )}
      </Stack>
    </Box>
  );
};

export default PageHeader;
