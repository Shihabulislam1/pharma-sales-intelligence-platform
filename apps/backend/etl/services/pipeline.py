import logging
import pandas as pd
from django.utils import timezone
from etl.models import ETLJob
from etl.services.validators import (
    REQUIRED_COLUMNS,
    validate_required_columns,
    validate_numeric_non_negative,
    validate_date_consistency,
    validate_covid_flag
)

logger = logging.getLogger('etl')

class ETLPipeline:
    def extract(self, source) -> pd.DataFrame:
        logger.info(f"Extracting data from {source}")
        df = pd.read_csv(source)
        
        missing_cols = validate_required_columns(df)
        if missing_cols:
            raise ValueError(f"Missing required columns: {', '.join(missing_cols)}")
            
        return df

    def transform(self, df: pd.DataFrame):
        logger.info(f"Transforming data, initial rows: {len(df)}")
        metrics = {'duplicates_removed': 0, 'invalid_rows': 0}
        
        initial_len = len(df)
        df = df.drop_duplicates()
        metrics['duplicates_removed'] = initial_len - len(df)
        
        # Trim whitespace from all string columns
        str_cols = df.select_dtypes(['object']).columns
        for col in str_cols:
            df[col] = df[col].astype(str).str.strip()
            
        # Standardize text casing
        df['medicine'] = df['medicine'].str.title()
        df['country'] = df['country'].str.title()
        df['region'] = df['region'].str.title()
        df['category'] = df['category'].str.title()
        
        # Validation masks
        # We want to keep rows where ALL conditions are True
        valid_mask = pd.Series(True, index=df.index)
        
        valid_mask &= validate_numeric_non_negative(df['units_sold'])
        valid_mask &= validate_numeric_non_negative(df['unit_price'])
        valid_mask &= validate_numeric_non_negative(df['stock_level'])
        valid_mask &= validate_numeric_non_negative(df['expiry_days_remaining'])
        
        valid_mask &= validate_covid_flag(df['covid_flag'])
        valid_mask &= validate_date_consistency(df)
        
        # Drop rows with empty essential fields
        for col in REQUIRED_COLUMNS:
            valid_mask &= df[col].notna()
            if col in str_cols:
                valid_mask &= (df[col] != '')
        
        clean_df = df[valid_mask].copy()
        metrics['invalid_rows'] = len(df) - len(clean_df)
        
        # Ensure correct types after cleaning
        clean_df['date'] = pd.to_datetime(clean_df['date']).dt.date
        clean_df['year'] = clean_df['year'].astype(int)
        clean_df['month'] = clean_df['month'].astype(int)
        clean_df['day'] = clean_df['day'].astype(int)
        clean_df['units_sold'] = clean_df['units_sold'].astype(int)
        clean_df['unit_price'] = clean_df['unit_price'].astype(float)
        clean_df['stock_level'] = clean_df['stock_level'].astype(int)
        clean_df['expiry_days_remaining'] = clean_df['expiry_days_remaining'].astype(int)
        clean_df['covid_flag'] = clean_df['covid_flag'].astype(bool)
        
        # Compute derived fields
        clean_df['revenue'] = clean_df['units_sold'] * clean_df['unit_price']
        
        logger.info(f"Transformation complete. Clean rows: {len(clean_df)}, rejected: {metrics['invalid_rows']}")
        return clean_df, metrics

    def load(self, clean_df: pd.DataFrame, etl_job: ETLJob) -> int:
        from sales.models import PharmacySalesFact
        
        logger.info("Loading records into database...")
        records = [
            PharmacySalesFact(
                date=row.date,
                year=row.year,
                month=row.month,
                day=row.day,
                region=row.region,
                country=row.country,
                category=row.category,
                medicine=row.medicine,
                age_group=row.age_group,
                units_sold=row.units_sold,
                unit_price=row.unit_price,
                revenue=row.revenue,
                stock_level=row.stock_level,
                expiry_days_remaining=row.expiry_days_remaining,
                covid_flag=row.covid_flag,
                etl_job=etl_job
            )
            for row in clean_df.itertuples(index=False)
        ]
            
        PharmacySalesFact.objects.bulk_create(
            records,
            batch_size=5000,
            update_conflicts=True,
            unique_fields=['date', 'country', 'region', 'medicine', 'category', 'age_group'],
            update_fields=['units_sold', 'unit_price', 'revenue', 'stock_level', 'expiry_days_remaining', 'covid_flag', 'updated_at', 'etl_job']
        )
        inserted_count = len(records)
        logger.info(f"Successfully loaded {inserted_count} records.")
        return inserted_count

    def run(self, source, etl_job: ETLJob) -> ETLJob:
        try:
            etl_job.status = ETLJob.Status.PROCESSING
            etl_job.save()
            
            df = self.extract(source)
            etl_job.total_rows = len(df)
            etl_job.save()
            
            clean_df, metrics = self.transform(df)
            etl_job.duplicates_removed = metrics['duplicates_removed']
            etl_job.invalid_rows = metrics['invalid_rows']
            
            inserted_count = self.load(clean_df, etl_job)
            
            etl_job.valid_rows = inserted_count
            etl_job.status = ETLJob.Status.COMPLETED
            etl_job.completed_at = timezone.now()
            etl_job.save()
            
            return etl_job
            
        except Exception as e:
            logger.error(f"ETL job failed: {str(e)}", exc_info=True)
            etl_job.status = ETLJob.Status.FAILED
            etl_job.error_message = str(e)
            etl_job.completed_at = timezone.now()
            etl_job.save()
            return etl_job
