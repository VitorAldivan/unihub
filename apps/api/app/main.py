from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="UniHub API",
    description="API do UniHub — Plataforma acadêmica com controle inteligente de faltas e frequência",
    version="0.1.0",
)

# Configuração de CORS (Cross-Origin Resource Sharing)
# No ambiente local permitimos a aplicação web (Next.js) em localhost:3000
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health/live", tags=["Health"])
def liveness_check():
    """Verifica se o processo da API está vivo e respondendo."""
    return {"status": "healthy", "service": "unihub-api"}


@app.get("/health/ready", tags=["Health"])
def readiness_check():
    """Verifica se a API está pronta para receber tráfego."""
    return {"status": "ready", "service": "unihub-api"}


@app.get("/", tags=["Root"])
def root():
    return {
        "name": "UniHub API",
        "version": "0.1.0",
        "status": "online",
        "docs_url": "/docs",
    }
