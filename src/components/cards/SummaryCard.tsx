import { FC } from 'react';
import { Card, CardContent, CardActions, Typography, Button, Stack } from '@mui/material';

export interface SummaryCardProps {
  title: string;
  description?: string;
  metadata?: string[];
  action?: {
    label?: string;
    onClick: () => void;
  };
  onClick?: () => void;
}

//TerraHarbor summary card
export const SummaryCard: FC<SummaryCardProps> = ({
  title,
  description,
  metadata = [],
  action,
  onClick,
}) => (
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
      <Typography variant="h6" component="h2" sx={(theme) => ({ mb: theme.spacing(1) })}>
        {title}
      </Typography>

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

    {action && (
      <CardActions sx={(theme) => ({ p: theme.spacing(3), pt: 0 })}>
        <Button
          variant="outlined"
          color="primary"
          onClick={(e) => {
            e.stopPropagation();
            action.onClick();
          }}
          size="small"
          sx={(theme) => ({
            borderColor: 'primary.main',
            color: 'primary.main',
            px: theme.spacing(2),
            py: theme.spacing(0.5),
            minWidth: 'auto',
            '&:hover': {
              borderColor: 'primary.dark',
              backgroundColor: 'primary.lighter',
            },
          })}
        >
          {action.label || 'OUVRIR'}
        </Button>
      </CardActions>
    )}
  </Card>
);

export default SummaryCard;
