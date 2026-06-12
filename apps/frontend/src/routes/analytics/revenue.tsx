import { Box, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useGetRevenueQuery } from '../../store/api';
import { useState } from 'react';
import { RevenueChart } from '../../components/analytics/RevenueChart';

export default function RevenueAnalytics() {
  const [groupBy, setGroupBy] = useState('month');
  const { data, isLoading } = useGetRevenueQuery({ group_by: groupBy });

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Revenue Analytics
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
            Analyze financial performance and revenue drivers
          </Typography>
        </Box>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Group By</InputLabel>
          <Select
            value={groupBy}
            label="Group By"
            onChange={(e) => setGroupBy(e.target.value)}
          >
            <MenuItem value="month">Month</MenuItem>
            <MenuItem value="region">Region</MenuItem>
            <MenuItem value="country">Country</MenuItem>
            <MenuItem value="category">Category</MenuItem>
            <MenuItem value="medicine">Medicine</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <RevenueChart data={data ?? []} isLoading={isLoading} groupBy={groupBy} />
    </Box>
  );
}
