import {
  Card,
  CardActions,
  CardContent,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { FC, ReactNode } from 'react';

export type SummaryAction = {
  label: string;
  onClick: () => void;
  icon: ReactNode;
  disabled?: boolean;
};

export interface SummaryCardProps {
  title: string;
  description?: string;
  metadata?: string[];
  actions?: SummaryAction[];
  actionsPlacement?: 'bottom' | 'right';
  onClick?: () => void;
}

export const SummaryCard: FC<SummaryCardProps> = ({
  title,
  description,
  metadata = [],
  actions = [],
  actionsPlacement = 'bottom',
  onClick,
}) => {
  const hasActions = actions.length > 0;

  const ActionButtons = (
    <Stack direction="row" spacing={1}>
      {actions.map((a, index) => (
        <Tooltip key={index} title={a.label}>
          <IconButton
            size="small"
            disabled={a.disabled}
            onClick={(e) => {
              e.stopPropagation();
              a.onClick();
            }}
          >
            {a.icon}
          </IconButton>
        </Tooltip>
      ))}
    </Stack>
  );

  return (
    <Card
      onClick={onClick}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: onClick ? 'pointer' : 'default',
      }}
    >
      <CardContent sx={(theme) => ({ flexGrow: 1, p: theme.spacing(3) })}>
        <Stack
          direction="row"
          alignItems="flex-start"
          justifyContent="space-between"
          sx={(theme) => ({
            mb: description || (metadata?.length ?? 0) > 0 ? theme.spacing(1) : 0,
          })}
        >
          <Typography variant="h6" component="h2" sx={(theme) => ({ mr: theme.spacing(2) })}>
            {title}
          </Typography>
          {hasActions && actionsPlacement === 'right' && ActionButtons}
        </Stack>

        {description && (
          <Typography variant="body2" sx={(theme) => ({ mb: theme.spacing(2) })}>
            {description}
          </Typography>
        )}

        {metadata.length > 0 && (
          <Stack spacing={0.5}>
            {metadata.map((item, index) => (
              <Typography key={index} variant="caption">
                {item}
              </Typography>
            ))}
          </Stack>
        )}
      </CardContent>

      {hasActions && actionsPlacement === 'bottom' && (
        <CardActions sx={(theme) => ({ p: theme.spacing(3), pt: 0 })}>{ActionButtons}</CardActions>
      )}
    </Card>
  );
};

export default SummaryCard;
