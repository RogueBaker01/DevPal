from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import get_settings
from app.middleware.simple_rate_limiter import CustomRateLimitMiddleware
import logging
import os

settings = get_settings()
logger = logging.getLogger(__name__)

app = FastAPI(
    title="DevPal API",
    description="API para DevPal - Plataforma de desarrollo profesional",
    version="1.0.0"
)

from fastapi.staticfiles import StaticFiles

app.add_middleware(CustomRateLimitMiddleware)

if not os.path.exists("static/uploads"):
    os.makedirs("static/uploads", exist_ok=True)
app.mount("/static", StaticFiles(directory="static"), name="static")

if not settings.is_development and settings.CORS_ORIGINS == "*":
    raise ValueError("CORS='*' no esta permitido en produccion. Define origenes especificos.")

if settings.CORS_ORIGINS == "*":
    print("CORS configurado como '*' - INSEGURO para produccion")

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

# Validar CORS en startup (keeping the original startup event for logging and consistency,
# but incorporating the new validation logic from the snippet)
@app.on_event("startup")
async def validate_security_config():
    if settings.CORS_ORIGINS == "*" or (settings.cors_origins_list and settings.cors_origins_list[0] == "*"):
        logger.warning("CORS configurado como '*' - INSEGURO para produccion")
        if os.getenv("ENVIRONMENT") == "production":
            raise ValueError("CORS wildcard no permitido en produccion. Especifica dominios en CORS_ORIGINS")
    
    logger.info(f"CORS configurado: {settings.cors_origins_list}")
    logger.info(f"Ambiente: {getattr(settings, 'ENVIRONMENT', 'development')}")

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],  # Específico, no "*"
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {
        "status": "online",
        "message": "DevPal API está funcionando correctamente",
        "version": "1.0.0",
        "docs": "/docs"
    }


@app.get("/health")
async def health_check():
    return {"status": "healthy"}




from app.routers import auth, noticias, eventos, desafios, code_review, gamification

app.include_router(auth.router, prefix="/api/auth", tags=["Autenticación"])
app.include_router(noticias.router, prefix="/api/noticias", tags=["Noticias"])
app.include_router(eventos.router, prefix="/api/eventos", tags=["Eventos"])
app.include_router(desafios.router, prefix="/api/desafios", tags=["Desafíos"])
app.include_router(code_review.router, prefix="/api/code-review", tags=["Code Review"])
app.include_router(gamification.router, prefix="/api/gamification", tags=["Gamificación"])


@app.on_event("startup")
async def startup_event():
    from app.jobs.scheduled_tasks import start_scheduler
    if settings.ENABLE_SCHEDULED_JOBS:
        start_scheduler()


@app.on_event("shutdown")
async def shutdown_event():
    from app.jobs.scheduled_tasks import stop_scheduler
    stop_scheduler()
