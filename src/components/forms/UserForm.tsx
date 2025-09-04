import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Checkbox, FormControlLabel, TextField } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

const schema = z.object({
  username: z.string().trim().min(1, 'Name required').max(100),
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
    defaultValues: { username: '', isAdmin: false, ...defaultValues },
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
        label="Username"
        fullWidth
        variant="outlined"
        margin="dense"
        {...register('username')}
        error={!!errors.username}
        helperText={errors.username?.message}
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
            label="Admin"
            disabled={disabled}
          />
        )}
      />
    </Box>
  );
}
