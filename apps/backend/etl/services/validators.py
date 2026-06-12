import pandas as pd

REQUIRED_COLUMNS = [
    'date', 'year', 'month', 'day', 'region', 'country',
    'category', 'medicine', 'age_group', 'units_sold',
    'unit_price', 'stock_level', 'expiry_days_remaining', 'covid_flag',
]

def validate_required_columns(df: pd.DataFrame) -> list[str]:
    """Returns list of missing column names."""
    return [col for col in REQUIRED_COLUMNS if col not in df.columns]

def validate_numeric_non_negative(series: pd.Series) -> pd.Series:
    """Returns boolean mask — True for valid (non-negative) values."""
    # Coerce to numeric, non-numeric becomes NaN
    numeric_series = pd.to_numeric(series, errors='coerce')
    # Valid if not NaN and >= 0
    return numeric_series.notna() & (numeric_series >= 0)

def validate_date_consistency(df: pd.DataFrame) -> pd.Series:
    """Returns boolean mask — True where year/month/day match the date column."""
    try:
        # Use errors='coerce' to return NaT for invalid dates
        parsed_dates = pd.to_datetime(df['date'], errors='coerce')
        # Check components, handling missing/invalid gracefully
        valid_mask = parsed_dates.notna() & \
                     (parsed_dates.dt.year == pd.to_numeric(df['year'], errors='coerce')) & \
                     (parsed_dates.dt.month == pd.to_numeric(df['month'], errors='coerce')) & \
                     (parsed_dates.dt.day == pd.to_numeric(df['day'], errors='coerce'))
        return valid_mask
    except Exception:
        return pd.Series(False, index=df.index)

def validate_covid_flag(series: pd.Series) -> pd.Series:
    """Returns boolean mask — True where covid_flag is 0 or 1."""
    numeric_series = pd.to_numeric(series, errors='coerce')
    return numeric_series.isin([0, 1])
