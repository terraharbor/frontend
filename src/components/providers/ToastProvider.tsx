import { Alert, Snackbar } from '@mui/material';
import { ReactNode, useState } from 'react';
import { Toast, ToastContext } from './useToast';

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<Toast | null>(null);

  const showToast = (t: Toast) => setToast(t);
  const handleClose = () => setToast(null);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Snackbar
        open={!!toast}
        autoHideDuration={4000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        {toast ? (
          <Alert severity={toast.severity} onClose={handleClose} sx={{ width: '100%' }}>
            {toast.message}
          </Alert>
        ) : undefined}
      </Snackbar>
    </ToastContext.Provider>
  );
}
