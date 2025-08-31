import { zodResolver } from '@hookform/resolvers/zod';
import { Box, TextField } from '@mui/material';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const schema = z.object({
  name: z.string().trim().min(1, 'Le nom est requis').max(100),
  description: z.string().trim().max(1000).optional(),
  userIds: z.array(z.string()).default([]),
});

export type TeamFormInput = z.input<typeof schema>;
export type TeamFormOutput = z.output<typeof schema>;

type Props = {
  defaultValues?: Partial<TeamFormInput>;
  onSubmit: (values: TeamFormOutput) => void;
  disabled?: boolean;
};

export function TeamForm({ defaultValues, onSubmit, disabled }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TeamFormInput, unknown, TeamFormOutput>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', description: '', userIds: [], ...defaultValues },
  });

  return (
    <Box
      component="form"
      id="team-form"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      sx={{ pt: 1 }}
    >
      <TextField
        autoFocus
        label="Nom"
        fullWidth
        variant="outlined"
        margin="dense"
        {...register('name')}
        error={!!errors.name}
        helperText={errors.name?.message}
        disabled={disabled}
      />
      <TextField
        label="Description (optionnel)"
        fullWidth
        variant="outlined"
        margin="dense"
        multiline
        rows={3}
        {...register('description')}
        error={!!errors.description}
        helperText={errors.description?.message}
        disabled={disabled}
      />
    </Box>
  );
}
