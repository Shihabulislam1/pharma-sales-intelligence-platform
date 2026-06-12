import { Box, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useGetCovidQuery } from '../../store/api';
import { useState } from 'react';
import { CovidChart } from '../../components/analytics/CovidChart';

export default function CovidAnalytics() {
  const [groupBy, setGroupBy] = useState('overall');
  const { data, isLoading } = useGetCovidQuery({ group_by: groupBy });

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            COVID-19 Impact Analysis
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
            Evaluate sales trends pre, during, and post pandemic
          </Typography>
        </Box>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Group By</InputLabel>
          <Select
            value={groupBy}
            label="Group By"
            onChange={(e) => setGroupBy(e.target.value)}
          >
            <MenuItem value="overall">Overall (Pre/During/Post)</MenuItem>
            <MenuItem value="category">By Category</MenuItem>
            <MenuItem value="region">By Region</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <CovidChart data={data ?? []} isLoading={isLoading} groupBy={groupBy} />
    </Box>
  );
}
