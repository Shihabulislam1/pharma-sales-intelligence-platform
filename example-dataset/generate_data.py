import pandas as pd
import numpy as np
import random
from datetime import datetime, timedelta

def generate_datasets():
    total_rows = 15000
    gen_rows = 30000
    np.random.seed(42)
    random.seed(42)

    # 1. Base Setup
    regions_countries = {
        'North America': ['USA', 'Canada', 'Mexico'],
        'South America': ['Brazil', 'Argentina', 'Colombia'],
        'Europe': ['Germany', 'UK', 'France', 'Italy'],
        'South Asia': ['India', 'Bangladesh'],
        'East Asia': ['China', 'Japan', 'South Korea'],
        'Middle East': ['UAE', 'Saudi Arabia'],
        'Africa': ['South Africa', 'Nigeria'],
        'Oceania': ['Australia', 'New Zealand']
    }
    
    medicine_categories = {
        'Diabetes': ['Metformin'],
        'Cardiovascular': ['Amlodipine', 'Atorvastatin'],
        'Antibiotic': ['Azithromycin', 'Amoxicillin'],
        'Vitamin': ['Vitamin C'],
        'Pain_Relief': ['Paracetamol', 'Ibuprofen'],
        'Respiratory': ['Salbutamol'],
        'Chronic': ['Omeprazole'],
        'Cough_Cold': ['Cough Syrup']
    }
    
    age_groups = ['0-12', '13-25', '26-45', '46-65', '65+']
    
    # 2. Generate Base Data
    data = []
    start_date = datetime(2020, 1, 1)
    end_date = datetime(2025, 12, 31)
    date_range_days = (end_date - start_date).days
    
    for _ in range(gen_rows):
        # Dates
        random_days = random.randint(0, date_range_days)
        date = start_date + timedelta(days=random_days)
        year = date.year
        month = date.month
        day = date.day
        
        # Covid Flag
        covid_flag = 1 if 2020 <= year <= 2022 else 0
        
        # Region & Country
        region = random.choice(list(regions_countries.keys()))
        country = random.choice(regions_countries[region])
        
        # Age group & Category matching
        age_group = random.choices(age_groups, weights=[0.15, 0.20, 0.25, 0.20, 0.20])[0]
        
        category_weights = {cat: 1 for cat in medicine_categories.keys()}
        
        # Adjust weights based on age
        if age_group in ['46-65', '65+']:
            category_weights['Chronic'] += 3
            category_weights['Cardiovascular'] += 3
            category_weights['Diabetes'] += 3
        if age_group in ['0-12', '13-25']:
            category_weights['Vitamin'] += 2
            category_weights['Cough_Cold'] += 2
            
        # Adjust weights based on covid
        if covid_flag == 1:
            category_weights['Vitamin'] += 2
            category_weights['Antibiotic'] += 2
            category_weights['Respiratory'] += 2
            
        categories_list = list(category_weights.keys())
        weights_list = list(category_weights.values())
        
        category = random.choices(categories_list, weights=weights_list)[0]
        medicine = random.choice(medicine_categories[category])
        
        # Prices
        base_prices = {
            'Diabetes': 15.0, 'Cardiovascular': 25.0, 'Antibiotic': 30.0,
            'Vitamin': 10.0, 'Pain_Relief': 8.0, 'Respiratory': 20.0,
            'Chronic': 40.0, 'Cough_Cold': 12.0
        }
        unit_price = round(base_prices[category] * random.uniform(0.8, 1.2), 2)
        
        # Units sold & Stock
        units_sold = random.randint(10, 500)
        stock_level = random.randint(100, 2000) - int(units_sold * random.uniform(0.5, 1.5))
        if stock_level < 0:
            stock_level = random.randint(10, 50)
            
        # Expiry
        expiry_days_remaining = random.randint(30, 1000)
        
        data.append([
            date.strftime('%Y-%m-%d'), year, month, day, region, country,
            category, medicine, age_group, units_sold, unit_price, stock_level,
            expiry_days_remaining, covid_flag
        ])
        
    df = pd.DataFrame(data, columns=[
        'date', 'year', 'month', 'day', 'region', 'country', 'category', 'medicine',
        'age_group', 'units_sold', 'unit_price', 'stock_level', 'expiry_days_remaining', 'covid_flag'
    ])
    
    # Ensure no duplicates for the unique constraint: date, country, region, medicine, category, age_group
    df = df.drop_duplicates(subset=['date', 'country', 'region', 'medicine', 'category', 'age_group'])
    
    if len(df) < total_rows:
        print(f"Warning: Only generated {len(df)} unique rows. Consider increasing gen_rows.")
        total_rows = len(df)
    else:
        df = df.iloc[:total_rows]
    
    # 3. Split into Clean (80%), Dirty (15%), Corrupted (5%)
    clean_size = int(total_rows * 0.8)
    dirty_size = int(total_rows * 0.15)
    
    # Shuffle
    df = df.sample(frac=1, random_state=42).reset_index(drop=True)
    
    df_clean = df.iloc[:clean_size].copy()
    df_dirty = df.iloc[clean_size:clean_size+dirty_size].copy()
    df_corrupted = df.iloc[clean_size+dirty_size:].copy()
    
    # -----------------------------
    # 4. Introduce Dirty Issues (15%)
    # -----------------------------
    num_dirty = len(df_dirty)
    
    def apply_issue(df, col, mask_frac, func):
        num_issues = int(num_dirty * mask_frac)
        indices = np.random.choice(df.index, num_issues, replace=False)
        df.loc[indices, col] = df.loc[indices, col].apply(func)
    
    # Convert all columns to object to allow mixing types (strings, NaNs)
    df_dirty = df_dirty.astype('object')
    
    # 3% missing values randomly scattered
    for _ in range(int(num_dirty * 0.03)):
        rand_idx = np.random.choice(df_dirty.index)
        rand_col = np.random.choice(df_dirty.columns)
        df_dirty.at[rand_idx, rand_col] = np.nan
        
    # 2% duplicate rows (we append them at the end)
    dup_rows = df_dirty.sample(n=int(num_dirty * 0.02), random_state=42)
    df_dirty = pd.concat([df_dirty, dup_rows])
    
    # 2% invalid dates
    apply_issue(df_dirty, 'date', 0.02, lambda x: np.nan if random.random() < 0.5 else '9999-99-99')
    
    # 1% negative stock values
    apply_issue(df_dirty, 'stock_level', 0.01, lambda x: -1 * abs(x) if pd.notnull(x) else x)
    
    # 1% negative unit prices
    apply_issue(df_dirty, 'unit_price', 0.01, lambda x: -1 * abs(x) if pd.notnull(x) else x)
    
    # 2% inconsistent category naming
    inconsistent_cats = {
        'Vitamin': ['vitamin', 'VITAMIN', ' Vitamin', 'Vitamn'],
        'Pain_Relief': ['Pain Relief', 'pain_relief', 'Pain-Relief']
    }
    def modify_category(x):
        if x in inconsistent_cats:
            return random.choice(inconsistent_cats[x])
        return x
    apply_issue(df_dirty, 'category', 0.02, modify_category)
    
    # 1% invalid age groups
    invalid_ages = ['66-80', 'Unknown', 'Adult', 'NULL']
    apply_issue(df_dirty, 'age_group', 0.01, lambda x: random.choice(invalid_ages))
    
    # 1% invalid covid_flag values
    invalid_flags = [2, 3, 'Yes', 'No']
    apply_issue(df_dirty, 'covid_flag', 0.01, lambda x: random.choice(invalid_flags))
    
    # 1% country-region mismatches
    def mismatch_region(x):
        all_regions = list(regions_countries.keys())
        if pd.notnull(x):
            try:
                all_regions.remove(x)
            except:
                pass
        return random.choice(all_regions)
    apply_issue(df_dirty, 'region', 0.01, mismatch_region)
    
    # 1% expiry_days_remaining values below zero
    apply_issue(df_dirty, 'expiry_days_remaining', 0.01, lambda x: random.randint(-50, -5))
    
    # 1% extreme outliers
    num_outliers = int(num_dirty * 0.01)
    outlier_indices = np.random.choice(df_dirty.index, num_outliers, replace=False)
    for idx in outlier_indices:
        df_dirty.at[idx, 'units_sold'] = 50000
        df_dirty.at[idx, 'unit_price'] = 10000
        
    # Random leading and trailing spaces in text columns
    text_cols = ['region', 'country', 'category', 'medicine', 'age_group']
    for col in text_cols:
        apply_issue(df_dirty, col, 0.02, lambda x: f" {x} " if pd.notnull(x) else x)
        
    # Some minor spelling mistakes in medicine names
    spell_mistakes = {
        'Amlodipine': 'Amlodipin',
        'Azithromycin': 'Azithromicin',
        'Vitamin C': 'Vitmin C'
    }
    def modify_medicine(x):
        if x in spell_mistakes:
            return spell_mistakes[x]
        return x
    apply_issue(df_dirty, 'medicine', 0.02, modify_medicine)
    
    # -----------------------------
    # 5. Introduce Corrupted Issues (5%)
    # -----------------------------
    num_corr = len(df_corrupted)
    
    # Missing columns (drop 2 columns randomly)
    df_corrupted = df_corrupted.drop(columns=['month', 'covid_flag'])
    
    # Wrong headers (rename)
    df_corrupted = df_corrupted.rename(columns={
        'date': 'txn_date',
        'units_sold': 'qty',
        'medicine': 'drug_name'
    })
    
    # Broken dates (mixed formats)
    def break_dates(x):
        if random.random() < 0.3:
            return 'not_a_date'
        elif random.random() < 0.5:
            # Change format to DD/MM/YYYY
            try:
                d = datetime.strptime(str(x), '%Y-%m-%d')
                return d.strftime('%d/%m/%Y')
            except:
                return x
        return x
    df_corrupted['txn_date'] = df_corrupted['txn_date'].apply(break_dates)
    
    # Mixed datatypes in numeric column
    def mix_datatypes(x):
        if random.random() < 0.2:
            return f"str_{x}"
        return x
    df_corrupted['qty'] = df_corrupted['qty'].apply(mix_datatypes)
    
    # 6. Save Datasets
    df_clean.to_csv('pharma_sales_clean.csv', index=False)
    df_dirty.to_csv('pharma_sales_dirty.csv', index=False)
    df_corrupted.to_csv('pharma_sales_corrupted.csv', index=False)
    
    print("Datasets generated successfully.")
    print(f"Clean: {len(df_clean)} rows")
    print(f"Dirty: {len(df_dirty)} rows")
    print(f"Corrupted: {len(df_corrupted)} rows")

if __name__ == "__main__":
    generate_datasets()
