import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Typography, Button, Alert, Stack } from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error to an error reporting service
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  handleRefresh = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minHeight="400px"
          p={4}
        >
          <Stack spacing={3} alignItems="center" maxWidth="600px">
            <Alert severity="error" sx={{ width: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Une erreur inattendue s'est produite
              </Typography>
              <Typography variant="body2">
                L'application a rencontré une erreur et ne peut pas continuer. 
                Veuillez essayer de rafraîchir la page ou contacter le support si le problème persiste.
              </Typography>
            </Alert>

            {this.state.error && (
              <Box sx={{ width: '100%' }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Détails de l'erreur:
                </Typography>
                <Typography 
                  variant="body2" 
                  component="pre" 
                  sx={{ 
                    backgroundColor: 'grey.100',
                    p: 2,
                    borderRadius: 1,
                    fontSize: '0.8rem',
                    overflow: 'auto',
                    maxHeight: '200px'
                  }}
                >
                  {this.state.error.message}
                  {this.state.error.stack && `\n\nStack trace:\n${this.state.error.stack}`}
                </Typography>
              </Box>
            )}

            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                onClick={this.handleReset}
                startIcon={<RefreshIcon />}
              >
                Réessayer
              </Button>
              <Button
                variant="contained"
                onClick={this.handleRefresh}
                startIcon={<RefreshIcon />}
              >
                Rafraîchir la page
              </Button>
            </Stack>
          </Stack>
        </Box>
      );
    }

    return this.props.children;
  }
}

// Hook version for functional components
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode
) => {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary fallback={fallback}>
      <Component {...props} />
    </ErrorBoundary>
  );
  
  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
};

export default ErrorBoundary;
