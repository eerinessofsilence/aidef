FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends build-essential libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt /app/

RUN pip install --no-cache-dir -r requirements.txt

COPY . /app/

ENV DJANGO_SETTINGS_MODULE=aidef.settings

RUN mkdir -p /app/static /app/media

CMD ["sh", "-c", "\
python manage.py migrate --noinput && \
python manage.py collectstatic --noinput && \
gunicorn aidef.wsgi:application --bind 0.0.0.0:8000 --workers 3 \
"]
