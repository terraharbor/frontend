import { Alert, Stack } from '@mui/material';
import { FC } from 'react';
import { useAuth } from '../components/providers/useAuth';

const TokensPage: FC = () => {
  const { isAdmin } = useAuth();

  if (!isAdmin) return <Alert severity="error">You are not allowed to access this page</Alert>;

  return <Stack>Tokens</Stack>;
};

export default TokensPage;
