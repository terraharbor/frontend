/**
 * Simple error handling utility for API calls
 */

export const getErrorMessage = (error: any): string => {
  // Check for network errors
  if (error.code === 'ERR_NETWORK') {
    return 'Network error - check if the backend is running';
  }
  
  // Check for specific HTTP status codes
  if (error.response?.status === 404) {
    return 'Endpoint not found - this feature may not be implemented yet';
  }
  
  if (error.response?.status === 401) {
    return 'Authentication required - please login first';
  }
  
  if (error.response?.status === 403) {
    return 'Access forbidden - insufficient permissions';
  }
  
  if (error.response?.status >= 500) {
    return 'Server error - please try again later';
  }
  
  // Try to get error message from response
  if (error.response?.data?.detail) {
    return error.response.data.detail;
  }
  
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  
  if (error.message) {
    return error.message;
  }
  
  return 'An unexpected error occurred';
};

export const logError = (operation: string, error: any) => {
  console.error(`Error in ${operation}:`, {
    message: error.message,
    status: error.response?.status,
    data: error.response?.data,
    url: error.config?.url
  });
};
