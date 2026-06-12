import { Box, Card, CardContent, CircularProgress, Typography, Chip, Stack, Divider } from '@mui/material';
import { useGetEtlJobsQuery } from '../../store/api';

export function RecentETLActivity() {
  const { data: jobs, isLoading } = useGetEtlJobsQuery();

  if (isLoading) return <CircularProgress size={24} />;

  const recent = jobs?.slice(0, 5) ?? [];

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>Recent Uploads</Typography>
          <Typography variant="body2" color="text.secondary">Latest ETL pipeline activity</Typography>
        </Box>
        {recent.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
            No uploads yet. Upload a CSV file to get started!
          </Typography>
        ) : (
          <Stack divider={<Divider />} spacing={0}>
            {recent.map((job) => (
              <Box key={job.id} sx={{ py: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {job.file_name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(job.uploaded_at).toLocaleDateString()} · {job.valid_rows ?? 0} rows loaded
                  </Typography>
                </Box>
                <Chip
                  label={job.status}
                  size="small"
                  color={job.status === 'COMPLETED' ? 'success' : job.status === 'FAILED' ? 'error' : 'warning'}
                  sx={{ fontWeight: 600, fontSize: '0.65rem' }}
                />
              </Box>
            ))}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}
