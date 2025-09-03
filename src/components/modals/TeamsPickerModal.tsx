import SearchIcon from '@mui/icons-material/Search';
import {
  Button,
  Checkbox,
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
  TextField,
} from '@mui/material';
import { FC, useEffect, useMemo, useState } from 'react';
import { Team } from '../../types/buisness';

type TeamsPickerModalProps = {
  open: boolean;
  title?: string;
  teams: Team[];
  selectedTeamIds: string[];
  onClose: () => void;
  onSubmit: (selectedTeamIds: string[]) => void;
  loading?: boolean;
};

const TeamsPickerModal: FC<TeamsPickerModalProps> = ({
  open,
  title = 'Équipes du projet',
  teams,
  selectedTeamIds,
  onClose,
  onSubmit,
  loading = false,
}) => {
  const [selected, setSelected] = useState<string[]>(selectedTeamIds);
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (open) setSelected(selectedTeamIds);
  }, [open, selectedTeamIds]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return teams;
    return teams.filter(
      (t) =>
        t.name.toLowerCase().includes(q) || (t.description?.toLowerCase().includes(q) ?? false),
    );
  }, [teams, query]);

  const toggle = (id: string) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const handleSubmit = () => {
    if (loading) return;
    onSubmit(selected);
  };

  const handleProtectedClose = () => {
    if (loading) return;
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleProtectedClose} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <TextField
          placeholder="Rechercher par nom/description…"
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
          {filtered.map((t) => {
            const checked = selected.includes(t.id);
            return (
              <ListItem key={t.id} disablePadding>
                <ListItemButton onClick={() => toggle(t.id)} dense>
                  <ListItemIcon>
                    <Checkbox edge="start" checked={checked} tabIndex={-1} disableRipple />
                  </ListItemIcon>
                  <ListItemText id={`team-${t.id}`} primary={t.name} secondary={t.description} />
                </ListItemButton>
              </ListItem>
            );
          })}
          {filtered.length === 0 && (
            <ListItem>
              <ListItemText primary="Aucune équipe" />
            </ListItem>
          )}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleProtectedClose} color="inherit" disabled={loading}>
          Annuler
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={loading}>
          Enregistrer {selected.length ? `(${selected.length})` : ''}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TeamsPickerModal;
