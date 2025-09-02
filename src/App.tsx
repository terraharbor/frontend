import { Stack } from '@mui/material';
import { FC } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import AppShell from './components/layout/AppShell';
import { ProtectedRoute } from './components/ProtectedRoute';
import { useAuth } from './components/providers/useAuth';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import { ProjectsPage } from './pages/ProjectsPage';
import RegisterPage from './pages/RegisterPage';
import TeamPage from './pages/TeamPage';
import { TeamsPage } from './pages/TeamsPage';
import TestPage from './pages/TestPage';
import UsersPage from './pages/UsersPage';

const Tokens: FC = () => <Stack>Tokens</Stack>;
const Audit: FC = () => <Stack>Audit logs</Stack>;
const Settings: FC = () => <Stack>Settings</Stack>;

const App: FC = () => {
  const { isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected routes wrapped in AppShell */}
      <Route
        path="/*"
        element={
          <AppShell>
            <ProtectedRoute>
              <Routes>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/projects" element={<ProjectsPage />} />
                <Route path="/teams" element={<TeamsPage />} />
                <Route path="/teams/:id" element={<TeamPage />} />
                <Route path="/users" element={<UsersPage />} />
                <Route path="/tokens" element={<Tokens />} />
                <Route path="/audit" element={<Audit />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/test" element={<TestPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </ProtectedRoute>
          </AppShell>
        }
      />
    </Routes>
  );
};

export default App;
