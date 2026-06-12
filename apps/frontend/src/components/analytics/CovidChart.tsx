import { Box, Card, CardContent, CircularProgress } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { formatRevenue, formatAxisRevenue, formatUnits } from '../../utils/formatters';

interface CovidChartProps {
  data: any[];
  isLoading: boolean;
  groupBy: string;
}

export function CovidChart({ data, isLoading, groupBy }: CovidChartProps) {
  return (
    <Card sx={{ height: 500 }}>
      <CardContent sx={{ height: '100%' }}>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <CircularProgress />
          </Box>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 40, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey={groupBy === 'overall' ? 'period' : groupBy} />
              <YAxis tickFormatter={formatAxisRevenue} />
              <Tooltip
                formatter={(value: any, name: any) => [
                  name.includes('evenue') ? formatRevenue(Number(value)) : formatUnits(Number(value)),
                  name
                ]}
              />
              <Legend />
              {groupBy === 'overall' ? (
                <>
                  <Bar dataKey="revenue" fill="#3b82f6" name="Revenue" />
                  <Bar dataKey="units_sold" fill="#10b981" name="Units Sold" />
                </>
              ) : (
                <>
                  <Bar dataKey="covid_revenue" fill="#ef4444" name="COVID Revenue" />
                  <Bar dataKey="non_covid_revenue" fill="#94a3b8" name="Non-COVID Revenue" />
                </>
              )}
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
