import { Stack } from '@mui/material';
import { FC } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { ProjectData } from './components/ProjectCard';
import AppShell from './components/layout/AppShell';
import DashboardPage from './pages/DashboardPage';
import { ProjectsPage } from './pages/ProjectsPage';
import TestPage from './pages/TestPage';
import { sampleProjects } from './sampleData';

const Projects: FC = () => {
  // Empty array to test "no projects available"
  // const projects: ProjectData[] = [];

  const handleCreateProject = () => {
    console.log('Create new project clicked from projects page');
  };

  const handleOpenProject = (project: ProjectData) => {
    console.log('Open project:', project.name);
  };

  return (
    <ProjectsPage
      projects={sampleProjects}
      onCreateProject={handleCreateProject}
      onOpenProject={handleOpenProject}
    />
  );
};
const Teams: FC = () => <Stack>Teams</Stack>;
const Users: FC = () => <Stack>Users</Stack>;
const Tokens: FC = () => <Stack>Tokens</Stack>;
const Audit: FC = () => <Stack>Audit logs</Stack>;
const Settings: FC = () => <Stack>Settings</Stack>;

const App: FC = () => {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/teams" element={<Teams />} />
        <Route path="/users" element={<Users />} />
        <Route path="/tokens" element={<Tokens />} />
        <Route path="/audit" element={<Audit />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/test" element={<TestPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppShell>
  );
};

export default App;
