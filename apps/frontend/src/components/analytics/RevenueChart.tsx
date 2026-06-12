import { Card, CardContent, CircularProgress, Box } from '@mui/material';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatRevenue, formatAxisRevenue, formatUnits } from '../../utils/formatters';

interface RevenueChartProps {
  data: any[];
  isLoading: boolean;
  groupBy: string;
}

export function RevenueChart({ data, isLoading, groupBy }: RevenueChartProps) {
  return (
    <Card sx={{ height: 500 }}>
      <CardContent sx={{ height: '100%' }}>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <CircularProgress />
          </Box>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 20, right: 30, left: 40, bottom: 20 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey={groupBy} />
              <YAxis tickFormatter={formatAxisRevenue} />
              <Tooltip
                formatter={(value: any, name: any) => [
                  name === 'revenue' ? formatRevenue(Number(value)) : formatUnits(Number(value)),
                  name === 'revenue' ? 'Revenue' : 'Units Sold'
                ]}
              />
              <Area type="monotone" dataKey="revenue" stroke="#4f46e5" fillOpacity={1} fill="url(#colorRevenue)" />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
