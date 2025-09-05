import { generateDiffFile } from '@git-diff-view/file';
import { DiffModeEnum, DiffView } from '@git-diff-view/react';
import '@git-diff-view/react/styles/diff-view.css';
import CloseIcon from '@mui/icons-material/Close';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  MenuItem,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import { FC, useEffect, useMemo, useState } from 'react';
import { StateFileSnapshot } from '../../types/buisness';

type StateFileCompareModalProps = {
  open: boolean;
  onClose: () => void;
  current: StateFileSnapshot;
  previousSnapshots: StateFileSnapshot[];
  initialCompareId?: string;
};

function prettyOrRaw(jsonStr: string) {
  try {
    const obj = JSON.parse(jsonStr);
    return JSON.stringify(obj, null, 2) + '\n';
  } catch {
    return jsonStr;
  }
}

const StateFileCompareModal: FC<StateFileCompareModalProps> = ({
  open,
  onClose,
  current,
  previousSnapshots,
  initialCompareId,
}) => {
  const [compareId, setCompareId] = useState<string | undefined>(initialCompareId);

  useEffect(() => {
    if (!open) return;
    if (initialCompareId) {
      setCompareId(initialCompareId);
    } else {
      setCompareId(previousSnapshots[0]?.id);
    }
  }, [open, initialCompareId, previousSnapshots]);

  const leftSnapshot = useMemo(
    () => previousSnapshots.find((s) => s.id === compareId),
    [compareId, previousSnapshots],
  );

  const leftStr = useMemo(
    () => (leftSnapshot ? prettyOrRaw(leftSnapshot.content) : '{}'),
    [leftSnapshot],
  );
  const rightStr = useMemo(() => prettyOrRaw(current.content || '{}'), [current]);

  const file = useMemo(() => {
    try {
      // Ensure both strings are valid before generating diff
      if (!leftStr.trim()) return null;
      if (!rightStr.trim()) return null;
      
      const f = generateDiffFile('before.json', leftStr, 'after.json', rightStr, 'json', 'json');
      f.initTheme('light');
      f.init();
      f.buildSplitDiffLines();
      f.onAllExpand('split');
      return f;
    } catch (error) {
      console.error('Failed to generate diff:', error);
      return null;
    }
  }, [rightStr, leftStr]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle>
        <Stack direction="row" alignItems="center" justifyContent="space-between" gap={2}>
          <Stack>
            <Typography variant="h6">Versions comparison</Typography>
          </Stack>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={2} sx={{ p: 2 }}>
          <Stack>
            <Stack direction="row" spacing={2}>
              <Stack sx={{ flex: 1 }}>
                <Typography variant="h5">Previous version</Typography>
              </Stack>

              <Stack sx={{ flex: 1 }}>
                <Typography variant="h5">Actual version</Typography>
              </Stack>
            </Stack>

            <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
              <Stack sx={{ flex: 1 }}>
                <FormControl size="small" sx={{ minWidth: 260 }}>
                  <Select
                    value={compareId ?? ''}
                    displayEmpty
                    onChange={(e) => setCompareId(String(e.target.value))}
                  >
                    {previousSnapshots.map((s) => (
                      <MenuItem key={s.id} value={s.id}>
                        {`v${s.version} • ${new Date(s.createdAt).toLocaleString()}`}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Stack>

              <Stack sx={{ flex: 1 }}>
                <Typography>
                  v{current.version} • {new Date(current.createdAt).toLocaleString()}
                </Typography>
              </Stack>
            </Stack>
          </Stack>

          <Stack
            sx={{
              border: '1px solid',
              borderColor: 'divider',
              maxHeight: '60vh',
              overflow: 'auto',
            }}
          >
            {file ? (
              <DiffView diffFile={file} diffViewMode={DiffModeEnum.Split} diffViewHighlight />
            ) : (
              <Typography sx={{ p: 2, textAlign: 'center', color: 'text.secondary' }}>
                Unable to generate diff. One or both versions may have invalid content.
              </Typography>
            )}
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default StateFileCompareModal;
