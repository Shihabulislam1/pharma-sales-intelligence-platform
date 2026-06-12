import { Box, Card, CardContent, CircularProgress, Typography, alpha, useTheme } from '@mui/material';
import { BarChart, Bar, CartesianGrid, Legend, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useGetDemographicsQuery } from '../../store/api';
import { formatRevenue, formatUnits, formatAxisRevenue } from '../../utils/formatters';

export function DemographicsBar() {
  const theme = useTheme();
  const { data, isLoading } = useGetDemographicsQuery();

  if (isLoading) return <CircularProgress size={24} />;

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>Sales by Age Group</Typography>
          <Typography variant="body2" color="text.secondary">Revenue and units across demographics</Typography>
        </Box>
        <Box sx={{ flexGrow: 1, minHeight: 220 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={alpha(theme.palette.divider, 0.4)} />
              <XAxis dataKey="age_group" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis
                tick={{ fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={formatAxisRevenue}
              />
              <Tooltip
                formatter={(value: any, name: any) => [
                  name === 'revenue' ? formatRevenue(Number(value)) : formatUnits(Number(value)),
                  name === 'revenue' ? 'Revenue' : 'Units Sold',
                ]}
                contentStyle={{
                  borderRadius: 12,
                  border: 'none',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
                  backgroundColor: theme.palette.background.paper,
                }}
              />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="revenue" fill="#6366f1" name="Revenue" radius={[6, 6, 0, 0]} />
              <Bar dataKey="units_sold" fill="#06b6d4" name="Units Sold" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
}
