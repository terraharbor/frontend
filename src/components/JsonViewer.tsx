import { Box } from '@mui/material';
import { FC } from 'react';

type JsonViewerProps = {
  value: string;
  maxHeight?: number | string;
};

const JsonViewer: FC<JsonViewerProps> = ({ value, maxHeight = '70vh' }) => {
  return (
    <Box
      component="pre"
      sx={{
        m: 0,
        p: 2,
        bgcolor: 'background.paper',
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        overflow: 'auto',
        maxHeight,
        fontFamily:
          'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
        fontSize: 12,
        whiteSpace: 'pre',
      }}
    >
      {value}
    </Box>
  );
};

export default JsonViewer;
