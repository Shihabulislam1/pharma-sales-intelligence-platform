# Local Development Database Container

This directory contains the Docker Compose configuration to spin up a local **PostgreSQL 17** instance for development.

## 1. Quickstart

To launch the database container in the background (detached mode):

```bash
docker compose up -d
```

To view the database logs:

```bash
docker compose logs -f
```

To stop the database:

```bash
docker compose down
```

## 2. Database Connection Credentials

- **Host**: `localhost` (or `127.0.0.1`)
- **Port**: `5432`
- **Username**: `postgres`
- **Password**: `devpassword`
- **Database Name**: `pharma_sales_dev`

## 3. Configuring Django to use PostgreSQL

### Step 1: Install PostgreSQL Driver
To connect Django to PostgreSQL, you need a Python database driver. Install `psycopg2-binary`:

```bash
source .venv/bin/activate
pip install psycopg2-binary
pip freeze > requirements.txt
```

### Step 2: Update settings.py
In `apps/backend/backend/settings.py`, replace the `DATABASES` setting:

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'pharma_sales_dev',
        'USER': 'postgres',
        'PASSWORD': 'devpassword',
        'HOST': '127.0.0.1',
        'PORT': '5432',
    }
}
```

### Step 3: Run Migrations
With the container running, run the migrations:
```bash
nx run backend:migrate
```
