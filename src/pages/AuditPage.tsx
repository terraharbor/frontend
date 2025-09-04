import { Stack } from '@mui/material';
import { FC } from 'react';
import { useAuth } from '../components/providers/useAuth';

const AuditPage: FC = () => {
  const { isAdmin } = useAuth();

  if (!isAdmin) return null;

  return <Stack>Audit</Stack>;
};

export default AuditPage;
