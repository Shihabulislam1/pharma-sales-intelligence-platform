import { Box, Card, CardContent, CircularProgress, Typography } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { formatRevenue, formatAxisRevenue, formatUnits } from '../../utils/formatters';

interface InventoryChartProps {
  data: any[];
  isLoading: boolean;
  view: string;
}

export function InventoryChart({ data, isLoading, view }: InventoryChartProps) {
  return (
    <Card sx={{ height: 500 }}>
      <CardContent sx={{ height: '100%' }}>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <CircularProgress />
          </Box>
        ) : data.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <Typography variant="body1" color="text.secondary">
              No inventory items match the current view criteria.
            </Typography>
          </Box>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 40, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey={view === 'category' ? 'category' : 'medicine'} />
              <YAxis yAxisId="left" tickFormatter={formatUnits} />
              <YAxis yAxisId="right" orientation="right" tickFormatter={formatAxisRevenue} />
              <Tooltip
                formatter={(value: any, name: any) => [
                  name === 'inventory_value' ? formatRevenue(Number(value)) : formatUnits(Number(value)),
                  name === 'inventory_value' ? 'Inventory Value' : 'Stock Level'
                ]}
              />
              <Legend />
              <Bar yAxisId="left" dataKey="stock_level" fill="#0ea5e9" name="Stock Level" />
              {view === 'all' && <Bar yAxisId="right" dataKey="inventory_value" fill="#10b981" name="Inventory Value" />}
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
