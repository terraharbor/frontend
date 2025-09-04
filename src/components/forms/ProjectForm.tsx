import { zodResolver } from '@hookform/resolvers/zod';
import { Box, TextField } from '@mui/material';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const schema = z.object({
  name: z.string().trim().min(1, 'Name required').max(100),
  description: z.string().trim().max(1000).optional(),
  teamIds: z.array(z.string()).default([]),
});

export type ProjectFormInput = z.input<typeof schema>;
export type ProjectFormOutput = z.output<typeof schema>;

type Props = {
  defaultValues?: Partial<ProjectFormInput>;
  onSubmit: (values: ProjectFormOutput) => void;
  disabled?: boolean;
};

export function ProjectForm({ defaultValues, onSubmit, disabled }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProjectFormInput, unknown, ProjectFormOutput>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', description: '', teamIds: [], ...defaultValues },
  });

  return (
    <Box
      component="form"
      id="project-form"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      sx={{ pt: 1 }}
    >
      <TextField
        autoFocus
        label="Name"
        fullWidth
        variant="outlined"
        margin="dense"
        {...register('name')}
        error={!!errors.name}
        helperText={errors.name?.message}
        disabled={disabled}
      />
      <TextField
        label="Description (optional)"
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
