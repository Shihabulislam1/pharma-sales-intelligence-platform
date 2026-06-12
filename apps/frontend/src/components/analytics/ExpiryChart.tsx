import { Box, Card, CardContent, CircularProgress } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { formatUnits, formatAxisUnits } from '../../utils/formatters';

interface ExpiryChartProps {
  data: any[];
  isLoading: boolean;
}

export function ExpiryChart({ data, isLoading }: ExpiryChartProps) {
  return (
    <Card sx={{ height: 500 }}>
      <CardContent sx={{ height: '100%' }}>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <CircularProgress />
          </Box>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 20, right: 30, left: 100, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" tickFormatter={formatAxisUnits} />
              <YAxis dataKey="medicine" type="category" />
              <Tooltip formatter={(value: any) => [formatUnits(Number(value)), 'Stock Level']} />
              <Bar dataKey="stock_level" name="Stock Level (At Risk)">
                {data?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.min_expiry_days < 30 ? '#ef4444' : '#f59e0b'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
