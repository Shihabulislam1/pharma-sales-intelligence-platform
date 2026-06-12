import { Box, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useGetInventoryQuery } from '../../store/api';
import { useState } from 'react';
import { InventoryChart } from '../../components/analytics/InventoryChart';

export default function InventoryAnalytics() {
  const [view, setView] = useState('all');
  const { data, isLoading } = useGetInventoryQuery(
    { view: view !== 'all' ? view : undefined, threshold: view === 'low_stock' ? 500 : undefined }
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Inventory Analytics
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
            Monitor stock levels and identify supply chain anomalies
          </Typography>
        </Box>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>View By</InputLabel>
          <Select
            value={view}
            label="View By"
            onChange={(e) => setView(e.target.value)}
          >
            <MenuItem value="all">All Inventory</MenuItem>
            <MenuItem value="category">By Category</MenuItem>
            <MenuItem value="low_stock">Low Stock (‹ 500)</MenuItem>
            <MenuItem value="overstock">Overstock (› 4500)</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <InventoryChart data={data ?? []} isLoading={isLoading} view={view} />
    </Box>
  );
}
