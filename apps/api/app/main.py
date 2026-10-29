from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.database import Base, engine
from app.modules.attendance.routers.attendance import router as attendance_router
from app.modules.attendance.routers.courses import router as courses_router

# Cria as tabelas no banco de dados automaticamente ao inicializar
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="UniHub API",
    description="API do UniHub — Plataforma acadêmica com controle inteligente de faltas e frequência",
    version="0.1.0",
)

# Configuração de CORS (Cross-Origin Resource Sharing)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registro dos módulos da aplicação
app.include_router(attendance_router)
app.include_router(courses_router)


@app.get("/health/live", tags=["Health"])
def liveness_check():
    return {"status": "healthy", "service": "unihub-api"}


@app.get("/health/ready", tags=["Health"])
def readiness_check():
    return {"status": "ready", "service": "unihub-api"}


@app.get("/", tags=["Root"])
def root():
    return {
        "name": "UniHub API",
        "version": "0.1.0",
        "status": "online",
        "docs_url": "/docs",
    }