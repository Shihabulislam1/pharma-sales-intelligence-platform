import { Box, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useGetExpiryQuery } from '../../store/api';
import { useState } from 'react';
import { ExpiryChart } from '../../components/analytics/ExpiryChart';

export default function ExpiryAnalytics() {
  const [days, setDays] = useState(30);
  const { data, isLoading } = useGetExpiryQuery({ days });

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Expiry Risk Analytics
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
            Track and mitigate risks of medicine expiration
          </Typography>
        </Box>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Expiring Within</InputLabel>
          <Select
            value={days}
            label="Expiring Within"
            onChange={(e) => setDays(Number(e.target.value))}
          >
            <MenuItem value={30}>30 Days</MenuItem>
            <MenuItem value={60}>60 Days</MenuItem>
            <MenuItem value={90}>90 Days</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <ExpiryChart data={data ?? []} isLoading={isLoading} />
    </Box>
  );
}
