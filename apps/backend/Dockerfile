FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PYTHONPATH=/app/apps/backend

WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends gcc libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --upgrade pip setuptools wheel \
    && pip install -r requirements.txt \
    && pip install gunicorn

COPY apps/backend ./apps/backend

# Create a non-root user and switch to it
RUN useradd -m appuser \
    && chown -R appuser:appuser /app

# Ensure entrypoint is executable
RUN chmod +x /app/apps/backend/entrypoint.sh

USER appuser

WORKDIR /app/apps/backend

EXPOSE 8000

ENTRYPOINT ["/app/apps/backend/entrypoint.sh"]
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "--workers", "3", "--timeout", "120", "backend.wsgi:application"]
