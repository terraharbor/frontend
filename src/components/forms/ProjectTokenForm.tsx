import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import { FC, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { sampleProjects } from '../../sampleData';
import { Project } from '../../types/buisness';
import ProjectPickerModal from '../modals/ProjectPickerModal';

const schema = z.object({
  project_id: z.string().trim().min(1, 'Project is required'),
});

export type ProjectTokenFormInput = z.input<typeof schema>;
export type ProjectTokenFormOutput = z.output<typeof schema>;

type Props = {
  projects?: Project[];
  defaultValues?: Partial<ProjectTokenFormInput>;
  onSubmit: (values: ProjectTokenFormOutput) => void;
  disabled?: boolean;
};

const ProjectTokenForm: FC<Props> = ({
  projects = sampleProjects,
  defaultValues,
  onSubmit,
  disabled,
}) => {
  const { handleSubmit, setValue, watch } = useForm<
    ProjectTokenFormInput,
    unknown,
    ProjectTokenFormOutput
  >({
    resolver: zodResolver(schema),
    defaultValues: {
      project_id: '',
      ...defaultValues,
    },
  });

  const [pickerOpen, setPickerOpen] = useState(false);
  const projectId = watch('project_id');

  const selectedProject = useMemo(
    () => projects.find((p) => p.id === projectId),
    [projects, projectId],
  );

  const openPicker = () => setPickerOpen(true);
  const closePicker = () => setPickerOpen(false);

  const handlePickProject = (pid: string) => {
    setValue('project_id', pid, { shouldValidate: true, shouldDirty: true });
    setPickerOpen(false);
  };

  return (
    <>
      <Box
        component="form"
        id="project-token-form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        sx={{ pt: 1 }}
      >
        <Stack spacing={1.5}>
          <Stack direction="row" spacing={1}>
            <TextField
              label="Project"
              value={selectedProject ? selectedProject.id : ''}
              placeholder="Select a project"
              fullWidth
              variant="outlined"
              margin="dense"
              InputProps={{ readOnly: true }}
              disabled={disabled}
            />
            <Button
              variant="outlined"
              onClick={openPicker}
              sx={{ mt: '4px', whiteSpace: 'nowrap' }}
              disabled={disabled}
            >
              Choose
            </Button>
          </Stack>

          <Typography variant="body2" color="text.secondary">
            This token will always have <strong>read</strong> and <strong>write</strong> access.
          </Typography>
        </Stack>
      </Box>

      <ProjectPickerModal
        open={pickerOpen}
        projects={projects}
        selectedProjectId={projectId}
        onClose={closePicker}
        onSubmit={handlePickProject}
      />
    </>
  );
};

export default ProjectTokenForm;
