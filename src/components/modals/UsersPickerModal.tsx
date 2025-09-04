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
import { User } from '../../types/buisness';

type UsersPickerModalProps = {
  open: boolean;
  title?: string;
  users: User[];
  selectedUserIds: string[];
  onClose: () => void;
  onSubmit: (selectedUserIds: string[]) => void;
  loading?: boolean;
};

const UsersPickerModal: FC<UsersPickerModalProps> = ({
  open,
  title = 'Team members',
  users,
  selectedUserIds,
  onClose,
  onSubmit,
  loading = false,
}) => {
  const [selected, setSelected] = useState<string[]>(selectedUserIds);
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (open) setSelected(selectedUserIds);
  }, [open, selectedUserIds]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) => u.username.toLowerCase().includes(q) || u.email.toLowerCase().includes(q),
    );
  }, [users, query]);

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
          placeholder="Find by username or email"
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
          {filtered.map((u) => {
            const checked = selected.includes(u.id);
            return (
              <ListItem key={u.id} disablePadding>
                <ListItemButton onClick={() => toggle(u.id)} dense>
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={checked}
                      tabIndex={-1}
                      disableRipple
                      inputProps={{ 'aria-labelledby': `user-${u.id}` }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    id={`user-${u.id}`}
                    primary={u.username}
                    secondary={`${u.email} • ${u.isAdmin ? 'Admin' : 'User'}`}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
          {filtered.length === 0 && (
            <ListItem>
              <ListItemText primary="No user" />
            </ListItem>
          )}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleProtectedClose} color="inherit" disabled={loading}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={loading}>
          Save {selected.length ? `(${selected.length})` : ''}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UsersPickerModal;
