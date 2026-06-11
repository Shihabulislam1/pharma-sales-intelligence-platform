# Software Requirements Specification (SRS)
## PharmaOps Intelligence Platform

**Version:** 1.0  
**Status:** MVP  
**Prepared for:** Pharmaceutical Company Application Project  
**Target Deadline:** 15 June 2026  
**Primary Stack:** Django, React,Material UI, PostgreSQL, Pandas  
**Example Dataset:** example-dataset/global_pharmacy_sales_2020_2025_daily_dataset.csv
---

## 1. Introduction

### 1.1 Purpose

This document defines the software requirements for **PharmaOps Intelligence Platform**, a web application built to ingest, clean, store, and analyze pharmaceutical pharmacy sales data.

The system is designed around the dataset structure with the following fields:

- date, year, month, day
- region, country
- category, medicine
- age_group
- units_sold, unit_price
- stock_level
- expiry_days_remaining
- covid_flag

The platform will be used to demonstrate practical knowledge of:

- Django and Django REST Framework
- React dashboard development
- PostgreSQL modeling and aggregation
- ETL design using Pandas
- Data cleaning, validation, and transformation
- Business analytics for pharmaceutical operations

### 1.2 Scope

The application will allow a user to:

- Upload CSV data
- Validate and clean rows
- Load normalized records into PostgreSQL
- Monitor ETL results
- View operational analytics dashboards
- Analyze demand, inventory, expiry risk, demographic trends, and COVID impact

### 1.3 Definitions

- **ETL:** Extract, Transform, Load
- **MVP:** Minimum Viable Product
- **KPI:** Key Performance Indicator
- **Fact Table:** Main table holding numeric event records
- **Dimension:** Descriptive entity used for analysis

---

## 2. Overall Description

### 2.1 Product Perspective

The product is a standalone internal analytics dashboard, not a consumer-facing pharmacy platform.

It sits between raw CSV exports and business decision-making. Its purpose is to convert raw pharmacy sales records into actionable insights.

### 2.2 User Classes

#### 2.2.1 Operations Analyst
Responsible for uploading data, checking ETL results, and reviewing trends.

#### 2.2.2 Manager
Uses dashboards to monitor revenue, stock levels, expiry risk, and regional performance.

#### 2.2.3 Executive Viewer
Needs only high-level summary metrics and trends.

### 2.3 Operating Environment

- Backend: Python 3.x.x compatible Django setup depending on project constraints
- Frontend: React,Material UI, React Query,react router
- Database: PostgreSQL
- Data processing: Pandas
- Deployment target: Local development ,Docker  vps cloud deployment via github workflows

### 2.4 Constraints

- Project time is limited
- Dataset is already structured but may contain missing or inconsistent values
- Authentication is not required for the MVP
- Forecasting is excluded from the MVP

### 2.5 Assumptions

- CSV files will follow the dataset schema or a close variation of it
- Numeric fields are intended to be valid numbers
- `revenue` is not explicitly present in the dataset and must be computed as `units_sold × unit_price`
- `covid_flag` is binary, where 1 indicates COVID period and 0 indicates non-COVID period

---

## 3. System Goals

1. Ingest pharmacy sales CSV files reliably.
2. Validate dataset structure and row quality.
3. Transform raw records into clean analytics-ready records.
4. Persist the cleaned dataset in PostgreSQL.
5. Present meaningful dashboards for operations and management.
6. Surface inventory and expiry risk as actionable business insights.

---

## 4. Functional Requirements

### 4.1 CSV Upload

#### Description
The system shall allow a user to upload one CSV file at a time.

#### Requirements
- The system must accept only `.csv` files.
- The system must validate required columns.
- The system must show an upload success or failure state.
- The system must store file metadata for ETL tracking.

#### Required Columns
- date
- year
- month
- day
- region
- country
- category
- medicine
- age_group
- units_sold
- unit_price
- stock_level
- expiry_days_remaining
- covid_flag

#### Acceptance Criteria
- Valid CSV uploads are accepted.
- Invalid file types are rejected.
- Missing mandatory columns produce errors.

---

### 4.2 ETL Processing

#### Description
The system shall process uploaded CSV files through a cleaning and transformation pipeline.

#### Extract
- Read CSV into a dataframe.
- Parse rows and detect schema mismatches.

#### Transform
The system shall:

- Remove duplicate rows
- Trim whitespace from text fields
- Standardize casing
- Convert date fields to a canonical format
- Validate numeric columns
- Convert empty strings to nulls where appropriate
- Compute revenue as `units_sold × unit_price`
- Validate that the provided year/month/day match the date field
- Normalize category and medicine text where necessary

#### Load
- Save valid records to PostgreSQL
- Save rejected row counts and ETL metrics
- Store import job status

#### Validation Rules
- `units_sold` must be non-negative
- `unit_price` must be non-negative
- `stock_level` must be non-negative
- `expiry_days_remaining` must be non-negative
- `covid_flag` must be 0 or 1
- `date` must be valid
- `year`, `month`, and `day` must match the date value

#### Acceptance Criteria
- ETL completes on valid files
- Invalid rows are rejected or flagged
- Clean rows are inserted into the database
- A processing summary is generated

---

### 4.3 ETL Monitoring

#### Description
The system shall show the outcome of ETL processing.

#### Metrics
- Rows uploaded
- Rows loaded
- Rows rejected
- Duplicate rows removed
- Invalid rows found
- Revenue records generated
- Processing status

#### Acceptance Criteria
- ETL summary is visible immediately after file import
- Metrics match the imported file statistics

---

### 4.4 Executive Dashboard

#### Description
The system shall provide a high-level overview of the imported dataset.

#### KPI Cards
- Total Revenue
- Total Units Sold
- Total Medicines
- Total Countries
- Total Regions
- Total Stock Value

#### Acceptance Criteria
- KPI values are computed from loaded data
- KPI cards are readable and responsive

---

### 4.5 Revenue Analytics

#### Description
The system shall support revenue analysis across multiple dimensions.

#### Required Views
- Revenue by region
- Revenue by country
- Revenue by category
- Revenue by medicine
- Revenue by age group
- Monthly revenue trend

#### Acceptance Criteria
- The user can identify top-performing regions, countries, medicines, and categories
- Trend charts show time-based changes

---

### 4.6 Inventory Analytics

#### Description
The system shall expose stock-related business insights.

#### Required Views
- Total stock level by medicine
- Low-stock medicines
- Overstocked medicines
- Inventory value by medicine
- Stock distribution by category

#### Suggested Thresholds
- Low stock: stock_level below a configurable threshold
- Overstock: stock_level above a configurable threshold

#### Acceptance Criteria
- Low and high stock items are clearly visible
- Inventory value can be ranked and summarized

---

### 4.7 Expiry Risk Analytics

#### Description
The system shall identify medicines at risk of expiry.

#### Required Views
- Medicines expiring within 30 days
- Medicines expiring within 60 days
- Expiry risk by category
- Inventory value at risk

#### Acceptance Criteria
- Expiry risk is easy to interpret
- Products with low expiry days remaining are highlighted

---

### 4.8 Demographic Analytics

#### Description
The system shall analyze medicine demand by age group.

#### Required Views
- Units sold by age group
- Revenue by age group
- Category demand by age group

#### Age Groups
- 0–12
- 13–25
- 26–45
- 46–65
- 65+

#### Acceptance Criteria
- Age-group demand is visible in charts or tables
- The user can compare groups easily

---

### 4.9 COVID Impact Analytics

#### Description
The system shall compare sales behavior during COVID and non-COVID periods.

#### Required Views
- Revenue comparison by covid_flag
- Units sold comparison by covid_flag
- Category comparison by covid_flag
- Region comparison by covid_flag

#### Acceptance Criteria
- The difference between `covid_flag = 1` and `covid_flag = 0` is visually clear

---

## 5. Non-Functional Requirements

### 5.1 Performance
- Dashboard pages should load in a reasonable time for demo-scale data
- ETL should handle a moderate CSV file without major delay
- Analytics endpoints should return aggregated data efficiently

### 5.2 Reliability
- Invalid data must not crash the system
- ETL failures must be reported clearly
- The user should always be able to see whether a file was processed successfully

### 5.3 Usability
- The UI must be simple and business-oriented
- Charts and metrics must be easy to read
- Navigation should be minimal and obvious

### 5.4 Maintainability
- ETL logic should be isolated from view logic
- Backend modules should be organized clearly
- Database tables should be easy to extend

---

## 6. Architecture

### 6.1 Frontend
- React
- Material UI or Bootstrap
- Recharts
- Axios

### 6.2 Backend
- Django
- Django REST Framework
- Pandas for ETL

### 6.3 Database
- PostgreSQL

### 6.4 Suggested Django Apps
- `etl`
- `sales`
- `analytics`

### 6.5 High-Level Flow
1. User uploads CSV
2. Backend validates file
3. ETL pipeline cleans and transforms records
4. Clean records are stored in PostgreSQL
5. Analytics endpoints aggregate the data
6. React renders KPI cards and charts

---

## 7. Data Design

### 7.1 Core Fact Table
A single primary fact table is sufficient for MVP.

#### Table: `pharmacy_sales_fact`
Suggested fields:
- id
- date
- year
- month
- day
- region
- country
- category
- medicine
- age_group
- units_sold
- unit_price
- revenue
- stock_level
- expiry_days_remaining
- covid_flag
- created_at
- updated_at

### 7.2 ETL Job Table
#### Table: `etl_jobs`
Suggested fields:
- id
- file_name
- uploaded_at
- total_rows
- valid_rows
- invalid_rows
- duplicates_removed
- status
- notes

### 7.3 Optional Normalized Tables
If time allows, create:
- `dim_region`
- `dim_country`
- `dim_category`
- `dim_medicine`

These are optional and not required for MVP.

---

## 8. API Specification

### 8.1 Upload File
`POST /api/uploads/`

Purpose:
- Upload CSV file

Response:
- upload status
- ETL job id
- summary metrics

---

### 8.2 ETL Summary
`GET /api/etl/jobs/`

Purpose:
- Return ETL processing history

---

### 8.3 Dashboard KPIs
`GET /api/analytics/kpis/`

Purpose:
- Return total revenue, units sold, countries, regions, medicines, and stock value

---

### 8.4 Revenue Analytics
`GET /api/analytics/revenue/`

Purpose:
- Return aggregated revenue data by region, country, category, medicine, and month

---

### 8.5 Inventory Analytics
`GET /api/analytics/inventory/`

Purpose:
- Return stock-based insights and inventory risk metrics

---

### 8.6 Expiry Analytics
`GET /api/analytics/expiry/`

Purpose:
- Return expiry-risk data and at-risk inventory summaries

---

### 8.7 Demographic Analytics
`GET /api/analytics/age-groups/`

Purpose:
- Return revenue and units sold grouped by age group

---

### 8.8 COVID Analytics
`GET /api/analytics/covid/`

Purpose:
- Return comparative analytics for covid_flag values

---

## 9. UI Requirements

### 9.1 Pages
1. Upload Dataset
2. ETL Summary
3. Overview Dashboard
4. Revenue Analytics
5. Inventory Analytics
6. Expiry Risk Analytics
7. Age Group Analytics
8. COVID Impact Analytics

### 9.2 Layout
- Sidebar navigation
- Main content area
- KPI cards
- Charts
- Tables
- Filter controls

### 9.3 Styling
- Clean, professional layout
- Minimal clutter
- Business dashboard appearance
- Responsive design

---

## 10. Data Quality Rules

### 10.1 Cleaning Rules
- Trim whitespace
- Standardize text case
- Remove duplicate rows
- Convert date strings
- Normalize empty values
- Validate numeric fields

### 10.2 Derived Fields
- Revenue = `units_sold × unit_price`
- Stock value = `stock_level × unit_price`

### 10.3 Rejection Rules
Rows should be rejected if:
- Required fields are missing
- Date is invalid
- Units sold is negative
- Unit price is negative
- Stock level is negative
- Expiry days remaining is negative
- covid_flag is invalid

---

## 11. Key Business Questions the System Must Answer

- Which medicines generate the highest revenue?
- Which regions have the strongest demand?
- Which countries contribute most to sales?
- Which categories are most profitable?
- Which medicines are at expiry risk?
- Which items are overstocked or understocked?
- Which age groups drive demand for which categories?
- Did the COVID period affect demand significantly?

---

## 12. Risks

- Data may contain unexpected inconsistencies
- Dataset may need additional preprocessing
- Time may not allow all charts to be implemented
- Overengineering the database could slow delivery
- Building too many features may reduce polish

---

## 13. MVP Delivery Plan

### Day 1
- Create Django project
- Define models
- Load sample CSV
- Build upload endpoint

### Day 2
- Build ETL pipeline
- Add validation and cleaning
- Save to PostgreSQL
- Store ETL job summary

### Day 3
- Build analytics endpoints
- Create dashboard screens
- Add charts and KPI cards

### Day 4
- Polish UI
- Test file upload flow
- Prepare README and demo story
- Finalize for application

---

## 14. Definition of Done

The project is complete when:

- CSV upload works
- ETL processing works
- Cleaned data is stored in PostgreSQL
- Dashboard displays core analytics
- Inventory and expiry insights are visible
- The implementation clearly demonstrates Django, React, SQL, ETL, and data analysis skills

---

## 15. Final Product Statement

PharmaOps Intelligence Platform is a pharmaceutical analytics system that transforms raw pharmacy sales data into decision-ready business intelligence. It helps operations teams monitor revenue, stock, expiry risk, demographic demand, and COVID-related changes in demand using an ETL-driven workflow.

This project is designed to be realistic, interview-friendly, and aligned with a pharmaceutical company’s analytics needs.
