# AI DEF — Military & Drone Gear Marketplace

**Tagline:** A military-themed e-commerce platform for drones, tactical gear, and collectible hardware — built with modern web stack and AI features.

> **Straight talk:** this is a themed online store for legal gear, collectibles, and drone hardware. **It does not provide instructions for creating weapons or illegal modifications.** Use the platform responsibly and comply with local laws.

---

## Table of contents

1. [Project overview](#project-overview)
2. [Key features](#key-features)
3. [Tech stack](#tech-stack)
4. [Getting started (developer)](#getting-started-developer)
5. [Environment variables](#environment-variables)
6. [Architecture & data model (brief)](#architecture--data-model-brief)
7. [Security & compliance notes](#security--compliance-notes)
8. [Deployment](#deployment)
9. [Contributing](#contributing)
10. [License & contact](#license--contact)

---

## Project overview

AI DEF is an e-commerce application themed around military, tactical, and drone hardware. It’s built as a realistic storefront supporting product listings, cart/checkout, admin management, and AI-driven features like recommendation and image tagging for product images.

Main purpose:

- demo a full-stack marketplace with modern UX,
- provide an admin/merchant flow for product management,
- showcase AI features (recommendations, search, auto-tagging),
- act as a portfolio / prototype for further productization.

**Not permitted**: instructions or content that enable weapon construction, evasion of regulations, or illegal activities. The platform is for legal products, simulation, and collectibles only.

---

## Key features

- **Product catalog** (categories: drones, optics, tactical gear, accessories, collectibles)
- **Search & filters** (by spec, price, tags)
- **Shopping cart & checkout** (mock or real payment providers configurable)
- **Admin dashboard** (CRUD for products, orders, inventory)
- **User accounts** (orders, wishlists, role-based access)
- **Inventory & pricing rules** (bulk discounts, dynamic pricing examples)
- **Audit & logging** for orders and admin actions
- **I18n ready** (English primary; structure to add locales)

---

## Tech stack

- Frontend: **Vite ** + **React** + **Tailwind CSS**
- Backend: **Django**
- Database: **PostgreSQL**
- Cache / Queue: **Redis**, background workers for AI tasks
- Payments: Stripe (demo mode) or other provider integrations
- Containerization: Docker / docker-compose

---

## Getting started (developer)

Clone the repo, install dependencies, run dev servers.

```bash
# frontend
git clone https://github.com/your-org/ai-def.git
cd ai-def/frontend
npm install
npm dev

# backend
cd ../backend
pip install -r requirements.txt
python manage.py runserver
```

Start services with docker-compose (example):

```bash
docker-compose up -d --build
```

---

## Environment variables

Create `.env` from `.env.example`. Example keys:

```env
# Backend
DJANGO_SECRET=supersecretdjangokey
DB_NAME=db_name
DB_USER=db_user
DB_PASS=db_pass
DB_HOST=localhost
DB_PORT=5432
```

**Do not commit secrets.** Use environment management for production (Vault, cloud secret manager).

---

## Architecture & data model (brief)

- **Users**: id, email, hashed_password, role (customer/admin), profile
- **Products**: id, title, sku, category, specs (json), price, stock, tags, images[]
- **Orders**: id, user_id, items[], totals, payment_status, shipping_status
- **Reviews**: id, product_id, user_id, rating, comment, created_at

---

## Security & compliance notes

- Uses HTTPS and CORS protection by default
- Sanitizes all inputs and file uploads
- Logs admin actions (read/write) for traceability
- Does **not** sell or promote real weapons
- Compliant with EU and US trade content policies (for demo/educational use)

---

## Deployment

Deploy via Docker Compose or directly on Vercel (frontend) and Render/Heroku (backend).

```bash
# Docker
docker-compose up -d

# or manual
npm build
npm start
```

---

## Contributing

Pull requests are welcome. Open an issue for major changes or discussions.  
Before submitting PRs:

- Run linters and formatters (Prettier, ESLint)
- Keep commits clean and descriptive (`feat:`, `fix:`, `refactor:`)
