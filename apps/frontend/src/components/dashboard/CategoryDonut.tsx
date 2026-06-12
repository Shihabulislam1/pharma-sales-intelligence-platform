import { Box, Card, CardContent, CircularProgress, Typography, useTheme } from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useGetRevenueQuery } from '../../store/api';
import { formatRevenue } from '../../utils/formatters';

const PIE_COLORS = ['#6366f1', '#06b6d4', '#f59e0b', '#10b981', '#f43f5e'];

export function CategoryDonut() {
  const theme = useTheme();
  const { data, isLoading } = useGetRevenueQuery({ group_by: 'category' });

  if (isLoading) return <CircularProgress size={24} />;

  const chartData = data?.map(d => ({
    name: d.category ?? '',
    value: d.revenue,
  })) ?? [];

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>Revenue by Category</Typography>
          <Typography variant="body2" color="text.secondary">Distribution across drug categories</Typography>
        </Box>
        <Box sx={{ flexGrow: 1, minHeight: 220 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius="55%"
                outerRadius="80%"
                paddingAngle={3}
                stroke="none"
              >
                {chartData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: any) => [formatRevenue(Number(value)), 'Revenue']}
                contentStyle={{
                  borderRadius: 12,
                  border: 'none',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
                  backgroundColor: theme.palette.background.paper,
                }}
              />
              <Legend
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: 12 }}
              />
            </PieChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
}
