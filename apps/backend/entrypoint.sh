#!/bin/bash
set -e

# Run migrations and collectstatic if necessary
# Requires SECRET_KEY and DB vars to be set
echo "Running database migrations..."
python manage.py migrate --noinput || true

echo "Collecting static files..."
python manage.py collectstatic --noinput || true

# Execute CMD
exec "$@"
