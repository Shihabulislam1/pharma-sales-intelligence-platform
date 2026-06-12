import { Box, Card, CardContent, CircularProgress, Typography, useTheme, Chip, Stack } from '@mui/material';
import { TrendingUp as TrendIcon } from '@mui/icons-material';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useGetRevenueQuery } from '../../store/api';
import { formatRevenue, formatAxisRevenue } from '../../utils/formatters';

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function RevenueSparkline() {
  const theme = useTheme();
  const { data, isLoading } = useGetRevenueQuery({ group_by: 'month' });

  if (isLoading) return <CircularProgress size={24} />;

  const sorted = data
    ? [...data].sort((a, b) => Number(a.month ?? 0) - Number(b.month ?? 0)).map(d => ({
        ...d,
        name: MONTH_NAMES[(Number(d.month) ?? 1) - 1],
        revenue: d.revenue,
      }))
    : [];

  const gradientId = 'revenueGradient';

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>Revenue Trend</Typography>
            <Typography variant="body2" color="text.secondary">Monthly revenue overview</Typography>
          </Box>
          <Chip
            icon={<TrendIcon sx={{ fontSize: 16 }} />}
            label="Monthly"
            size="small"
            color="primary"
            variant="outlined"
          />
        </Stack>
        <Box sx={{ flexGrow: 1, minHeight: 220 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sorted} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.4} />
                  <stop offset="95%" stopColor={theme.palette.primary.main} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis
                tick={{ fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={formatAxisRevenue}
              />
              <Tooltip
                formatter={(value: any) => [formatRevenue(Number(value)), 'Revenue']}
                contentStyle={{
                  borderRadius: 12,
                  border: 'none',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
                  backgroundColor: theme.palette.background.paper,
                }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke={theme.palette.primary.main}
                strokeWidth={2.5}
                fillOpacity={1}
                fill={`url(#${gradientId})`}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
}
