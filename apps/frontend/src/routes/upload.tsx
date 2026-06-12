import { Box, Typography } from '@mui/material';
import { UploadForm } from '../components/etl/UploadForm';

export default function UploadPage() {
  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Upload Sales Data
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
          Securely import your latest pharmaceutical sales and inventory records
        </Typography>
      </Box>
      <UploadForm />
    </Box>
  );
}
