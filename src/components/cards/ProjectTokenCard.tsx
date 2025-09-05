import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { Box, IconButton, Link, Skeleton, Stack, Tooltip, Typography } from '@mui/material';
import { FC, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProjectService } from '../../api/projectService';
import { Project, ProjectToken } from '../../types/buisness';

type ProjectTokenCardProps = {
  token: ProjectToken;
  onDelete?: (token: ProjectToken) => void;
};

const ProjectTokenCard: FC<ProjectTokenCardProps> = ({ token, onDelete }) => {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(false);

  const loadProject = async () => {
    setLoading(true);
    try {
      const projectData = await ProjectService.getProject(token.project_id);
      setProject(Array.isArray(projectData) ? projectData[0] : projectData);
    } catch {
      setProject(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProject();
  }, [token.project_id]);

  const openProject = () => {
    if (project) navigate(`/projects/${project.id}`);
  };

  const masked = useMemo(() => {
    const v = token.token ?? '';
    return '•'.repeat(v.length);
  }, [token.token]);

  if (loading) {
    return <Skeleton height={100} />;
  }

  return (
    <Stack
      direction="row"
      sx={{
        justifyContent: 'space-between',
        alignItems: 'center',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        p: 2,
        bgcolor: 'background.paper',
      }}
    >
      <Stack spacing={1} sx={{ minWidth: 0, pr: 1, flex: 1 }}>
        <Stack direction="row" spacing={0.5} alignItems="center">
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            Token for{' '}
          </Typography>
          {project ? (
            <Link component="button" onClick={openProject} underline="hover">
              {project.name}
            </Link>
          ) : (
            <Typography component="span" variant="body2" color="text.secondary">
              (unknown project)
            </Typography>
          )}
        </Stack>

        <Stack direction="row" spacing={1} alignItems="center" sx={{ minWidth: 0 }}>
          <Box
            sx={{
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1,
              px: 1.5,
              py: 1,
              bgcolor: (t) => t.palette.action.hover,
              fontFamily:
                'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
              fontSize: 12,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: 520,
              minWidth: 240,
            }}
          >
            {expanded ? token.token : masked}
          </Box>

          <Tooltip title={expanded ? 'Hide token' : 'Show token'}>
            <IconButton size="small" onClick={() => setExpanded((v) => !v)}>
              {expanded ? (
                <VisibilityOffIcon fontSize="small" />
              ) : (
                <VisibilityIcon fontSize="small" />
              )}
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>

      <Stack direction="row" spacing={1} alignItems="center">
        {onDelete && (
          <Tooltip title="Delete token">
            <IconButton size="small" color="error" onClick={() => onDelete(token)}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </Stack>
    </Stack>
  );
};

export default ProjectTokenCard;
