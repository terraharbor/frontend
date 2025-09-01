import { zodResolver } from '@hookform/resolvers/zod';
import { Box, MenuItem, TextField } from '@mui/material';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { UserRole } from '../../types/buisness';

const USER_ROLES: UserRole[] = ['Admin', 'User'];

const schema = z.object({
  username: z.string().trim().min(1, 'Le nom est requis').max(100),
  email: z.string().trim().email('E-mail invalide').max(255),
  role: z.enum(USER_ROLES),
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
    formState: { errors },
  } = useForm<UserFormInput, unknown, UserFormOutput>({
    resolver: zodResolver(schema),
    defaultValues: { username: '', email: '', role: 'User', ...defaultValues },
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

      <TextField
        select
        defaultValue="User"
        label="Rôle"
        fullWidth
        variant="outlined"
        margin="dense"
        {...register('role')}
        error={!!errors.role}
        helperText={errors.role?.message}
        disabled={disabled}
      >
        {USER_ROLES.map((role) => (
          <MenuItem key={role} value={role}>
            {role}
          </MenuItem>
        ))}
      </TextField>
    </Box>
  );
}
