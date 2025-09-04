import SearchIcon from '@mui/icons-material/Search';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Radio,
  TextField,
} from '@mui/material';
import { FC, useEffect, useMemo, useState } from 'react';
import { Project } from '../../types/buisness';

type ProjectPickerModalProps = {
  open: boolean;
  title?: string;
  projects: Project[];
  selectedProjectId?: string;
  onClose: () => void;
  onSubmit: (projectId: string) => void;
  loading?: boolean;
};

const ProjectPickerModal: FC<ProjectPickerModalProps> = ({
  open,
  title = 'Select a project',
  projects,
  selectedProjectId,
  onClose,
  onSubmit,
  loading = false,
}) => {
  const [selected, setSelected] = useState<string>(selectedProjectId ?? '');
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (open) {
      setSelected(selectedProjectId ?? '');
      setQuery('');
    }
  }, [open, selectedProjectId]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return projects;
    return projects.filter((p) => p.name.toLowerCase().includes(q));
  }, [projects, query]);

  const handleProtectedClose = () => {
    if (loading) return;
    onClose();
  };

  const handleSubmit = () => {
    if (loading || !selected) return;
    onSubmit(selected);
  };

  return (
    <Dialog open={open} onClose={handleProtectedClose} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <TextField
          placeholder="Find by name or description"
          fullWidth
          variant="outlined"
          margin="normal"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        <List dense sx={{ maxHeight: 420, overflow: 'auto', borderRadius: 1 }}>
          {filtered.map((p) => {
            const checked = selected === p.id;
            return (
              <ListItem key={p.id} disablePadding>
                <ListItemButton onClick={() => setSelected(p.id)} dense selected={checked}>
                  <ListItemIcon>
                    <Radio edge="start" checked={checked} />
                  </ListItemIcon>
                  <ListItemText primary={p.name} />
                </ListItemButton>
              </ListItem>
            );
          })}
          {filtered.length === 0 && (
            <ListItem>
              <ListItemText primary="No project" />
            </ListItem>
          )}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleProtectedClose} color="inherit" disabled={loading}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={loading || !selected}>
          Select
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProjectPickerModal;
