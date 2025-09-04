import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Checkbox, FormControlLabel, TextField } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

const schema = z.object({
  username: z.string().trim().min(1, 'Le nom est requis').max(100),
  email: z.string().trim().email('E-mail invalide').max(255),
  isAdmin: z.boolean(),
});

export type UserFormInput = z.input<typeof schema>;
export type UserFormOutput = z.output<typeof schema>;

type Props = {
  defaultValues?: Partial<UserFormInput>;
  onSubmit: (values: UserFormOutput) => void;
  disabled?: boolean;
};

export function UserForm({ defaultValues, onSubmit, disabled }: Props) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<UserFormInput, unknown, UserFormOutput>({
    resolver: zodResolver(schema),
    defaultValues: { username: '', email: '', isAdmin: false, ...defaultValues },
  });

  return (
    <Box
      component="form"
      id="user-form"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      sx={{ pt: 1 }}
    >
      <TextField
        autoFocus
        label="Nom d'utilisateur"
        fullWidth
        variant="outlined"
        margin="dense"
        {...register('username')}
        error={!!errors.username}
        helperText={errors.username?.message}
        disabled={disabled}
      />

      <TextField
        label="E-mail"
        fullWidth
        type="email"
        variant="outlined"
        margin="dense"
        {...register('email')}
        error={!!errors.email}
        helperText={errors.email?.message}
        disabled={disabled}
      />

      <Controller
        name="isAdmin"
        control={control}
        render={({ field }) => (
          <FormControlLabel
            sx={{ mt: 1 }}
            control={
              <Checkbox
                {...field}
                checked={!!field.value}
                onChange={(e) => field.onChange(e.target.checked)}
              />
            }
            label="Administrateur"
            disabled={disabled}
          />
        )}
      />
    </Box>
  );
}
