import { Box, Typography } from '@mui/material';
import { useGetDemographicsQuery } from '../../store/api';
import { DemographicsChart } from '../../components/analytics/DemographicsChart';

export default function DemographicsAnalytics() {
  const { data, isLoading } = useGetDemographicsQuery();

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Demographics Analytics
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
          Understand patient distributions across regions and categories
        </Typography>
      </Box>

      <DemographicsChart data={data ?? []} isLoading={isLoading} />
    </Box>
  );
}
