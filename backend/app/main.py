from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routers import products, customers, orders, dashboard
from app.config import settings

# Create all tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Inventory & Order Management System",
    description="Production-ready REST API for managing products, customers, and orders.",
    version="1.0.0",
)

origins = [o.strip() for o in settings.ALLOWED_ORIGINS.split(",") if o.strip()]

cors_options = {
    "allow_credentials": False,
    "allow_methods": ["*"],
    "allow_headers": ["*"],
}

if origins:
    cors_options["allow_origins"] = origins
else:
    cors_options["allow_origin_regex"] = ".*"

app.add_middleware(CORSMiddleware, **cors_options)

app.include_router(products.router)
app.include_router(customers.router)
app.include_router(orders.router)
app.include_router(dashboard.router)


@app.get("/health", tags=["Health"])
def health():
    return {"status": "ok"}
