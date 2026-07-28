# AI DEF

**AI DEF** is a full-stack, multilingual web platform for presenting legal drone, defense-adjacent, and civilian technology products. It pairs a cinematic React interface with a Django API, editorial content, product detail pages, contact flows, and an authenticated client portal.

> The project is designed for lawful commercial, educational, and portfolio use. It does not provide weapon-building instructions or support illegal modifications.

## Highlights

- Product and solution catalogues with rich detail pages and media galleries
- Technology, blog, support, company, and terms pages managed through Django
- Localized public API and content in English, German, Slovak, Spanish, and French
- Contact and strategic partnership requests with configurable email notifications
- Token-authenticated client portal with protected API endpoints
- Django admin for managing products, content, images, and requests

## Stack

- **Frontend:** React, TypeScript, Vite, Tailwind CSS, i18next
- **Backend:** Django, Django REST Framework, django-modeltranslation
- **Data:** PostgreSQL
- **Deployment:** Docker Compose, Nginx, Gunicorn

## Run Locally

### Docker

```bash
cp .env.example .env
docker compose up --build
```

### Development servers

Start PostgreSQL first, then run the frontend and backend in separate terminals:

```bash
# frontend
cd frontend
npm install
npm run dev
```

```bash
# backend
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

Copy `.env.example` to `.env` and configure the database, allowed hosts, and mail settings before deploying. Never commit real credentials.

## Quality Checks

```bash
# frontend
cd frontend && npm run build && npm run lint

# backend
cd backend && python manage.py test
```

## License

Private project. All rights reserved.
