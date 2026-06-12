export interface KPIResponse {
  total_revenue: number;
  total_units_sold: number;
  total_countries: number;
  total_regions: number;
  total_medicines: number;
  total_stock_value: number;
}

export interface RevenueData {
  region?: string;
  country?: string;
  category?: string;
  medicine?: string;
  month?: string;
  revenue: number;
  units_sold: number;
}

export interface InventoryData {
  medicine: string;
  category: string;
  stock_level: number;
  inventory_value?: number;
}

export interface ExpiryData {
  medicine: string;
  category: string;
  stock_level: number;
  expiry_days_remaining: number;
}

export interface AgeGroupData {
  age_group: string;
  revenue: number;
  units_sold: number;
}

export interface CovidData {
  covid_flag: boolean;
  revenue: number;
  units_sold: number;
  region?: string;
  category?: string;
}
