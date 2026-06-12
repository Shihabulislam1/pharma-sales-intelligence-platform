import { Box, Typography } from '@mui/material';
import { useGetEtlJobsQuery } from '../store/api';
import { ETLHistoryTable } from '../components/etl/ETLHistoryTable';

export default function ETLPage() {
  const { data: jobs, isLoading, error } = useGetEtlJobsQuery();

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          ETL Processing History
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
          Monitor and manage your data extraction, transformation, and loading tasks
        </Typography>
      </Box>
      <ETLHistoryTable jobs={jobs} isLoading={isLoading} error={error} />
    </Box>
  );
}
