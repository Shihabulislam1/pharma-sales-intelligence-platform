import { Box, CircularProgress, Grid, Typography } from '@mui/material';
import {
  AttachMoney as RevenueIcon,
  ShoppingCart as UnitsIcon,
  Inventory as StockIcon,
  MedicalServices as MedicineIcon,
  Public as CountryIcon,
  Map as RegionIcon,
} from '@mui/icons-material';
import { useGetKpisQuery } from '../store/api';
import { formatRevenue, formatUnits } from '../utils/formatters';

import { KPICard } from '../components/dashboard/KPICard';
import { RevenueSparkline } from '../components/dashboard/RevenueSparkline';
import { CategoryDonut } from '../components/dashboard/CategoryDonut';
import { DemographicsBar } from '../components/dashboard/DemographicsBar';
import { RecentETLActivity } from '../components/dashboard/RecentETLActivity';

export default function DashboardOverview() {
  const { data: kpis, isLoading, error } = useGetKpisQuery();

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
        }}
      >
        <CircularProgress size={48} />
      </Box>
    );
  }

  if (error)
    return <Typography color="error">Error loading dashboard data</Typography>;
  if (!kpis) return null;

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Dashboard Overview
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
          Real-time pharmaceutical sales intelligence at a glance
        </Typography>
      </Box>

      {/* KPI Cards Row */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <KPICard
            title="Total Revenue"
            value={formatRevenue(kpis.total_revenue)}
            icon={<RevenueIcon />}
            gradient="linear-gradient(135deg, #6366f1, #8b5cf6)"
            subtitle="All-time aggregate"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <KPICard
            title="Units Sold"
            value={formatUnits(kpis.total_units_sold)}
            icon={<UnitsIcon />}
            gradient="linear-gradient(135deg, #06b6d4, #22d3ee)"
            subtitle="Total units distributed"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <KPICard
            title="Inventory Value"
            value={formatRevenue(kpis.total_stock_value)}
            icon={<StockIcon />}
            gradient="linear-gradient(135deg, #10b981, #34d399)"
            subtitle="Current stock valuation"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <KPICard
            title="Medicines"
            value={kpis.total_medicines.toString()}
            icon={<MedicineIcon />}
            gradient="linear-gradient(135deg, #f59e0b, #fbbf24)"
            subtitle="Unique products tracked"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <KPICard
            title="Regions"
            value={kpis.total_regions.toString()}
            icon={<RegionIcon />}
            gradient="linear-gradient(135deg, #f43f5e, #fb7185)"
            subtitle="Global coverage"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <KPICard
            title="Countries"
            value={kpis.total_countries.toString()}
            icon={<CountryIcon />}
            gradient="linear-gradient(135deg, #8b5cf6, #a78bfa)"
            subtitle="Markets served"
          />
        </Grid>
      </Grid>

      {/* Charts Row 1: Revenue Trend + Category Donut */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 8 }}>
          <RevenueSparkline />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <CategoryDonut />
        </Grid>
      </Grid>

      {/* Charts Row 2: Demographics + Recent ETL */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <DemographicsBar />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <RecentETLActivity />
        </Grid>
      </Grid>
    </Box>
  );
}
