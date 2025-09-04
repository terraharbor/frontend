import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Alert, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import { FC, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import StateFileCard from '../components/cards/StateFileCard';
import TeamCard from '../components/cards/TeamCard';
import JsonViewer from '../components/JsonViewer';
import StateFileCompareModal from '../components/modals/StateFileCompareModal';
import StateFileViewerModal from '../components/modals/StateFileViewerModal';
import TeamsPickerModal from '../components/modals/TeamsPickerModal';
import PageHeader from '../components/PageHeader';
import { useAuth } from '../components/providers/useAuth';
import { useToast } from '../components/providers/useToast';
import {
  sampleProjects,
  sampleStateFileInfos,
  sampleStateFilesTerraform,
  sampleTeams,
  sampleUsers,
} from '../sampleData';
import { Project, StateFileInfos, StateFileSnapshot, Team } from '../types/buisness';

const ProjectPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const { isAdmin } = useAuth();
  const { showToast } = useToast();
  const [viewerModalOpen, setViewerModalOpen] = useState(false);
  const [compareModalOpen, setCompareModalOpen] = useState(false);
  const [teamsModalOpen, setTeamsModalOpen] = useState(false);
  const [selectedSnapshot, setSelectedSnapshot] = useState<StateFileSnapshot | null>(null);

  const initialProject: Project | undefined = useMemo(
    () => sampleProjects.find((p) => p.id === id),
    [id],
  );
  const [project, setProject] = useState<Project | undefined>(initialProject);

  const teams = useMemo<Team[]>(
    () => (project ? sampleTeams.filter((t) => project.teamIds.includes(t.id)) : []),
    [project],
  );

  const { currentState, previousStates } = useMemo(() => {
    if (!project) return { currentState: undefined, previousStates: [] as StateFileSnapshot[] };

    const states = sampleStateFilesTerraform
      .filter((s) => s.projectId === project.id)
      .sort((a, b) => b.version - a.version);

    const [current, ...previous] = states;
    return { currentState: current, previousStates: previous };
  }, [project]);

  const currentStateCreatedByUser = useMemo(
    () => (currentState ? sampleUsers.find((u) => currentState?.createdBy === u.id) : undefined),
    [currentState],
  );

  const stateFileInfos: StateFileInfos = sampleStateFileInfos[0];

  const locked = stateFileInfos.status === 'locked';

  const stateFileLockedByUser = useMemo(
    () => (stateFileInfos ? sampleUsers.find((u) => stateFileInfos.lockedBy === u.id) : undefined),
    [stateFileInfos],
  );

  const handleOpenViewer = (s: StateFileSnapshot) => {
    setSelectedSnapshot(s);
    setViewerModalOpen(true);
  };

  const handleCloseViewer = () => {
    setSelectedSnapshot(null);
    setViewerModalOpen(false);
  };

  const handleOpenCompare = (s: StateFileSnapshot) => {
    setSelectedSnapshot(s);
    setCompareModalOpen(true);
  };

  const handleCloseCompare = () => {
    setCompareModalOpen(false);
    setSelectedSnapshot(null);
  };

  const openTeamsModal = () => setTeamsModalOpen(true);
  const closeTeamsModal = () => setTeamsModalOpen(false);

  const handleSaveTeams = (selectedTeamIds: string[]) => {
    setProject((prev) => (prev ? { ...prev, teamIds: selectedTeamIds } : prev));
    showToast({ message: 'Équipes mises à jour.', severity: 'success' });
    closeTeamsModal();
  };

  const handleRemoveTeam = (team: Team) => {
    setProject((prev) => {
      if (!prev) return prev;
      if (!prev.teamIds.includes(team.id)) return prev;
      return { ...prev, teamIds: prev.teamIds.filter((id) => id !== team.id) };
    });
    showToast({ message: 'Équipe retirée du projet.', severity: 'success' });
  };

  const handleLockOrUnlock = () => {
    if (locked) {
      // Unlock -> TODO API call
    } else {
      // Lock -> TODO API call
    }
  };

  const handleDeleteStateFileSnapshot = (stateFileSnapshot: StateFileSnapshot) => {
    console.log('Delete v' + stateFileSnapshot.version);
    // Call API
  };

  const handleRestoreStateFileSnapshot = (stateFileSnapshot: StateFileSnapshot) => {
    console.log('Restore v' + stateFileSnapshot.version);
    // Call API
  };

  if (!project) {
    return (
      <Stack spacing={2}>
        <PageHeader title="Projet introuvable" />
        <Alert severity="error">Impossible de trouver un projet avec l'id "{id}".</Alert>
      </Stack>
    );
  }

  return (
    <>
      <Stack spacing={4}>
        <PageHeader title={project.name} />
        {project.description && <Typography variant="body2">{project.description}</Typography>}

        <Stack spacing={4}>
          <Stack direction="row" spacing={2}>
            <Stack spacing={1} sx={{ flex: 1 }}>
              <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography>Equipes</Typography>
                {isAdmin && (
                  <IconButton
                    color="primary"
                    onClick={openTeamsModal}
                    title="Ajouter une équipe"
                    sx={{ p: 0 }}
                  >
                    <EditIcon />
                  </IconButton>
                )}
              </Stack>

              {teams && teams.length > 0 ? (
                <Stack spacing={1}>
                  {...teams.map((team) => (
                    <TeamCard
                      key={team.id}
                      team={team}
                      onDelete={handleRemoveTeam}
                      displayActions
                    />
                  ))}
                </Stack>
              ) : (
                <Alert severity="info">Aucune équipe</Alert>
              )}
            </Stack>

            <Stack spacing={1} sx={{ flex: 1 }}>
              <Typography>Activités</Typography>
              <Stack
                height="100%"
                sx={{
                  bgcolor: 'neutral.white',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 2,
                }}
              >
                A compléter
              </Stack>
            </Stack>
          </Stack>

          <Stack direction="row" spacing={2}>
            <Stack spacing={1} sx={{ flex: 1 }}>
              <Typography>Versions précédentes</Typography>
              <Stack spacing={1} sx={{ maxHeight: '60vh' }}>
                {previousStates.length > 0 ? (
                  previousStates.map((s) => (
                    <StateFileCard
                      stateFile={s}
                      onCompare={handleOpenCompare}
                      onRestore={handleRestoreStateFileSnapshot}
                      onView={handleOpenViewer}
                      onDelete={handleDeleteStateFileSnapshot}
                    />
                  ))
                ) : (
                  <Alert severity="info">Aucune version précédente</Alert>
                )}
              </Stack>
            </Stack>

            <Stack spacing={1} sx={{ flex: 1 }}>
              <Typography>State File Terraform</Typography>

              {currentState ? (
                <Stack
                  sx={{
                    bgcolor: 'neutral.white',
                    borderRadius: 2,
                    p: 2,
                    overflow: 'auto',
                  }}
                >
                  <Stack spacing={2}>
                    <Stack
                      direction="row"
                      sx={{ justifyContent: 'space-between', alignItems: 'center' }}
                    >
                      <Typography variant="caption" color="text.secondary">
                        Actuel • v{currentState.version} •{' '}
                        {new Date(currentState.createdAt).toLocaleString()} • par{' '}
                        {currentStateCreatedByUser && currentStateCreatedByUser.username}
                      </Typography>

                      <Stack direction="row" spacing={1}>
                        <IconButton size="small" onClick={handleLockOrUnlock} sx={{ p: 0 }}>
                          <Tooltip title={locked ? 'Unlock' : 'Lock'}>
                            {locked ? (
                              <LockOpenIcon fontSize="small" />
                            ) : (
                              <LockIcon fontSize="small" />
                            )}
                          </Tooltip>
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleOpenViewer(currentState)}
                          sx={{ p: 0 }}
                        >
                          <Tooltip title="Open">
                            <VisibilityIcon fontSize="small" />
                          </Tooltip>
                        </IconButton>

                        {isAdmin && (
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteStateFileSnapshot(currentState)}
                            sx={{ p: 0 }}
                          >
                            <Tooltip title="Delete">
                              <DeleteIcon fontSize="small" color="error" />
                            </Tooltip>
                          </IconButton>
                        )}
                      </Stack>
                    </Stack>

                    {locked && (
                      <Stack
                        direction="row"
                        sx={{
                          border: '1px solid',
                          borderColor: 'divider',
                          borderRadius: 1.5,
                          alignItems: 'center',
                          px: 1,
                          py: 0.5,
                        }}
                      >
                        <LockIcon color="error" />
                        <Typography
                          variant="caption"
                          sx={{ ml: 2 }}
                        >{`Locked by ${stateFileLockedByUser?.username} the ${new Date(stateFileInfos.lockedAt!).toLocaleString()}`}</Typography>
                      </Stack>
                    )}

                    <JsonViewer value={currentState.content} />
                  </Stack>
                </Stack>
              ) : (
                <Alert severity="info">Aucun state file pour ce projet.</Alert>
              )}
            </Stack>
          </Stack>
        </Stack>
      </Stack>

      <StateFileViewerModal
        open={viewerModalOpen}
        onClose={handleCloseViewer}
        snapshot={selectedSnapshot}
      />

      {currentState && (
        <StateFileCompareModal
          open={compareModalOpen}
          onClose={handleCloseCompare}
          current={currentState}
          previousSnapshots={previousStates}
          initialCompareId={selectedSnapshot?.id}
        />
      )}

      <TeamsPickerModal
        open={teamsModalOpen}
        teams={sampleTeams}
        selectedTeamIds={project.teamIds}
        onClose={() => setTeamsModalOpen(false)}
        onSubmit={handleSaveTeams}
      />
    </>
  );
};

export default ProjectPage;
