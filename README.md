# Inventory & Order Management System

A production-ready full-stack application for managing products, customers, and orders with real-time inventory tracking.

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Python 3.12 + FastAPI |
| Frontend | React 18 + Vite + Tailwind CSS |
| Database | PostgreSQL 16 |
| Containerization | Docker + Docker Compose |
| Frontend Deploy | Vercel / Netlify |
| Backend Deploy | Render / Railway |

---

## Project Structure

```
.
├── backend/
│   ├── app/
│   │   ├── main.py          # FastAPI app + CORS
│   │   ├── config.py        # Pydantic settings
│   │   ├── database.py      # SQLAlchemy engine + session
│   │   ├── models.py        # ORM models
│   │   ├── schemas.py       # Pydantic request/response schemas
│   │   └── routers/
│   │       ├── products.py
│   │       ├── customers.py
│   │       ├── orders.py
│   │       └── dashboard.py
│   ├── Dockerfile
│   ├── .dockerignore
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── api/             # Axios client + endpoint helpers
│   │   ├── components/      # Modal, ConfirmDialog, StatCard
│   │   └── pages/           # Dashboard, Products, Customers, Orders, OrderDetail
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── docker-compose.yml
├── .env.example
└── .gitignore
```

---

## Quick Start (Docker Compose)

```bash
# 1. Clone the repo
git clone <your-repo-url>
cd inventory-order-management

# 2. Create .env from example and set your credentials
cp .env.example .env

# 3. Build and start all services
docker compose up --build

# 4. Open in browser
#    Frontend: http://localhost
#    Backend API docs: http://localhost:8000/docs
```

---

## API Reference

### Products
| Method | Endpoint | Description |
|---|---|---|
| POST | `/products` | Create product |
| GET | `/products` | List all products |
| GET | `/products/{id}` | Get product by ID |
| PUT | `/products/{id}` | Update product |
| DELETE | `/products/{id}` | Delete product |

### Customers
| Method | Endpoint | Description |
|---|---|---|
| POST | `/customers` | Create customer |
| GET | `/customers` | List all customers |
| GET | `/customers/{id}` | Get customer by ID |
| DELETE | `/customers/{id}` | Delete customer |

### Orders
| Method | Endpoint | Description |
|---|---|---|
| POST | `/orders` | Create order (auto-reduces stock) |
| GET | `/orders` | List all orders |
| GET | `/orders/{id}` | Get order details |
| DELETE | `/orders/{id}` | Cancel order (restores stock) |

### Dashboard
| Method | Endpoint | Description |
|---|---|---|
| GET | `/dashboard` | Summary stats + low stock |

---

## Business Rules Implemented

- Product SKU must be unique (400 if duplicate)
- Customer email must be unique (400 if duplicate)
- Product quantity cannot go negative (DB constraint + validation)
- Orders fail with 400 if any item has insufficient stock
- Creating an order atomically reduces stock for all items
- Total order amount is calculated on the backend
- Cancelling an order restores stock for all items
- All inputs validated via Pydantic before processing

---

## Environment Variables

| Variable | Description | Example |
|---|---|---|
| `POSTGRES_USER` | PostgreSQL username | `inventory_user` |
| `POSTGRES_PASSWORD` | PostgreSQL password | `StrongPassw0rd!` |
| `POSTGRES_DB` | Database name | `inventory_db` |
| `ALLOWED_ORIGINS` | CORS allowed origins (comma-separated) | `https://myapp.vercel.app` |

---

## Deployment Guide

### Backend on Render

1. Push code to GitHub
2. Create a new **Web Service** on [Render](https://render.com)
3. Set **Root Directory** to `backend`
4. Set **Build Command**: `pip install -r requirements.txt`
5. Set **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
6. Add environment variable `DATABASE_URL` pointing to a Render PostgreSQL instance
7. Add `ALLOWED_ORIGINS` with your Vercel frontend URL, for example `https://inventory-order-management-2jkjuduv9-nihal-s-projects7.vercel.app`
   - For testing only, `ALLOWED_ORIGINS=*` will allow any origin.

### Frontend on Vercel

1. Import the GitHub repo on [Vercel](https://vercel.com)
2. Set **Root Directory** to `frontend`
3. Set **Build Command**: `npm run build`
4. Set **Output Directory**: `dist`
5. Add environment variable `VITE_API_URL` = `https://your-render-backend-url.onrender.com`

### Docker Hub

```bash
# Build and push backend image
docker build -t <dockerhub-username>/inventory-backend:latest ./backend
docker push <dockerhub-username>/inventory-backend:latest
```

---

## Local Development (without Docker)

### Backend
```bash
cd backend
python -m venv .venv
.venv\Scripts\activate   # Windows
pip install -r requirements.txt
# Set DATABASE_URL in .env to point to a local PostgreSQL instance
uvicorn app.main:app --reload
```

### Frontend
```bash
cd frontend
npm install
# Set VITE_API_URL=http://localhost:8000 in .env.local
npm run dev
```
