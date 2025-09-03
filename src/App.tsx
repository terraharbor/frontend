import { FC } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import AppShell from './components/layout/AppShell';
import { ProtectedRoute } from './components/ProtectedRoute';
import { useAuth } from './components/providers/useAuth';
import AuditPage from './pages/AuditPage';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import ProjectPage from './pages/ProjectPage';
import { ProjectsPage } from './pages/ProjectsPage';
import RegisterPage from './pages/RegisterPage';
import TeamPage from './pages/TeamPage';
import { TeamsPage } from './pages/TeamsPage';
import TestPage from './pages/TestPage';
import TokensPage from './pages/TokensPage';
import UsersPage from './pages/UsersPage';

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
                <Route path="/projects/:id" element={<ProjectPage />} />
                <Route path="/teams" element={<TeamsPage />} />
                <Route path="/teams/:id" element={<TeamPage />} />
                <Route path="/users" element={<UsersPage />} />
                <Route path="/tokens" element={<TokensPage />} />
                <Route path="/audit" element={<AuditPage />} />
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
